import React from 'react';
import { motion } from 'framer-motion';
import './regionalCard.css';
import bgImage1 from '/src/assets/background-darkbg.png';
import { Link } from 'react-router-dom';

const regionColors = {
  kanto: ['#FFCDD2', '#ff808c'],
  johto: ['#FFF9C4', '#FFE082'],
  hoenn: ['#B2DFDB', '#80CBC4'],
  sinnoh: ['#E1BEE7', '#CE93D8'],
  unova: ['#ECEFF1', '#CFD8DC'],
  kalos: ['#C5CAE9', '#9FA8DA'],
  alola: ['#FFE0B2', '#FFCC80'],
  galar: ['#F0F4C3', '#DCE775'],
  paldea: ['#F8BBD0', '#E1BEE7']
};

function Regioncard({ regionKey, professorName, professorImage, onClick }) {
  const gradient = regionColors[regionKey] || ['#E0E0E0', '#BDBDBD'];

  return (
      <motion.div
      className="rcard"
        whileHover={{ scale: 1.05 }}
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
        onClick={onClick}
      >
        <img className='rbg' src={bgImage1} alt="" />

        <div className='rinfo'>
          
          <h3 className="rregion-title">{regionKey.toUpperCase()}</h3>
          <p className="rcard-label">{professorName}</p>
        </div>

        <div className="rcard-img-container">
          <img src={professorImage} alt={professorName} className="rcard-img" loading="lazy" />
        </div>

        
      </motion.div>
  );
}

export default Regioncard;
