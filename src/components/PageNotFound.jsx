import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Oops! Page not found.</p>
      <p className="mt-2 text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default PageNotFound;
