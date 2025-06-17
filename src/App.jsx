import { Routes, Route, BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import PageNotFound from "./components/PageNotFound";
import Verify from "./components/Verify";
import AppLayout from "./components/AppLayout";
import TodoDashboard from "./components/TodoDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route index element={<TodoDashboard />} />
            <Route path="/auth/verify" element={<Verify />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
