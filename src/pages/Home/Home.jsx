//Home.jsx

import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import RegionalCard from '../../components/Regioncard.jsx';
import { regionProfessors } from '../../data/professors.js'
import './home.css'
import img from '../../assets/hero.png'
import bgx from '../../assets/background-lightbg.png'
import Button from '../../components/Button.jsx';
import { pokemonGroups } from '../../data/pokemonGroups.js';
import GroupCard from '../../components/Groupcard.jsx';
import Typecard from '../../components/Typecard.jsx';


function Home() {
    const pokemonTypes = [
        { name: 'fire', image: '/src/assets/types/fire.png' },
        { name: 'water', image: '/src/assets/types/water.png' },
        { name: 'grass', image: '/src/assets/types/grass.png' },
        { name: 'electric', image: '/src/assets/types/electric.png' },
        { name: 'ice', image: '/src/assets/types/ice.png' },
        { name: 'fighting', image: '/src/assets/types/fighting.png' },
        { name: 'poison', image: '/src/assets/types/poison.png' },
        { name: 'ground', image: '/src/assets/types/ground.png' },
        { name: 'flying', image: '/src/assets/types/flying.png' },
        { name: 'psychic', image: '/src/assets/types/psychic.png' },
        { name: 'bug', image: '/src/assets/types/bug.png' },
        { name: 'rock', image: '/src/assets/types/rock.png' },
        { name: 'ghost', image: '/src/assets/types/ghost.png' },
        { name: 'dragon', image: '/src/assets/types/dragon.png' },
        { name: 'dark', image: '/src/assets/types/dark.png' },
        { name: 'steel', image: '/src/assets/types/steel.png' },
        { name: 'fairy', image: '/src/assets/types/fairy.png' },
        { name: 'normal', image: '/src/assets/types/normal.png' }
    ];
    const navigate = useNavigate();

    const handleRegionClick = (regionKey) => {
        navigate(`/region/${regionKey}`);
    };

    const handleGroupClick = (groupKey) => {
        navigate(`/group/${groupKey}`);
    }

    const handleTypeClick = (typeKey) => {
        navigate(`/type/${typeKey}`)
    }

    return (
        <div className="ghome-container">
            <div className="circle"></div>
            <div className="circle2"></div>
            <img src={bgx} className='ball' alt="" />
            <div className="hero-home">

                <div className="content-home">
                    <h1>Catching ’Em All in Code: A Pokémon Exploration</h1>
                    <p>I’ve always loved Pokémon — from trading cards to animated battles, it’s been a cherished part of my childhood. Now, as I explore the world of web development, I couldn’t think of a better way to play around and learn than by diving back into that magical universe. This project brings the regions of Pokémon to life — letting you explore the native Pokémon of each area, complete with artwork, types, and smooth pagination. It’s not just a project — it’s a nostalgic journey coded into reality.</p>

                    <NavLink to={'/all'}onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}> <Button label='Check out all Pokemons!' />  </NavLink>
                </div>
                <img src={img} className='img-home' alt="Pikachu" />
            </div>

            <div className="rgnal">
            <div className='tit1'>
                <h1 className='rgp'>Regional Pokédex</h1>
                <div className="line"></div>
            </div>

            <div className="regional-cards-container">
                {regionProfessors.map(({ region, name, image }) => {
                    return (
                        <RegionalCard
                            key={region}
                            regionKey={region}
                            professorName={name}
                            professorImage={image}
                            onClick={() => handleRegionClick(region)}
                        />
                    );
                })}
            </div>
            </div>

            <div className='tit1'>
                <h1 className='rgp'>Pokemon Groups</h1>
                <div className="line"></div>
            </div>

            <div className="regional-cards-container">
                {pokemonGroups.map(({ key, label, image, gradient }) => (
                    <GroupCard
                        key={key}       // Pass the group key for gradient selection
                        title={label}         // Display label on card
                        image={image}
                        gradient={gradient}        // Pokémon group image
                        onClick={() => handleGroupClick(key)}
                    />
                ))}
            </div>

            <div className='tit1'>
                <h1 className='rgp'>Pokémon Types</h1>
                <div className="line"></div>
            </div>

            <div className="regional-cards-container">
                {pokemonTypes.map(({ name, image }) => (
                    <Typecard
                        key={name}
                        typeName={name}
                        image={image}
                        onClick={() => handleTypeClick(name)}
                    />
                ))}
            </div>


        </div>


    );
}

export default Home;
