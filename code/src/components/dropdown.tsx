import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const username = localStorage.getItem("username");

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem("session_id");
      const userType = localStorage.getItem("userType");

      if (userType === "authenticated" && sessionId) {
        await axios.delete(
          `https://api.themoviedb.org/3/authentication/session`,
          {
            params: {
              api_key: "f2e925e83f161638e1ddd37336f5156f",
              session_id: sessionId,
            },
          }
        );
      }

      localStorage.removeItem("session_id");
      localStorage.removeItem("account_id");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("userType");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isGuest = !username;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:text-gray-600 transition duration-300"
      >
        {username || "Guest"}
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {!isGuest && (
              <button
                onClick={() => navigate("/favorite")}
                className="w-full px-4 py-2 text-sm text-black hover:bg-gray-100"
              >
                Favorite
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-black hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
