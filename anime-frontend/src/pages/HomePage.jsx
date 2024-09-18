import React from 'react';
import { Link } from 'react-router-dom';
import { getAnimeList } from '../api/api';
import '../App.css';

const categories = [
  'Action',
  'Adventure',
  'Drama',
  'Comedy'
];

const HomePage = () => {
  const [animeList, setAnimeList] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const fetchAnimeList = async () => {
      try {
        const response = await getAnimeList();
        setAnimeList(response.data);
      } catch (error) {
        console.error('Failed to fetch anime list:', error);
      }
    };

    fetchAnimeList();
  }, []);

  const filteredAnimeList = animeList
    .filter(anime => 
      anime.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || anime.category === selectedCategory)
    );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-500`}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-md rounded-b-lg">
        <h1 className="text-3xl font-bold">Anime World</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-300">
            {darkMode ? '🌞' : '🌙'}
          </button>
          <Link to="/login">
            <img src="https://cdn-icons-png.flaticon.com/512/32/32195.png" alt="Login Icon" className="w-8 h-8" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero text-center py-16 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Welcome to Anime World</h1>
          <p className="text-lg mb-6">Discover and watch your favorite anime!</p>
          <input
            type="text"
            placeholder="Search for anime..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Categories Filter */}
      <section className="categories bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-lg ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-600 dark:text-gray-200'} hover:bg-blue-500 transition-colors duration-300`}
              >
                {category}
              </button>
            ))}
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-5 py-2 rounded-lg ${selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-600 dark:text-gray-200'} hover:bg-blue-500 transition-colors duration-300`}
            >
              All
            </button>
          </div>
        </div>
      </section>

      {/* Anime List */}
      <section className="anime-list py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-8">Anime List</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredAnimeList.map((anime) => (
              <div key={anime.id} className="anime-card bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                <img
                  src={anime.thumbnailUrl}
                  alt={anime.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{anime.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{anime.description}</p>
                <Link to={`/anime/${anime.id}`} className="text-blue-500 hover:underline transition-colors duration-300">
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-gray-800 text-white text-center py-4 rounded-t-lg">
        <div className="container mx-auto">
          <p>&copy; 2024 Anime World. All rights reserved.</p>
          <p>
            <a href="mailto:contact@animeworld.com" className="text-blue-400 hover:underline">
              Contact Us
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
