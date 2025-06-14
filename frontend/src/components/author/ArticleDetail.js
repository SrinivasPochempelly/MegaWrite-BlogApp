import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [flashMessage, setFlashMessage] = useState(localStorage.getItem('flashMessage') || '');
  const { articleId } = useParams();
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

    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/author-api/articles/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedArticles = response.data.Articles || response.data.articles || [];
        const foundArticle = fetchedArticles.find((a) => a.articleId === articleId);
        if (foundArticle) {
          setArticle(foundArticle);
          setError('');
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch article.');
      } finally {
        localStorage.removeItem('flashMessage');
        setFlashMessage('');
      }
    };
    fetchArticle();
  }, [articleId, username, token, navigate, role]);

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container-fluid text-center mt-5">
        <h4 className="fw-bold">Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="col-12 col-md-8 col-lg-6 article-detail">
        {flashMessage && <div className="alert alert-warning text-center">{flashMessage}</div>}
        <div className="card shadow-lg animate__fadeIn">
          <div className="card-body">
            <span className="badge bg-primary mb-3">{article.category}</span>
            <h1 className="card-title fw-bold mb-4">{article.title}</h1>
            <div className="d-flex justify-content-between text-muted mb-4">
              <small>By: {article.username}</small>
              <small>{formatDate(article.dateOfModification)}</small>
            </div>
            {article.images && article.images.length > 0 && (
              <div className="article-image-wrapper mb-4">
                <div id={`detail-carousel-${article.articleId}`} className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {article.images.map((image, index) => (
                      <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img
                          src={image.url}
                          alt={image.caption}
                          className="d-block w-100 detail-img img-fluid"
                        />
                        <div className="image-overlay">
                          <p className="image-caption">{image.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {article.images.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#detail-carousel-${article.articleId}`}
                        data-bs-slide="prev"
                      >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#detail-carousel-${article.articleId}`}
                        data-bs-slide="next"
                      >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            <p className="card-text">{article.content}</p>
            <div className="mb-3">
              <h5 className="mb-3 fw-bold">Comments</h5>
              {article.comments && article.comments.length > 0 ? (
                article.comments.map((comment, index) => (
                  <div key={index} className="mb-2">
                    <p>
                      <strong>{comment.username}</strong> ({formatDate(comment.createdAt)}): {comment.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted">No comments yet.</p>
              )}
            </div>
            <button className="btn btn-outline-primary mt-4 w-100" onClick={() => navigate('/author/articles')}>
              Back to Articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;