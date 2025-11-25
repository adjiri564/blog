import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';

function App() {
  return (
    <BrowserRouter>
      <header>
        {/* You can add your new header/nav design here */}
        <div className="container">
          <h1>
            <Link to="/">My Awesome Blog</Link>
          </h1>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;