// ==================== FORMATOWANIE ====================

window.formatPrice = (price) => {
  return (price || 0).toFixed(2).replace('.', ',') + ' zł';
};

window.formatTime = (date) => {
  return new Date(date).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
};

window.formatDate = (date) => {
  return new Date(date).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
};

window.formatDateFull = (date) => {
  return new Date(date).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

window.isToday = (dateStr) => {
  if (!dateStr) return true;
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// ==================== ROZMIARY ====================

window.getSizeIndex = (sizeId, settings) => {
  return settings.sizes.findIndex(s => s.id === sizeId);
};

window.getSizeLetter = (sizeIndex, settings) => {
  return settings.sizes[sizeIndex]?.short || 'ś';
};

// ==================== ID GENERATOR ====================

window.generateId = (array) => {
  if (!array || array.length === 0) return 1;
  return Math.max(...array.map(x => x.id || x.nr || 0)) + 1;
};

// ==================== TWORZENIE POZYCJI ====================

window.createPizzaItem = (pizzaNr, size, db) => {
  const pizza = db.pizzas.find(p => p.nr === pizzaNr);
  const addons = { ...(pizza?.defaultAddons || {}) };
  
  // Domyślne darmowe sosy
  const sauces = {};
  const freeSauceIds = pizza?.freeSauces || [];
  const freeSaucesCount = pizza?.freeSaucesCount ?? db.settings.defaultFreeSauces;
  freeSauceIds.slice(0, freeSaucesCount).forEach(id => {
    sauces[id] = 1;
  });

  return {
    id: Date.now() + Math.random(),
    type: 'pizza',
    pizzaNr,
    name: pizza?.name || '',
    size,
    qty: 1,
    notes: '',
    discount: null,
    isSplit: false,
    splitPizzaNr: null,
    splitName: null,
    addons,
    splitAddons: {},
    sauces
  };
};

window.createMenuItem = (menuItem) => {
  return {
    id: Date.now() + Math.random(),
    type: 'menu',
    menuId: menuItem.id,
    name: menuItem.name,
    price: menuItem.price,
    qty: 1,
    addons: { ...(menuItem.defaultAddons || {}) }
  };
};

// ==================== KALKULACJE CEN ====================

window.calculatePackagingCost = (item, db) => {
  if (item.type === 'pizza') {
    const pizza = db.pizzas.find(p => p.nr === item.pizzaNr);
    const sizeIdx = getSizeIndex(item.size, db.settings);
    const pkgId = pizza?.pkg?.[sizeIdx];
    const pkg = db.packaging.find(p => p.id === pkgId);
    return (pkg?.price || 0) * item.qty;
  }
  
  if (item.type === 'menu') {
    const menuItem = db.menu.find(x => x.id === item.menuId);
    const pkg = db.packaging.find(p => p.id === menuItem?.pkg);
    return (pkg?.price || 0) * item.qty;
  }
  
  return 0;
};

window.calculatePizzaPrice = (item, db) => {
  const pizza = db.pizzas.find(p => p.nr === item.pizzaNr);
  const sizeIdx = getSizeIndex(item.size, db.settings);
  let basePrice = pizza?.p?.[sizeIdx] || 0;

  // Pół na pół - wyższa cena + dopłata
  if (item.isSplit && item.splitPizzaNr) {
    const pizza2 = db.pizzas.find(p => p.nr === item.splitPizzaNr);
    basePrice = Math.max(basePrice, pizza2?.p?.[sizeIdx] || 0) + db.settings.splitSurcharge;
  }

  let price = basePrice;

  // Rabat per pozycja
  const discount = item.discount;
  if (discount) {
    if (discount.type === 'size-upgrade' && item.size === discount.sizeFrom) {
      const targetIdx = getSizeIndex(discount.sizeTo, db.settings);
      price = pizza?.p?.[targetIdx] || price;
    }
    if (discount.type === 'fixed') {
      price = discount.fixedPrice;
    }
    if (discount.type === 'percent') {
      price *= (1 - discount.percent / 100);
    }
  }

  // Dodatki pierwszej połówki - liczymy tylko extra (ponad domyślne)
  const defaultAddons = pizza?.defaultAddons || {};
  const currentAddons = item.addons || {};

  Object.entries(currentAddons).forEach(([addonId, qty]) => {
    const addon = db.addons.find(a => a.id === parseInt(addonId));
    if (addon && qty > 0) {
      const defaultQty = defaultAddons[addonId] || 0;
      const extraQty = Math.max(0, qty - defaultQty);
      price += addon.price * extraQty;
    }
  });

  // Dodatki drugiej połówki (jeśli split)
  if (item.isSplit) {
    const splitAddons = item.splitAddons || {};
    const pizza2 = db.pizzas.find(p => p.nr === item.splitPizzaNr);
    const defaultAddons2 = pizza2?.defaultAddons || {};
    
    Object.entries(splitAddons).forEach(([addonId, qty]) => {
      const addon = db.addons.find(a => a.id === parseInt(addonId));
      if (addon && qty > 0) {
        const defaultQty = defaultAddons2[addonId] || 0;
        const extraQty = Math.max(0, qty - defaultQty);
        price += addon.price * extraQty * 0.5; // połowa ceny dla drugiej połówki
      }
    });
  }

  // Sosy - liczymy płatne
  const freeSauceIds = pizza?.freeSauces || [];
  const freeSaucesCount = pizza?.freeSaucesCount ?? db.settings.defaultFreeSauces;
  const selectedSauces = item.sauces || {};

  let freeUsed = 0;
  Object.entries(selectedSauces).forEach(([sauceId, qty]) => {
    const sauce = db.sauces.find(s => s.id === parseInt(sauceId));
    if (!sauce) return;
    
    for (let i = 0; i < qty; i++) {
      if (freeSauceIds.includes(parseInt(sauceId)) && freeUsed < freeSaucesCount) {
        freeUsed++;
      } else {
        price += sauce.price;
      }
    }
  });

  return price * item.qty;
};

window.calculateMenuPrice = (item, db, globalDiscount = null) => {
  const menuItem = db.menu.find(x => x.id === item.menuId);
  let price = menuItem?.price || 0;

  // Dodatki
  const defaultAddons = menuItem?.defaultAddons || {};
  const currentAddons = item.addons || {};

  Object.entries(currentAddons).forEach(([addonId, qty]) => {
    const addon = db.addons.find(a => a.id === parseInt(addonId));
    if (addon && qty > 0) {
      const defaultQty = defaultAddons[addonId] || 0;
      const extraQty = Math.max(0, qty - defaultQty);
      price += addon.price * extraQty;
    }
  });

  price *= item.qty;

  // Rabat globalny
  if (globalDiscount?.type === 'percent' && !(globalDiscount.noAlco && menuItem?.alco)) {
    price *= (1 - globalDiscount.percent / 100);
  }

  return price;
};

window.calculateItemPrice = (item, db, globalDiscount = null) => {
  if (item.type === 'pizza') {
    return calculatePizzaPrice(item, db);
  }
  
  if (item.type === 'menu') {
    return calculateMenuPrice(item, db, globalDiscount);
  }
  
  return 0;
};

window.calculateTotal = (cart, db, globalDiscount, promo) => {
  let subtotal = cart.reduce((sum, item) => sum + calculateItemPrice(item, db, globalDiscount), 0);
  let packaging = cart.reduce((sum, item) => sum + calculatePackagingCost(item, db), 0);
  
  // Promocje combo
  if (promo?.type === 'combo') {
    const eligible = cart.filter(i =>
      i.type === 'pizza' &&
      i.size === promo.size &&
      promo.pizzas.includes(i.pizzaNr) &&
      !i.discount
    );
    const totalQty = eligible.reduce((sum, p) => sum + p.qty, 0);
    const combos = Math.floor(totalQty / promo.count);
    
    if (combos > 0) {
      const normalPrice = eligible.reduce((sum, p) => sum + calculateItemPrice(p, db, null), 0);
      subtotal = subtotal - normalPrice + combos * promo.price;
    }
  }
  
  return {
    subtotal,
    packaging,
    total: subtotal + packaging
  };
};

// ==================== GRUPOWANIE ====================

window.groupByCategory = (addons) => {
  const groups = { serowe: [], mięsne: [], warzywne: [], inne: [] };
  addons.forEach(a => {
    (groups[a.category] || groups.inne).push(a);
  });
  return groups;
};

// ==================== MOTYWY ====================

window.getThemeClasses = (db) => {
  // Już nie potrzebne - używamy CSS variables
  // Zostawiamy dla kompatybilności wstecznej
  return {
    gradient: 'bg-primary-gradient',
    borderPrimaryHover: 'hover:border-primary-300',
  };
};

// Hook do używania w komponentach  
window.useTheme = (db) => {
  return getThemeClasses(db);
};
// Funkcja do ustawienia CSS variables na podstawie motywu
window.applyThemeVars = (db) => {
  const theme = db.themes?.[db.settings?.theme] || db.themes?.classic || { primary: 'amber' };
  const primary = theme.primary;
  
  // Mapa kolorów
  const colors = {
    amber: { 
      50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 
      400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
    },
    sky: { 
      50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
      400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
      gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)'
    },
    emerald: { 
      50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
      400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
      gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
    },
    orange: { 
      50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
      400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
      gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)'
    },
    purple: { 
      50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe',
      400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce',
      gradient: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)'
    },
    rose: { 
      50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
      400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
      gradient: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)'
    }
  };
  
  const c = colors[primary] || colors.amber;
  
  document.documentElement.style.setProperty('--primary-50', c[50]);
  document.documentElement.style.setProperty('--primary-100', c[100]);
  document.documentElement.style.setProperty('--primary-200', c[200]);
  document.documentElement.style.setProperty('--primary-300', c[300]);
  document.documentElement.style.setProperty('--primary-400', c[400]);
  document.documentElement.style.setProperty('--primary-500', c[500]);
  document.documentElement.style.setProperty('--primary-600', c[600]);
  document.documentElement.style.setProperty('--primary-700', c[700]);
  document.documentElement.style.setProperty('--primary-gradient', c.gradient);
};
