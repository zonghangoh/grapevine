import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import FilesPage from './pages/FilesPage';
import AccountsPage from './pages/AccountsPage';
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/files"
                element={
                  <ProtectedRoute>
                    <FilesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accounts"
                element={
                  <ProtectedRoute requireAdmin>
                    <AccountsPage />
                  </ProtectedRoute>
                }
              />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
