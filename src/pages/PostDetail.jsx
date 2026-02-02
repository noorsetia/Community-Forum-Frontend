import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../api/postsApi";
import LikeButton from "../components/LikeButton";
import Comments from "../components/Comments";
import { useTheme } from "../context/ThemeContext";

export default function PostDetail() {
  const { id } = useParams();
  const { isDarkMode } = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id),
  });

  if (isLoading) return <div className="loader" style={{ color: isDarkMode ? "#e0e0e0" : "#333" }}>Loading post...</div>;

  return (
    <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{
        backgroundColor: isDarkMode ? "#1a1a2e" : "#ffffff",
        padding: "30px",
        borderRadius: "8px",
        marginBottom: "30px",
        border: `1px solid ${isDarkMode ? "#2e2e3e" : "#e0e0e0"}`,
        boxShadow: isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "20px", color: isDarkMode ? "#e0e0e0" : "#1a1a2e" }}>
          {data.title}
        </h2>
        <div style={{ marginBottom: "20px" }}>
          <small style={{ color: isDarkMode ? "#888" : "#666" }}>
            Posted on {new Date(data.createdAt).toLocaleString()}
          </small>
        </div>
        <p style={{ lineHeight: "1.6", marginBottom: "20px", color: isDarkMode ? "#b0b0b0" : "#333" }}>
          {data.content}
        </p>
        <LikeButton post={data} />
      </div>

      <Comments />
    </div>
  );
}
