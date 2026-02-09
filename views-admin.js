// ==================== ADMIN PANEL - KOMPLETNA WERSJA Z WALIDACJÄ„ ====================

const AdminPanel = ({ onClose }) => {
  const { db, actions } = useApp();
  const [tab, setTab] = useState('pizzas');
  const [editType, setEditType] = useState(null);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');

  const tabs = [
    { id: 'pizzas', label: 'ðŸÂâ€¢ Pizze' },
    { id: 'menu', label: 'ðŸÂâ€ Menu' },
    { id: 'addons', label: 'ðŸâ€œÂ¦ Dodatki' },
    { id: 'sauces', label: 'ðŸÂ¥Â« Sosy' },
    { id: 'packaging', label: 'ðŸâ€œÂ¦ Opakowania' },
    { id: 'locations', label: 'ðŸâ€œÂ Adresy' },
    { id: 'discounts', label: 'ðŸÂÂ·Ã¯Â¸Â Rabaty' },
    { id: 'promotions', label: 'ðŸÅ½Â Promocje' },
    { id: 'settings', label: 'Ã¢Å¡â„¢Ã¯Â¸Â Ustaw.' }
  ];

  const startEdit = (type, data) => {
    setEditType(type);
    setEditData(data ? JSON.parse(JSON.stringify(data)) : null);
    setError('');
  };

  const cancelEdit = () => {
    setEditType(null);
    setEditData(null);
    setError('');
  };

  const handleDelete = (type, id, name) => {
    if (!window.confirm(`UsunÄ…Ä‡ "${name}"?`)) return;
    switch (type) {
      case 'pizza': actions.deletePizza(id); break;
      case 'menu': actions.deleteMenuItem(id); break;
      case 'addon': actions.deleteAddon(id); break;
      case 'sauce': actions.deleteSauce(id); break;
      case 'packaging': actions.deletePackaging(id); break;
      case 'discount': actions.deleteDiscount(id); break;
      case 'promo': actions.deletePromo(id); break;
      case 'city': actions.deleteCity(id); break;
      case 'street': actions.deleteStreet(id); break;
      case 'landmark': actions.deleteLandmark(id); break;
    }
    cancelEdit();
  };

  const ItemRow = ({ children, onClick }) => (
    <button onClick={onClick} className="w-full bg-white rounded-lg p-3 border-2 border-stone-200 hover:border-amber-400 flex items-center justify-between mb-2 text-left active:scale-98">
      <div className="flex-1 min-w-0">{children}</div>
      <Icon.Edit2 size={16} className="text-stone-400 ml-2" />
    </button>
  );

  const ErrorMessage = () => error ? <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-3">{error}</div> : null;

  // ==================== PIZZA FORM ====================
  const PizzaForm = () => {
    const [f, setF] = useState(editData || {
      nr: generateId(db.pizzas),
      name: '',
      p: [0, 0, 0],
      pkg: [1, 2, 3],
      availableAddons: [],
      defaultAddons: {},
      freeSauces: [1, 2],
      freeSaucesCount: 2
    });
    const isNew = !editData;
    const pizzaAddons = db.addons.filter(a => a.forType === 'pizza' || a.forType === 'both');

    const validate = () => {
      if (!f.name.trim()) return 'Podaj nazwÄ™ pizzy';
      if (f.p[0] <= 0 || f.p[1] <= 0 || f.p[2] <= 0) return 'Wszystkie ceny muszÄ… byÄ‡ wiÄ™ksze od 0';
      if (isNew && db.pizzas.find(p => p.nr === f.nr)) return 'Pizza o tym numerze juÅ¼ istnieje';
      return null;
    };

    const save = () => {
      const err = validate();
      if (err) { setError(err); return; }
      if (isNew) actions.addPizza(f);
      else actions.updatePizza(editData.nr, f);
      cancelEdit();
    };

    const getQty = id => f.defaultAddons[id] || 0;
    const isAvailable = id => f.availableAddons.includes(id);

    const addAddon = id => {
      if (getQty(id) < 20) {
        setF(p => ({ ...p, defaultAddons: { ...p.defaultAddons, [id]: getQty(id) + 1 } }));
      }
    };

    const removeAddon = id => {
      const qty = getQty(id);
      if (qty > 1) {
        setF(p => ({ ...p, defaultAddons: { ...p.defaultAddons, [id]: qty - 1 } }));
      } else {
        setF(p => {
          const d = { ...p.defaultAddons };
          delete d[id];
          return { ...p, defaultAddons: d };
        });
      }
    };

    const toggleAddon = id => {
      if (isAvailable(id)) {
        if (getQty(id) > 0) {
          // Chip aktywny - zmniejsz do 0
          setF(p => {
            const d = { ...p.defaultAddons };
            delete d[id];
            return { ...p, defaultAddons: d };
          });
        } else {
          // Chip nieaktywny ale available - dodaj 1
          setF(p => ({ ...p, defaultAddons: { ...p.defaultAddons, [id]: 1 } }));
        }
      } else {
        // Chip ukryty - pokaÅ¼ bez domyÅ›lnej iloÅ›ci
        setF(p => ({ ...p, availableAddons: [...p.availableAddons, id] }));
      }
    };

    const handleLongPress = id => {
      // Przytrzymanie - ukryj chip caÅ‚kowicie
      setF(p => {
        const newAvail = p.availableAddons.filter(x => x !== id);
        const newDef = { ...p.defaultAddons };
        delete newDef[id];
        return { ...p, availableAddons: newAvail, defaultAddons: newDef };
      });
    };

    const toggleFreeSauce = id => {
      setF(p => ({ ...p, freeSauces: p.freeSauces.includes(id) ? p.freeSauces.filter(x => x !== id) : [...p.freeSauces, id] }));
    };

    return (
      <div className="bg-white rounded-xl p-4 border-2 border-amber-300 space-y-4 max-h-[80vh] overflow-y-auto">
        <h3 className="font-bold text-lg">{isNew ? 'Nowa pizza' : 'Edytuj pizzÄ™'}</h3>
        <ErrorMessage />
        <div className="grid grid-cols-4 gap-3">
          <Input label="Nr" type="number" value={f.nr} onChange={e => setF(p => ({ ...p, nr: parseInt(e.target.value) || 0 }))} />
          <div className="col-span-3"><Input label="Nazwa*" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label="Cena S*" type="number" step="0.01" value={f.p[0]} onChange={e => setF(p => ({ ...p, p: [parseFloat(e.target.value) || 0, p.p[1], p.p[2]] }))} />
          <Input label="Cena M*" type="number" step="0.01" value={f.p[1]} onChange={e => setF(p => ({ ...p, p: [p.p[0], parseFloat(e.target.value) || 0, p.p[2]] }))} />
          <Input label="Cena L*" type="number" step="0.01" value={f.p[2]} onChange={e => setF(p => ({ ...p, p: [p.p[0], p.p[1], parseFloat(e.target.value) || 0] }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-2">Dodatki (klik=dodaj, przytrzymaj=ukryj)</label>
          <div className="flex flex-wrap gap-1">
            {pizzaAddons.map(a => (
              <AddonChip
                key={a.id}
                name={a.name}
                qty={getQty(a.id)}
                isDefault={false}
                isRemoved={!isAvailable(a.id)}
                mode="admin"
                onAdd={() => addAddon(a.id)}
                onRemove={() => removeAddon(a.id)}
                onToggle={() => toggleAddon(a.id)}
                onLongPress={() => handleLongPress(a.id)}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-2">Darmowe sosy</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {db.sauces.map(s => <Chip key={s.id} active={f.freeSauces.includes(s.id)} onClick={() => toggleFreeSauce(s.id)} small>{s.name}</Chip>)}
          </div>
          <Input label="Ile gratis" type="number" value={f.freeSaucesCount} onChange={e => setF(p => ({ ...p, freeSaucesCount: parseInt(e.target.value) || 0 }))} />
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="success" className="flex-1" onClick={save}>Zapisz</Button>
          <Button variant="secondary" onClick={cancelEdit}>Anuluj</Button>
          {!isNew && <Button variant="danger" onClick={() => handleDelete('pizza', editData.nr, editData.name)}>UsuÅ„</Button>}
        </div>
      </div>
    );
  };

  // ==================== MENU FORM ====================
  const MenuForm = () => {
    const [f, setF] = useState(editData || { id: generateId(db.menu), name: '', price: 0, cat: 'przekÄ…ski', pkg: null, availableAddons: [], defaultAddons: {}, alco: false });
    const isNew = !editData;
    const cats = ['przekÄ…ski', 'saÅ‚atki', 'makarony', 'burgery', 'napoje', 'alkohole', 'desery'];
    const menuAddons = db.addons.filter(a => a.forType === 'menu' || a.forType === 'both');

    const validate = () => {
      if (!f.name.trim()) return 'Podaj nazwÄ™ pozycji';
      if (f.price <= 0) return 'Cena musi byÄ‡ wiÄ™ksza od 0';
      return null;
    };

    const save = () => {
      const err = validate();
      if (err) { setError(err); return; }
      if (isNew) actions.addMenuItem(f);
      else actions.updateMenuItem(editData.id, f);
      cancelEdit();
    };

    const getQty = id => f.defaultAddons[id] || 0;
    const isAvailable = id => f.availableAddons.includes(id);

    const addAddon = id => {
      const current = getQty(id);
      if (current > 0 && current < 20) {
        setF(p => ({ ...p, defaultAddons: { ...p.defaultAddons, [id]: current + 1 } }));
      }
    };

    const removeAddon = id => {
      const current = getQty(id);
      if (current > 1) {
        setF(p => ({ ...p, defaultAddons: { ...p.defaultAddons, [id]: current - 1 } }));
      } else if (current === 1) {
        setF(p => { const d = { ...p.defaultAddons }; delete d[id]; return { ...p, defaultAddons: d }; });
      }
    };

    const toggleAddon = id => {
      if (!isAvailable(id)) {
        // Dodaj do dostÄ™pnych
        setF(p => ({ ...p, availableAddons: [...p.availableAddons, id] }));
      } else {
        // JuÅ¼ dostÄ™pny - toggle iloÅ›ci (0/1)
        if (getQty(id) > 0) {
          setF(p => { const d = { ...p.defaultAddons }; delete d[id]; return { ...p, defaultAddons: d }; });
        } else {
          setF(p => ({ ...p, defaultAddons: { ...p.defaultAddons, [id]: 1 } }));
        }
      }
    };

    const handleLongPress = id => {
      setF(p => {
        const newAvail = p.availableAddons.filter(x => x !== id);
        const newDef = { ...p.defaultAddons };
        delete newDef[id];
        return { ...p, availableAddons: newAvail, defaultAddons: newDef };
      });
    };

    return (
      <div className="bg-white rounded-xl p-4 border-2 border-amber-300 space-y-4">
        <h3 className="font-bold text-lg">{isNew ? 'Nowa pozycja' : 'Edytuj pozycjÄ™'}</h3>
        <ErrorMessage />
        <Input label="Nazwa*" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Cena*" type="number" step="0.01" value={f.price} onChange={e => setF(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} />
          <Select label="Kategoria" value={f.cat} onChange={e => setF(p => ({ ...p, cat: e.target.value }))} options={cats.map(c => ({ value: c, label: c }))} />
        </div>
        <Toggle label="Alkohol" checked={f.alco || false} onChange={() => setF(p => ({ ...p, alco: !p.alco }))} />
        {menuAddons.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-2">Dodatki (klik=dodaj/toggle, przytrzymaj=ukryj)</label>
            <div className="flex flex-wrap gap-1">
              {menuAddons.map(a => (
                <AddonChip
                  key={a.id}
                  name={a.name}
                  qty={getQty(a.id)}
                  isDefault={false}
                  isRemoved={!isAvailable(a.id)}
                  mode="admin"
                  onAdd={() => addAddon(a.id)}
                  onRemove={() => removeAddon(a.id)}
                  onToggle={() => toggleAddon(a.id)}
                  onLongPress={() => handleLongPress(a.id)}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button variant="success" className="flex-1" onClick={save}>Zapisz</Button>
          <Button variant="secondary" onClick={cancelEdit}>Anuluj</Button>
          {!isNew && <Button variant="danger" onClick={() => handleDelete('menu', editData.id, editData.name)}>UsuÅ„</Button>}
        </div>
      </div>
    );
  };

  // ==================== ADDON FORM ====================
  const AddonForm = () => {
    const [f, setF] = useState(editData || { id: generateId(db.addons), name: '', price: 0, category: 'inne', forType: 'both' });
    const isNew = !editData;

    const validate = () => {
      if (!f.name.trim()) return 'Podaj nazwÄ™ dodatku';
      if (f.price < 0) return 'Cena nie moÅ¼e byÄ‡ ujemna';
      return null;
    };

    const save = () => {
      const err = validate();
      if (err) { setError(err); return; }
      if (isNew) actions.addAddon(f);
      else actions.updateAddon(editData.id, f);
      cancelEdit();
    };

    return (
      <div className="bg-white rounded-xl p-4 border-2 border-amber-300 space-y-4">
        <h3 className="font-bold text-lg">{isNew ? 'Nowy dodatek' : 'Edytuj dodatek'}</h3>
        <ErrorMessage />
        <Input label="Nazwa*" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Cena*" type="number" step="0.5" value={f.price} onChange={e => setF(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} />
          <Select label="Kategoria" value={f.category} onChange={e => setF(p => ({ ...p, category: e.target.value }))} options={['serowe', 'miÄ™sne', 'warzywne', 'sosy', 'inne'].map(c => ({ value: c, label: c }))} />
        </div>
        <Select label="Dla" value={f.forType} onChange={e => setF(p => ({ ...p, forType: e.target.value }))} options={[{ value: 'pizza', label: 'Pizza' }, { value: 'menu', label: 'Menu' }, { value: 'both', label: 'Pizza i Menu' }]} />
        <div className="flex gap-2 pt-2">
          <Button variant="success" className="flex-1" onClick={save}>Zapisz</Button>
          <Button variant="secondary" onClick={cancelEdit}>Anuluj</Button>
          {!isNew && <Button variant="danger" onClick={() => handleDelete('addon', editData.id, editData.name)}>UsuÅ„</Button>}
        </div>
      </div>
    );
  };

  // ==================== SAUCE FORM ====================
  const SauceForm = () => {
    const [f, setF] = useState(editData || { id: generateId(db.sauces), name: '', price: 3 });
    const isNew = !editData;

    const validate = () => {
      if (!f.name.trim()) return 'Podaj nazwÄ™ sosu';
      if (f.price < 0) return 'Cena nie moÅ¼e byÄ‡ ujemna';
      return null;
    };

    const save = () => {
      const err = validate();
      if (err) { setError(err); return; }
      if (isNew) actions.addSauce(f);
      else actions.updateSauce(editData.id, f);
      cancelEdit();
    };

    return (
      <div className="bg-white rounded-xl p-4 border-2 border-amber-300 space-y-4">
        <h3 className="font-bold text-lg">{isNew ? 'Nowy sos' : 'Edytuj sos'}</h3>
        <ErrorMessage />
        <Input label="Nazwa*" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} />
        <Input label="Cena*" type="number" step="0.5" value={f.price} onChange={e => setF(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} />
        <div className="flex gap-2 pt-2">
          <Button variant="success" className="flex-1" onClick={save}>Zapisz</Button>
          <Button variant="secondary" onClick={cancelEdit}>Anuluj</Button>
          {!isNew && <Button variant="danger" onClick={() => handleDelete('sauce', editData.id, editData.name)}>UsuÅ„</Button>}
        </div>
      </div>
    );
  };

  // ==================== PACKAGING FORM ====================
  const PackagingForm = () => {
    const [f, setF] = useState(editData || { id: generateId(db.packaging), name: '', price: 1 });
    const isNew = !editData;

    const validate = () => {
      if (!f.name.trim()) return 'Podaj nazwÄ™ opakowania';
      if (f.price < 0) return 'Cena nie moÅ¼e byÄ‡ ujemna';
      return null;
    };

    const save = () => {
      const err = validate();
      if (err) { setError(err); return; }
      if (isNew) actions.addPackaging(f);
      else actions.updatePackaging(editData.id, f);
      cancelEdit();
    };

    return (
      <div className="bg-white rounded-xl p-4 border-2 border-amber-300 space-y-4">
        <h3 className="font-bold text-lg">{isNew ? 'Nowe opakowanie' : 'Edytuj opakowanie'}</h3>
        <ErrorMessage />
        <Input label="Nazwa*" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} />
        <Input label="Cena*" type="number" step="0.5" value={f.price} onChange={e => setF(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} />
        <div className="flex gap-2 pt-2">
          <Button variant="success" className="flex-1" onClick={save}>Zapisz</Button>
          <Button variant="secondary" onClick={cancelEdit}>Anuluj</Button>
          {!isNew && <Button variant="danger" onClick={() => handleDelete('packaging', editData.id, editData.name)}>UsuÅ„</Button>}
        </div>
      </div>
    );
  };

  // ==================== PROMOTION FORM ====================
  const PromotionForm = () => {
    const [f, setF] = useState(editData || { 
      id: generateId(db.promotions), 
      name: '', 
      type: 'combo', 
      price: 90, 
      size: 'L', 
      count: 2, 
      pizzas: [], 
      active: true 
    });
    const isNew = !editData;

    const validate = () => {
      if (!f.name.trim()) return 'Podaj nazwÄ™ promocji';
      if (f.price <= 0) return 'Cena musi byÄ‡ wiÄ™ksza od 0';
      if (f.count <= 0) return 'IloÅ›Ä‡ musi byÄ‡ wiÄ™ksza od 0';
      if (f.pizzas.length === 0) return 'Wybierz przynajmniej jednÄ… pizzÄ™';
      return null;
    };

    const save = () => {
      const err = validate();
      if (err) { setError(err); return; }
      if (isNew) actions.addPromo(f);
      else actions.updatePromo(editData.id, f);
      cancelEdit();
    };

    const togglePizza = nr => {
      setF(p => ({ ...p, pizzas: p.pizzas.includes(nr) ? p.pizzas.filter(n => n !== nr) : [...p.pizzas, nr] }));
    };

    return (
      <div className="bg-white rounded-xl p-4 border-2 border-amber-300 space-y-4 max-h-[80vh] overflow-y-auto">
        <h3 className="font-bold text-lg">{isNew ? 'Nowa promocja' : 'Edytuj promocjÄ™'}</h3>
        <ErrorMessage />
        <Input label="Nazwa*" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} />
        <div className="grid grid-cols-3 gap-3">
          <Input label="Cena*" type="number" step="0.01" value={f.price} onChange={e => setF(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} />
          <Select label="Rozmiar" value={f.size} onChange={e => setF(p => ({ ...p, size: e.target.value }))} options={db.settings.sizes.map(s => ({ value: s.id, label: s.label }))} />
          <Input label="IloÅ›Ä‡*" type="number" value={f.count} onChange={e => setF(p => ({ ...p, count: parseInt(e.target.value) || 0 }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-2">Pizze w promocji*</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {db.pizzas.map(p => (
              <Chip key={p.nr} active={f.pizzas.includes(p.nr)} onClick={() => togglePizza(p.nr)} small>
                {p.nr}. {p.name}
              </Chip>
            ))}
          </div>
        </div>
        <Toggle label="Aktywna" checked={f.active} onChange={() => setF(p => ({ ...p, active: !p.active }))} />
        <div className="flex gap-2 pt-2">
          <Button variant="success" className="flex-1" onClick={save}>Zapisz</Button>
          <Button variant="secondary" onClick={cancelEdit}>Anuluj</Button>
          {!isNew && <Button variant="danger" onClick={() => handleDelete('promo', editData.id, editData.name)}>UsuÅ„</Button>}
        </div>
      </div>
    );
  };

  // ==================== DISCOUNT FORM ====================
  const DiscountForm = () => {
    const [f, setF] = useState(editData || { id: generateId(db.discounts), name: '', type: 'percent', percent: 10, fixedPrice: 25, sizeFrom: 'L', sizeTo: 'M', active: true, perItem: true, noAlco: false });
    const isNew = !editData;

    const validate = () => {
      if (!f.name.trim()) return 'Podaj nazwÄ™ rabatu';
      if (f.type === 'percent' && (f.percent <= 0 || f.percent > 100)) return 'Procent musi byÄ‡ miÄ™dzy 1 a 100';
      if (f.type === 'fixed' && f.fixedPrice <= 0) return 'StaÅ‚a cena musi byÄ‡ wiÄ™ksza od 0';
      return null;
    };

    const save = () => {
      const err = validate();
      if (err) { setError(err); return; }
      if (isNew) actions.addDiscount(f);
      else actions.updateDiscount(editData.id, f);
      cancelEdit();
    };

    return (
      <div className="bg-white rounded-xl p-4 border-2 border-amber-300 space-y-4">
        <h3 className="font-bold text-lg">{isNew ? 'Nowy rabat' : 'Edytuj rabat'}</h3>
        <ErrorMessage />
        <Input label="Nazwa*" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} />
        <Select label="Typ" value={f.type} onChange={e => setF(p => ({ ...p, type: e.target.value }))} options={[{ value: 'percent', label: 'Procentowy' }, { value: 'size-upgrade', label: 'WiÄ™kszy w cenie mniejszego' }, { value: 'fixed', label: 'StaÅ‚a cena' }]} />
        {f.type === 'percent' && <Input label="Procent* (1-100)" type="number" value={f.percent} onChange={e => setF(p => ({ ...p, percent: parseInt(e.target.value) || 0 }))} />}
        {f.type === 'fixed' && <Input label="StaÅ‚a cena*" type="number" step="0.01" value={f.fixedPrice} onChange={e => setF(p => ({ ...p, fixedPrice: parseFloat(e.target.value) || 0 }))} />}
        {f.type === 'size-upgrade' && (
          <div className="grid grid-cols-2 gap-3">
            <Select label="Z rozmiaru" value={f.sizeFrom} onChange={e => setF(p => ({ ...p, sizeFrom: e.target.value }))} options={db.settings.sizes.map(s => ({ value: s.id, label: s.label }))} />
            <Select label="W cenie" value={f.sizeTo} onChange={e => setF(p => ({ ...p, sizeTo: e.target.value }))} options={db.settings.sizes.map(s => ({ value: s.id, label: s.label }))} />
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          <Toggle label="Aktywny" checked={f.active} onChange={() => setF(p => ({ ...p, active: !p.active }))} />
          <Toggle label="Per pozycja" checked={f.perItem} onChange={() => setF(p => ({ ...p, perItem: !p.perItem }))} />
          <Toggle label="Bez alkoholu" checked={f.noAlco || false} onChange={() => setF(p => ({ ...p, noAlco: !p.noAlco }))} />
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="success" className="flex-1" onClick={save}>Zapisz</Button>
          <Button variant="secondary" onClick={cancelEdit}>Anuluj</Button>
          {!isNew && <Button variant="danger" onClick={() => handleDelete('discount', editData.id, editData.name)}>UsuÅ„</Button>}
        </div>
      </div>
    );
  };

  // ==================== LOCATIONS PANEL ====================
  const LocationsPanel = () => {
    const [subTab, setSubTab] = useState('cities');
    const [editing, setEditing] = useState(null);
    const [aliasInput, setAliasInput] = useState('');

    const validateCity = (data) => {
      if (!data.name.trim()) return 'Podaj nazwÄ™ miasta';
      if (data.deliveryFee < 0) return 'Koszt dowozu nie moÅ¼e byÄ‡ ujemny';
      if (data.minOrder < 0) return 'Min. zamÃ³wienie nie moÅ¼e byÄ‡ ujemne';
      return null;
    };

    const validateStreet = (data) => {
      if (!data.name.trim()) return 'Podaj nazwÄ™ ulicy';
      if (!data.cityId) return 'Wybierz miasto';
      return null;
    };

    const validateLandmark = (data) => {
      if (!data.name.trim()) return 'Podaj nazwÄ™ obiektu';
      if (!data.cityId) return 'Wybierz miasto';
      if (!data.number.trim()) return 'Podaj numer';
      return null;
    };

    const saveCity = () => {
      const err = validateCity(editing.data);
      if (err) { setError(err); return; }
      if (editing.data.id) actions.updateCity(editing.data.id, editing.data);
      else actions.addCity({ ...editing.data, id: generateId(db.locations.cities) });
      setEditing(null);
      setError('');
    };

    const saveStreet = () => {
      const err = validateStreet(editing.data);
      if (err) { setError(err); return; }
      if (editing.data.id) actions.updateStreet(editing.data.id, editing.data);
      else actions.addStreet({ ...editing.data, id: generateId(db.locations.streets) });
      setEditing(null);
      setError('');
    };

    const saveLandmark = () => {
      const err = validateLandmark(editing.data);
      if (err) { setError(err); return; }
      if (editing.data.id) actions.updateLandmark(editing.data.id, editing.data);
      else actions.addLandmark({ ...editing.data, id: generateId(db.locations.landmarks) });
      setEditing(null);
      setError('');
    };

    const addAlias = () => {
      if (aliasInput.trim() && editing?.type === 'street') {
        setEditing(p => ({ ...p, data: { ...p.data, aliases: [...(p.data.aliases || []), aliasInput.trim()] } }));
        setAliasInput('');
      }
    };

    const removeAlias = alias => {
      if (editing?.type === 'street') {
        setEditing(p => ({ ...p, data: { ...p.data, aliases: p.data.aliases.filter(a => a !== alias) } }));
      }
    };

    if (editing?.type === 'city') {
      return (
        <div className="bg-white rounded-xl p-4 border-2 border-amber-300 space-y-4">
          <h3 className="font-bold text-lg">{editing.data.id ? 'Edytuj miasto' : 'Nowe miasto'}</h3>
          <ErrorMessage />
          <Input label="Nazwa*" value={editing.data.name} onChange={e => setEditing(p => ({ ...p, data: { ...p.data, name: e.target.value } }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Koszt dowozu*" type="number" step="0.01" value={editing.data.deliveryFee} onChange={e => setEditing(p => ({ ...p, data: { ...p.data, deliveryFee: parseFloat(e.target.value) || 0 } }))} />
            <Input label="Min. zamÃ³wienie*" type="number" step="0.01" value={editing.data.minOrder} onChange={e => setEditing(p => ({ ...p, data: { ...p.data, minOrder: parseFloat(e.target.value) || 0 } }))} />
          </div>
          <div className="flex gap-2">
            <Button variant="success" className="flex-1" onClick={saveCity}>Zapisz</Button>
            <Button variant="secondary" onClick={() => { setEditing(null); setError(''); }}>Anuluj</Button>
            {editing.data.id && <Button variant="danger" onClick={() => { handleDelete('city', editing.data.id, editing.data.name); setEditing(null); }}>UsuÅ„</Button>}
          </div>
        </div>
      );
    }

    if (editing?.type === 'street') {
      return (
        <div className="bg-white rounded-xl p-4 border-2 border-amber-300 space-y-4">
          <h3 className="font-bold text-lg">{editing.data.id ? 'Edytuj ulicÄ™' : 'Nowa ulica'}</h3>
          <ErrorMessage />
          <Input label="Nazwa*" value={editing.data.name} onChange={e => setEditing(p => ({ ...p, data: { ...p.data, name: e.target.value } }))} />
          <Select label="Miasto*" value={editing.data.cityId || ''} onChange={e => setEditing(p => ({ ...p, data: { ...p.data, cityId: parseInt(e.target.value) } }))} options={db.locations.cities.map(c => ({ value: c.id, label: c.name }))} />
          <Input label="Max numer (opcjonalnie)" type="number" value={editing.data.maxNumber || ''} onChange={e => setEditing(p => ({ ...p, data: { ...p.data, maxNumber: e.target.value ? parseInt(e.target.value) : null } }))} placeholder="np. 150" />
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1">Aliasy</label>
            <div className="flex gap-2 mb-2">
              <Input value={aliasInput} onChange={e => setAliasInput(e.target.value)} placeholder="np. AWP" />
              <Button onClick={addAlias}><Icon.Plus size={16} /></Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {(editing.data.aliases || []).map(a => (
                <span key={a} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                  {a} <button onClick={() => removeAlias(a)} className="font-bold">Ã—</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="success" className="flex-1" onClick={saveStreet}>Zapisz</Button>
            <Button variant="secondary" onClick={() => { setEditing(null); setError(''); }}>Anuluj</Button>
            {editing.data.id && <Button variant="danger" onClick={() => { handleDelete('street', editing.data.id, editing.data.name); setEditing(null); }}>UsuÅ„</Button>}
          </div>
        </div>
      );
    }

    if (editing?.type === 'landmark') {
      const streets = editing.data.cityId ? db.locations.streets.filter(s => s.cityId === editing.data.cityId) : [];
      return (
        <div className="bg-white rounded-xl p-4 border-2 border-amber-300 space-y-4">
          <h3 className="font-bold text-lg">{editing.data.id ? 'Edytuj obiekt' : 'Nowy obiekt'}</h3>
          <ErrorMessage />
          <Input label="Nazwa*" value={editing.data.name} onChange={e => setEditing(p => ({ ...p, data: { ...p.data, name: e.target.value } }))} />
          <Select label="Miasto*" value={editing.data.cityId || ''} onChange={e => setEditing(p => ({ ...p, data: { ...p.data, cityId: parseInt(e.target.value), streetId: null } }))} options={db.locations.cities.map(c => ({ value: c.id, label: c.name }))} />
          <Select label="Ulica" value={editing.data.streetId || ''} onChange={e => setEditing(p => ({ ...p, data: { ...p.data, streetId: parseInt(e.target.value) } }))} options={[{ value: '', label: '-- wybierz --' }, ...streets.map(s => ({ value: s.id, label: s.name }))]} />
          <Input label="Numer*" value={editing.data.number} onChange={e => setEditing(p => ({ ...p, data: { ...p.data, number: e.target.value } }))} />
          <div className="flex gap-2">
            <Button variant="success" className="flex-1" onClick={saveLandmark}>Zapisz</Button>
            <Button variant="secondary" onClick={() => { setEditing(null); setError(''); }}>Anuluj</Button>
            {editing.data.id && <Button variant="danger" onClick={() => { handleDelete('landmark', editing.data.id, editing.data.name); setEditing(null); }}>UsuÅ„</Button>}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {['cities', 'streets', 'landmarks'].map(t => (
            <button key={t} onClick={() => setSubTab(t)} className={`flex-1 py-2 rounded-lg font-semibold text-sm ${subTab === t ? 'bg-amber-500 text-white' : 'bg-stone-100'}`}>
              {t === 'cities' ? 'Miasta' : t === 'streets' ? 'Ulice' : 'Obiekty'}
            </button>
          ))}
        </div>

        {subTab === 'cities' && (
          <>
            <Button variant="success" className="w-full" onClick={() => { setEditing({ type: 'city', data: { name: '', deliveryFee: 0, minOrder: 30 } }); setError(''); }}><Icon.Plus size={16} /> Dodaj miasto</Button>
            {db.locations.cities.map(c => (
              <ItemRow key={c.id} onClick={() => { setEditing({ type: 'city', data: { ...c } }); setError(''); }}>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-stone-500">DowÃ³z: {c.deliveryFee}zÅ‚, min: {c.minOrder}zÅ‚</div>
              </ItemRow>
            ))}
          </>
        )}

        {subTab === 'streets' && (
          <>
            <Button variant="success" className="w-full" onClick={() => { setEditing({ type: 'street', data: { cityId: db.locations.cities[0]?.id, name: '', aliases: [], maxNumber: null } }); setError(''); }}><Icon.Plus size={16} /> Dodaj ulicÄ™</Button>
            {db.locations.cities.map(city => {
              const streets = db.locations.streets.filter(s => s.cityId === city.id);
              if (streets.length === 0) return null;
              return (
                <Section key={city.id} title={city.name} collapsible defaultOpen={false}>
                  {streets.map(s => (
                    <ItemRow key={s.id} onClick={() => { setEditing({ type: 'street', data: { ...s } }); setError(''); }}>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-sm text-stone-500">
                        {s.aliases?.length > 0 && <span className="text-blue-600">{s.aliases.join(', ')} â€¢ </span>}
                        {s.maxNumber && `do ${s.maxNumber}`}
                      </div>
                    </ItemRow>
                  ))}
                </Section>
              );
            })}
          </>
        )}

        {subTab === 'landmarks' && (
          <>
            <Button variant="success" className="w-full" onClick={() => { setEditing({ type: 'landmark', data: { cityId: db.locations.cities[0]?.id, streetId: null, name: '', number: '' } }); setError(''); }}><Icon.Plus size={16} /> Dodaj obiekt</Button>
            {db.locations.landmarks.map(lm => {
              const city = db.locations.cities.find(c => c.id === lm.cityId);
              const street = db.locations.streets.find(s => s.id === lm.streetId);
              return (
                <ItemRow key={lm.id} onClick={() => { setEditing({ type: 'landmark', data: { ...lm } }); setError(''); }}>
                  <div className="font-semibold">ðŸâ€œÂ {lm.name}</div>
                  <div className="text-sm text-stone-500">{city?.name}, {street?.name} {lm.number}</div>
                </ItemRow>
              );
            })}
          </>
        )}
      </div>
    );
  };

  // ==================== SETTINGS PANEL ====================
  const SettingsPanel = () => (
    <div className="space-y-4">
      <Section title="Restauracja">
        <Input label="Nazwa" value={db.settings.restaurantName} onChange={e => actions.updateSettings({ restaurantName: e.target.value })} />
      </Section>
      <Section title="Motyw kolorystyczny">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(db.themes).map(([id, theme]) => (
            <button
              key={id}
              onClick={() => actions.updateSettings({ theme: id })}
              className={`p-3 rounded-lg border-2 text-left active:scale-95 ${
                db.settings.theme === id
                  ? `bg-${theme.primary}-50 border-${theme.primary}-400 text-${theme.primary}-700`
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="font-semibold text-sm">{theme.name}</div>
              <div className="flex gap-1 mt-2">
                <div className={`w-6 h-6 rounded-full bg-${theme.primary}-500`}></div>
                <div className={`w-6 h-6 rounded-full bg-${theme.cartBg} border-2 border-${theme.cartBorder}`}></div>
              </div>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Pizza">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Darmowe sosy (domyÅ›lnie)" type="number" value={db.settings.defaultFreeSauces} onChange={e => actions.updateSettings({ defaultFreeSauces: parseInt(e.target.value) || 0 })} />
          <Input label="DopÅ‚ata Â½/Â½" type="number" step="0.01" value={db.settings.splitSurcharge} onChange={e => actions.updateSettings({ splitSurcharge: parseFloat(e.target.value) || 0 })} />
        </div>
      </Section>
      <Section title="Dane">
        <Button variant="danger" className="w-full" onClick={() => { if (window.confirm('ResetowaÄ‡ wszystkie dane?')) actions.resetData(); }}>
          <Icon.Trash2 size={16} /> Reset danych
        </Button>
      </Section>
    </div>
  );

  // ==================== RENDER ====================
  return (
    <Modal onClose={onClose} title="Admin Panel">
      <div className="p-3">
        <div className="overflow-x-auto mb-4 -mx-1 px-1 flex gap-2 pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); cancelEdit(); }}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap text-sm ${tab === t.id ? 'bg-amber-500 text-white' : 'bg-stone-100'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'pizzas' && (
          editType === 'pizza' ? <PizzaForm /> : (
            <>
              <Button variant="success" className="w-full mb-3" onClick={() => startEdit('pizza', null)}><Icon.Plus size={16} /> Dodaj pizzÄ™</Button>
              {db.pizzas.map(p => (
                <ItemRow key={p.nr} onClick={() => startEdit('pizza', p)}>
                  <div className="font-semibold">{p.nr}. {p.name}</div>
                  <div className="text-sm text-amber-600">{p.p.map(x => formatPrice(x)).join(' / ')}</div>
                </ItemRow>
              ))}
            </>
          )
        )}

        {tab === 'menu' && (
          editType === 'menu' ? <MenuForm /> : (
            <>
              <Button variant="success" className="w-full mb-3" onClick={() => startEdit('menu', null)}><Icon.Plus size={16} /> Dodaj pozycjÄ™</Button>
              {['przekÄ…ski', 'burgery', 'saÅ‚atki', 'makarony', 'napoje', 'alkohole', 'desery'].map(cat => {
                const items = db.menu.filter(m => m.cat === cat);
                if (items.length === 0) return null;
                return (
                  <Section key={cat} title={cat} collapsible defaultOpen={false}>
                    {items.map(m => (
                      <ItemRow key={m.id} onClick={() => startEdit('menu', m)}>
                        <div className="font-semibold">{m.name} {m.alco && 'ðŸÂÂº'}</div>
                        <div className="text-sm text-amber-600">{formatPrice(m.price)}</div>
                      </ItemRow>
                    ))}
                  </Section>
                );
              })}
            </>
          )
        )}

        {tab === 'addons' && (
          editType === 'addon' ? <AddonForm /> : (
            <>
              <Button variant="success" className="w-full mb-3" onClick={() => startEdit('addon', null)}><Icon.Plus size={16} /> Dodaj dodatek</Button>
              {['serowe', 'miÄ™sne', 'warzywne', 'sosy', 'inne'].map(cat => {
                const items = db.addons.filter(a => a.category === cat);
                if (items.length === 0) return null;
                return (
                  <Section key={cat} title={cat} collapsible defaultOpen={false}>
                    {items.map(a => (
                      <ItemRow key={a.id} onClick={() => startEdit('addon', a)}>
                        <div className="font-semibold">{a.name}</div>
                        <div className="text-sm text-stone-500">{formatPrice(a.price)} â€¢ {a.forType}</div>
                      </ItemRow>
                    ))}
                  </Section>
                );
              })}
            </>
          )
        )}

        {tab === 'sauces' && (
          editType === 'sauce' ? <SauceForm /> : (
            <>
              <Button variant="success" className="w-full mb-3" onClick={() => startEdit('sauce', null)}><Icon.Plus size={16} /> Dodaj sos</Button>
              {db.sauces.map(s => (
                <ItemRow key={s.id} onClick={() => startEdit('sauce', s)}>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-amber-600">{formatPrice(s.price)}</div>
                </ItemRow>
              ))}
            </>
          )
        )}

        {tab === 'packaging' && (
          editType === 'packaging' ? <PackagingForm /> : (
            <>
              <Button variant="success" className="w-full mb-3" onClick={() => startEdit('packaging', null)}><Icon.Plus size={16} /> Dodaj opakowanie</Button>
              {db.packaging.map(p => (
                <ItemRow key={p.id} onClick={() => startEdit('packaging', p)}>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-amber-600">{formatPrice(p.price)}</div>
                </ItemRow>
              ))}
            </>
          )
        )}

        {tab === 'locations' && <LocationsPanel />}

        {tab === 'discounts' && (
          editType === 'discount' ? <DiscountForm /> : (
            <>
              <Button variant="success" className="w-full mb-3" onClick={() => startEdit('discount', null)}><Icon.Plus size={16} /> Dodaj rabat</Button>
              {db.discounts.map(d => (
                <ItemRow key={d.id} onClick={() => startEdit('discount', d)}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{d.name}</span>
                    {d.active ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Ã¢Å“â€œ</span> : <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">OFF</span>}
                    {d.perItem && <span className="text-xs text-blue-600">per item</span>}
                  </div>
                  <div className="text-sm text-stone-500">
                    {d.type === 'percent' && `${d.percent}%`}
                    {d.type === 'size-upgrade' && `${d.sizeFrom} Ã¢â€ â€™ ${d.sizeTo}`}
                    {d.type === 'fixed' && `${d.fixedPrice}zÅ‚`}
                  </div>
                </ItemRow>
              ))}
            </>
          )
        )}

        {tab === 'promotions' && (
          editType === 'promo' ? <PromotionForm /> : (
            <>
              <Button variant="success" className="w-full mb-3" onClick={() => startEdit('promo', null)}><Icon.Plus size={16} /> Dodaj promocjÄ™</Button>
              {db.promotions.map(p => (
                <ItemRow key={p.id} onClick={() => startEdit('promo', p)}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{p.name}</span>
                    {p.active ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Ã¢Å“â€œ</span> : <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">OFF</span>}
                  </div>
                  <div className="text-sm text-stone-500">
                    {p.count}x pizza {p.size} za {formatPrice(p.price)}
                  </div>
                </ItemRow>
              ))}
            </>
          )
        )}

        {tab === 'settings' && <SettingsPanel />}
      </div>
    </Modal>
  );
};
