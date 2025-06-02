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
import fire from '../../assets/types/fire.png';
import water from '../../assets/types/water.png';
import grass from '../../assets/types/grass.png';
import electric from '../../assets/types/electric.png';
import ice from '../../assets/types/ice.png';
import fighting from '../../assets/types/fighting.png';
import poison from '../../assets/types/poison.png';
import ground from '../../assets/types/ground.png';
import flying from '../../assets/types/flying.png';
import psychic from '../../assets/types/psychic.png';
import bug from '../../assets/types/bug.png';
import rock from '../../assets/types/rock.png';
import ghost from '../../assets/types/ghost.png';
import dragon from '../../assets/types/dragon.png';
import dark from '../../assets/types/dark.png';
import steel from '../../assets/types/steel.png';
import fairy from '../../assets/types/fairy.png';
import normal from '../../assets/types/normal.png';


function Home() {
    const pokemonTypes = [
        { name: 'fire', image: fire},
        { name: 'water', image: water },
        { name: 'grass', image: grass },
        { name: 'electric', image: electric },
        { name: 'ice', image: ice },
        { name: 'fighting', image: fighting },
        { name: 'poison', image: poison },
        { name: 'ground', image: ground },
        { name: 'flying', image: flying },
        { name: 'psychic', image: psychic },
        { name: 'bug', image: bug},
        { name: 'rock', image: rock },
        { name: 'ghost', image: ghost },
        { name: 'dragon', image: dragon },
        { name: 'dark', image: dark },
        { name: 'steel', image: steel },
        { name: 'fairy', image: fairy },
        { name: 'normal', image: normal }
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
                        className='region-card'
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
                        key={key}       
                        title={label}         
                        image={image}
                        gradient={gradient}        
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
