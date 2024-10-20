import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
// import Mori from "../../assets/Mori.jpg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
// import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: number;
  vote_average: number;
}

const Main = () => {
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [currentBatch, setCurrentBatch] = useState(0);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/movie/now_playing`, {
        params: {
          api_key: import.meta.env.VITE_TMDB_KEY,
          language: "en-US",
          page: 1,
        },
      })
      .then((response) => {
        if (response.data.results) {
          setNowPlaying(response.data.results.slice(0, 6));
        }
      })
      .catch((error) => {
        console.error("error get data", error);
      });

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/movie/popular`, {
        params: {
          api_key: import.meta.env.VITE_TMDB_KEY,
          languge: "en-US",
          page: 1,
        },
      })
      .then((response) => {
        if (response.data.results) {
          setPopularMovies(response.data.results);
          setDisplayedMovies(response.data.results.slice(0, 6));
        }
      })
      .catch((error) => {
        console.error("error get data", error);
      });
  }, []);

  const fetchFavoriteMovies = async () => {
    const sessionId = localStorage.getItem("session_id");
    const accountId = localStorage.getItem("account_id");

    if (sessionId && accountId) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/account/${accountId}/favorite/movies`,
          {
            params: {
              session_id: sessionId,
              api_key: import.meta.env.VITE_TMDB_KEY,
              page: 1,
            },
          }
        );
        setFavorites(response.data.results); // Update favorites from API
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      }
    }
  };

  fetchFavoriteMovies();

  const loadMoreMovie = () => {
    const nextBatchStart = currentBatch * 6;
    const nextBatchEnd = nextBatchStart + 6;

    if (nextBatchEnd > popularMovies.length) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/movie/popular`, {
          params: {
            api_key: import.meta.env.VITE_TMDB_KEY,
            language: "en-US",
            page: page + 1,
          },
        })
        .then((response) => {
          if (response.data.results) {
            const newMovies: Movie[] = response.data.results;

            const uniqueNewMovies = newMovies.filter(
              (movie: Movie) =>
                !popularMovies.some(
                  (existingMovie: Movie) => existingMovie.id === movie.id
                )
            );

            setPopularMovies((prevMovies) => [
              ...prevMovies,
              ...uniqueNewMovies,
            ]);

            setDisplayedMovies((prevDisplayed) => [
              ...prevDisplayed,
              ...[
                ...popularMovies.slice(nextBatchStart, popularMovies.length),
                ...uniqueNewMovies.slice(
                  0,
                  nextBatchEnd - popularMovies.length
                ),
              ],
            ]);

            setPage(page + 1);
            setCurrentBatch(currentBatch + 1);
          }
        })
        .catch((error) => {
          console.error("error get more movies", error);
        });
    } else {
      const newDisplayedMovies = popularMovies.slice(
        nextBatchStart,
        nextBatchEnd
      );

      setDisplayedMovies((prevDisplayed) => [
        ...prevDisplayed,
        ...newDisplayedMovies.filter(
          (movie: Movie) =>
            !prevDisplayed.some(
              (existingMovie: Movie) => existingMovie.id === movie.id
            )
        ),
      ]);

      setCurrentBatch(currentBatch + 1); // Memperbarui batch
    }
  };

  const addFavorite = async (movie: Movie) => {
    const sessionId = localStorage.getItem("session_id");
    const accountId = localStorage.getItem("account_id"); // Ambil account_id dari local storage
    if (!sessionId || !accountId) return;

    try {
      const response = await axios.post(
        `https://api.themoviedb.org/3/account/${accountId}/favorite?session_id=${sessionId}`,
        {
          media_type: "movie",
          media_id: movie.id,
          favorite: true,
        },
        {
          params: {
            api_key: import.meta.env.VITE_TMDB_KEY,
            language: "en-US",
          },
        }
      );

      if (response.status === 200) {
        console.log(`Successfully added ${movie.title} to favorites.`);
        // Tambahkan movie ke state favorites
        setFavorites((prevFavorites) => [...prevFavorites, movie]);
      }
    } catch (error) {
      console.error("Error adding to favorites", error);
    }
  };

  const toggleFavorite = (movie: Movie) => {
    console.log("Toggling Favorite for movie:", movie.title);

    if (favorites.some((favMovie) => favMovie.id === movie.id)) {
      // Jika sudah ada di favorites, hapus
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favMovie) => favMovie.id !== movie.id)
      );
      console.log(`Removed from favorites: ${movie.title}`);
    } else {
      // Jika belum ada, tambahkan
      addFavorite(movie).then(() => {
        // Setelah berhasil menambahkan, perbarui favorites
        setFavorites((prevFavorites) => [...prevFavorites, movie]);
        console.log(`Added to favorites: ${movie.title}`);
      });
    }

    // Log current favorites after toggle
    console.log("Current favorites after toggle:", favorites);
  };

  const userType = localStorage.getItem("userType");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto h-full w-full p-5  bg-[#0F0F0F] flex flex-col justify-center items-center">
        <p className="text-3xl pb-5 font-extrabold text-white">
          Now Playing Movie
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {nowPlaying.map((movie) => (
            <div
              key={movie.id}
              className="relative bg-[#242A38] hover:bg-gray-600 text-white h-96 w-52 text-center rounded-md overflow-hidden drop-shadow-sm hover:drop-shadow-lg cursor-pointer transition duration-300"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                // alt={movie.title}
                className="rounded-t-sm w-full h-3/4 object-cover relative"
              />
              {userType !== "guest" && (
                <button
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    favorites.some((favMovie) => favMovie.id === movie.id)
                      ? "bg-gray-200"
                      : "bg-gray-500"
                  }`}
                  onClick={() => toggleFavorite(movie)}
                >
                  <FaStar
                    className={`w-4 h-4 ${
                      favorites.some((favMovie) => favMovie.id === movie.id)
                        ? "text-yellow-500"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              )}
              <div className="p-1 justify-center items-center">
                <p className="text-base font-extrabold">{movie.title}</p>
                <p className="text-sm font-light">{movie.release_date}</p>
                <p className="text-sm font-light">
                  Rating: {movie.vote_average}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-3xl pt-12 font-extrabold text-white">
          Popular Movie
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-5">
          {displayedMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative bg-[#242A38] hover:bg-gray-600 text-white h-96 w-52 text-center rounded-md overflow-hidden drop-shadow-sm hover:drop-shadow-lg cursor-pointer transition duration-300"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                // alt={movie.title}
                className="rounded-t-sm w-full h-3/4 object-cover relative"
              />
              {userType !== "guest" && (
                <button
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    favorites.some((favMovie) => favMovie.id === movie.id)
                      ? "bg-gray-200"
                      : "bg-gray-500"
                  }`}
                  onClick={() => toggleFavorite(movie)}
                >
                  <FaStar
                    className={`w-4 h-4 ${
                      favorites.some((favMovie) => favMovie.id === movie.id)
                        ? "text-yellow-500"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              )}
              <div className="p-1 justify-center items-center">
                <p className="text-base font-extrabold">{movie.title}</p>
                <p className="text-sm font-light">{movie.release_date}</p>
                <p className="text-sm font-light">
                  Rating: {movie.vote_average}
                </p>
              </div>
            </div>
          ))}
          {displayedMovies.length < 30 && (
            <div className=" justify-center items-center my-8">
              <button
                onClick={loadMoreMovie}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600 transition duration-300"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
