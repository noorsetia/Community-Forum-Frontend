import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LikeButton from "./LikeButton";
import { useTheme } from "../context/ThemeContext";
import { getComments } from "../api/postsApi";

export default function PostCard({ post }) {
  const { isDarkMode } = useTheme();
  
  // Fetch comments count for this post with real-time updates
  const { data: comments = [] } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => getComments(post.id),
    refetchInterval: 2000 // Refetch every 2 seconds
  });
  
  const commentCount = comments.length;

  return (
    <div className="post-card" style={{
      padding: "20px",
      marginBottom: "20px",
      backgroundColor: isDarkMode ? "#1a1a2e" : "#ffffff",
      borderRadius: "8px",
      border: `1px solid ${isDarkMode ? "#2e2e3e" : "#e0e0e0"}`,
      boxShadow: isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <Link to={`/post/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <h3 style={{ 
          marginBottom: "10px", 
          color: isDarkMode ? "#e0e0e0" : "#1a1a2e" 
        }}>
          {post.title}
        </h3>
        <p style={{ 
          marginBottom: "15px", 
          color: isDarkMode ? "#b0b0b0" : "#666" 
        }}>
          {post.content.substring(0, 150)}...
        </p>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <LikeButton post={post} />
        <Link 
          to={`/post/${post.id}`}
          style={{
            padding: "8px 16px",
            backgroundColor: isDarkMode ? "#16213e" : "#3498db",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "14px"
          }}
        >
          💬 {commentCount} Comments
        </Link>
        <small style={{ color: isDarkMode ? "#888" : "#999" }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
}
