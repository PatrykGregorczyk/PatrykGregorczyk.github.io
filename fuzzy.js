// ==================== FUZZY MATCHING ====================
// Autocomplete z obsługą literówek (tolerancja 2 litery)

const fuzzyMatch = (input, target) => {
  if (!input || !target) return false;
  
  const a = input.toLowerCase().trim();
  const b = target.toLowerCase();
  
  // Dokładne dopasowanie lub zawieranie
  if (b.startsWith(a) || b.includes(a)) return true;
  
  // Za krótki input
  if (a.length < 2) return false;
  
  // Pierwsza litera musi się zgadzać
  if (a[0] !== b[0]) return false;
  
  // Policz różnice w środkowych literach
  const aMiddle = a.length > 2 ? a.slice(1, -1) : a.slice(1);
  const bMiddle = b.length > 2 ? b.slice(1, -1) : b.slice(1);
  
  let differences = 0;
  const minLength = Math.min(aMiddle.length, bMiddle.length);
  
  for (let i = 0; i < minLength; i++) {
    if (aMiddle[i] !== bMiddle[i]) differences++;
    if (differences > 2) return false;
  }
  
  return differences <= 2;
};

const findBestMatch = (input, options, getLabel = (x) => x.name || x) => {
  if (!input || input.length < 2) return null;
  
  const searchText = input.toLowerCase().trim();
  
  // 1. Dokładne dopasowanie
  for (const option of options) {
    const label = getLabel(option).toLowerCase();
    if (label === searchText || label.startsWith(searchText)) {
      return option;
    }
  }
  
  // 2. Fuzzy match na głównej nazwie
  for (const option of options) {
    if (fuzzyMatch(searchText, getLabel(option))) {
      return option;
    }
  }
  
  // 3. Sprawdź aliasy
  for (const option of options) {
    if (option.aliases) {
      for (const alias of option.aliases) {
        if (fuzzyMatch(searchText, alias)) {
          return option;
        }
      }
    }
  }
  
  return null;
};

const filterOptions = (input, options, getLabel = (x) => x.name || x) => {
  if (!input || input.trim() === '') {
    return options; // Pokaż wszystko gdy puste
  }
  
  const searchText = input.toLowerCase().trim();
  
  return options.filter(option => {
    const label = getLabel(option);
    
    // Dokładne zawieranie
    if (label.toLowerCase().includes(searchText)) return true;
    
    // Fuzzy match
    if (fuzzyMatch(searchText, label)) return true;
    
    // Sprawdź aliasy
    if (option.aliases) {
      return option.aliases.some(alias =>
        alias.toLowerCase().includes(searchText) ||
        fuzzyMatch(searchText, alias)
      );
    }
    
    return false;
  });
};
