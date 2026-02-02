import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getComments, createComment } from "../api/postsApi";
import { useTheme } from "../context/ThemeContext";

export default function Comments() {
  const { id } = useParams();
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const { isDarkMode } = useTheme();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getComments(id),
    refetchInterval: 2000 // Refetch every 2 seconds for real-time updates
  });

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = localStorage.getItem("token");
      return await createComment(newComment, token);
    },
    onMutate: async (newComment) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", id] });
      
      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(["comments", id]);
      
      // Optimistically update with temporary comment
      const optimisticComment = {
        ...newComment,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      queryClient.setQueryData(["comments", id], (old = []) => [...old, optimisticComment]);
      
      // Clear input immediately for better UX
      setCommentText("");
      
      return { previousComments, commentText };
    },
    onError: (err, variables, context) => {
      // Revert to previous value on error
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", id], context.previousComments);
      }
      // Restore the comment text
      if (context?.commentText) {
        setCommentText(context.commentText);
      }
      console.error("Comment error:", err);
      alert("Failed to post comment. Please try again.");
    },
    onSuccess: () => {
      // Invalidate to get the real data from server
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    }
  });

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    mutation.mutate({
      postId: parseInt(id),
      content: commentText,
      authorId: 1, // In real app, get from auth context
      author: {
        id: 1,
        username: "current_user",
        displayName: "Current User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=current_user"
      }
    });
  };

  if (isLoading) return <div className="loader" style={{ color: isDarkMode ? "#e0e0e0" : "#333" }}>Loading comments...</div>;

  return (
    <div className="comments" style={{ marginTop: "2rem" }}>
      <h3 style={{ color: isDarkMode ? "#e0e0e0" : "#1a1a2e" }}>Comments ({comments?.length || 0})</h3>
      
      {/* Comment Input */}
      <div style={{ marginBottom: "1.5rem" }}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "10px",
            borderRadius: "4px",
            border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
            marginBottom: "10px",
            backgroundColor: isDarkMode ? "#1a1a2e" : "#fff",
            color: isDarkMode ? "#e0e0e0" : "#333"
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending || !commentText.trim()}
          style={{
            padding: "8px 16px",
            backgroundColor: isDarkMode ? "#0f3460" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: mutation.isPending ? "not-allowed" : "pointer"
          }}
        >
          {mutation.isPending ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {/* Comments List */}
      <div>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                padding: "15px",
                marginBottom: "10px",
                backgroundColor: isDarkMode ? "#1a1a2e" : "#f5f5f5",
                borderRadius: "8px",
                border: `1px solid ${isDarkMode ? "#2e2e3e" : "#e0e0e0"}`
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <img
                  src={comment.author?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                  alt={comment.author?.displayName}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    marginRight: "10px"
                  }}
                />
                <div>
                  <strong style={{ color: isDarkMode ? "#e0e0e0" : "#333" }}>
                    {comment.author?.displayName || "Anonymous"}
                  </strong>
                  <small style={{ marginLeft: "10px", color: isDarkMode ? "#888" : "#666" }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
              <p style={{ margin: 0, color: isDarkMode ? "#b0b0b0" : "#333" }}>
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: isDarkMode ? "#888" : "#666" }}>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
