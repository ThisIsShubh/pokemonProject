import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import './type.css';

const limit = 30;

function Typeview() {
  const { typeName } = useParams(); 
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [visiblePokemon, setVisiblePokemon] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const start = (page - 1) * limit;
    const end = start + limit;
    setVisiblePokemon(allPokemonList.slice(start, end));
  }, [page, allPokemonList]);

  
  useEffect(() => {
    const fetchTypePokemon = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        if (!res.ok) throw new Error(`Type ${typeName} not found`);
        const data = await res.json();

        const promises = data.pokemon.map(async ({ pokemon }) => {
          try {
            const pokeRes = await fetch(pokemon.url);
            const pokeData = await pokeRes.json();
            return {
              id: pokeData.id,
              name: pokeData.name,
              sprite: pokeData.sprites.other['official-artwork'].front_default,
              types: pokeData.types.map(t => t.type.name),
            };
          } catch (err) {
            console.warn(`Failed to fetch ${pokemon.name}`, err);
            return null;
          }
        });

        const results = await Promise.all(promises);
        const finalList = results.filter(Boolean).sort((a, b) => a.id - b.id);

        setAllPokemonList(finalList);
        setTotalPages(Math.ceil(finalList.length / limit));
        setPage(1); // Reset to first page on type change
      } catch (error) {
        console.error('Error fetching Pokémon by type:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTypePokemon();
  }, [typeName]);

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
        <h2 className="region-title">{typeName.toUpperCase()} Type</h2>
        <div className="line"></div>
      </div>
      <p className='descr'>Showing Pokémon of type <strong>{typeName}</strong>.</p>

      {loading ? (
        <p>Loading Pokémon...</p>
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

export default Typeview;
