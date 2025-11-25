import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        console.error(err);
        }
    };

    return (
    // This div centers everything on the page
    <div className="login-page-container">
      {/* This div is the white card for the form */}
        <div className="login-card">
        <h2>Admin Panel Login</h2>
        <form onSubmit={handleSubmit}>
            {error && <p className="login-error">{error}</p>}
            <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            </div>
            <div className="form-group">
            <label htmlFor="password">Password</label>
                <input
                    // 2. Dynamically set the input type based on state
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>

          {/* 3. Add the checkbox toggle */}
          <div className="show-password-toggle">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
    );
}

export default LoginPage;