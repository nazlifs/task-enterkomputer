import { createBrowserRouter } from "react-router-dom";
import { Favorites, Hero, Login } from "../pages";

const router = createBrowserRouter([
  {
    path: "/hero",
    element: <Hero />,
  },

  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/favorite",
    element: <Favorites />,
  },
]);

export default router;
