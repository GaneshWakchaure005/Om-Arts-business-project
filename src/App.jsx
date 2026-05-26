import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import AdminLogin from "./pages/admin/AdminLogin";
import AddModel from "./pages/admin/AddModel";
import UpdateModel from "./pages/admin/UpdateModel";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<Main />} />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-model"
          element={
            <ProtectedRoute>
              <AddModel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/update-model/:id"
          element={
            <ProtectedRoute>
              <UpdateModel />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;