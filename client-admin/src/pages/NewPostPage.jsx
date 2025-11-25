import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth

function NewPostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
  const { logout } = useAuth(); // 2. Get the logout function from context

  const handleSubmit = async (e) => {
        e.preventDefault();
    if (!title.trim() || !content.trim()) {
            setError('Title and content are required.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
      await apiClient.post('/posts', {
                title,
                content,
            });
            // On success redirect to the dashboard
            navigate('/');
        } catch (err) {
      // 3. Add specific error handling for 401 Unauthorized
      if (err.response?.status === 401) {
        setError(
          'Your session has expired. Please log out and log in again.'
        );
        // We can even log the user out automatically
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 3000);
      } else {
        setError('Failed to create post. Please try again');
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
    };

    return (
    // ... the JSX part of your component remains the same
        <div className="container post-form">
      <Link to="/">&larr; Back to Dashboard</Link>
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
    );
}

export default NewPostPage;