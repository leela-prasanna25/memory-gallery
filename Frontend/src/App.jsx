import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import GalleryPage from "./pages/GalleryPage";
import UploadPage from "./pages/UploadPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/gallery" replace />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="auth" element={<AuthPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/gallery" replace />} />
    </Routes>
  );
}
