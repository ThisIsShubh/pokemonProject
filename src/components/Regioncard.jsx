import React from 'react';
import { motion } from 'framer-motion';
import './regionalCard.css';
import bgImage1 from '/src/assets/background-darkbg.png';
import { Link } from 'react-router-dom';

const regionColors = {
  kanto: ['#D32F2F', '#B71C1C'],        // deeper red
  johto: ['#FBC02D', '#F57F17'],        // bold yellow/orange
  hoenn: ['#00796B', '#004D40'],        // strong teal
  sinnoh: ['#8E24AA', '#6A1B9A'],       // rich purple
  unova: ['#607D8B', '#455A64'],        // slate gray
  kalos: ['#3F51B5', '#303F9F'],        // indigo blue
  alola: ['#FB8C00', '#EF6C00'],        // orange
  galar: ['#9E9D24', '#827717'],        // olive green
  paldea: ['#AD1457', '#880E4F']        // dark pink/magenta
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
