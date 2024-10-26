import React, { useState } from 'react';
import { format } from 'date-fns';
import { ThumbsUp, MessageCircle, Check, Send } from 'lucide-react';
import type { Post } from '../services/types';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../hooks/useDatabase';

const ForumPage: React.FC = () => {
  const { user } = useAuth();
  const { posts, loading, createPost, createAnswer, handleVote, handleAcceptAnswer } = useDatabase();
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Health' });
  const [newAnswers, setNewAnswers] = useState<Record<string, string>>({});
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const post: Post = {
      id: Date.now().toString(),
      ...newPost,
      authorId: user.id,
      createdAt: new Date().toISOString(),
      votes: 0,
      answers: []
    };

    await createPost(post);
    setNewPost({ title: '', content: '', category: 'Health' });
  };

  const handleCreateAnswer = async (postId: string) => {
    if (!user || !newAnswers[postId]?.trim()) return;

    const answer = {
      id: Date.now().toString(),
      content: newAnswers[postId],
      authorId: user.id,
      createdAt: new Date().toISOString(),
      votes: 0,
      isAccepted: false
    };

    await createAnswer(postId, answer);
    setNewAnswers(prev => ({ ...prev, [postId]: '' }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user && (
        <form onSubmit={handleCreatePost} className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Create a New Post</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              >
                <option>Health</option>
                <option>Work-Life Balance</option>
                <option>Career</option>
                <option>Legal Rights</option>
                <option>Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              Post Question
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(post.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleVote(post.id, 'post')}
                  className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition duration-200"
                >
                  <ThumbsUp size={18} />
                  <span>{post.votes}</span>
                </button>
                <button
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition duration-200"
                >
                  <MessageCircle size={18} />
                  <span>{post.answers.length}</span>
                </button>
              </div>
            </div>

            {(expandedPost === post.id || post.answers.length > 0) && (
              <div className="border-t bg-gray-50">
                {post.answers.map(answer => (
                  <div key={answer.id} className="p-6 border-b">
                    <p className="text-gray-600 mb-3">{answer.content}</p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleVote(post.id, 'answer', answer.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition duration-200"
                      >
                        <ThumbsUp size={16} />
                        <span>{answer.votes}</span>
                      </button>
                      {user?.id === post.authorId && !answer.isAccepted && (
                        <button
                          onClick={() => handleAcceptAnswer(post.id, answer.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-500 transition duration-200"
                        >
                          Mark as Best Answer
                        </button>
                      )}
                      {answer.isAccepted && (
                        <span className="flex items-center text-green-600">
                          <Check size={16} className="mr-1" />
                          Best Answer
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {user && expandedPost === post.id && (
                  <div className="p-6">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Write your answer..."
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                        value={newAnswers[post.id] || ''}
                        onChange={(e) => setNewAnswers(prev => ({ ...prev, [post.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => handleCreateAnswer(post.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Send size={16} className="mr-2" />
                        Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;
