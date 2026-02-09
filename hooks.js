// ==================== REACT DEPENDENCIES ====================
const { useState, useReducer, useEffect, useCallback, createContext, useContext, useRef } = React;

// ==================== CONTEXT ====================
const AppContext = createContext(null);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// ==================== HOOKS ====================

// Hook do zarządzania danymi aplikacji
const useAppData = () => {
  const [state, dispatch] = useReducer(
    dataReducer,
    { data: DataService.load(), version: 0, logs: [] }
  );
  
  // Auto-save do localStorage przy każdej zmianie
  useEffect(() => {
    if (state.version > 0) {
      DataService.save(state.data);
    }
  }, [state.version, state.data]);

  // Wszystkie akcje
  const actions = {
    // Orders
    addOrder: useCallback((order) => {
      dispatch({ type: ACTIONS.ADD_ORDER, payload: order });
    }, []),
    
    updateOrder: useCallback((id, updates) => {
      dispatch({ type: ACTIONS.UPDATE_ORDER, payload: { id, updates } });
    }, []),
    
    deleteOrder: useCallback((id) => {
      dispatch({ type: ACTIONS.DELETE_ORDER, payload: id });
    }, []),

    // Pizzas
    addPizza: useCallback((pizza) => {
      dispatch({ type: ACTIONS.ADD_PIZZA, payload: pizza });
    }, []),
    
    updatePizza: useCallback((nr, updates) => {
      dispatch({ type: ACTIONS.UPDATE_PIZZA, payload: { nr, updates } });
    }, []),
    
    deletePizza: useCallback((nr) => {
      dispatch({ type: ACTIONS.DELETE_PIZZA, payload: nr });
    }, []),

    // Menu
    addMenuItem: useCallback((item) => {
      dispatch({ type: ACTIONS.ADD_MENU_ITEM, payload: item });
    }, []),
    
    updateMenuItem: useCallback((id, updates) => {
      dispatch({ type: ACTIONS.UPDATE_MENU_ITEM, payload: { id, updates } });
    }, []),
    
    deleteMenuItem: useCallback((id) => {
      dispatch({ type: ACTIONS.DELETE_MENU_ITEM, payload: id });
    }, []),

    // Addons
    addAddon: useCallback((addon) => dispatch({ type: ACTIONS.ADD_ADDON, payload: addon }), []),
    updateAddon: useCallback((id, updates) => dispatch({ type: ACTIONS.UPDATE_ADDON, payload: { id, updates } }), []),
    deleteAddon: useCallback((id) => dispatch({ type: ACTIONS.DELETE_ADDON, payload: id }), []),

    // Sauces
    addSauce: useCallback((sauce) => dispatch({ type: ACTIONS.ADD_SAUCE, payload: sauce }), []),
    updateSauce: useCallback((id, updates) => dispatch({ type: ACTIONS.UPDATE_SAUCE, payload: { id, updates } }), []),
    deleteSauce: useCallback((id) => dispatch({ type: ACTIONS.DELETE_SAUCE, payload: id }), []),

    // Discounts
    addDiscount: useCallback((discount) => dispatch({ type: ACTIONS.ADD_DISCOUNT, payload: discount }), []),
    updateDiscount: useCallback((id, updates) => dispatch({ type: ACTIONS.UPDATE_DISCOUNT, payload: { id, updates } }), []),
    deleteDiscount: useCallback((id) => dispatch({ type: ACTIONS.DELETE_DISCOUNT, payload: id }), []),

    // Promotions
    addPromo: useCallback((promo) => dispatch({ type: ACTIONS.ADD_PROMO, payload: promo }), []),
    updatePromo: useCallback((id, updates) => dispatch({ type: ACTIONS.UPDATE_PROMO, payload: { id, updates } }), []),
    deletePromo: useCallback((id) => dispatch({ type: ACTIONS.DELETE_PROMO, payload: id }), []),

    // Packaging
    addPackaging: useCallback((pkg) => dispatch({ type: ACTIONS.ADD_PACKAGING, payload: pkg }), []),
    updatePackaging: useCallback((id, updates) => dispatch({ type: ACTIONS.UPDATE_PACKAGING, payload: { id, updates } }), []),
    deletePackaging: useCallback((id) => dispatch({ type: ACTIONS.DELETE_PACKAGING, payload: id }), []),

    // Cities
    addCity: useCallback((city) => dispatch({ type: ACTIONS.ADD_CITY, payload: city }), []),
    updateCity: useCallback((id, updates) => dispatch({ type: ACTIONS.UPDATE_CITY, payload: { id, updates } }), []),
    deleteCity: useCallback((id) => dispatch({ type: ACTIONS.DELETE_CITY, payload: id }), []),

    // Streets
    addStreet: useCallback((street) => dispatch({ type: ACTIONS.ADD_STREET, payload: street }), []),
    updateStreet: useCallback((id, updates) => dispatch({ type: ACTIONS.UPDATE_STREET, payload: { id, updates } }), []),
    deleteStreet: useCallback((id) => dispatch({ type: ACTIONS.DELETE_STREET, payload: id }), []),

    // Landmarks
    addLandmark: useCallback((landmark) => dispatch({ type: ACTIONS.ADD_LANDMARK, payload: landmark }), []),
    updateLandmark: useCallback((id, updates) => dispatch({ type: ACTIONS.UPDATE_LANDMARK, payload: { id, updates } }), []),
    deleteLandmark: useCallback((id) => dispatch({ type: ACTIONS.DELETE_LANDMARK, payload: id }), []),

    // Settings
    updateSettings: useCallback((settings) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: settings }), []),

    // Reset
    resetData: useCallback(() => dispatch({ type: ACTIONS.RESET_DATA }), []),

    // Debug
    addLog: useCallback((message) => dispatch({ type: ACTIONS.ADD_LOG, payload: message }), []),
    clearLogs: useCallback(() => dispatch({ type: ACTIONS.CLEAR_LOGS }), []),
  };

  return {
    db: state.data,
    version: state.version,
    logs: state.logs,
    actions,
  };
};

// Hook do zarządzania koszykiem
const useCart = () => {
  const [cart, setCart] = useState([]);
  const [globalDiscount, setGlobalDiscount] = useState(null);
  const [promo, setPromo] = useState(null);

  const addToCart = useCallback((item) => {
    setCart(prev => [...prev, item]);
  }, []);

  const updateCartItem = useCallback((updatedItem) => {
    setCart(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setGlobalDiscount(null);
    setPromo(null);
  }, []);

  const loadCart = useCallback((items) => {
    setCart(items.map((item, idx) => ({ ...item, id: Date.now() + idx })));
  }, []);

  return {
    cart,
    globalDiscount,
    promo,
    setCart,
    setGlobalDiscount,
    setPromo,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
  };
};

// ==================== PROVIDER ====================

const AppProvider = ({ children }) => {
  const appData = useAppData();
  const cartData = useCart();

  const value = {
    // Database
    db: appData.db,
    version: appData.version,
    logs: appData.logs,
    actions: appData.actions,
    
    // Cart
    cart: cartData.cart,
    globalDiscount: cartData.globalDiscount,
    promo: cartData.promo,
    setCart: cartData.setCart,
    setGlobalDiscount: cartData.setGlobalDiscount,
    setPromo: cartData.setPromo,
    addToCart: cartData.addToCart,
    updateCartItem: cartData.updateCartItem,
    removeFromCart: cartData.removeFromCart,
    clearCart: cartData.clearCart,
    loadCart: cartData.loadCart,
  };

  return React.createElement(AppContext.Provider, { value }, children);
};
