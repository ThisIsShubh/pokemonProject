
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
    gradient: ['#9E9D24', '#827717'] // deep olive green
  },
  {
    key: 'legendaries',
    label: 'Legendary Pokémon',
    image: legendsImg,
    gradient: ['#512DA8', '#311B92'] // rich indigo
  },
  {
    key: 'mythicals',
    label: 'Mythical Pokémon',
    image: mythicalsImg,
    gradient: ['#C2185B', '#880E4F'] // vibrant rose
  },
  {
    key: 'mega',
    label: 'Mega Evolutions',
    image: megaImg,
    gradient: ['#7B1FA2', '#4A148C'] // dark violet
  },
  {
    key: 'ultrabeasts',
    label: 'Ultra Beasts',
    image: ultraImg,
    gradient: ['#BF360C', '#DD2C00'] // intense orange-red
  },
  {
    key: 'baby',
    label: 'Baby Pokémon',
    image: babyImg,
    gradient: ['#FBC02D', '#F57F17'] // strong gold-yellow
  }
];

