import { useNavigate } from "react-router-dom";
import Dropdown from "./dropdown";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 bg-gray-800 py-0 px-6">
      <header className=" p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <button
              className="text-white hover:text-gray-600 transition duration-300"
              onClick={() => navigate("/hero")}
            >
              Movie
            </button>
          </h1>

          <div className="flex space-x-4">
            <Dropdown />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
