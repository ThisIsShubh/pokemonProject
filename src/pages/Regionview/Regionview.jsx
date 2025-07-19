
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import './region.css';
import regionDetails from '../../data/regionabout';
import { FilterContext } from '../../Context/FilterContext';

const limit = 30;


const LEGENDARY_ADDITIONS = {
  kanto: ['mewtwo', 'mew'],
  johto: ['raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'celebi'],
  hoenn: ['regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon', 'rayquaza', 'jirachi', 'deoxys'],
  sinnoh: ['dialga', 'palkia', 'giratina', 'heatran', 'regigigas', 'cresselia', 'darkrai', 'shaymin', 'arceus'],
  unova: ['reshiram', 'zekrom', 'kyurem', 'victini', 'tornadus', 'thundurus', 'landorus', 'keldeo', 'meloetta', 'genesect'],
  kalos: ['xerneas', 'yveltal', 'zygarde', 'diancie', 'hoopa', 'volcanion'],
  alola: ['solgaleo', 'lunala', 'necrozma', 'tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini', 'cosmog', 'cosmoem', 'magearna', 'marshadow', 'zeraora'],
  galar: ['zacian', 'zamazenta', 'eternatus', 'kubfu', 'urshifu', 'calyrex', 'glastrier', 'spectrier', 'zarude'],
  paldea: ['koraidon', 'miraidon', 'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu', 'terapagos']
};

function Regionview() {
  const { regionName } = useParams();
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [visiblePokemon, setVisiblePokemon] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useContext(FilterContext);

  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const start = (page - 1) * limit;
    const end = start + limit;
    setVisiblePokemon(allPokemonList.slice(start, end));
  }, [page, allPokemonList]);

  useEffect(() => {
    const fetchRegionPokemon = async () => {
      setLoading(true);
      try {
        
        const regionRes = await fetch(`https://pokeapi.co/api/v2/region/${regionName}`);
        if (!regionRes.ok) throw new Error(`Region ${regionName} not found`);
        const regionData = await regionRes.json();

        
        const pokedexUrl = regionData.pokedexes[0].url;
        const pokedexRes = await fetch(pokedexUrl);
        if (!pokedexRes.ok) throw new Error(`Pokedex not found for region ${regionName}`);
        const pokedexData = await pokedexRes.json();

        
        const speciesList = pokedexData.pokemon_entries.map(entry => entry.pokemon_species.name);
        const existingPokemon = await Promise.all(speciesList.map(fetchPokemonData));
        let finalList = existingPokemon.filter(Boolean);

        
        const regionKey = regionName.toLowerCase();
        if (LEGENDARY_ADDITIONS[regionKey]) {
          const legendaries = await Promise.all(
            LEGENDARY_ADDITIONS[regionKey].map(fetchPokemonData)
          );
          
          
          const existingIds = new Set(finalList.map(p => p.id));
          const newLegendaries = legendaries.filter(p => p && !existingIds.has(p.id));
          
          finalList = [...finalList, ...newLegendaries];
        }

        setAllPokemonList(finalList);
        setTotalPages(Math.ceil(finalList.length / limit));
        setPage(1);
      } catch (error) {
        console.error('Error fetching region Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPokemonData = async (speciesName) => {
      try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesName}`);
        const speciesData = await speciesRes.json();
        const defaultVariety = speciesData.varieties.find(v => v.is_default);
        if (!defaultVariety) return null;

        const pokemonRes = await fetch(defaultVariety.pokemon.url);
        const pokemonData = await pokemonRes.json();

        return {
          id: pokemonData.id,
          name: pokemonData.name,
          sprite: pokemonData.sprites.other['official-artwork'].front_default,
          types: pokemonData.types.map(t => t.type.name),
        };
      } catch (err) {
        console.warn(`Failed to fetch ${speciesName}`, err);
        return null;
      }
    };

    fetchRegionPokemon();
  }, [regionName]);

  useEffect(() => {
  const filtered = allPokemonList.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const start = (page - 1) * limit;
  const end = start + limit;

  const sliced = filtered.slice(start, end);

  setVisiblePokemon(sliced);
  setTotalPages(Math.ceil(filtered.length / limit));
}, [searchTerm, allPokemonList, page]);


  useEffect(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setVisiblePokemon(allPokemonList.slice(start, end));
  }, [page, allPokemonList]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

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
    <div className="region-page">
      <div className='tit-region'>
      <h2 className="region-title">{regionName.toUpperCase()} Region</h2>
      <div className="line"></div>
      </div>
      <p className='descr'>
  {regionDetails[regionName]?.description || "Description not available for this region."}
</p>

      {loading ? (
        <div className="poke-loading-container">
          <div className="pokeball-spinner">
            <div className="pokeball-top"></div>
            <div className="pokeball-bottom"></div>
            <div className="pokeball-center"></div>
            <div className="pokeball-button"></div>
          </div>
          <p className="loading-text">Loading Pokémon...</p>
        </div>
      ) : (
        <>
          <div className="card-grid">
            {visiblePokemon.map(pokemon => (
              <Card key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
}

export default Regionview;
