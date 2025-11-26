import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const MAX_COMMENT_LENGTH = 500; // Define a max length for comments

function CommentForm({ postId, onCommentPosted }) {
    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');

  // 1. Add new state variables for a better UX
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!authorName.trim() || !content.trim()) {
      setError('Name and comment content are required.');
            return;
        }
    if (content.length > MAX_COMMENT_LENGTH) {
      setError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`);
      return;
    }


    setIsSubmitting(true); // Disable form
            setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
        authorName,
        content,
      });

      onCommentPosted(response.data);
      setSuccess('Your comment has been posted!'); // Show success message
      setAuthorName(''); // Clear form
      setContent('');

      // Hide success message after a few seconds
      setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
      setError('Failed to post comment. Please try again.');
            console.error(err);
    } finally {
      setIsSubmitting(false); // Re-enable form
        }
    };

  const charCount = content.length;
  const isOverLimit = charCount > MAX_COMMENT_LENGTH;

    return (
    <form onSubmit={handleSubmit} className="comment-form">
            <h4>Leave a Comment</h4>

      {/* 2. Display success or error messages */}
      {error && <p className="form-error" style={{color: 'red'}}>{error}</p>}
      {success && <p className="form-success" style={{color: 'green'}}>{success}</p>}

      <div className="form-group">
                <label htmlFor="authorName">Name:</label>
        <input
          type="text"
          id="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your Name"
                required
          disabled={isSubmitting}
                />
            </div>
      <div className="form-group">
                <label htmlFor="content">Comment:</label>
        <textarea
          id="content"
                value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What are your thoughts?"
                required
          disabled={isSubmitting}
                ></textarea>
        {/* 3. Add the character counter */}
        <div className={`char-counter ${isOverLimit ? 'over-limit' : ''}`} style={{color: isOverLimit ? 'red' : 'inherit'}}>
          {charCount}/{MAX_COMMENT_LENGTH}
            </div>
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Submit Comment'}
      </button>
    </form>
    );
}

export default CommentForm;