import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentForm from '../components/CommentForm';

const API_URL = import.meta.env.VITE_API_URL;

function PostPage() {
  const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/posts/${postId}`);
            setPost(response.data);
      } catch (err) {
        setError('Post not found or could not be loaded.');
                console.error(err);
      } finally {
        setLoading(false);
        }
        };

        fetchPost();
    }, [postId]);

    const handleCommentPosted = (newComment) => {
        setPost((prevPost) => ({
            ...prevPost,
        comments: [...prevPost.comments], newComment,
        }));
    };

    if (loading) return <p>Loading post...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>Post not found.</p>;

    return (
    <div className="container single-post">
      <h1>{post.title}</h1>
      <div className="meta">
        by {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <div className="content">{post.content}</div>
      <section className="comment-section">
            <h3>Comments</h3>
        <ul className="comment-list">
          {post.comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-avatar">
                {/* Display the first letter of the author's name */}
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="comment-body">
                <div className="comment-content">{comment.content}</div>
                <div className="comment-meta">
                  <strong>{comment.authorName}</strong> on{' '}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
    </div>
            </li>
          ))}
        </ul>
        <CommentForm postId={postId} onCommentPosted={handleCommentPosted} />
      </section>
    </div>
  );
}

export default PostPage;