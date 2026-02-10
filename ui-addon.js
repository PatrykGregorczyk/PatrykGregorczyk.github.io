// ==================== ADDON CHIP ====================
// Uniwersalny przycisk dodatku - jeden wygląd dla wszystkich trybów

const AddonChip = ({
  name,
  qty = 0,
  maxQty = 20,
  isDefault = false,
  isRemoved = false,
  onAdd,
  onRemove,
  onToggle,
  onLongPress,
  mode = 'cart' // 'cart' lub 'admin'
}) => {
  const chipWidth = 'w-28';
  const longPressTimer = useRef(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    if (mode === 'admin' && onLongPress) {
      setIsPressed(true);
      longPressTimer.current = setTimeout(() => {
        onLongPress();
        setIsPressed(false);
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      setIsPressed(false);
    }
  };

  // ========== AKTYWNY (qty > 0) ==========
  if (qty > 0) {
    return (
      <div
        className={`inline-flex items-stretch rounded-full overflow-hidden border-2 border-emerald-400 text-xs font-medium h-8 ${chipWidth}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <button
          onClick={onRemove}
          className={`w-[34%] flex items-center justify-center active:scale-95 shrink-0 ${
            isPressed ? 'bg-red-600' : 'bg-rose-500'
          } text-white font-bold`}
        >
          ×{qty}
        </button>
        <button
          onClick={qty < maxQty ? onAdd : undefined}
          className={`flex-1 flex items-center justify-center gap-1 text-white active:scale-95 ${
            qty >= maxQty ? 'bg-emerald-400' : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          <span className="truncate">{name}</span>
        </button>
      </div>
    );
  }

  // ========== USUNIĘTY DOMYŁšLNY ==========
  if (isRemoved) {
    return (
      <button
        onClick={onToggle}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        className={`inline-flex items-center justify-center rounded-full text-xs font-medium border-2 line-through h-8 ${chipWidth} active:scale-95 ${
          isPressed ? 'bg-red-600 text-white border-red-600' : 'bg-red-100 text-red-600 border-red-300'
        }`}
      >
        {name}
      </button>
    );
  }

  // ========== NIEAKTYWNY (domyślny lub dodany) ==========
  return (
    <button
      onClick={onToggle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      className={`inline-flex items-center justify-center rounded-full text-xs font-medium border-2 h-8 ${chipWidth} active:scale-95 ${
        isPressed ? 'bg-red-600 text-white border-red-600' : 
        isDefault
          ? 'bg-primary-100 text-primary-800 border-primary-400'
          : 'bg-white text-stone-600 border-stone-300 hover:border-primary-400'
      }`}
    >
      {name}
    </button>
  );
};

// ==================== AUTOCOMPLETE INPUT ====================
// Input z podpowiedziami i fuzzy matching

const AutocompleteInput = ({
  value,
  onChange,
  options,
  placeholder,
  onSelect,
  renderOption,
  getLabel = (x) => x.name || x,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const containerRef = useRef(null);

  // Sync z zewnętrzną wartością
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Zamknij dropdown przy kliknięciu poza komponentem
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtruj opcje z fuzzy matching
  const filteredOptions = filterOptions(inputValue, options, getLabel);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Autocorrect przy blur
    setTimeout(() => {
      const match = findBestMatch(inputValue, options, getLabel);
      if (match && getLabel(match).toLowerCase() !== inputValue.toLowerCase()) {
        const label = getLabel(match);
        setInputValue(label);
        onChange(label);
        onSelect && onSelect(match);
      }
    }, 200);
  };

  const handleSelect = (option) => {
    const label = getLabel(option);
    setInputValue(label);
    onChange(label);
    onSelect && onSelect(option);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="w-full pr-8 bg-white"
      />
      <button
        type="button"
        onClick={toggleDropdown}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400"
      >
        <Icon.ChevronDown size={18} />
      </button>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border-2 border-stone-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left hover:bg-primary-50 text-sm border-b border-stone-100 last:border-0"
            >
              {renderOption ? renderOption(option) : (
                <>
                  {getLabel(option)}
                  {option.aliases && option.aliases.length > 0 && (
                    <span className="text-stone-400 ml-1">({option.aliases[0]})</span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== CART ITEM ====================
// Pozycja w koszyku z edycjÄ…

const CartItem = ({ item, onUpdate, onRemove, onEdit }) => {
  const { db, globalDiscount } = useApp();
  const [showDiscounts, setShowDiscounts] = useState(false);

  const price = calculateItemPrice(item, db, globalDiscount);
  const packagingCost = calculatePackagingCost(item, db);
  const availableDiscounts = item.type === 'pizza' ? db.discounts.filter(d => d.active && d.perItem) : [];

  const itemName = item.isSplit && item.splitName ? `${item.name} / ${item.splitName}` : item.name;

  const getSubtitle = () => {
    if (item.type === 'pizza') {
      const sizeIdx = getSizeIndex(item.size, db.settings);
      const letter = getSizeLetter(sizeIdx, db.settings);

      if (item.isSplit) {
        return `${letter} ${item.pizzaNr}/${item.splitPizzaNr} • pół/pół`;
      }

      const pizza = db.pizzas.find(p => p.nr === item.pizzaNr);
      const defaultAddons = pizza?.defaultAddons || {};
      const currentAddons = item.addons || {};

      let changes = [];

      // Policz usunięte
      Object.entries(defaultAddons).forEach(([id, qty]) => {
        const curr = currentAddons[id] || 0;
        if (curr < qty) changes.push(`-${qty - curr}`);
      });

      // Policz dodane
      Object.entries(currentAddons).forEach(([id, qty]) => {
        const def = defaultAddons[id] || 0;
        if (qty > def) changes.push(`+${qty - def}`);
      });

      return `${letter} ${item.pizzaNr}${changes.length ? ` (${changes.join('')})` : ''}`;
    }
    return null;
  };

  const handleQuantityChange = (delta) => {
    const newQty = item.qty + delta;
    if (newQty < 1) {
      onRemove(item.id);
    } else {
      onUpdate({ ...item, qty: newQty });
    }
  };

  const handleDiscountSelect = (discount) => {
    onUpdate({ ...item, discount });
    setShowDiscounts(false);
  };

  const handleRemoveDiscount = () => {
    onUpdate({ ...item, discount: null });
  };

  return (
    <div className="bg-white rounded-xl p-3 border-2 border-stone-200">
      <div className="flex justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-stone-800 truncate">{itemName}</div>

          {getSubtitle() && <div className="text-xs text-stone-500 mt-0.5">{getSubtitle()}</div>}

          {item.notes && <div className="text-xs text-primary-600 mt-0.5 truncate">🍝" {item.notes}</div>}

          {item.discount && (
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
              🍝·ï¸ {item.discount.name}
              <button onClick={handleRemoveDiscount} className="font-bold">×</button>
            </span>
          )}
        </div>

        <div className="text-right shrink-0">
          <div className="font-bold text-primary-600">{formatPrice(price)}</div>
          {packagingCost > 0 && <div className="text-xs text-stone-400">+{formatPrice(packagingCost)}</div>}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center active:scale-95"
          >
            {item.qty > 1 ? <Icon.Minus size={16} /> : <Icon.Trash2 size={16} />}
          </button>
          <span className="font-bold w-8 text-center">{item.qty}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center active:scale-95"
          >
            <Icon.Plus size={16} />
          </button>
        </div>

        <div className="flex gap-2">
          {item.type === 'pizza' && !item.discount && availableDiscounts.length > 0 && (
            <button
              onClick={() => setShowDiscounts(!showDiscounts)}
              className="px-3 py-1.5 rounded-lg bg-violet-100 text-violet-700 text-sm font-semibold flex items-center gap-1 active:scale-95"
            >
              <Icon.Tag size={14} /> Rabat
            </button>
          )}
          <button
            onClick={() => onEdit(item)}
            className="px-3 py-1.5 rounded-lg bg-sky-100 text-sky-700 text-sm font-semibold flex items-center gap-1 active:scale-95"
          >
            <Icon.Edit2 size={14} /> Edytuj
          </button>
        </div>
      </div>

      {showDiscounts && (
        <div className="mt-3 pt-3 border-t border-stone-100">
          <div className="text-xs font-bold text-stone-500 mb-2">Wybierz rabat:</div>
          <div className="flex flex-wrap gap-2">
            {availableDiscounts.map(d => (
              <Chip key={d.id} onClick={() => handleDiscountSelect(d)} small>
                {d.name}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
