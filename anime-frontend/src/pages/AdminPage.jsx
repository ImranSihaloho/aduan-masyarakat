import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [newAnime, setNewAnime] = useState({
    title: '',
    description: '',
    category: '',
    videoUrl: '',
    thumbnailUrl: '',
    releaseDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAnimeList = async () => {
    try {
      const response = await axios.get('http://localhost:5130/api/anime'); // Sesuaikan URL API
      setAnimeList(response.data);
    } catch (error) {
      setError('Failed to fetch anime list');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchAnimeList();
  }, []);

  const handleAddAnime = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5130/api/anime', newAnime); // Sesuaikan URL API
      setNewAnime({
        title: '',
        description: '',
        category: '',
        videoUrl: '',
        thumbnailUrl: '',
        releaseDate: '',
      });
      await fetchAnimeList();
    } catch (error) {
      setError('Failed to add anime');
    }
  };

  const handleEditAnime = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5130/api/anime/${selectedAnime.id}`, selectedAnime); // Sesuaikan URL API
      setSelectedAnime(null);
      await fetchAnimeList();
    } catch (error) {
      setError('Failed to update anime');
    }
  };

  const handleDeleteAnime = async (id) => {
    try {
      await axios.delete(`http://localhost:5130/api/anime/${id}`).then((res)=>console.log(res)); // Sesuaikan URL API
      await fetchAnimeList();
    } catch (error) {
      setError('Failed to delete anime ', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Admin Dashboard</h1>

      {/* Add Anime Form */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Anime</h2>
        <form onSubmit={handleAddAnime} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-200 font-semibold">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newAnime.title}
              onChange={(e) => setNewAnime({ ...newAnime, title: e.target.value })}
              className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter anime title"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-200 font-semibold">
              Description
            </label>
            <textarea
              id="description"
              value={newAnime.description}
              onChange={(e) => setNewAnime({ ...newAnime, description: e.target.value })}
              className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter anime description"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-gray-700 dark:text-gray-200 font-semibold">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={newAnime.category}
              onChange={(e) => setNewAnime({ ...newAnime, category: e.target.value })}
              className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter anime category"
              required
            />
          </div>
          <div>
            <label htmlFor="videoUrl" className="block text-gray-700 dark:text-gray-200 font-semibold">
              Video URL
            </label>
            <input
              type="url"
              id="videoUrl"
              value={newAnime.videoUrl}
              onChange={(e) => setNewAnime({ ...newAnime, videoUrl: e.target.value })}
              className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter anime video URL"
              required
            />
          </div>
          <div>
            <label htmlFor="thumbnailUrl" className="block text-gray-700 dark:text-gray-200 font-semibold">
              Thumbnail URL
            </label>
            <input
              type="url"
              id="thumbnailUrl"
              value={newAnime.thumbnailUrl}
              onChange={(e) => setNewAnime({ ...newAnime, thumbnailUrl: e.target.value })}
              className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter anime thumbnail URL"
              required
            />
          </div>
          <div>
            <label htmlFor="releaseDate" className="block text-gray-700 dark:text-gray-200 font-semibold">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              value={newAnime.releaseDate}
              onChange={(e) => setNewAnime({ ...newAnime, releaseDate: e.target.value })}
              className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add Anime
          </button>
        </form>
      </section>

      {/* Anime List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Anime List</h2>
        <table className="w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Release Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {animeList.map((anime) => (
              <tr key={anime.id}>
                <td className="py-2 px-4 border-b">{anime.id}</td>
                <td className="py-2 px-4 border-b">{anime.title}</td>
                <td className="py-2 px-4 border-b">{anime.category}</td>
                <td className="py-2 px-4 border-b">{new Date(anime.releaseDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={() => setSelectedAnime(anime)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded ml-2"
                    onClick={() => handleDeleteAnime(anime.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Edit Anime Form */}
      {selectedAnime && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Edit Anime</h2>
          <form onSubmit={handleEditAnime} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div>
              <label htmlFor="editTitle" className="block text-gray-700 dark:text-gray-200 font-semibold">
                Title
              </label>
              <input
                type="text"
                id="editTitle"
                value={selectedAnime.title}
                onChange={(e) => setSelectedAnime({ ...selectedAnime, title: e.target.value })}
                className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter anime title"
                required
              />
            </div>
            <div>
              <label htmlFor="editDescription" className="block text-gray-700 dark:text-gray-200 font-semibold">
                Description
              </label>
              <textarea
                id="editDescription"
                value={selectedAnime.description}
                onChange={(e) => setSelectedAnime({ ...selectedAnime, description: e.target.value })}
                className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter anime description"
                required
              />
            </div>
            <div>
              <label htmlFor="editCategory" className="block text-gray-700 dark:text-gray-200 font-semibold">
                Category
              </label>
              <input
                type="text"
                id="editCategory"
                value={selectedAnime.category}
                onChange={(e) => setSelectedAnime({ ...selectedAnime, category: e.target.value })}
                className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter anime category"
                required
              />
            </div>
            <div>
              <label htmlFor="editVideoUrl" className="block text-gray-700 dark:text-gray-200 font-semibold">
                Video URL
              </label>
              <input
                type="url"
                id="editVideoUrl"
                value={selectedAnime.videoUrl}
                onChange={(e) => setSelectedAnime({ ...selectedAnime, videoUrl: e.target.value })}
                className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter anime video URL"
                required
              />
            </div>
            <div>
              <label htmlFor="editThumbnailUrl" className="block text-gray-700 dark:text-gray-200 font-semibold">
                Thumbnail URL
              </label>
              <input
                type="url"
                id="editThumbnailUrl"
                value={selectedAnime.thumbnailUrl}
                onChange={(e) => setSelectedAnime({ ...selectedAnime, thumbnailUrl: e.target.value })}
                className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter anime thumbnail URL"
                required
              />
            </div>
            <div>
              <label htmlFor="editReleaseDate" className="block text-gray-700 dark:text-gray-200 font-semibold">
                Release Date
              </label>
              <input
                type="date"
                id="editReleaseDate"
                value={selectedAnime.releaseDate}
                onChange={(e) => setSelectedAnime({ ...selectedAnime, releaseDate: e.target.value })}
                className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Update Anime
            </button>
            <button
              type="button"
              className="w-full mt-2 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition duration-300"
              onClick={() => setSelectedAnime(null)}
            >
              Cancel
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default AdminPage;