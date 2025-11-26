import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts`);
                setPosts(response.data);
            } catch (err) {
        setError('Failed to fetch posts.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>{error}</p>;

    return (
    <div className="container">
      <ul className="post-list">
                    {posts.map((post) => (
          <li key={post.id} className="post-item">
            <h2>
                                <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <div className="meta">
              by {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <p className="excerpt">
              {post.content.substring(0, 200)}...
            </p>
            <Link to={`/posts/${post.id}`} className="read-more">
              Read More
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;