import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

function SignUpPage() {
    const { token } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    setError('');
    setSuccess('');

    // Add client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        `${API_URL}/auth/signup`,
        { username, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('New admin user created successfully! Redirecting to dashboard...');
            setTimeout(() => {
        navigate('/'); //  Redirect to dashboard on success
      }, 2000);
    } catch (err) {
      const errMessage =
        err.response?.data?.message ||
        'Registration failed! Please try again.';
            setError(errMessage);
            console.error(err);
    } finally {
      setIsSubmitting(false);
        }
    };

    return (
    <div className="container post-form">
      <Link to="/">&larr; Back to Dashboard</Link>
            <h2>Create New Admin User</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        className="username-input" // Add this class
                        value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input 
            type="email" // Use type="email" for better validation
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
                </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* 5. Add password requirements hint */}
          <p className="form-hint">Must be at least 8 characters long.</p>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {/* 6. Update button to show submitting state */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating User...' : 'Create User'}
        </button>
      </form>
    </div>
    );
}

export default SignUpPage;