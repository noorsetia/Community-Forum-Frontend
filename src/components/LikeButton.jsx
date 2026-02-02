import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostById, likePost, unlikePost } from "../api/postsApi";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

export default function LikeButton({ post }) {
  const queryClient = useQueryClient();
  const currentUserId = 1; // In real app, get from auth context
  const { isDarkMode } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch the latest post data for real-time updates
  const { data: latestPost = post, isLoading } = useQuery({
    queryKey: ["post", post.id],
    queryFn: () => getPostById(post.id),
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
    initialData: post
  });

  // Use the post's likes field from db.json
  const likeCount = latestPost.likes || 0;
  const isLiked = (latestPost.likedBy || []).includes(currentUserId);

  const likeMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      return await likePost(post.id, currentUserId, token);
    },
    onMutate: async () => {
      setIsProcessing(true);
      await queryClient.cancelQueries({ queryKey: ["post", post.id] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      
      const previousPost = queryClient.getQueryData(["post", post.id]);
      
      // Optimistically update the post
      queryClient.setQueryData(["post", post.id], (old) => ({
        ...old,
        likes: (old.likes || 0) + 1,
        likedBy: [...(old.likedBy || []), currentUserId]
      }));
      
      return { previousPost };
    },
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(["post", post.id], context.previousPost);
      }
      console.error("Like error:", err);
      alert("Failed to like post. Please try again.");
    },
    onSettled: () => {
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: ["post", post.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      return await unlikePost(post.id, currentUserId, token);
    },
    onMutate: async () => {
      setIsProcessing(true);
      await queryClient.cancelQueries({ queryKey: ["post", post.id] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      
      const previousPost = queryClient.getQueryData(["post", post.id]);
      
      // Optimistically update the post
      queryClient.setQueryData(["post", post.id], (old) => ({
        ...old,
        likes: Math.max((old.likes || 0) - 1, 0),
        likedBy: (old.likedBy || []).filter(id => id !== currentUserId)
      }));
      
      return { previousPost };
    },
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(["post", post.id], context.previousPost);
      }
      console.error("Unlike error:", err);
      alert("Failed to unlike post. Please try again.");
    },
    onSettled: () => {
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: ["post", post.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing || isLoading) return;
    
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isProcessing || isLoading}
      style={{
        padding: "8px 16px",
        backgroundColor: isLiked ? "#e94560" : (isDarkMode ? "#0f3460" : "#3498db"),
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: (isProcessing || isLoading) ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        fontSize: "14px",
        opacity: (isProcessing || isLoading) ? 0.7 : 1
      }}
    >
      {isLiked ? "❤️" : "🤍"} {likeCount}
    </button>
  );
}
