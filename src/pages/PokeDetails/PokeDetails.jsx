import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './pokedetails.css';

const typeGradientColors = {
  fire: ['#FFD1B2', '#FFB347'],
  water: ['#B3E5FC', '#81D4FA'],
  grass: ['#A4D541', '#A5D6A7'],
  electric: ['#FFF9C4', '#FFF59D'],
  bug: ['#DCE775', '#D4E157'],
  normal: ['#F5F5F5', '#E0E0E0'],
  poison: ['#E1BEE7', '#CE93D8'],
  ground: ['#D7CCC8', '#BCAAA4'],
  fairy: ['#F8BBD0', '#F48FB1'],
  fighting: ['#FFCDD2', '#EF9A9A'],
  psychic: ['#F8BBD0', '#F48FB1'],
  rock: ['#D7CCC8', '#BCAAA4'],
  ghost: ['#CFD8DC', '#B0BEC5'],
  ice: ['#B3E5FC', '#81D4FA'],
  dragon: ['#B3E5FC', '#81D4FA'],
  dark: ['#CFD8DC', '#B0BEC5'],
  steel: ['#CFD8DC', '#B0BEC5'],
  flying: ['#E1BEE7', '#CE93D8'],
  default: ['#F5F5F5', '#E0E0E0']
};

var type1 = '';
var type2 = '';

