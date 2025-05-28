import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card.jsx';
import { pokemonGroups } from '../../data/pokemonGroups.js';
import './groupview.css'

const limit = 30;

function GroupView() {
  const { groupName } = useParams();
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [visiblePokemon, setVisiblePokemon] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const group = pokemonGroups.find(group => group.key === groupName);

const name = group?.label ?? 'Unknown Group';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const start = (page - 1) * limit;
    const end = start + limit;
    setVisiblePokemon(allPokemonList.slice(start, end));
  }, [page, allPokemonList]);

  useEffect(() => {
    const fetchGroupPokemon = async () => {
      setLoading(true);
      try {
        let speciesList = [];

        if (groupName === 'starters') {
          speciesList = [
            'bulbasaur', 'charmander', 'squirtle',
            'chikorita', 'cyndaquil', 'totodile',
            'treecko', 'torchic', 'mudkip',
            'turtwig', 'chimchar', 'piplup',
            'snivy', 'tepig', 'oshawott',
            'chespin', 'fennekin', 'froakie',
            'rowlet', 'litten', 'popplio',
            'grookey', 'scorbunny', 'sobble',
            'sprigatito', 'fuecoco', 'quaxly'
          ];
        } else if (groupName === 'legendaries') {
          const res = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=10000');
          const data = await res.json();
          const speciesPromises = data.results.map(async (species) => {
            const speciesRes = await fetch(species.url);
            const speciesData = await speciesRes.json();
            return speciesData.is_legendary ? speciesData.name : null;
          });
          const speciesResults = await Promise.all(speciesPromises);
          speciesList = speciesResults.filter(Boolean);
        } else if (groupName === 'mythicals') {
          const res = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=10000');
          const data = await res.json();
          const speciesPromises = data.results.map(async (species) => {
            const speciesRes = await fetch(species.url);
            const speciesData = await speciesRes.json();
            return speciesData.is_mythical ? speciesData.name : null;
          });
          const speciesResults = await Promise.all(speciesPromises);
          speciesList = speciesResults.filter(Boolean);
        } else if (groupName === 'mega') {
          const res = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=10000');
          const data = await res.json();
          const speciesURLs = data.results.map(species => species.url);

          const megaForms = await Promise.all(
            speciesURLs.map(async url => {
              try {
                const speciesRes = await fetch(url);
                const speciesData = await speciesRes.json();

                const megaVarieties = speciesData.varieties.filter(
                  v => !v.is_default && v.pokemon.name.includes('mega')
                );

                return megaVarieties.map(v => ({
                  name: v.pokemon.name,
                  url: v.pokemon.url
                }));
              } catch {
                return [];
              }
            })
          );

          
          speciesList = megaForms.flat().filter(Boolean);
        } else if (groupName === 'ultrabeasts') {
  try {
    const res = await fetch('https://pokeapi.co/api/v2/ability/beast-boost');
    const data = await res.json();

    speciesList = data.pokemon.map(p => p.pokemon.name);
  } catch (err) {
    console.error('Error fetching Ultra Beasts by ability:', err);
    speciesList = [];
  }
} else if (groupName === 'baby') {
          const res = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=10000');
          const data = await res.json();
          const speciesPromises = data.results.map(async (species) => {
            const speciesRes = await fetch(species.url);
            const speciesData = await speciesRes.json();
            return speciesData.is_baby ? speciesData.name : null;
          });
          const speciesResults = await Promise.all(speciesPromises);
          speciesList = speciesResults.filter(Boolean);
        }

        const promises = speciesList.map(async (entry) => {
          try {
            let pokemonUrl = '';
            let name = '';

            if (typeof entry === 'string') {
              
              const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${entry}`);
              const speciesData = await speciesRes.json();
              const defaultVariety = speciesData.varieties.find(v => v.is_default);

              if (!defaultVariety) return null;
              pokemonUrl = defaultVariety.pokemon.url;
              name = defaultVariety.pokemon.name;
            } else {
             
              pokemonUrl = entry.url;
              name = entry.name;
            }

            const pokemonRes = await fetch(pokemonUrl);
            const pokemonData = await pokemonRes.json();

            return {
              id: pokemonData.id,
              name: pokemonData.name,
              sprite: pokemonData.sprites.other['official-artwork'].front_default,
              types: pokemonData.types.map(t => t.type.name),
            };
          } catch (err) {
            console.warn(`Failed to fetch ${entry?.name || entry}`, err);
            return null;
          }
        });

        const results = await Promise.all(promises);
        const finalList = results.filter(Boolean);

        setAllPokemonList(finalList);
        setTotalPages(Math.ceil(finalList.length / limit));
        setPage(1);
      } catch (error) {
        console.error('Error fetching group Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupPokemon();
  }, [groupName]);

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
    <div className="group-page">
      <div className='tit-group'>
        <h2 className="group-title">{name}</h2>
        <div className="line"></div>
      </div>
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

export default GroupView;
