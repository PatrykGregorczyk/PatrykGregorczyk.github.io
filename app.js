// ==================== CART ITEM COMPACT ====================
// Ultra-kompaktowa pozycja z listÃâ¦ dodatkÃÂ³w

const CartItemCompact = ({ item, onUpdate, onRemove, onEdit }) => {
  const { db, globalDiscount } = useApp();

  const price = item.qty > 0 ? calculateItemPrice(item, db, globalDiscount) : 0;
  const packagingCost = item.qty > 0 ? calculatePackagingCost(item, db) : 0;

  const itemName = item.isSplit && item.splitName ? `${item.name} / ${item.splitName}` : item.name;

  const getSubtitle = () => {
    if (item.type === 'pizza') {
      const sizeIdx = getSizeIndex(item.size, db.settings);
      const sizeLabel = db.settings.sizes[sizeIdx]?.label || '';
      if (item.isSplit) {
        return { nr: `${item.pizzaNr}/${item.splitPizzaNr}`, size: sizeLabel };
      }
      return { nr: item.pizzaNr, size: sizeLabel };
    }
    return null;
  };

  // Lista dodatków dla pizzy i menu
  const getAddonsInfo = () => {
    let sourceData, defaultAddons, currentAddons;
    
    if (item.type === 'pizza') {
      sourceData = db.pizzas.find(p => p.nr === item.pizzaNr);
      defaultAddons = sourceData?.defaultAddons || {};
      currentAddons = item.addons || {};
    } else if (item.type === 'menu') {
      sourceData = db.menu.find(m => m.id === item.menuId);
      defaultAddons = sourceData?.defaultAddons || {};
      currentAddons = item.addons || {};
    } else {
      return null;
    }
    
    const defaultList = [];
    const added = [];
    const removed = [];
    
    // Lista domyślnych (bez zmian)
    Object.entries(defaultAddons).forEach(([id, qty]) => {
      const curr = currentAddons[id] || 0;
      if (curr === qty) {
        const addon = db.addons.find(a => a.id === parseInt(id));
        if (addon) {
          defaultList.push(qty > 1 ? `${qty}x ${addon.name}` : addon.name);
        }
      }
    });
    
    // Usunięte (z domyślnych)
    Object.entries(defaultAddons).forEach(([id, qty]) => {
      const curr = currentAddons[id] || 0;
      if (curr < qty) {
        const addon = db.addons.find(a => a.id === parseInt(id));
        if (addon) {
          const diff = qty - curr;
          removed.push(diff > 1 ? `${diff}x ${addon.name}` : addon.name);
        }
      }
    });
    
    // Dodane (ponad domyślne)
    Object.entries(currentAddons).forEach(([id, qty]) => {
      const def = defaultAddons[id] || 0;
      if (qty > def) {
        const addon = db.addons.find(a => a.id === parseInt(id));
        if (addon) {
          const diff = qty - def;
          added.push(diff > 1 ? `${diff}x ${addon.name}` : addon.name);
        }
      }
    });
    
    // Sosy (tylko dla pizzy)
    const sauces = [];
    if (item.type === 'pizza' && item.sauces) {
      Object.entries(item.sauces).forEach(([id, qty]) => {
        const sauce = db.sauces.find(s => s.id === parseInt(id));
        if (sauce && qty > 0) {
          sauces.push(qty > 1 ? `${qty}x ${sauce.name}` : sauce.name);
        }
      });
    }
    
    return { defaultList, added, removed, sauces };
  };

  const handleQuantityChange = (delta) => {
    const newQty = item.qty + delta;
    if (newQty < 0) return;
    onUpdate({ ...item, qty: newQty });
  };

  const subtitle = getSubtitle();
  const addonsInfo = getAddonsInfo();
  const isGrayed = item.qty === 0;

  return (
    <div 
      onClick={() => onEdit(item)}
      className={`rounded-lg p-2 border transition-all cart-item-enter cursor-pointer ${isGrayed ? 'bg-stone-100 border-stone-300 opacity-50' : 'bg-white border-stone-200 shadow-soft hover:shadow-medium hover:border-primary-300'}`}
    >
      {/* Główna linia */}
      <div className="flex items-start gap-2">
        {/* Lewa: Numer i nazwa */}
        <div className="flex-1 min-w-0">
          {/* Pizza: numer . nazwa */}
          {subtitle && (
            <div className="font-bold text-stone-800">
              {subtitle.nr} . {itemName}
            </div>
          )}
          {/* Menu: tylko nazwa */}
          {!subtitle && (
            <div className="font-bold text-stone-800">{itemName}</div>
          )}
          
          {/* Rozmiar pod nazwą */}
          {subtitle && (
            <div className="text-sm text-stone-500 mt-0.5">
              {subtitle.size}
            </div>
          )}
        </div>

        {/* Środek: Cena */}
        <div className="text-right shrink-0">
          <div className={`font-bold ${isGrayed ? 'text-stone-400' : 'text-primary-600'}`}>
            {price.toFixed(2).replace('.', ',')}
          </div>
          {packagingCost > 0 && (
            <div className="text-xs text-stone-400">
              +{packagingCost.toFixed(2).replace('.', ',')}
            </div>
          )}
        </div>

        {/* Prawa: Ilość (pionowo: + liczba -) */}
        <div 
          className="flex flex-col shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleQuantityChange(1)}
            className="w-7 h-7 rounded-t bg-stone-200 flex items-center justify-center active:scale-95 shrink-0 hover:bg-stone-300"
          >
            <Icon.Plus size={14} />
          </button>
          <div className="w-7 h-7 flex items-center justify-center font-bold text-sm shrink-0 bg-stone-100 border-y border-stone-200">
            {item.qty}
          </div>
          <button
            onClick={() => handleQuantityChange(-1)}
            className="w-7 h-7 rounded-b bg-stone-200 flex items-center justify-center active:scale-95 shrink-0 hover:bg-stone-300"
          >
            <Icon.Minus size={14} />
          </button>
        </div>
      </div>

      {/* Lista dodatków - w kolejności: domyślne, usunięte, dodane, sosy */}
      {addonsInfo && (addonsInfo.defaultList.length > 0 || addonsInfo.added.length > 0 || addonsInfo.removed.length > 0 || addonsInfo.sauces.length > 0) && (
        <div className="mt-2 pt-2 border-t border-stone-100 space-y-1">
          {addonsInfo.defaultList.length > 0 && (
            <div className="text-xs text-stone-600">{addonsInfo.defaultList.join(', ')}</div>
          )}
          {addonsInfo.removed.length > 0 && (
            <div className="text-xs text-red-600 line-through">-{addonsInfo.removed.join(', ')}</div>
          )}
          {addonsInfo.added.length > 0 && (
            <div className="text-xs text-emerald-600">+{addonsInfo.added.join(', ')}</div>
          )}
          {addonsInfo.sauces.length > 0 && (
            <div className="text-xs text-stone-500">🥫 {addonsInfo.sauces.join(', ')}</div>
          )}
        </div>
      )}

      {/* Dodatkowe info */}
      {(item.notes || item.discount) && (
        <div className="mt-2 pt-2 border-t border-stone-100 flex flex-wrap gap-1">
          {item.notes && (
            <span className="text-xs bg-primary-50 text-amber-700 px-2 py-0.5 rounded">
              📝 {item.notes}
            </span>
          )}
          {item.discount && (
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded">
              🏷️ {item.discount.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== CART BREAKDOWN MODAL ====================
// Modal z peÃânym rozwiniÃâ¢ciem koszyka i edycjÃâ¦ cen

const CartBreakdownModal = ({ onClose }) => {
  const { db, cart, globalDiscount, promo, updateCartItem } = useApp();
  const [editingPrices, setEditingPrices] = useState({});
  const [editingTotal, setEditingTotal] = useState(false);
  const [customTotal, setCustomTotal] = useState(null);

  const activeCart = cart.filter(item => item.qty > 0);
  const totals = calculateTotal(activeCart, db, globalDiscount, promo);

  const getItemPrice = (item) => {
    if (editingPrices[item.id] !== undefined) {
      return parseFloat(editingPrices[item.id]) || 0;
    }
    return calculateItemPrice(item, db, globalDiscount);
  };

  const getItemPackaging = (item) => {
    return calculatePackagingCost(item, db);
  };

  const getTotalPrice = () => {
    if (customTotal !== null) {
      return customTotal;
    }
    return activeCart.reduce((sum, item) => sum + getItemPrice(item) + getItemPackaging(item), 0);
  };

  const handlePriceChange = (itemId, value) => {
    setEditingPrices(prev => ({ ...prev, [itemId]: value }));
    setCustomTotal(null);
  };

  const handleTotalChange = (value) => {
    const parsed = parseFloat(value);
    setCustomTotal(isNaN(parsed) ? null : parsed);
  };

  return (
    <div className="h-full flex flex-col bg-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-white border-b shrink-0 shadow-soft">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
        >
          <Icon.ChevronLeft />
        </button>
        <h2 className="font-bold text-base truncate px-2">Rozwinięcie koszyka</h2>
        <div className="w-9" />
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeCart.map(item => {
          const itemName = item.isSplit && item.splitName ? `${item.name} / ${item.splitName}` : item.name;
          const price = getItemPrice(item);
          const packaging = getItemPackaging(item);

          return (
            <div key={item.id} className="bg-white rounded-lg p-3 border-2 border-stone-200 space-y-2">
              <div className="font-semibold text-stone-800">{itemName}</div>
              
              {/* Cena pozycji */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Cena:</span>
                <input
                  type="number"
                  step="0.01"
                  value={editingPrices[item.id] !== undefined ? editingPrices[item.id] : price.toFixed(2)}
                  onChange={e => handlePriceChange(item.id, e.target.value)}
                  className="flex-1 font-bold text-primary-600"
                />
                <span className="text-xs text-stone-500">zł</span>
              </div>

              {/* Opakowanie */}
              {packaging > 0 && (
                <div className="text-xs text-stone-400">
                  Opakowanie: +{formatPrice(packaging)}
                </div>
              )}

              {/* Dodatki dla pizzy */}
              {item.type === 'pizza' && item.addons && (
                <div className="space-y-1">
                  <div className="text-xs text-stone-500 font-semibold">Dodatki:</div>
                  {Object.entries(item.addons).map(([addonId, qty]) => {
                    const addon = db.addons.find(a => a.id === parseInt(addonId));
                    if (!addon || qty === 0) return null;
                    return (
                      <div key={addonId} className="text-xs text-stone-600 ml-2">
                        • {addon.name} ×{qty}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sosy dla pizzy */}
              {item.type === 'pizza' && item.sauces && Object.keys(item.sauces).length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-stone-500 font-semibold">Sosy:</div>
                  {Object.entries(item.sauces).map(([sauceId, qty]) => {
                    const sauce = db.sauces.find(s => s.id === parseInt(sauceId));
                    if (!sauce || qty === 0) return null;
                    return (
                      <div key={sauceId} className="text-xs text-stone-600 ml-2">
                        • {sauce.name} ×{qty}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* RAZEM */}
        <div className="bg-primary-50 rounded-lg p-4 border-2 border-primary-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">RAZEM:</span>
            {!editingTotal ? (
              <button
                onClick={() => setEditingTotal(true)}
                className="flex-1 text-right font-black text-xl text-primary-600"
              >
                {formatPrice(getTotalPrice())}
              </button>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={customTotal !== null ? customTotal.toFixed(2) : getTotalPrice().toFixed(2)}
                  onChange={e => handleTotalChange(e.target.value)}
                  onBlur={() => setEditingTotal(false)}
                  autoFocus
                  className="flex-1 text-right font-black text-xl text-primary-600 border-primary-400"
                />
                <span className="text-sm text-stone-500">zł</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ==================== CART SIDEBAR ====================
// Koszyk zawsze widoczny po prawej stronie

const CartSidebar = ({ onOrder, onEditItem, onEditMenuItem, onShowBreakdown }) => {
  const {
    db,
    cart,
    updateCartItem,
    removeFromCart,
    globalDiscount,
    setGlobalDiscount,
    promo,
    setPromo
  } = useApp();

  const [showDiscountsPromos, setShowDiscountsPromos] = useState(false);

  const totals = calculateTotal(cart.filter(item => item.qty > 0), db, globalDiscount, promo);
  const globalDiscounts = db.discounts.filter(d => d.active && !d.perItem);
  const activePromos = db.promotions.filter(p => p.active);
  const activeCart = cart.filter(item => item.qty > 0);

  const handleEdit = (item) => {
    if (item.type === 'pizza') {
      onEditItem(item);
    } else if (item.type === 'menu') {
      onEditMenuItem(item);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Lista pozycji */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {cart.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <Icon.ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">Brak pozycji</p>
          </div>
        ) : (
          cart.map(item => (
            <CartItemCompact
              key={item.id}
              item={item}
              onUpdate={updateCartItem}
              onRemove={removeFromCart}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Footer - 3 przyciski obok siebie */}
      {activeCart.length > 0 && (
        <div className="p-2 border-t-2 border-stone-200 shrink-0">
          {/* Rozwinięte rabaty i promocje - nad przyciskami */}
          {showDiscountsPromos && (
            <div className="space-y-2 pb-2 mb-2 border-b border-stone-200">
              {globalDiscounts.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-stone-500 mb-1">Rabat:</div>
                  <div className="flex flex-wrap gap-1">
                    {globalDiscounts.map(d => (
                      <Chip
                        key={d.id}
                        active={globalDiscount?.id === d.id}
                        onClick={() => setGlobalDiscount(globalDiscount?.id === d.id ? null : d)}
                        small
                      >
                        {d.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {activePromos.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-stone-500 mb-1">Promocja:</div>
                  <div className="flex flex-wrap gap-1">
                    {activePromos.map(p => (
                      <Chip
                        key={p.id}
                        active={promo?.id === p.id}
                        onClick={() => setPromo(promo?.id === p.id ? null : p)}
                        small
                      >
                        {p.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3 przyciski obok siebie */}
          <div className="flex gap-2">
            {/* 1. Rabaty/Promocje */}
            {(globalDiscounts.length > 0 || activePromos.length > 0) && (
              <button
                onClick={() => setShowDiscountsPromos(!showDiscountsPromos)}
                className="flex-1 px-2 py-3 rounded-lg bg-white border-2 border-stone-200 hover:border-stone-300 font-semibold flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all shadow-soft"
              >
                <span className="text-xs text-stone-700">Promocje</span>
                <span className="text-xs text-stone-700">i Rabaty</span>
                <Icon.ChevronDown size={14} className={`text-stone-400 transition-transform ${showDiscountsPromos ? 'rotate-180' : ''}`} />
              </button>
            )}

            {/* 2. Zamów */}
            <button
              onClick={onOrder}
              className="flex-1 px-3 py-3 rounded-lg bg-primary-gradient text-white text-base font-bold flex items-center justify-center active:scale-95 transition-all shadow-medium hover:shadow-strong"
            >
              Zamów
            </button>

            {/* 3. RAZEM */}
            <button
              onClick={onShowBreakdown}
              className="flex-1 px-2 py-3 rounded-lg bg-white border-2 border-stone-300 hover:border-stone-400 font-bold flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all shadow-soft"
            >
              <span className="text-xs text-stone-600">RAZEM</span>
              <span className="text-lg text-stone-800">{formatPrice(totals.total)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


// ==================== MAIN APP ====================

const MainApp = () => {
  const { db, cart, addToCart, clearCart, loadCart, actions } = useApp();
  const theme = useTheme(db);
  
  // Aplikuj CSS variables gdy motyw siÃâ¢ zmieni
  React.useEffect(() => {
    if (window.applyThemeVars && db) {
      window.applyThemeVars(db);
    }
  }, [db.settings?.theme, db]);
  
  const [sizeIdx, setSizeIdx] = useState(1);
  const [mainTab, setMainTab] = useState('pizza');
  const [kitchenCat, setKitchenCat] = useState('przekÃâ¦ski');
  const [barCat, setBarCat] = useState('napoje');
  
  const [showCart, setShowCart] = useState(true); // Globalny toggle koszyka
  const [showHistory, setShowHistory] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLabel, setShowLabel] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  // Stany dla edytorów - aby koszyk był widoczny podczas edycji
  const [editingItem, setEditingItem] = useState(null);
  const [editingMenuItemState, setEditingMenuItemState] = useState(null);
  const [showCartBreakdown, setShowCartBreakdown] = useState(false);

  // Dodaj pizzÃâ¢ do koszyka
  const handleAddPizza = (pizza) => {
    const item = createPizzaItem(pizza.nr, db.settings.sizes[sizeIdx].id, db);
    addToCart(item);
  };

  // Dodaj pozycjÃâ¢ z menu
  const handleAddMenuItem = (menuItem) => {
    const item = createMenuItem(menuItem, db);
    addToCart(item);
  };

  // ObsÃâuga zamÃÂ³wienia z koszyka
  const handleOrderClick = () => {
    setShowOrderForm(true);
  };

  const handleOrder = (order) => {
    setShowOrderForm(false);
    setShowLabel(order);
  };

  // PotwierdÃÂº zamÃÂ³wienie
  const handleConfirmOrder = () => {
    actions.addOrder(showLabel);
    clearCart();
    setShowLabel(null);
  };

  // Kopiuj z historii
  const handleCopyFromHistory = (order) => {
    loadCart(order.items);
    setShowHistory(false);
  };

  // Drukuj ponownie
  const handleReprint = (order) => {
    setShowHistory(false);
    setShowLabel({ ...order, _reprintOnly: true });
  };

  // PotwierdÃÂº reprint
  const handleConfirmReprint = () => {
    if (showLabel._reprintOnly) {
      setShowLabel(null);
    } else {
      handleConfirmOrder();
    }
  };

  // Kategorie
  const kitchenCategories = [
    { id: 'przekÃâ¦ski', label: 'Ã°Å¸Å¸Â¢ PrzekÃâ¦ski' },
    { id: 'burgery', label: 'Ã°Å¸Ââ Burgery' },
    { id: 'saÃâatki', label: 'Ã°Å¸Â¥â SaÃâatki' },
    { id: 'makarony', label: 'Ã°Å¸ÂÂ Makarony' },
    { id: 'desery', label: 'Ã°Å¸ÂÂ° Desery' },
  ];

  const barCategories = [
    { id: 'napoje', label: 'Ã°Å¸Â¥Â¤ Zimne' },
    { id: 'alkohole', label: 'Ã°Å¸ÂÂº Alkohol' },
  ];


  return (
    <div className="h-screen flex themed-bg">
      {/* Lewa strona - Menu / Admin / History / Edytory */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Renderowanie contentu - główny widok, admin, historia lub edytory */}
        {editingItem ? (
          <PizzaEditor
            item={editingItem}
            onSave={(updated) => { updateCartItem(updated); setEditingItem(null); }}
            onClose={() => setEditingItem(null)}
          />
        ) : editingMenuItemState ? (
          <MenuItemEditor
            item={editingMenuItemState}
            onSave={(updated) => { updateCartItem(updated); setEditingMenuItemState(null); }}
            onClose={() => setEditingMenuItemState(null)}
          />
        ) : showCartBreakdown ? (
          <CartBreakdownModal onClose={() => setShowCartBreakdown(false)} />
        ) : showOrderForm ? (
          <CartView 
            onClose={() => setShowOrderForm(false)} 
            onOrder={handleOrder}
          />
        ) : showAdmin ? (
          <AdminPanel onClose={() => setShowAdmin(false)} />
        ) : showHistory ? (
          <HistoryView
            onClose={() => setShowHistory(false)}
            onReprint={handleReprint}
            onCopy={handleCopyFromHistory}
          />
        ) : (
          <>
            {/* Header */}
            <header className="bg-white border-b p-3 shrink-0 shadow-soft space-y-3">
          {/* ZakÅadki gÅÃ³wne z przyciskami po prawej */}
          <div className="flex items-center gap-3">
            {/* ZakÅadki */}
            <div className="flex-1 flex gap-1 p-1 bg-stone-200 rounded-xl">
              {[
                { id: 'pizza', label: 'Pizza', icon: '🍕' },
                { id: 'kuchnia', label: 'Kuchnia', icon: '👨‍🍳' },
                { id: 'bar', label: 'Bar', icon: '☕' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setMainTab(t.id)}
                  className={`flex-1 py-2 px-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 ${
                    mainTab === t.id ? 'bg-white text-stone-800 shadow-medium' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Przyciski po prawej */}
            <div className="flex shadow-soft rounded-xl overflow-hidden shrink-0">
              <button
                onClick={() => setShowAdmin(true)}
                className="w-10 h-10 bg-white hover:bg-stone-50 flex items-center justify-center transition-colors text-stone-600 hover:text-stone-800"
              >
                <Icon.Settings size={20} />
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="w-10 h-10 bg-white hover:bg-stone-50 flex items-center justify-center transition-colors border-l border-stone-200 text-stone-600 hover:text-stone-800"
              >
                <Icon.History size={20} />
              </button>
            </div>
          </div>

          {/* Rozmiary pizzy */}
          {mainTab === 'pizza' && (
            <div className="flex gap-2">
              {db.settings.sizes.map((size, idx) => (
                <button
                  key={size.id}
                  onClick={() => setSizeIdx(idx)}
                  className={`flex-1 py-2.5 rounded-xl font-semibold active:scale-95 transition-all ${
                    sizeIdx === idx ? `${theme.gradient} text-white shadow-medium` : 'bg-white border-2 border-stone-200 shadow-soft'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}

          {/* Kategorie kuchni */}
          {mainTab === 'kuchnia' && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {kitchenCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setKitchenCat(cat.id)}
                  className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap active:scale-95 transition-all ${
                    kitchenCat === cat.id ? `${theme.gradient} text-white shadow-medium` : `bg-white border-2 border-stone-200 shadow-soft ${theme.borderPrimaryHover}`
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Kategorie baru */}
          {mainTab === 'bar' && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {barCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setBarCat(cat.id)}
                  className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap active:scale-95 transition-all ${
                    barCat === cat.id ? `${theme.gradient} text-white shadow-medium` : `bg-white border-2 border-stone-200 shadow-soft ${theme.borderPrimaryHover}`
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-3">
          {/* Pizze */}
          {mainTab === 'pizza' && (
            <div className="grid grid-cols-4 gap-3">
              {db.pizzas.map(pizza => (
                <PizzaTile
                  key={pizza.nr}
                  pizza={pizza}
                  sizeIdx={sizeIdx}
                  onClick={handleAddPizza}
                />
              ))}
            </div>
          )}

          {/* Kuchnia */}
          {mainTab === 'kuchnia' && (
            <div className="grid grid-cols-4 gap-3">
              {db.menu
                .filter(m => m.cat === kitchenCat)
                .map(item => (
                  <Tile key={item.id} onClick={() => handleAddMenuItem(item)}>
                    <div className="font-semibold text-stone-700 truncate">{item.name}</div>
                    <div className="font-bold text-primary-600 mt-1">{formatPrice(item.price)}</div>
                  </Tile>
                ))}
            </div>
          )}

          {/* Bar */}
          {mainTab === 'bar' && (
            <div className="grid grid-cols-4 gap-3">
              {db.menu
                .filter(m => m.cat === barCat)
                .map(item => (
                  <Tile key={item.id} onClick={() => handleAddMenuItem(item)}>
                    <div className="font-semibold text-stone-700 truncate">{item.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-primary-600">{formatPrice(item.price)}</span>
                      {item.alco && <span>Ã°Å¸ÂÂÃÂÃÂº</span>}
                    </div>
                  </Tile>
                ))}
            </div>
          )}
        </main>
          </>
        )}
      </div>

      {/* Prawa strona - Koszyk ZAWSZE WIDOCZNY */}
      <div className="shrink-0 bg-themed-subtle border-l-2 themed-border-subtle" style={{ width: `${db.settings.cartWidth || 33}%` }}>
        <CartSidebar 
          onOrder={handleOrderClick}
          onEditItem={setEditingItem}
          onEditMenuItem={setEditingMenuItemState}
          onShowBreakdown={setShowCartBreakdown}
        />
      </div>

      {/* Modale (tylko pełnoekranowe) */}
      {showLabel && (
        <OrderLabel order={showLabel} onClose={() => setShowLabel(null)} onConfirm={handleConfirmReprint} />
      )}
    </div>
  );
};

// ==================== APP ROOT ====================

const App = () => {
  return (
    <AppProvider>
      <AppWithContext />
    </AppProvider>
  );
};

const AppWithContext = () => {
  const { removeFromCart } = useApp();
  
  // UdostÃâ¢pniamy globalnie dla edytorÃÂ³w
  React.useEffect(() => {
    window.__appContext = { removeFromCart };
  }, [removeFromCart]);
  
  return <MainApp />;
};

// ==================== RENDER ====================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