function PokeDetails() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [movesDetails, setMovesDetails] = useState([]);
  const [abilitiesDetails, setAbilitiesDetails] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handlePokemonClick = (name) => {
    navigate(`/pokemon/${name}`);
  };

  const getBackground = () => {
    if (!pokemon || !pokemon.types) return {};

    type1 = pokemon.types[0].type.name;
    type2 = pokemon.types[1]?.type.name || type1;

    const color1 = typeGradientColors[type1] ? typeGradientColors[type1][0] : typeGradientColors.default[0];
    const color2 = typeGradientColors[type2] ? typeGradientColors[type2][1] : typeGradientColors.default[1];

    return { background: `linear-gradient(135deg, ${color1}, ${color2})` };
  };


  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!pokemonRes.ok) throw new Error("Failed to fetch Pokémon data");
        const pokemonData = await pokemonRes.json();

        
        const speciesUrl = pokemonData.species.url;

        
        const speciesRes = await fetch(speciesUrl);
        if (!speciesRes.ok) throw new Error("Failed to fetch species data");
        const speciesData = await speciesRes.json();

        
        const [evolutionData, movesData, abilitiesData, typeData] = await Promise.all([
          speciesData.evolution_chain?.url ? fetch(speciesData.evolution_chain.url).then(res => res.json()) : Promise.resolve(null),
          Promise.all(pokemonData.moves.map(m => fetch(m.move.url).then(res => res.json()))),
          Promise.all(pokemonData.abilities.map(a => fetch(a.ability.url).then(res => res.json()))),
          Promise.all(pokemonData.types.map(t => fetch(t.type.url).then(res => res.json()))),
        ]);

        setPokemon(pokemonData);
        setSpecies(speciesData);
        setEvolutionChain(evolutionData);
        setMovesDetails(movesData);
        setAbilitiesDetails(abilitiesData);
        setTypeData(typeData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [name]);

  const renderEvolutionChain = (chain) => {
    if (!chain) return null;

   
    const isMega = pokemon.name.includes('-mega');

    return (
      <div className="evolution-chain">
        {!isMega && chain && (
          <>
            <div className="evolution-stage" onClick={() => handlePokemonClick(chain.species.name)}>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chain.species.url.split('/')[6]}.png`}
                alt={chain.species.name} />
              <p>{chain.species.name}</p>
            </div>
            {chain.evolves_to.map((evolve, idx) => (
              <React.Fragment key={idx}>
                <div className="evolution-arrow">→</div>
                {renderEvolutionChain(evolve)}
              </React.Fragment>
            ))}
          </>
        )}
        {isMega && (
          <div className="mega-notice">
            <p>Mega Evolution - Temporary transformation in battle</p>
            <div className="mega-base-form">
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.id}.png`}
                alt={species.name}
                onClick={() => handlePokemonClick(species.name)} />
              <p>Base Form: {species.name}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getFormIndicators = () => [
    '-mega', '-gmax', '-alola', '-galar', '-hisui', '-totem', '-primal'
  ];

  const getSpecialForms = () => {
    if (!species) return [];
    return species.varieties
      .filter(v => {
        const formName = v.pokemon.name;
        return getFormIndicators().some(indicator =>
          formName.includes(indicator) && !v.is_default
        );
      })
      .map(v => v.pokemon);
  };

  const getAllForms = () => {
    if (!species) return [];
    return species.varieties
      .filter(v => !v.is_default)
      .map(v => v.pokemon);
  };

  const renderAllForms = () => {
    const forms = getAllForms();
    if (forms.length === 0) return null;

    
    const formCategories = {
      mega: [],
      regional: [],
      battle: [],
      gigantamax: [],
      terastal: [],
      other: []
    };

    forms.forEach(form => {
      const formName = form.name;
      if (formName.includes('-mega')) formCategories.mega.push(form);
      else if (formName.includes('-gmax')) formCategories.gigantamax.push(form);
      else if (formName.match(/-alola|-galar|-hisui/)) formCategories.regional.push(form);
      else if (formName.includes('-terastal')) formCategories.terastal.push(form);
      else if (formName.includes('-totem')) formCategories.other.push(form);
      else formCategories.battle.push(form);
    });

    return (
      <div className="detail-card forms-section">
        <h2>Alternate Forms</h2>
        <div className="frms">
        {formCategories.mega.length > 0 && (
          <FormCategory
            title="Mega Evolutions"
            forms={formCategories.mega}
            formatter={name => name.replace('-mega', ' Mega')}
          />
        )}

        {formCategories.regional.length > 0 && (
          <FormCategory
            title="Regional Forms"
            forms={formCategories.regional}
            formatter={name => name.replace(/(alola|galar|hisui)/, m => ` ${m.charAt(0).toUpperCase() + m.slice(1)}`)}
          />
        )}

        {formCategories.gigantamax.length > 0 && (
          <FormCategory
            title="Gigantamax Forms"
            forms={formCategories.gigantamax}
            formatter={name => name.replace('-gmax', ' Gigantamax')}
          />
        )}

        {formCategories.terastal.length > 0 && (
          <FormCategory
            title="Terastal Forms"
            forms={formCategories.terastal}
            formatter={name => name.replace('-terastal', ' Terastal')}
          />
        )}

        {formCategories.battle.length > 0 && (
          <FormCategory
            title="Battle Forms"
            forms={formCategories.battle}
            formatter={name => {
              const formName = name.split('-').pop();
              return `${formName.charAt(0).toUpperCase() + formName.slice(1)} Form`;
            }}
          />
        )}

        {formCategories.other.length > 0 && (
          <FormCategory
            title="Other Forms"
            forms={formCategories.other}
            formatter={name => name.replace(/-/g, ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase())}
          />
        )}
        </div>
      </div>
    );
  };

  
  const FormCategory = ({ title, forms, formatter }) => (
    <div className="form-category">
      <h3>{title}</h3>
      <div className="forms-grid">
        {forms.map(form => (
          <FormCard
            key={form.name}
            form={form}
            formatter={formatter}
          />
        ))}
      </div>
    </div>
  );

  const FormCard = ({ form, formatter }) => {
    const [formDetails, setFormDetails] = useState(null);

    useEffect(() => {
      const fetchFormDetails = async () => {
        const res = await fetch(form.url);
        const data = await res.json();
        setFormDetails(data);
      };
      fetchFormDetails();
    }, [form.url]);

    return (
      <div
        className="form-card"
        onClick={() => handlePokemonClick(form.name)}
      >
        {formDetails && (
          <>
            <img
              src={formDetails.sprites.other['official-artwork']?.front_default ||
                formDetails.sprites.front_default}
              alt={form.name}
            />
            <p>{formatter(form.name)}</p>
          </>
        )}
      </div>
    );
  };


  const renderMegaEvolutions = () => {
    const megaEvolutions = getMegaEvolutions();
    if (megaEvolutions.length === 0) return null;

    return (
      <div className="detail-card mega-evolution-section">
        <h2>Mega Evolutions</h2>
        <div className="mega-evolution-grid">
          {megaEvolutions.map(mega => (
            <div
              key={mega.name}
              className="mega-evolution-card"
              onClick={() => handlePokemonClick(mega.name)}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mega.url.split('/')[6]}.png`}
                alt={mega.name}
              />
              <p>{mega.name.replace(/-mega/gi, ' Mega').replace(/-/g, ' ')}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };



  const getMegaEvolutions = () => {
    if (!species) return [];
    return species.varieties
      .filter(v => v.pokemon.name.includes('-mega') && !v.is_default)
      .map(v => v.pokemon);
  };


  const calculateTypeEffectiveness = () => {
    const attackTypes = new Set();

    
    typeData.forEach(type => {
      Object.values(type.damage_relations).flat().forEach(entry => {
        attackTypes.add(entry.name);
      });
    });

    const multipliers = {};

    
    attackTypes.forEach(attackType => {
      let multiplier = 1;

      typeData.forEach(defType => {
        const relations = defType.damage_relations;

        if (relations.double_damage_from.some(t => t.name === attackType)) {
          multiplier *= 2;
        } else if (relations.half_damage_from.some(t => t.name === attackType)) {
          multiplier *= 0.5;
        } else if (relations.no_damage_from.some(t => t.name === attackType)) {
          multiplier *= 0;
        }
      });

      multipliers[attackType] = multiplier;
    });

    return multipliers;
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!pokemon || !species) return null;

  const typeEffectiveness = calculateTypeEffectiveness();
  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const flavorTextEntry = species.flavor_text_entries.find(entry => entry.language.name === 'en');
  const genusEntry = species.genera.find(g => g.language.name === 'en');

  return (
    <div className="pokemon-details-container" >
      <div className="main-info-card" style={getBackground()}>
        <div className="header-section">
          <h1 className="pokemon-name">
            {capitalizedName}
            {name.includes('-mega') && <span className="form-badge">MEGA</span>}
          </h1>
          <div className="type-pills">
            {pokemon.types.map((t, idx) => (
              <span key={idx} className={`type-pill type-${t.type.name}`} >
                {t.type.name}
              </span>
            ))}
          </div>
          <p className="pokemon-genus">{genusEntry?.genus}</p>
        </div>

        <div className="image-section">
          <img
            className="main-artwork"
            src={pokemon.sprites.other['official-artwork'].front_default}
            alt={pokemon.name}
          />
          <div className="sprite-gallery">
            {/* Male/Default Sprites */}
            <div className="sprite-row">
              {Object.entries(pokemon.sprites).map(([key, value]) =>
                value && typeof value === 'string' && !key.includes('female') && (
                  <img key={key} src={value} alt={`${key} sprite`} className="sprite-thumbnail" />
                )
              )}
            </div>

            {/* Female Sprites (if any) */}
            {Object.values(pokemon.sprites).some(v => typeof v === 'string' && v.includes('female')) && (
              <div className="sprite-row">
                <h4 className="gender-label">Female Variants</h4>
                {Object.entries(pokemon.sprites).map(([key, value]) =>
                  value && typeof value === 'string' && key.includes('female') && (
                    <img key={key} src={value} alt={`${key} sprite`} className="sprite-thumbnail" />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flavorstat">
        <p>{flavorTextEntry.flavor_text.replace(/\f/g, ' ')}</p>

        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-label">Height</span>
            <span className="stat-value">{(pokemon.height / 10).toFixed(1)} m</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Weight</span>
            <span className="stat-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Base XP</span>
            <span className="stat-value">{pokemon.base_experience}</span>
          </div>
        </div>
      </div>

      {/* Evolution Chain */}
      <div className="detail-card evolution-section">
        <div className="titdabba">
        <h2>Evolution Chain</h2>
        <div className="line"></div>
        </div>
        {renderEvolutionChain(evolutionChain?.chain)}
        {renderAllForms()}
      </div>

      {/* Stats Section */}
      <div className="detail-card stats-section">
        <div className="titdabba">
        <h2>Base Stats</h2>
        <div className="line"></div>
        </div>
        <div className="stat-items">
          {pokemon.stats.map(stat => (
            <div key={stat.stat.name} className="stat-row">
              <div className="stat-info">
                <span className="stat-name">{stat.stat.name.replace('-', ' ').toUpperCase()}</span>
                <span className="stat-value">{stat.base_stat}</span>
              </div>
              <div className="stat-bar-container">
                <div
                  className="stat-bar"
                  style={{
                    width: `${(stat.base_stat / 255) * 100}%`,
                    backgroundColor: `rgba(255, 0, 0, 0.36)`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Type Effectiveness */}
      <div className="detail-card type-effectiveness">
  <div className="titdabba">
    <h2>Type Effectiveness</h2>
    <div className="line"></div>
  </div>
  <div className="effectiveness-grid">
    {[
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic',
      'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ].map(type => {
      const multiplier = typeEffectiveness[type] || 1;
      return (
        <div key={type} className="effectiveness-item">
          <span className="type-label">{type}</span>
          <span className={`multiplier ${
            multiplier > 1 ? 'weak' : 
            multiplier < 1 ? 'resist' : 
            'neutral'
          }`}>
            {multiplier}x
          </span>
        </div>
      );
    })}
  </div>
</div>

      {/* Abilities */}
      <div className="detail-card abilities-section">
        <div className="titdabba">
        <h2>Abilities</h2>
        <div className="line"></div>
        </div>
        <div className="abitems">
          {abilitiesDetails.map((ability, idx) => (
            <div key={ability.id} className="ability-item">
              <h3>{ability.name.replace('-', ' ')[0].toUpperCase() + ability.name.replace('-', ' ').slice(1)}</h3>
              <p>{ability.effect_entries.find(e => e.language.name === 'en')?.effect}</p>
              {pokemon.abilities[idx].is_hidden && <span className="hidden-tag">Hidden</span>}
            </div>
          ))}
        </div>
      </div>

        {/* Moves Table */}
        <div className="detail-card moves-section">
          <div className="titdabba">
          <h2>Moves ({movesDetails.length})</h2>
          <div className="line"></div>
        </div>
          <div className="moves-table">
            <div className="table-header">
              <span>Move</span>
              <span>Type</span>
              <span>Power</span>
              <span>PP</span>
              <span>Accuracy</span>
            </div>
            {movesDetails.map(move => (
              <div key={move.id} className="move-row">
                <span>{move.name.replace('-', ' ')[0].toUpperCase()+ move.name.replace('-', ' ').slice(1)}</span>
                <span className="type-tag" style={{
                  backgroundColor: typeGradientColors[move.type.name][0]
                }}>
                  {move.type.name[0].toUpperCase() + move.type.name.slice(1)}
                </span>
                <span>{move.power || '-'}</span>
                <span>{move.pp}</span>
                <span>{move.accuracy ? `${move.accuracy}%` : '-'}</span>
              </div>
            ))}
          </div>
        </div>



        {/* Breeding Info */}
        <div className="detail-card breeding-section">
          <div className="titdabba">
          <h2>Breeding</h2>
          <div className="line"></div>
        </div>
          <div className="breeding-grid">
            <div className="breeding-item">
              <span className="breeding-label">Egg Groups</span>
              <span className="breeding-value">
                {species.egg_groups.map(g => g.name).join(', ')}
              </span>
            </div>
            <div className="breeding-item">
              <span className="breeding-label">Hatch Time</span>
              <span className="breeding-value">
                {species.hatch_counter * 257} steps
              </span>
            </div>
            <div className="breeding-item">
              <span className="breeding-label">Gender Rate</span>
              <span className="breeding-value">
                ♂ {100 - (species.gender_rate * 12.5)}% / ♀ {species.gender_rate * 12.5}%
              </span>
            </div>
          </div>
        </div>
      </div>
      );
}

      export default PokeDetails;