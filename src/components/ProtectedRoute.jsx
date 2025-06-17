/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../contexts/AuthContext";
import { toastOptions, API_ROOT_URL } from "../helper/constants";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  const [isUserVerified, setIsUserVerified] = useState(false);
  const [loading, setLoading] = useState(true); // wen dom loads set to true so that the server can check first if this user has been verified.

  useEffect(() => {
    if (user) getUser();
  }, [user]);

  // wait for this to fetch user data before checking if user is verified
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

  // TODO: go back to login after verifying since after a user use the link to verify email there is no token in the localstorage, so user must login again.
  if (!user) return <Navigate to="/auth/login" replace />;

  // if the user is not verified and is done loading
  if (!isUserVerified && !loading)
    return <Navigate to="/auth/verify" replace state={isUserVerified} />;

  return children;
}

export default ProtectedRoute;
