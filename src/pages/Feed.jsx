import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/postsApi";
import PostCard from "../components/PostCard";
import { useTheme } from "../context/ThemeContext";

export default function Feed() {
  const { isDarkMode } = useTheme();
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts
  });

  if (isLoading) return <p style={{ color: isDarkMode ? "#e0e0e0" : "#333" }}>Loading...</p>;
  if (error) return <p style={{ color: "#e94560" }}>Error loading posts: {error.message}</p>;
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p style={{ color: isDarkMode ? "#e0e0e0" : "#333" }}>No posts found</p>;
  }

  // Sort posts by createdAt date (newest first)
  const sortedPosts = [...data].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB - dateA; // Descending order (newest first)
  });

  return (
    <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: isDarkMode ? "#e0e0e0" : "#1a1a2e", marginBottom: "2rem" }}>Forum Feed</h1>
      {sortedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
