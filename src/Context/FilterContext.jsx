import { createContext, useState } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [generationFilter, setGenerationFilter] = useState('');
  const [isLegendary, setIsLegendary] = useState(false);
  const [isMythical, setIsMythical] = useState(false);

  return (
    <FilterContext.Provider value={{
      searchTerm, setSearchTerm,
      typeFilter, setTypeFilter,
      generationFilter, setGenerationFilter,
      isLegendary, setIsLegendary,
      isMythical, setIsMythical
    }}>
      {children}
    </FilterContext.Provider>
  );
};
