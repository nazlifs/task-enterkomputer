import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface TokenResponse {
  request_token: string;
}

interface SessionResponse {
  session_id: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = async () => {
    try {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);

      const responseRequestToken = await axios.get<TokenResponse>(
        "https://api.themoviedb.org/3/authentication/token/new",
        {
          params: {
            api_key: "f2e925e83f161638e1ddd37336f5156f",
          },
        }
      );

      const requestToken = responseRequestToken.data.request_token;

      const responseLogin = await axios.post<TokenResponse>(
        "https://api.themoviedb.org/3/authentication/token/validate_with_login",
        {
          username: username,
          password: password,
          request_token: requestToken,
        },
        {
          params: {
            api_key: "f2e925e83f161638e1ddd37336f5156f",
          },
        }
      );

      const validatedToken = responseLogin.data.request_token;

      const responseSession = await axios.post<SessionResponse>(
        "https://api.themoviedb.org/3/authentication/session/new",
        {
          request_token: validatedToken,
        },
        {
          params: {
            api_key: "f2e925e83f161638e1ddd37336f5156f",
          },
        }
      );

      const sessionId = responseSession.data.session_id;
      // console.log("Session ID:", sessionId);

      const responseAccount = await axios.get(
        `https://api.themoviedb.org/3/account`,
        {
          params: {
            api_key: "f2e925e83f161638e1ddd37336f5156f",
            session_id: sessionId,
          },
        }
      );

      const accountId = responseAccount.data.id;

      localStorage.setItem("session_id", sessionId);
      localStorage.setItem("account_id", accountId);
      localStorage.setItem("userType", "authenticated");

      navigate("/hero");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const continueAsGuest = async () => {
    try {
      const responseGuestSession = await axios.get<SessionResponse>(
        "https://api.themoviedb.org/3/authentication/guest_session/new",
        {
          params: {
            api_key: "f2e925e83f161638e1ddd37336f5156f",
          },
        }
      );

      const guestSessionId = responseGuestSession.data.session_id;
      // console.log("Guest Session ID:", guestSessionId);

      localStorage.setItem("session_id", guestSessionId);
      localStorage.setItem("userType", "guest");

      navigate("/hero");
    } catch (error) {
      console.error("Failed to create guest session:", error);
    }
  };

  return (
    <div className="w-full h-screen flex bg-[#0F0F0F]">
      <div className="bg-gray-600 w-[90%] max-w-md h-[80%] shadow-2xl m-auto px-8 py-12 rounded-3xl">
        <div className="mb-16">
          <span className="text-3xl font-semibold text-white">Login</span>
          <p className="text-2xl text-white">to get started</p>
        </div>
        <div className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-[66px] rounded-lg p-[24px]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[66px] rounded-lg p-[24px]"
          />
        </div>
        <button
          className="bg-gray-800 hover:bg-gray-700 w-full py-3 rounded-lg text-white my-2"
          onClick={login}
        >
          Login
        </button>

        <div className="text-center">
          <button
            className="font-semibold text-white hover:text-gray-800"
            onClick={continueAsGuest}
          >
            Continue as A Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
