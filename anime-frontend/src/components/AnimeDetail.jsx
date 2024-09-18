import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnimeDetail } from "../api/api";

const AnimeDetail = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        const response = await getAnimeDetail(id);
        setAnime(response.data);
      } catch (error) {
        console.error("Failed to fetch anime details:", error);
      }
    };

    fetchAnimeDetail();
  }, [id]);

  if (!anime) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  console.log("Video URL:", anime.videoUrl); // Debugging line

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="p-4 bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-md">
        <h1 className="text-3xl font-bold text-center">Anime Detail</h1>
      </header>

      <main className="container mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">{anime.title}</h1>
          <div className="mb-4">
            <img
              src={anime.thumbnailUrl}
              alt={anime.title}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
          </div>
          <p className="text-lg mb-4">{anime.description}</p>
          <p className="text-md mb-2 font-semibold">
            Category: {anime.category}
          </p>
          <p className="text-md mb-4">
            Release Date: {new Date(anime.releaseDate).toLocaleDateString()}
          </p>
          <div className="flex justify-center">
            {(anime.videoUrl && (anime.videoUrl.includes("youtube.com")) ||
            anime.videoUrl.includes("youtu.be")) ? (
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(anime.videoUrl)}`}
                title={anime.title}
                frameBorder="0"
                allowFullScreen
                className="rounded-md shadow-md"
              ></iframe>
            ) : (
              <video width="100%" controls className="rounded-md shadow-md">
                <source src={anime.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4 mt-6">
        <p>&copy; 2024 Anime World. All rights reserved.</p>
      </footer>
    </div>
  );
};

const extractYouTubeVideoId = (url) => {
  if (url.includes("youtube.com")) { //
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  }
  else if (url.includes("youtu.be")) { //
    console.log(url.split("/")) //
    return url.split("/")[3]; //
  } //
};

export default AnimeDetail;
