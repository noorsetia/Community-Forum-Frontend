const BASE_URL = "https://community-forum-backend-4g6j.onrender.com";

export const getPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts?_sort=createdAt&_order=desc`);
  return res.json();
};

export const getPostById = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  return res.json();
};

export const login = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

export const register = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Registration failed: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

export const createPost = async (post, token) => {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify({
      ...post,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      commentCount: 0,
      tags: [],
      views: 0
    })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create post: ${res.status} ${errorText}`);
  }
  
  return res.json();
};

export const getComments = async (postId) => {
  const res = await fetch(`${BASE_URL}/comments?postId=${postId}&_sort=createdAt&_order=asc`);
  return res.json();
};

export const createComment = async (comment, token) => {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify({
      ...comment,
      createdAt: new Date().toISOString()
    })
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create comment: ${res.status}`);
  }
  
  return res.json();
};

export const likePost = async (postId, userId, token) => {
  // First, get the current post
  const postRes = await fetch(`${BASE_URL}/posts/${postId}`);
  const post = await postRes.json();
  
  // Check if user already liked
  if (post.likedBy && post.likedBy.includes(userId)) {
    return post; // Already liked
  }
  
  // Update the post with new like
  const updatedPost = {
    ...post,
    likes: (post.likes || 0) + 1,
    likedBy: [...(post.likedBy || []), userId]
  };
  
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify({
      likes: updatedPost.likes,
      likedBy: updatedPost.likedBy
    })
  });
  
  if (!res.ok) {
    throw new Error(`Failed to like post: ${res.status}`);
  }
  
  return res.json();
};

export const unlikePost = async (postId, userId, token) => {
  // First, get the current post
  const postRes = await fetch(`${BASE_URL}/posts/${postId}`);
  const post = await postRes.json();
  
  // Check if user actually liked it
  if (!post.likedBy || !post.likedBy.includes(userId)) {
    return post; // Not liked
  }
  
  // Update the post by removing the like
  const updatedPost = {
    ...post,
    likes: Math.max((post.likes || 0) - 1, 0),
    likedBy: (post.likedBy || []).filter(id => id !== userId)
  };
  
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify({
      likes: updatedPost.likes,
      likedBy: updatedPost.likedBy
    })
  });
  
  if (!res.ok) {
    throw new Error(`Failed to unlike post: ${res.status}`);
  }
  
  return res.json();
};

export const getLikes = async (postId) => {
  const res = await fetch(`${BASE_URL}/likes?postId=${postId}`);
  return res.json();
};
