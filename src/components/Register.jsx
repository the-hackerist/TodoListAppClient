import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import validator from "validator";
import { toast } from "react-toastify";

import { useAuth } from "../contexts/AuthContext";
import { toastOptions, API_ROOT_URL } from "../helper/constants";

function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [clientError, setClientError] = useState(null);
  const [isNotMatch, setIsNotMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [{ email, password, confirmPassword }, setRegisterDetails] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      setError(null);
      setClientError(null);
      setIsNotMatch(false);

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
      if (validator.isEmpty(confirmPassword)) {
        setClientError("Confirm password is required.");
        return;
      }

      if (confirmPassword.trim() !== password.trim()) {
        setIsNotMatch(true);
        return;
      }

      setLoading(true);

      const user = await fetch(`${API_ROOT_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await user.json();

      if (!result.isSuccess) {
        setError({ message: result.message, errors: result.errors });
        setLoading(false);

        return;
      }

      toast.success(result.message, { ...toastOptions, autoClose: 5000 });

      navigate("/auth/login");
      setLoading(false);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <section className="flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="align-center flex flex-col justify-center rounded-md border-1 border-[#DDDDDD] p-8"
      >
        {(clientError && (
          <p className="mb-4 rounded-full bg-red-200 px-4 py-1 text-xs font-semibold text-red-500">
            {clientError}
          </p>
        )) ||
          (isNotMatch && (
            <p className="mb-4 rounded-full bg-red-200 px-4 py-1 text-xs font-semibold text-red-500">
              Confirm password does not match password.
            </p>
          )) ||
          (error && (
            <p className="mb-4 rounded-full bg-red-200 px-4 py-1 text-xs font-semibold text-red-500">
              {(error.errors && error.errors[0]?.msg) || error.message}
            </p>
          ))}

        {/* // TODO improve validating of confirm password */}
        <div className="flex items-center gap-4 py-2">
          <label className="w-36" htmlFor="email">
            Email:
          </label>
          <input
            className={`border-b-1 px-4 py-1 ${error && error.errors && error.errors[0]?.path === "email" ? "border-b-2 border-red-400" : "border-[#CCCCCC]"} ${clientError && (clientError.includes("Email") || clientError.includes("Invalid")) ? "border-b-2 border-red-400" : "border-[#CCCCCC]"}`}
            id="email"
            type="email"
            value={email}
            onChange={(e) =>
              setRegisterDetails((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            placeholder="youremail@domain.com..."
          />
        </div>
        <div className="flex items-center gap-4 py-2">
          <label className="w-36" htmlFor="password">
            Password:
          </label>
          <input
            className={`border-b-1 px-4 py-1 ${error && error.errors && error.errors[0]?.path === "password" ? "border-b-2 border-red-400" : "border-[#CCCCCC]"} ${clientError && clientError.includes("Password") ? "border-b-2 border-red-400" : "border-[#CCCCCC]"}`}
            id="password"
            type="password"
            value={password}
            onChange={(e) =>
              setRegisterDetails((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            placeholder="password..."
          />
        </div>
        <div className="flex items-center gap-4 py-2">
          <label className="w-36" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            // TODO improve validating of confirm password
            className={`border-b-1 px-4 py-1 ${isNotMatch || (clientError && clientError.includes("Confirm")) ? "border-b-2 border-red-400" : "border-[#CCCCCC]"}`}
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setRegisterDetails((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            placeholder="confirm password..."
          />
        </div>
        <button
          className={`mt-4 border-y-1 py-2 text-sm font-bold uppercase transition ${!loading ? "cursor-pointer border-blue-500 text-blue-500 hover:rounded-md hover:bg-blue-500 hover:text-white" : "cursor-not-allowed rounded-md border-gray-400 bg-gray-400 text-white"} `}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="flex flex-col gap-2 pt-4 text-sm">
          <Link to="/auth/login">Already have an account?</Link>
        </div>
      </form>
    </section>
  );
}

export default Register;
