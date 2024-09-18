import React, { useEffect, useState } from 'react';
import { getAnimeList } from '../api/api';

const AnimeList = () => {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
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

  return (
    <div>
      <h1>Anime List</h1>
      <ul>
      {animeList.map((anime) => (
        <li key={anime.id}>
          <h2>{anime.title}</h2>
          <p>{anime.description}</p>
          <p>Category: {anime.category}</p>
          <a href={anime.videoUrl}>Watch Video</a>
          <img src={anime.thumbnailUrl} alt={anime.title} />
          <p>Release Date: {new Date(anime.releaseDate).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
    </div>
  );
};

export default AnimeList;
