/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../contexts/AuthContext";
import { toastOptions, API_ROOT_URL } from "../helper/constants";

function Verify() {
  const { user, setUser } = useAuth();

  const [isUserVerified, setIsUserVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");

  useEffect(() => {
    if (user) getUser();
  }, [user]);

  useEffect(() => {
    if (token) updateVerify();
  }, []);

  const getUser = async () => {
    const data = await fetch(`${API_ROOT_URL}/auth/verify?token=${user}`);

    const result = await data.json();

    if (!result.isSuccess) {
      toast.error(result.message, toastOptions);
      setLoading(false); // done fetching
      return;
    }

    setIsUserVerified(result.isVerified);
    setLoading(false); // done fetching
  };

  const updateVerify = async () => {
    const data = await fetch(`${API_ROOT_URL}/auth/verify?token=${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    const result = await data.json();

    if (!result.isSuccess) {
      toast.error(result.message, toastOptions);
      return;
    }

    toast.success(result.message, toastOptions);
    navigate("/");
  };

  const handleResendEmail = async () => {
    const data = await fetch(`${API_ROOT_URL}/auth/verify?token=${user}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result = await data.json();

    if (!result.isSuccess) {
      toast.error(
        (result.errors && result.errors[0].msg) || result.message,
        toastOptions,
      );
      return;
    }

    toast.success(result.message, toastOptions);

    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    setUser(null);

    navigate("/auth/login");
  };

  if (!user) return <Navigate to="/auth/login" replace />;

  if (isUserVerified && !loading) return <Navigate to="/" replace />;

  return (
    <div className="flex h-140 flex-col items-center justify-center gap-8">
      <p className="rounded-md bg-red-100 px-4 py-2 text-lg font-semibold text-red-500">
        Your account has not yet been verified.
      </p>
      <p>
        Check your email, If you did not receive an email verification link
        click{" "}
        <a
          onClick={handleResendEmail}
          className="cursor-pointer text-blue-500 hover:underline active:text-blue-800"
        >
          resend verification email
        </a>
        .
      </p>
    </div>
  );
}

export default Verify;
