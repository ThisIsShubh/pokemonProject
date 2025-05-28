import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './card.css';
import bgImage from '/src/assets/background-darkbg.png';

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

function Card({ pokemon }) {
  const getBackground = () => {
    const types = pokemon.types;
    if (types.length === 1) {
      const [type] = types;
      return `linear-gradient(135deg, ${typeGradientColors[type][0]}, ${typeGradientColors[type][1]})`;
    }
    return `linear-gradient(135deg, ${typeGradientColors[types[0]][0]}, ${typeGradientColors[types[1]][1]})`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card"
      style={{ background: getBackground() }}
    >
      <Link to={`/pokemon/${pokemon.name}`} className="card-link">
        <div className="card-id">#{pokemon.id.toString().padStart(3, '0')}</div>

        <img className='bg' src={bgImage} alt="" />

        <div className='info'>
          <h3 className="card-title">{pokemon.name}</h3>


          <div className="card-types">
            {pokemon.types.map(type => (
              <span
                key={type}
                className={`type-badge type-${type}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="card-img-container">
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="card-img"
            loading="lazy"
          />
        </div>


      </Link>
    </motion.div>
  );
}

export default Card;