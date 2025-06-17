import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    setUser(null);
  };

  return (
    <header className="py-8 text-4xl font-bold">
      <nav className="flex justify-between">
        <p>Todo List</p>
        {user && (
          <p
            onClick={handleLogout}
            className="cursor-pointer text-lg font-semibold hover:underline"
          >
            Logout
          </p>
        )}
      </nav>
    </header>
  );
}

export default Header;
