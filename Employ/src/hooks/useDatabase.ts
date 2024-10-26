import axios from 'axios';
import { useState, useEffect } from 'react';
import { db } from '../services/database'; // Adjust the path based on your project structure
import type { Post, Answer } from '../services/types';

const API_URL = 'http://localhost:3000/api';

export const useDatabase = () => {
  // User Operations
  const createUser = async (email: string, name?: string) => {
    try {
      const response = await axios.post(`${API_URL}/users`, { email, name });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  // Recommendation Operations
  const saveRecommendation = async (userId: string, data: any) => {
    try {
      const response = await axios.post(`${API_URL}/recommendations`, {
        userId,
        ...data,
      });
      return response.data;
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw error;
    }
  };

  const getRecommendations = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  };

  // Message Operations
  const saveMessage = async (userId: string, content: string) => {
    try {
      const response = await axios.post(`${API_URL}/messages`, { userId, content });
      return response.data;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  };

  const getMessages = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/messages/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  };

  // Wellness Score Operations
  const saveWellnessScore = async (userId: string, score: number) => {
    try {
      const response = await axios.post(`${API_URL}/wellness-scores`, { userId, score });
      return response.data;
    } catch (error) {
      console.error('Error saving wellness score:', error);
      throw error;
    }
  };

  const getWellnessScores = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/wellness-scores/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting wellness scores:', error);
      throw error;
    }
  };

  // Resource Operations
  const getResources = async () => {
    try {
      const response = await axios.get(`${API_URL}/resources`);
      return response.data;
    } catch (error) {
      console.error('Error getting resources:', error);
      throw error;
    }
  };

  // SQLite Operations for Posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await db.getPosts();
      setPosts(fetchedPosts);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (post: Post) => {
    await db.createPost(post);
    await loadPosts();
  };

  const createAnswer = async (postId: string, answer: Answer) => {
    await db.createAnswer(postId, answer);
    await loadPosts();
  };

  const handleVote = async (postId: string, type: 'post' | 'answer', answerId?: string) => {
    if (type === 'post') {
      await db.updatePostVotes(postId, 1);
    } else if (answerId) {
      await db.updateAnswerVotes(answerId, 1);
    }
    await loadPosts();
  };

  const handleAcceptAnswer = async (postId: string, answerId: string) => {
    await db.updateAnswerAcceptedStatus(answerId, true);
    await loadPosts();
  };

  return {
    createUser,
    saveRecommendation,
    getRecommendations,
    saveMessage,
    getMessages,
    saveWellnessScore,
    getWellnessScores,
    getResources,
    posts,
    loading,
    createPost,
    createAnswer,
    handleVote,
    handleAcceptAnswer,
  };
};
export default useDatabase;
