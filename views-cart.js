// ==================== CART VIEW - FORMULARZ ZAMÃÆÃ¢â¬ÅWIENIA ====================

const CartView = ({ onClose, onOrder, initialData = null }) => {
  const { db, cart } = useApp();

  const [selectedCity, setSelectedCity] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState(
    initialData
      ? {
          isTakeout: initialData.isTakeout || false,
          orderNumber: String(initialData.orderNumber || ''),
          city: initialData.city || '',
          street: initialData.street || '',
          streetDisplay: initialData.streetDisplay || initialData.street || '',
          number: initialData.number || '',
          phone: initialData.phone || '',
          doorCode: initialData.doorCode || '',
          deliveryTime: initialData.deliveryTime || '30',
          paymentType: initialData.paymentType || 'cash',
          isScheduled: initialData.isScheduled || false,
          scheduledTime: initialData.scheduledTime || '',
          scheduledDate: initialData.scheduledDate || ''
        }
      : {
          isTakeout: false,
          orderNumber: '',
          city: '',
          street: '',
          streetDisplay: '',
          number: '',
          phone: '',
          doorCode: '',
          deliveryTime: '30',
          paymentType: 'cash',
          isScheduled: false,
          scheduledTime: '',
          scheduledDate: ''
        }
  );

  const isEditMode = !!initialData;
  const activeCart = isEditMode 
    ? initialData.items.filter(i => i.qty > 0) 
    : cart.filter(i => i.qty > 0);

  const cityStreets = selectedCity
    ? db.locations.streets.filter(s => s.cityId === selectedCity.id)
    : [];

  // Inicjalizacja miasta
  useEffect(() => {
    if (form.city) {
      const found = db.locations.cities.find(c => c.name === form.city);
      if (found) setSelectedCity(found);
    }
  }, []);

  // WALIDACJA FORMULARZA - zwraca ostrzeÅ¼enia ale nie blokuje
  const validateOrder = () => {
    if (activeCart.length === 0) {
      return 'Koszyk jest pusty';
    }

    // OstrzeÅ¼enia dla dowozu (nie blokujÄ)
    const warnings = [];
    if (!form.isTakeout) {
      if (!form.city.trim()) warnings.push('Brak miasta');
      if (!form.street.trim()) warnings.push('Brak ulicy');
      if (!form.number.trim()) warnings.push('Brak numeru domu');
      if (!form.phone.trim()) {
        warnings.push('Brak telefonu');
      } else {
        const phoneDigits = form.phone.replace(/\D/g, '');
        if (phoneDigits.length < 9) {
          warnings.push('Telefon niepeÅny');
        }
      }
    }

    if (form.isScheduled) {
      if (!form.scheduledTime) warnings.push('Brak godziny dostawy');
      if (!form.scheduledDate) warnings.push('Brak daty dostawy');
    }

    if (warnings.length > 0) {
      return 'â ï¸ ' + warnings.join(', ');
    }

    return null;
  };

  const submit = () => {
    const validationError = validateOrder();
    
    // Blokuj tylko pusty koszyk
    if (activeCart.length === 0) {
      setError('Koszyk jest pusty');
      return;
    }
    
    // Dla ostrzeÅ¼eÅ - ustaw bÅÄd ale pozwÃ³l kontynuowaÄ
    if (validationError) {
      setError(validationError);
    } else {
      setError('');
    }

    const address = `${form.streetDisplay || form.street} ${form.number}`.trim();
    const orderData = {
      id: initialData?.id || Date.now(),
      orderNumber: form.orderNumber || Math.floor(Math.random() * 900) + 100,
      timestamp: initialData?.timestamp || new Date().toISOString(),
      items: activeCart,
      ...form,
      address
    };
    
    onOrder(orderData);
  };

  const handleCitySelect = (city) => {
    const found = db.locations.cities.find(
      c => c.name === city || c.id === city?.id
    );
    setSelectedCity(found);
    setForm(f => ({ ...f, city: found?.name || '' }));
  };

  const handleStreetSelect = (street) => {
    setForm(f => ({ ...f, street: street.name, streetDisplay: street.name }));
  };

  const selectLandmark = (lm) => {
    const city = db.locations.cities.find(c => c.id === lm.cityId);
    const street = db.locations.streets.find(s => s.id === lm.streetId);
    setSelectedCity(city);
    setForm(f => ({
      ...f,
      city: city?.name || '',
      street: street?.name || '',
      streetDisplay: street?.name || '',
      number: lm.number
    }));
  };

  const addDoorCodeChar = (char) => {
    setForm(f => ({ ...f, doorCode: f.doorCode + char }));
  };

  return (
    <div className="h-full flex flex-col bg-stone-100">
      {/* Header z przyciskiem powrotu */}
      <div className="flex items-center justify-between p-2 bg-white border-b shrink-0 shadow-soft">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
        >
          <Icon.ChevronLeft />
        </button>
        <h2 className="font-bold text-base truncate px-2">
          {isEditMode ? `Edycja #${initialData.orderNumber}` : 'Nowe zamówienie'}
        </h2>
        <div className="w-9" />
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="bg-white rounded-xl p-3 border-2 border-stone-200 space-y-3">
          {/* DowÃÂ³z / Wynos */}
          <div className="flex gap-2">
            <button
              onClick={() => { setForm(f => ({ ...f, isTakeout: false })); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 border-2 font-semibold ${
                !form.isTakeout
                  ? 'bg-sky-50 border-sky-400 text-sky-700'
                  : 'border-stone-200'
              }`}
            >
              <Icon.MapPin size={16} /> DowÃÂ³z
            </button>
            <button
              onClick={() => { setForm(f => ({ ...f, isTakeout: true })); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 border-2 font-semibold ${
                form.isTakeout
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                  : 'border-stone-200'
              }`}
            >
              <Icon.Package size={16} /> Wynos
            </button>
          </div>

          {/* Adres (tylko dla dowozu) */}
          {!form.isTakeout && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nr"
                  value={form.orderNumber}
                  onChange={e => setForm(f => ({ ...f, orderNumber: e.target.value }))}
                  className="w-14 rounded-lg bg-primary-50 border-2 border-primary-300 font-bold text-center"
                />
                <div className="flex-1">
                  <AutocompleteInput
                    value={form.city}
                    onChange={v => setForm(f => ({ ...f, city: v }))}
                    options={db.locations.cities}
                    placeholder="MiejscowoÃâºÃâ¡*"
                    onSelect={handleCitySelect}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <AutocompleteInput
                    value={form.street}
                    onChange={v => setForm(f => ({ ...f, street: v, streetDisplay: v }))}
                    options={cityStreets}
                    placeholder="Ulica*"
                    onSelect={handleStreetSelect}
                    renderOption={s => (
                      <span>
                        {s.name}
                        {s.aliases?.length > 0 && (
                          <span className="text-stone-400"> ({s.aliases[0]})</span>
                        )}
                        {s.maxNumber && (
                          <span className="text-stone-400 ml-1">do {s.maxNumber}</span>
                        )}
                      </span>
                    )}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Nr*"
                  value={form.number}
                  onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
                  className="w-20"
                />
              </div>

              <input
                type="tel"
                placeholder="Telefon* (min. 9 cyfr)"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full"
              />

              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Kod drzwi"
                  value={form.doorCode}
                  onChange={e => setForm(f => ({ ...f, doorCode: e.target.value }))}
                  className="flex-1"
                />
                <button
                  onClick={() => addDoorCodeChar('*')}
                  className="w-10 h-10 rounded-lg bg-stone-100 font-bold text-lg active:scale-95"
                >
                  *
                </button>
                <button
                  onClick={() => addDoorCodeChar('#')}
                  className="w-10 h-10 rounded-lg bg-stone-100 font-bold text-lg active:scale-95"
                >
                  #
                </button>
                <button
                  onClick={() => addDoorCodeChar('ÃâÃÂ§')}
                  className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center active:scale-95"
                >
                  <Icon.Key size={18} />
                </button>
              </div>

              {/* Landmarki */}
              {db.locations.landmarks.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-100">
                  <span className="text-xs text-stone-400 w-full mb-1">Szybki wybÃÂ³r:</span>
                  {db.locations.landmarks.map(lm => (
                    <button
                      key={lm.id}
                      onClick={() => selectLandmark(lm)}
                      className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 active:scale-95"
                    >
                      Ã°Å¸ÂÂÃ¢â¬ÅÃÂ {lm.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Czas */}
          <div>
            <div className="text-xs font-bold text-stone-500 mb-2">Czas</div>
            <div className="flex gap-2 flex-wrap">
              {db.settings.deliveryTimes.map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, deliveryTime: t, isScheduled: false }))}
                  className={`px-3 py-2 rounded-lg font-semibold ${
                    form.deliveryTime === t && !form.isScheduled
                      ? 'bg-primary-500 text-white'
                      : 'bg-stone-100'
                  }`}
                >
                  {t}m
                </button>
              ))}
            </div>
          </div>

          {/* Na termin */}
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer ${
              form.isScheduled ? 'bg-primary-50 border-primary-300' : 'border-stone-200'
            }`}
          >
            <input
              type="checkbox"
              checked={form.isScheduled}
              onChange={e => setForm(f => ({ ...f, isScheduled: e.target.checked }))}
              className="w-5 h-5"
            />
            <span className="font-semibold">Ã°Å¸Ââ¢ÃÂ Na termin</span>
            {form.isScheduled && (
              <>
                <input
                  type="time"
                  value={form.scheduledTime}
                  onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))}
                  className="ml-auto rounded text-sm"
                />
                <input
                  type="date"
                  value={form.scheduledDate}
                  onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
                  className="rounded text-sm"
                />
              </>
            )}
          </label>

          {/* PÃâatnoÃâºÃâ¡ */}
          <div>
            <div className="text-xs font-bold text-stone-500 mb-2">PÃâatnoÃâºÃâ¡</div>
            <div className="flex gap-2">
              {db.settings.paymentTypes.map(p => (
                <button
                  key={p.id}
                  onClick={() => setForm(f => ({ ...f, paymentType: p.id }))}
                  className={`flex-1 py-2.5 rounded-lg font-semibold ${
                    form.paymentType === p.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-stone-100'
                  }`}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Footer z przyciskami */}
      <div className="p-2 bg-white border-t shrink-0 shadow-strong space-y-2">
        {error && (
          <div className={`border-2 px-4 py-3 rounded-lg text-sm font-semibold ${
            error.startsWith('⚠️')
              ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            ⚠️ {error}
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Anuluj
          </Button>
          <Button variant="primary" className="flex-1" onClick={submit}>
            {isEditMode ? 'Zapisz' : 'Potwierdź'}
          </Button>
        </div>
      </div>
    </div>
  );
};
