import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

function UserArticleList() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [flashMessage, setFlashMessage] = useState(localStorage.getItem('flashMessage') || '');
useEffect(() => {
  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-api/articles`);
      console.log('API Response:', response.data);
      const activeArticles = response.data.articles
        .filter((article) => article.status)
        .sort((a, b) => new Date(b.dateOfModification) - new Date(a.dateOfModification)); // Sort by latest first
      console.log('Active Articles:', activeArticles);
      setArticles(activeArticles);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch articles';
      console.error('Fetch Error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
      localStorage.removeItem('flashMessage');
      setFlashMessage('');
    }
  };
  fetchArticles();
}, []);

  if (loading) {
    return (
      <div className="container-fluid mt-5 text-center">
        <h4 className="fw-bold">Loading articles...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {flashMessage && <div className="alert alert-warning text-center">{flashMessage}</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {articles.length === 0 && !error ? (
        <div className="alert alert-info text-center">No articles available.</div>
      ) : (
        <div className="row g-4">
          {articles.map((article) => (
            <div key={article.articleId} className="col-md-4 d-flex justify-content-center">
              <div className="card article-card shadow-lg animate__fadeIn custom-article-card">
                <div className="card-body">
                  <span className="badge bg-primary mb-3">{article.category}</span>
                  <h5 className="card-title fw-bold">{article.title}</h5>
                  <div className="d-flex justify-content-between text-muted mb-1">
                    <small>By: {article.username}</small>
                    <small>{formatDate(article.dateOfModification)}</small>
                  </div>
                  {article.images && article.images.length > 0 ? (
                    <div className="article-image-wrapper mb-3">
                      <div id={`carousel-${article.articleId}`} className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                          {article.images.map((image, imgIndex) => (
                            <div
                              key={imgIndex}
                              className={`carousel-item ${imgIndex === 0 ? 'active' : ''}`}
                            >
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
                    <img src="/placeholder.jpg" alt="No image" className="card-img-top img-fluid mb-3" />
                  )}
                  <p className="card-text">
                    {article.content.length > 100
                      ? `${article.content.substring(0, 100)}...`
                      : article.content}
                  </p>
                  <div className="mb-3">
                    <h6 className="fw-bold">Latest Comments</h6>
                    {article.comments && article.comments.length > 0 ? (
                      [...article.comments]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 3)
                        .map((comment, index) => (
                          <div key={index} className="mb-2">
                            <p className="mb-0">
                              <strong>{comment.username}</strong> (
                              {formatDate(comment.createdAt)}): {comment.comment}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-muted">No comments yet.</p>
                    )}
                  </div>
                  <Link to={`/article/${article.articleId}`} className="btn btn-primary">Read More</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserArticleList;