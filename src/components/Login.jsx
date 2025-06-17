import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";

import { useAuth } from "../contexts/AuthContext";
import { toastOptions, API_ROOT_URL } from "../helper/constants";
import Loader from "./Loader";

const ONE_HOUR = 3_600_000;

function Login() {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [clientError, setClientError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [{ email, password }, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const { user, setUser } = useAuth();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      setError(null);
      setClientError(null);

      if (validator.isEmpty(email)) {
        setClientError("Email is required.");
        return;
      }
      if (!validator.isEmail(email)) {
        setClientError("Invalid email format.");
        return;
      }
      if (validator.isEmpty(password)) {
        setClientError("Password is required.");
        return;
      }

      setLoading(true);

      const user = await fetch(`${API_ROOT_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });
      const result = await user.json();

      setLoading(false);

      if (!result.isSuccess) {
        setError({ message: result.message, errors: result.errors });
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem(
        "token_expiry",
        new Date(Date.now() + ONE_HOUR).toISOString(),
      );

      toast.success(result.message, toastOptions);

      setUser(result.token);
      navigate("/");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <section className="flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="align-center flex flex-col justify-center rounded-md border-1 border-[#DDDDDD] p-8"
      >
        {(clientError && (
          <p className="mb-4 rounded-full bg-red-200 px-4 py-1 text-xs font-semibold text-red-500">
            <p>{clientError}</p>
          </p>
        )) ||
          (error && (
            <p className="mb-4 rounded-full bg-red-200 px-4 py-1 text-xs font-semibold text-red-500">
              {error.errors[0]?.msg || error.message}
            </p>
          ))}
        <div className="flex items-center gap-4 py-2">
          <label className="w-20" htmlFor="email">
            Email:
          </label>
          <input
            className={`border-b-1 px-4 py-1 ${error && error.errors[0]?.path === "email" ? "border-b-2 border-red-400" : "border-[#CCCCCC]"} ${clientError && (clientError.includes("Email") || clientError.includes("Invalid")) ? "border-b-2 border-red-400" : "border-[#CCCCCC]"}`}
            id="email"
            // type="email"
            value={email}
            onChange={(e) =>
              setLoginDetails((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            placeholder="youremail@domain.com..."
          />
        </div>
        <div className="flex items-center gap-4 py-2">
          <label className="w-20" htmlFor="password">
            Password:
          </label>
          <input
            className={`border-b-1 px-4 py-1 ${error && error.errors[0]?.path === "password" ? "border-b-2 border-red-400" : "border-[#CCCCCC]"} ${clientError && clientError.includes("Password") ? "border-b-2 border-red-400" : "border-[#CCCCCC]"}`}
            id="password"
            type="password"
            value={password}
            onChange={(e) =>
              setLoginDetails((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="password..."
          />
        </div>
        <button
          className={`mt-4 border-y-1 py-2 text-sm font-bold uppercase transition ${!loading ? "cursor-pointer border-blue-500 text-blue-500 hover:rounded-md hover:bg-blue-500 hover:text-white" : "rounded-md border-gray-400 bg-gray-400 text-white"} `}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="flex flex-col gap-2 pt-4 text-sm">
          <Link to="/auth/register">Not yet registered?</Link>
          <Link to="/auth/verify">Registered but not verified?</Link>
          <a>Forgot password?</a>
        </div>
      </form>
    </section>
  );
}

export default Login;
