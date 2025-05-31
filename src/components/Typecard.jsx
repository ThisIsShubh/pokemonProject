import React from 'react';
import { motion } from 'framer-motion';
import './regionalCard.css';
import bgImage1 from '/src/assets/background-darkbg.png';


const typeColors = {
  fire: ['#E65100', '#BF360C'],          // deep orange
  water: ['#1565C0', '#0D47A1'],         // deep blue
  grass: ['#2E7D32', '#1B5E20'],         // forest green
  electric: ['#F9A825', '#F57F17'],      // strong yellow-orange
  ice: ['#00ACC1', '#00838F'],           // teal blue
  fighting: ['#C62828', '#B71C1C'],      // crimson red
  poison: ['#8E24AA', '#6A1B9A'],        // rich purple
  ground: ['#8D6E63', '#5D4037'],        // brown/tan
  flying: ['#5C6BC0', '#3949AB'],        // periwinkle/violet-blue
  psychic: ['#D81B60', '#AD1457'],       // hot pink/magenta
  bug: ['#689F38', '#558B2F'],           // earthy green
  rock: ['#795548', '#4E342E'],          // strong brown
  ghost: ['#4527A0', '#311B92'],         // deep violet
  dragon: ['#512DA8', '#311B92'],        // rich indigo
  dark: ['#3E2723', '#212121'],          // black/brown
  steel: ['#607D8B', '#455A64'],         // slate gray
  fairy: ['#C2185B', '#880E4F'],         // strong rose
  normal: ['#757575', '#424242']         // gray scale
};


function Typecard({ typeName, image, onClick }) {
  const gradient = typeColors[typeName] || ['#E0E0E0', '#BDBDBD'];

  return (
      <motion.div
        className="rcard"
        whileHover={{ scale: 1.05 }}
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
        onClick={onClick}
      >
        <img className="rbg" src={bgImage1} alt="" />

        <div className="rinfo">
          <h3 className="rregion-title">{typeName.toUpperCase()}</h3>
          <p className="rcard-label">Type</p>
        </div>

        <div className="rcard-img-container">
          <img src={image} alt={typeName} className="rcard-img" loading="lazy" />
        </div>
      </motion.div>
  );
}

export default Typecard;
