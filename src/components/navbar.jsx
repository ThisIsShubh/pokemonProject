import { useState, useContext } from 'react';
import './navbar.css'
import { FilterContext } from '../Context/FilterContext';
import logo from '/src/assets/International_Pokémon_logo.png'; // Adjust the path as needed
import React from 'react';

const Navbar = ({ onSearch }) => {  const {
    searchTerm,
    setSearchTerm
  } = useContext(FilterContext);

  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <nav className="navbar">
      <img
        src={logo}
        alt="Logo"
        className="logoimg"
      />
      <div className='searchfilter'>
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="searchbar"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={() => setShowFilterDialog(true)} className="filter-button">
        ⚙ Filters
      </button>
      </div>

      {showFilterDialog && (
        <div className="filter-dialog">
          <button className="close-dialog" onClick={() => setShowFilterDialog(false)}>
            ❌
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;