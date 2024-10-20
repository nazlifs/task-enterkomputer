import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

const Favorites = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchFavoriteMovies();
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
              api_key: "f2e925e83f161638e1ddd37336f5156f",
              page: 1,
            },
          }
        );
        setFavoriteMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto h-full w-full p-5 bg-[#0F0F0F] flex flex-col justify-center items-center">
        <p className="text-3xl pb-5 font-extrabold text-white">My Favorite</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {favoriteMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative bg-[#242A38] hover:bg-gray-600 text-white h-96 w-52 text-center rounded-md overflow-hidden drop-shadow-sm hover:drop-shadow-lg cursor-pointer transition duration-300"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-t-sm w-full h-3/4 object-cover relative"
              />
              <div className="p-1 justify-center items-center">
                <p className="text-base font-extrabold mt-2">{movie.title}</p>
                <p className="text-sm font-light">{movie.release_date}</p>
                <p className="text-sm font-light">
                  Rating: {movie.vote_average}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
