import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';

const EditPostPage = () => {
    const { postId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [published, setPublished] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
                const response = await apiClient.get(`/posts/${postId}`);
                const post = response.data;
                setTitle(post.title);
                setContent(post.content);
                setPublished(post.published);
      } catch (err) {
        // Add the same 401 handling here
        if (err.response?.status === 401) {
            setError(
            'Your session has expired. Please log out and log in again.'
            );
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 3000);
      } else {
          setError('Failed to load post');
      }
      console.error(err);
    }
    };

        fetchPost();
  }, [postId, logout, navigate]); // Add logout and navigate to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title.trim() || !content.trim()) {
            setError('Title and content are required');
            return;
        }
        setIsSubmitting(true);
        setError('');
    try {
        await apiClient.put(`/posts/${postId}`, {
                title,
                content,
        published,
            });
            navigate('/');
    } catch (err) {
        if (err.response?.status === 401) {
            setError(
            'Your session has expired. Please log out and log in again.'
            );
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 3000);
      } else {
        setError('Failed to update post');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
    };

    return (
        <div className="container post-form">
        <Link to="/">&larr; Back to Dashboard</Link>
        <h2>Edit Post</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="title">Title:</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            </div>
            <div>
            <label htmlFor="content">Content:</label>
            <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="10"
                required
            ></textarea>
            </div>
            <div>
            <label>
            Published:
                <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                />
            </label>
            </div>
            <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
        </form>
        </div>
    );
};
export default EditPostPage;