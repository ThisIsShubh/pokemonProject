import React from 'react';
import { motion } from 'framer-motion';
import './groupcard.css';
import bgImage1 from '/src/assets/background-darkbg.png';

function GroupCard({ groupKey, title, image, onClick, gradient }) {
  const bgGradient = gradient || ['#E0E0E0', '#BDBDBD'];

  return (
    <motion.div
      className="gcard"
      whileHover={{ scale: 1.05 }}
      style={{
        background: `linear-gradient(135deg, ${bgGradient[0]}, ${bgGradient[1]})`
      }}
      onClick={onClick}
    >
      <img className='gbg' src={bgImage1} alt="" />

      <div className="ginfo">
        <h3 className="gcard-title">{title}</h3>
      </div>

      <div className="gcard-img-container">
        <img src={image} alt={title} className="gcard-img" loading="lazy" />
      </div>
    </motion.div>
  );
}

export default GroupCard;
