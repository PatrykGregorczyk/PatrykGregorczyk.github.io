// ==================== PIZZA EDITOR ====================
// Pełny edytor pizzy z pół na pół, dodatkami, sosami, notatkami

const PizzaEditor = ({ item, onSave, onClose }) => {
  const { db } = useApp();
  const [ed, setEd] = useState({
    ...item,
    addons: { ...(item.addons || {}) },
    splitAddons: { ...(item.splitAddons || {}) },
    sauces: { ...(item.sauces || {}) }
  });
  const [showSplit, setShowSplit] = useState(ed.isSplit);

  const pizza = db.pizzas.find(p => p.nr === ed.pizzaNr);
  const splitPizza = ed.splitPizzaNr ? db.pizzas.find(p => p.nr === ed.splitPizzaNr) : null;
  const price = calculateItemPrice(ed, db);

  const getAvailableAddons = (pizzaData) => {
    return (pizzaData?.availableAddons || [])
      .map(id => db.addons.find(a => a.id === id))
      .filter(Boolean);
  };

  const availableAddons1 = getAvailableAddons(pizza);
  const availableAddons2 = getAvailableAddons(splitPizza);

  // Handlers dla pierwszej połówki
  const getQty1 = (id) => ed.addons[id] || 0;
  const isDefault1 = (id) => (pizza?.defaultAddons || {})[id] > 0;
  const getDefaultQty1 = (id) => (pizza?.defaultAddons || {})[id] || 0;

  const addAddon1 = (id) => {
    if (getQty1(id) < 5) {
      setEd(p => ({ ...p, addons: { ...p.addons, [id]: getQty1(id) + 1 } }));
    }
  };

  const removeAddon1 = (id) => {
    const qty = getQty1(id);
    if (qty > 1) {
      setEd(p => ({ ...p, addons: { ...p.addons, [id]: qty - 1 } }));
    } else {
      setEd(p => {
        const a = { ...p.addons };
        delete a[id];
        return { ...p, addons: a };
      });
    }
  };

  const toggleAddon1 = (id) => {
    if (getQty1(id) > 0) {
      setEd(p => {
        const a = { ...p.addons };
        delete a[id];
        return { ...p, addons: a };
      });
    } else {
      const defQty = getDefaultQty1(id);
      setEd(p => ({ ...p, addons: { ...p.addons, [id]: defQty > 0 ? defQty : 1 } }));
    }
  };

  // Handlers dla drugiej połówki
  const getQty2 = (id) => ed.splitAddons[id] || 0;
  const isDefault2 = (id) => (splitPizza?.defaultAddons || {})[id] > 0;
  const getDefaultQty2 = (id) => (splitPizza?.defaultAddons || {})[id] || 0;

  const addAddon2 = (id) => {
    if (getQty2(id) < 5) {
      setEd(p => ({ ...p, splitAddons: { ...p.splitAddons, [id]: getQty2(id) + 1 } }));
    }
  };

  const removeAddon2 = (id) => {
    const qty = getQty2(id);
    if (qty > 1) {
      setEd(p => ({ ...p, splitAddons: { ...p.splitAddons, [id]: qty - 1 } }));
    } else {
      setEd(p => {
        const a = { ...p.splitAddons };
        delete a[id];
        return { ...p, splitAddons: a };
      });
    }
  };

  const toggleAddon2 = (id) => {
    if (getQty2(id) > 0) {
      setEd(p => {
        const a = { ...p.splitAddons };
        delete a[id];
        return { ...p, splitAddons: a };
      });
    } else {
      const defQty = getDefaultQty2(id);
      setEd(p => ({ ...p, splitAddons: { ...p.splitAddons, [id]: defQty > 0 ? defQty : 1 } }));
    }
  };

  // Handlers dla sosów
  const getSauceQty = (id) => ed.sauces[id] || 0;

  const addSauce = (id) => {
    if (getSauceQty(id) < 5) {
      setEd(p => ({ ...p, sauces: { ...p.sauces, [id]: getSauceQty(id) + 1 } }));
    }
  };

  const removeSauce = (id) => {
    const qty = getSauceQty(id);
    if (qty > 1) {
      setEd(p => ({ ...p, sauces: { ...p.sauces, [id]: qty - 1 } }));
    } else {
      setEd(p => {
        const s = { ...p.sauces };
        delete s[id];
        return { ...p, sauces: s };
      });
    }
  };

  const toggleSauce = (id) => {
    getSauceQty(id) > 0 ? removeSauce(id) : addSauce(id);
  };

  // Pół na pół
  const enableSplit = (p2) => {
    const addons2 = { ...(p2.defaultAddons || {}) };
    setEd(prev => ({
      ...prev,
      isSplit: true,
      splitPizzaNr: p2.nr,
      splitName: p2.name,
      splitAddons: addons2
    }));
    setShowSplit(true);
  };

  const disableSplit = () => {
    setEd(prev => ({
      ...prev,
      isSplit: false,
      splitPizzaNr: null,
      splitName: null,
      splitAddons: {}
    }));
    setShowSplit(false);
  };

  // Notatki
  const toggleNote = (note) => {
    setEd(p => ({
      ...p,
      notes: (p.notes || '').includes(note)
        ? p.notes.replace(note, '').trim()
        : ((p.notes || '') + ' ' + note).trim()
    }));
  };

  const freeSauceIds = pizza?.freeSauces || [];
  const freeSaucesCount = pizza?.freeSaucesCount ?? db.settings.defaultFreeSauces;

  const handleSave = () => {
    onSave(ed);
    onClose();
  };

  const title = ed.isSplit
    ? `${pizza?.name} / ${ed.splitName}`
    : `${pizza?.name} (${pizza?.nr})`;

  return (
    <Modal
      onClose={onClose}
      title={
        <div className="flex items-center justify-between w-full">
          <span>{title}</span>
          <button
            onClick={() => {
              if (window.confirm('Usunąć tę pozycję z koszyka?')) {
                const { removeFromCart } = window.__appContext;
                removeFromCart(item.id);
                onClose();
              }
            }}
            className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center active:scale-95"
          >
            <Icon.Trash2 size={16} />
          </button>
        </div>
      }
      footer={
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Zapisz • {formatPrice(price)}
        </Button>
      }
    >
      <div className="p-3 space-y-4">
        {/* Rozmiar */}
        <Section title="Rozmiar">
          <div className="flex gap-2">
            {db.settings.sizes.map(s => (
              <button
                key={s.id}
                onClick={() => setEd(p => ({ ...p, size: s.id }))}
                className={`flex-1 py-2.5 rounded-lg font-semibold ${
                  ed.size === s.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border-2 border-stone-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Pół na pół */}
        <Section title="🍝• Pół na pół" collapsible defaultOpen={showSplit}>
          {!ed.isSplit ? (
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {db.pizzas
                .filter(p => p.nr !== ed.pizzaNr)
                .map(p => (
                  <button
                    key={p.nr}
                    onClick={() => enableSplit(p)}
                    className="p-2 rounded-lg bg-white border-2 border-stone-200 hover:border-primary-400 text-left text-sm active:scale-95"
                  >
                    <span className="text-stone-400">{p.nr}.</span> {p.name}
                  </button>
                ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-violet-50 border-2 border-violet-200 rounded-lg p-3 flex justify-between items-center">
                <span className="font-semibold text-violet-700">🍝• {ed.splitName}</span>
                <button
                  onClick={disableSplit}
                  className="px-2 py-1 rounded bg-violet-200 text-violet-700 text-xs font-semibold active:scale-95"
                >
                  Usuń
                </button>
              </div>

              {/* Składniki drugiej połówki */}
              <div className="bg-violet-50 rounded-lg p-3">
                <div className="text-xs font-bold text-violet-600 mb-2">
                  Składniki: {ed.splitName}
                </div>
                <div className="flex flex-wrap gap-1">
                  {availableAddons2.map(addon => (
                    <AddonChip
                      key={addon.id}
                      name={addon.name}
                      qty={getQty2(addon.id)}
                      isDefault={isDefault2(addon.id)}
                      isRemoved={isDefault2(addon.id) && getQty2(addon.id) === 0}
                      onAdd={() => addAddon2(addon.id)}
                      onRemove={() => removeAddon2(addon.id)}
                      onToggle={() => toggleAddon2(addon.id)}
                      mode="cart"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* Składniki pierwszej połówki */}
        <Section title={ed.isSplit ? `Składniki: ${pizza?.name}` : 'Składniki'}>
          {Object.entries(groupByCategory(availableAddons1)).map(([cat, addons]) =>
            addons.length > 0 && (
              <div key={cat} className="mb-2">
                <div className="text-xs text-stone-400 mb-1">{cat}</div>
                <div className="flex flex-wrap gap-1">
                  {addons.map(addon => (
                    <AddonChip
                      key={addon.id}
                      name={addon.name}
                      qty={getQty1(addon.id)}
                      isDefault={isDefault1(addon.id)}
                      isRemoved={isDefault1(addon.id) && getQty1(addon.id) === 0}
                      onAdd={() => addAddon1(addon.id)}
                      onRemove={() => removeAddon1(addon.id)}
                      onToggle={() => toggleAddon1(addon.id)}
                      mode="cart"
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </Section>

        {/* Sosy */}
        <Section
          title={`Sosy (${freeSaucesCount} gratis: ${
            freeSauceIds
              .map(id => db.sauces.find(s => s.id === id)?.name)
              .filter(Boolean)
              .join(', ') || 'brak'
          })`}
        >
          <div className="flex flex-wrap gap-1">
            {db.sauces.map(s => (
              <AddonChip
                key={s.id}
                name={s.name}
                qty={getSauceQty(s.id)}
                isDefault={freeSauceIds.includes(s.id)}
                isRemoved={false}
                onAdd={() => addSauce(s.id)}
                onRemove={() => removeSauce(s.id)}
                onToggle={() => toggleSauce(s.id)}
                mode="cart"
              />
            ))}
          </div>
        </Section>

        {/* Notatki */}
        <Section title="Notatki">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {db.settings.quickNotes.map(note => (
              <Chip
                key={note}
                active={(ed.notes || '').includes(note)}
                onClick={() => toggleNote(note)}
                small
              >
                {note}
              </Chip>
            ))}
          </div>
          <Input
            placeholder="Własna notatka..."
            value={ed.notes || ''}
            onChange={e => setEd(p => ({ ...p, notes: e.target.value }))}
          />
        </Section>

        {/* Rabaty */}
        <Section title="Rabat">
          <div className="flex flex-wrap gap-1.5">
            {db.discounts.filter(d => d.active && d.perItem).map(discount => (
              <Chip
                key={discount.id}
                active={ed.discount?.id === discount.id}
                onClick={() => setEd(p => ({ 
                  ...p, 
                  discount: p.discount?.id === discount.id ? null : discount 
                }))}
                small
              >
                {discount.name}
              </Chip>
            ))}
          </div>
        </Section>
      </div>
    </Modal>
  );
};

// ==================== MENU ITEM EDITOR ====================
// Edytor pozycji menu

const MenuItemEditor = ({ item, onSave, onClose }) => {
  const { db } = useApp();
  const [ed, setEd] = useState({
    ...item,
    addons: { ...(item.addons || {}) }
  });

  const menuItem = db.menu.find(m => m.id === ed.menuId);
  const price = calculateItemPrice(ed, db);

  const availableAddons = (menuItem?.availableAddons || [])
    .map(id => db.addons.find(a => a.id === id))
    .filter(Boolean);

  const getQty = id => ed.addons[id] || 0;
  const isDefault = id => (menuItem?.defaultAddons || {})[id] > 0;
  const getDefaultQty = id => (menuItem?.defaultAddons || {})[id] || 0;

  const addAddon = id => {
    if (getQty(id) < 5) {
      setEd(p => ({ ...p, addons: { ...p.addons, [id]: getQty(id) + 1 } }));
    }
  };

  const removeAddon = id => {
    const qty = getQty(id);
    if (qty > 1) {
      setEd(p => ({ ...p, addons: { ...p.addons, [id]: qty - 1 } }));
    } else {
      setEd(p => {
        const a = { ...p.addons };
        delete a[id];
        return { ...p, addons: a };
      });
    }
  };

  const toggleAddon = id => {
    if (getQty(id) > 0) {
      setEd(p => {
        const a = { ...p.addons };
        delete a[id];
        return { ...p, addons: a };
      });
    } else {
      const defQty = getDefaultQty(id);
      setEd(p => ({ ...p, addons: { ...p.addons, [id]: defQty > 0 ? defQty : 1 } }));
    }
  };

  const handleSave = () => {
    onSave(ed);
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      title={
        <div className="flex items-center justify-between w-full">
          <span>{menuItem?.name || 'Edycja'}</span>
          <button
            onClick={() => {
              if (window.confirm('Usunąć tę pozycję z koszyka?')) {
                const { removeFromCart } = window.__appContext;
                removeFromCart(item.id);
                onClose();
              }
            }}
            className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center active:scale-95"
          >
            <Icon.Trash2 size={16} />
          </button>
        </div>
      }
      footer={
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Zapisz • {formatPrice(price)}
        </Button>
      }
    >
      <div className="p-3 space-y-4">
        {availableAddons.length > 0 ? (
          <Section title="Dodatki">
            <div className="flex flex-wrap gap-1">
              {availableAddons.map(addon => (
                <AddonChip
                  key={addon.id}
                  name={addon.name}
                  qty={getQty(addon.id)}
                  isDefault={isDefault(addon.id)}
                  isRemoved={isDefault(addon.id) && getQty(addon.id) === 0}
                  onAdd={() => addAddon(addon.id)}
                  onRemove={() => removeAddon(addon.id)}
                  onToggle={() => toggleAddon(addon.id)}
                  mode="cart"
                />
              ))}
            </div>
          </Section>
        ) : (
          <div className="text-center py-8 text-stone-500">
            <p className="text-sm">Ta pozycja nie ma dostępnych dodatków</p>
            <p className="text-xs mt-2">Użyj przycisku usuń aby usunąć z koszyka</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
