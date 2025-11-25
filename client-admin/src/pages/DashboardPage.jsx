import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import apiClient from '../api';

function DashboardPage() {
    const { logout } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchPosts = async() => {
            try{
                    const response = await apiClient.get('/posts');
                setPosts(response.data)
                } catch (err) {
                    setError('Failed to fetch posts.');
                console.error(err)
            } finally{
                setLoading(false)
                }
        };

        fetchPosts();
    }, [])

        const handleDelete = async (postId) => {
        // 1. Ask for confirmation before proceeding
        const isConfirmed = window.confirm(
          'Are you sure you want to delete this post? This action cannot be undone.'
        );

        // 2. Only proceed if the user confirmed
        if (isConfirmed) {
          try {
            // Make the DELETE request
            await apiClient.delete(`/posts/${postId}`);

            // Update the posts array to remove the deleted post
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (err) {
                setError('Failed to delete post.');
                console.error(err);
            }
        }
    };

    if(loading) return <p>Loading posts...</p>;
    if(error) return <p style={{color:'red'}}>{error}</p>;

    return(
        <div className="container">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <button onClick={logout}>Log Out</button>
            </header>

            <nav className="admin-nav">
                <Link to='/signup'>Create New User</Link>
                <Link to='/new-post'>+ New Post</Link>
            </nav>

            <h2>Manage Posts</h2>
            <table className="post-list-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {posts.map((post) => (
                    <tr key={post.id}>
                        <td>{post.title}</td>
                        <td>{post.published ? 'Published' : 'Draft'}</td>
                        <td className="actions">
                            <Link to={`/edit-post/${post.id}`} className="edit">Edit</Link>
                            <button onClick={() => handleDelete(post.id)} className="delete">Delete</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default DashboardPage;    