
import startersImg from '../assets/starters.png';
import legendsImg from '../assets/legendary.png';
import mythicalsImg from '../assets/mythical.png';
import megaImg from '../assets/mega.png';
import ultraImg from '../assets/ultrabeasts.png';
import babyImg from '../assets/baby.png'

export const pokemonGroups = [
  {
    key: 'starters',
    label: 'Starters',
    image: startersImg,
    gradient: ['#DCE775', '#AED581']
  },
  {
    key: 'legendaries',
    label: 'Legendary Pokémon',
    image: legendsImg,
    gradient: ['#B39DDB', '#9575CD']
  },
  {
    key: 'mythicals',
    label: 'Mythical Pokémon',
    image: mythicalsImg,
    gradient: ['#F8BBD0', '#F48FB1']
  },
  {
    key: 'mega',
    label: 'Mega Evolutions',
    image: megaImg,
    gradient: ['#CE93D8', '#AB47BC']
  },
    {
    key: 'ultrabeasts',
    label: 'Ultra Beasts',
    image: ultraImg,
    gradient: ['#F18C3B', '#E83F42']
  },
  {
    key: 'baby',
    label: 'Baby Pokémon',
    image: babyImg,
    gradient: ['#FFF59D', '#FFEB3B']
  }
];
