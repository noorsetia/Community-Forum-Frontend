import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import PostDetail from "./pages/PostDetail";
import Navbar from "./components/Navbar";

export default function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/feed" />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new" element={<NewPost />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </>
  );
}
