import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/postsApi";
import { useTheme } from "../context/ThemeContext";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      await createPost(
        { 
          title, 
          content, 
          authorId: 1,
          author: {
            id: 1,
            username: "demo_user",
            displayName: "Demo User",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo_user"
          }
        },
        token
      );
      alert("Post created successfully!");
      navigate("/feed");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message || "Failed to create post");
      alert(`Error: ${err.message || "Failed to create post"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: isDarkMode ? "#e0e0e0" : "#1a1a2e", marginBottom: "2rem" }}>
        New Post
      </h2>
      {error && (
        <div style={{ 
          color: '#fff', 
          backgroundColor: '#e94560',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '10px' 
        }}>
          {error}
        </div>
      )}
      <input 
        value={title}
        onChange={e => setTitle(e.target.value)} 
        placeholder="Title" 
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '15px',
          borderRadius: '4px',
          border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
          backgroundColor: isDarkMode ? "#1a1a2e" : "#fff",
          color: isDarkMode ? "#e0e0e0" : "#333",
          fontSize: '16px'
        }}
      />
      <textarea 
        value={content}
        onChange={e => setContent(e.target.value)} 
        placeholder="Content" 
        disabled={loading}
        style={{
          width: '100%',
          minHeight: '200px',
          padding: '12px',
          marginBottom: '15px',
          borderRadius: '4px',
          border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
          backgroundColor: isDarkMode ? "#1a1a2e" : "#fff",
          color: isDarkMode ? "#e0e0e0" : "#333",
          fontSize: '16px',
          resize: 'vertical'
        }}
      />
      <button 
        onClick={handleSubmit} 
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: isDarkMode ? "#0f3460" : "#3498db",
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {loading ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
}
