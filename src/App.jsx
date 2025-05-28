import { useEffect, useState, useCallback } from 'react';
import './App.css';
import './index.css';
import Card from './components/Card';
import logo from '/src/assets/International_Pokémon_logo.svg.png';
import bgImage from '/src/assets/background-darkbg.png';
import bgImage2 from '/src/assets/background-lightbg.png';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 30;

  const [typeFilter, setTypeFilter] = useState('');
  const [generationFilter, setGenerationFilter] = useState('');
  const [isLegendary, setIsLegendary] = useState(false);
  const [isMythical, setIsMythical] = useState(false);

  const [types, setTypes] = useState([]);
  const [generations, setGenerations] = useState([]);

  const isFiltering = !!(searchTerm || typeFilter || generationFilter || isLegendary || isMythical);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1300&offset=0`);
        const result = await res.json();
        setAllPokemons(result.results);
        setTotalPages(Math.ceil(result.count / limit));
      } catch (err) {
        console.error("Failed to fetch all Pokémon list:", err);
      }
    };

    fetchAll();
  }, []);

  const loadPokemons = useCallback(async () => {
    setLoading(true);

    try {
      if (!isFiltering) {
        // Normal pagination mode
        const offset = (page - 1) * limit;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const result = await res.json();

        const responses = await Promise.all(result.results.map(p => fetch(p.url)));
        const data = await Promise.all(responses.map(res => res.json()));

        const formatted = data.map(pokemon => ({
          id: pokemon.id,
          name: pokemon.name,
          sprite: pokemon.sprites.front_default,
          types: pokemon.types.map(t => t.type.name),
        }));

        setPokemons(formatted);
        setTotalPages(Math.ceil(result.count / limit));
      } else {
        // Filtered mode
        const filtered = allPokemons.filter(p => p.name.includes(searchTerm));

        const responses = await Promise.all(filtered.map(p => fetch(p.url)));
        const data = await Promise.all(responses.map(res => res.json()));

        const filteredData = await Promise.all(data.map(async (pokemon) => {
          const species = await fetch(pokemon.species.url).then(r => r.json());

          const matchType = typeFilter ? pokemon.types.some(t => t.type.name === typeFilter) : true;
          const matchGen = generationFilter ? species.generation.name === generationFilter : true;
          const matchLegend = isLegendary ? species.is_legendary : true;
          const matchMyth = isMythical ? species.is_mythical : true;

          return (matchType && matchGen && matchLegend && matchMyth) ? {
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.front_default,
            types: pokemon.types.map(t => t.type.name),
          } : null;
        }));

        const finalData = filteredData.filter(p => p !== null);
        setPokemons(finalData);
        setPage(1); // Reset to first page on filter change
        setTotalPages(1); // Disable pagination
      }
    } catch (err) {
      console.error("Error fetching Pokémon:", err);
    }

    setLoading(false);
  }, [page, isFiltering, searchTerm, typeFilter, generationFilter, isLegendary, isMythical, allPokemons]);

  useEffect(() => {
    loadPokemons();
  }, [loadPokemons]);

  useEffect(() => {
    const fetchFilters = async () => {
      const [typeRes, genRes] = await Promise.all([
        fetch("https://pokeapi.co/api/v2/type").then(res => res.json()),
        fetch("https://pokeapi.co/api/v2/generation").then(res => res.json()),
      ]);

      setTypes(typeRes.results);
      setGenerations(genRes.results);
    };

    fetchFilters();
  }, []);

  const renderPagination = () => {
    if (totalPages <= 1 || isFiltering) return null;

    const pages = [];

    pages.push(1);
    if (page > 4) pages.push('...');

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 3) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return (
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1 || loading}>
          ⬅ Prev
        </button>
        {pages.map((pg, idx) =>
          pg === '...' ? (
            <span key={`ellipsis-${idx}`} className="ellipsis">...</span>
          ) : (
            <button
              key={pg}
              onClick={() => setPage(pg)}
              disabled={loading}
              className={page === pg ? 'active' : ''}
            >
              {pg}
            </button>
          )
        )}
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages || loading}>
          Next ➡
        </button>
      </div>
    );
  };

  return (
    <div className='page'>
      <img className='Image2' src={bgImage2} alt="" />
      <img className='Image3' src={bgImage2} alt="" />
      <div className='logoimgcontainer'>
        <img className='logoimg' src={logo} alt="Pokemon" />
        <img className='bgImage' src={bgImage} alt="" />
        <h1>What Pokémon are you looking for?</h1>
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="searchbar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />

        <div className="filters">
          <select onChange={(e) => setTypeFilter(e.target.value)} value={typeFilter}>
            <option value="">All Types</option>
            {types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>

          <select onChange={(e) => setGenerationFilter(e.target.value)} value={generationFilter}>
            <option value="">All Generations</option>
            {generations.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
          </select>

          <label title={isMythical ? "Can't be both Legendary and Mythical!" : ""}>
  <input
    type="checkbox"
    checked={isLegendary}
    onChange={() => setIsLegendary(p => !p)}
    disabled={isMythical}
  />
  Legendary
</label>

<label title={isLegendary ? "You must be trying to catch Arceus with that combo — not gonna happen." : ""}>
  <input
    type="checkbox"
    checked={isMythical}
    onChange={() => setIsMythical(p => !p)}
    disabled={isLegendary}
  />
  Mythical
</label>

        </div>

      </div>



      <div className="spacer"></div>

      {loading ? (
        <p>Loading Pokémons...</p>
      ) : (
        <div className='Cards'>
          {pokemons.map(pokemon => (
            <Card key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}

      {renderPagination()}
    </div>
  );
}

export default App;
