import { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { FilterContext } from '../../Context/FilterContext'; // ⬅️ Your global context
import bgImage from '/src/assets/background-darkbg.png';
import bgImage2 from '/src/assets/background-lightbg.png';
import './all.css'


const limit = 30;
let latestSearchId = 0; // ⬅️ Add this outside the Home component


function All() {
  const [pokemons, setPokemons] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();


  // ⬅️ Get search & filters from context (provided by Navbar layout)
  const {
    searchTerm,
    typeFilter,
    generationFilter,
    isLegendary,
    isMythical,
  } = useContext(FilterContext);


  const isFiltering = !!(
    searchTerm ||
    typeFilter ||
    generationFilter ||
    isLegendary ||
    isMythical
  );


  // Fetch all Pokémon only once (for filtering)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1300&offset=0`);
        const result = await res.json();
        setAllPokemons(result.results);
        setTotalPages(Math.ceil(result.count / limit));
      } catch (err) {
        console.error("Failed to fetch all Pokémon:", err);
      }
    };


    fetchAll();
  }, []);


  // Load Pokémons based on current page or filters
  const loadPokemons = useCallback(async () => {
    setLoading(true);


    const currentSearchId = ++latestSearchId; // 🆕 Track current request ID


    try {
      if (!isFiltering) {
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


        if (currentSearchId !== latestSearchId) return; // 🛑 Abort stale result


        setPokemons(formatted);
        setTotalPages(Math.ceil(result.count / limit));
      } else {
        const filtered = allPokemons.filter(p => p.name.includes(searchTerm.toLowerCase()));


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


        if (currentSearchId !== latestSearchId) return; // 🛑 Abort stale result


        setPokemons(finalData);
        setPage(1);
        setTotalPages(1); // No pagination when filtering
      }
    } catch (err) {
      console.error("Error loading Pokémon:", err);
    }


    setLoading(false);
  }, [page, searchTerm, typeFilter, generationFilter, isLegendary, isMythical, isFiltering, allPokemons]);


  useEffect(() => {
    loadPokemons();
  }, [loadPokemons]);


  const handleCardClick = (id) => {
    navigate(`/pokemon/${id}`);
  };


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
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1 || loading}>⬅ Prev</button>
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
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages || loading}>Next ➡</button>
      </div>
    );
  };


  return (
    <div className="home-container">
      {loading ? (
        <p>Loading Pokémons...</p>
      ) : (
        <div className="Cards">
          {pokemons.map(pokemon => (
            <Card key={pokemon.id} pokemon={pokemon} onClick={() => handleCardClick(pokemon.id)} />
          ))}
        </div>
      )}
      {renderPagination()}
    </div>
  );
}


export default All;
