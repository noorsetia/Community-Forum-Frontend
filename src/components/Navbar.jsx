import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const navbarStyle = {
    padding: "1rem 2rem",
    backgroundColor: isDarkMode ? "#1a1a2e" : "#2c3e50",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: "bold"
  };

  const buttonBaseStyle = {
    textDecoration: "none",
    padding: "0.5rem 1rem",
    color: "#fff",
    borderRadius: "4px",
    transition: "background-color 0.3s",
    border: "none",
    cursor: "pointer",
    fontSize: "14px"
  };

  return (
    <nav style={navbarStyle}>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link to="/feed" style={linkStyle}>
          Community Forum
        </Link>
        <Link to="/feed" style={{
          ...buttonBaseStyle,
          backgroundColor: isDarkMode ? "#0f3460" : "#34495e"
        }}>
          Feed
        </Link>
        <Link to="/new" style={{
          ...buttonBaseStyle,
          backgroundColor: isDarkMode ? "#16213e" : "#2c3e50"
        }}>
          + New Post
        </Link>
      </div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button 
          onClick={toggleTheme}
          style={{
            ...buttonBaseStyle,
            backgroundColor: isDarkMode ? "#533483" : "#f39c12",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {isDarkMode ? "🌙 Dark" : "☀️ Light"}
        </button>
        <button 
          onClick={handleLogout}
          style={{
            ...buttonBaseStyle,
            backgroundColor: "#e94560"
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
