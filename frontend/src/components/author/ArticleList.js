import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

function ArticleList({ userType }) {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [flashMessage, setFlashMessage] = useState(localStorage.getItem('flashMessage') || '');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || !username || role !== 'author') {
      localStorage.setItem('flashMessage', 'Please log in as an author.');
      navigate('/author/auth');
      return;
    }

    const fetchArticles = async () => {
      try {
        let url = `${process.env.REACT_APP_API_URL}/author-api/articles/${username}`;
        if (userType === 'author') {
          url += `?status=${showDeleted ? 'false' : 'true'}`;
        }
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Backend response:', response.data);
        const fetchedArticles = response.data.Articles || [];
        setArticles(fetchedArticles);
        setError('');
      } catch (err) {
        console.error('Fetch error:', err.response || err);
        setError(err.response?.data?.message || 'Failed to fetch articles');
        setArticles([]);
      } finally {
        localStorage.removeItem('flashMessage');
        setFlashMessage('');
      }
    };
    fetchArticles();
  }, [userType, username, token, showDeleted, navigate, role]);

  const handleSoftDelete = async (articleId) => {
    if (!token || !username) {
      setError('Please log in to delete articles.');
      return;
    }
    if (!articleId) {
      setError('Invalid article ID');
      console.error('Invalid articleId:', articleId);
      return;
    }
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }
    try {
      console.log('Deleting article:', { articleId, username });
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/author-api/article/soft-delete/${articleId}`,
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Delete response:', response.data);
      setArticles(articles.filter((a) => a.articleId !== articleId));
      setError('');
      alert(response.data.message || 'Article deleted successfully');
    } catch (err) {
      console.error('Delete error:', err.response || err);
      const errorMessage = err.response?.data?.message || 'Failed to delete article';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleRestore = async (articleId) => {
    if (!token || !username) {
      setError('Please log in to restore articles.');
      return;
    }
    if (!articleId) {
      setError('Invalid article ID');
      console.error('Invalid articleId:', articleId);
      return;
    }
    if (!window.confirm('Are you sure you want to restore this article?')) {
      return;
    }
    try {
      console.log('Restoring article:', { articleId, username });
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/author-api/article/restore/${articleId}`,
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Restore response:', response.data);
      setArticles(articles.filter((a) => a.articleId !== articleId));
      setError('');
      alert(response.data.message || 'Article restored successfully');
    } catch (err) {
      console.error('Restore error:', err.response || err);
      const errorMessage = err.response?.data?.message || 'Failed to restore article';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div className="container-fluid article-list">
      {flashMessage && <div className="alert alert-warning text-center">{flashMessage}</div>}
      <h3 className="text-center mb-5 display-4 fw-bold">
        {userType === 'author' ? (showDeleted ? 'Deleted Articles' : 'Your Articles') : 'Latest Articles'}
      </h3>
      {userType === 'author' && (
        <div className="text-center mb-4">
          <button
            className={`btn ${showDeleted ? 'btn-outline-primary' : 'btn-primary'} me-2`}
            onClick={() => setShowDeleted(false)}
          >
            Active Articles
          </button>
          <button
            className={`btn ${showDeleted ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowDeleted(true)}
          >
            Deleted Articles
          </button>
        </div>
      )}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {articles.length === 0 && !error && (
        <div className="alert alert-info text-center">
          {showDeleted ? 'No deleted articles found.' : 'No articles found.'}
        </div>
      )}
      <div className="row g-4">
        {articles.map((article, index) => (
          <div key={article.articleId} className="col-md-4">
            <div className={`card article-card shadow-lg h-100 animate__fadeIn`} style={{ animationDelay: `${index * 0.1}s` }}>
              {article.images && article.images.length > 0 ? (
                <div className="article-image-wrapper">
                  <div id={`carousel-${article.articleId}`} className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {article.images.map((image, imgIndex) => (
                        <div key={imgIndex} className={`carousel-item ${imgIndex === 0 ? 'active' : ''}`}>
                          <img
                            src={image.url}
                            alt={image.caption || `Image ${imgIndex + 1}`}
                            className="d-block w-100 card-img-top img-fluid"
                          />
                          <div className="image-overlay">
                            <p className="image-caption">{image.caption || 'No caption'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {article.images.length > 1 && (
                      <>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target={`#carousel-${article.articleId}`}
                          data-bs-slide="prev"
                        >
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target={`#carousel-${article.articleId}`}
                          data-bs-slide="next"
                        >
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <img src="/placeholder.jpg" alt="No image" className="card-img-top img-fluid" />
              )}
              <div className="card-body">
                <span className="badge bg-primary mb-2">{article.category}</span>
                <h4 className="card-title fw-bold">{article.title}</h4>
                <p className="card-text text-muted">{article.content.substring(0, 100)}...</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">By: {article.username}</small>
                  <small className="text-muted">{formatDate(article.dateOfModification)}</small>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0">
                {userType === 'author' && (
                  <div className="d-flex gap-2 flex-wrap">
                    {!showDeleted ? (
                      <>
                        <button
                          className="btn btn-outline-primary flex-grow-1"
                          onClick={() => navigate(`/author/update/${article.articleId}`)}
                        >
                          Edit Article
                        </button>
                        <button
                          className="btn btn-primary flex-grow-1"
                          onClick={() => navigate(`/author/article/${article.articleId}`)}
                        >
                          Read More
                        </button>
                        <button
                          className="btn btn-danger flex-grow-1"
                          onClick={() => handleSoftDelete(article.articleId)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-success flex-grow-1"
                        onClick={() => handleRestore(article.articleId)}
                      >
                        Restore
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>  
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleList;