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

function UserArticleDetail() {
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [flashMessage, setFlashMessage] = useState(localStorage.getItem('flashMessage') || '');
  const { id } = useParams();
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !username) {
      localStorage.setItem('flashMessage', 'Please log in to view this article.');
      navigate('/user/auth');
      return;
    }

    const fetchArticle = async () => {
      try {
        const response = await axios.get('http://localhost:9898/user-api/articles');
        const article = response.data.articles.find((a) => String(a.articleId) === String(id) && a.status);
        if (article) {
          setArticle(article);
          setError('');
        } else {
          setError('Article not found or deleted');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch article');
      } finally {
        localStorage.removeItem('flashMessage');
        setFlashMessage('');
      }
    };
    fetchArticle();
  }, [id, token, username, navigate]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token || !username) {
      setError('Please log in to comment');
      return;
    }
    if (role === 'author') {
      setError('Authors cannot comment on articles');
      return;
    }
    const commentObj = {
      username,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    try {
      const response = await axios.put(
        `http://localhost:9898/user-api/comment/${id}`,
        commentObj,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(response.data.message);
      setError('');
      setComment('');
      const updatedResponse = await axios.get('http://localhost:9898/user-api/articles');
      const updatedArticle = updatedResponse.data.articles.find((a) => String(a.articleId) === String(id));
      setArticle(updatedArticle);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
      setSuccess('');
    }
  };

  const handleBack = () => {
    navigate('/articles');
  };

  if (!article) {
    return (
      <div className="container-fluid">
        <div className="card shadow-lg animate__fadeIn">
          <div className="card-body">
            {flashMessage && <div className="alert alert-warning">{flashMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <p className="text-center">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="container-fluid">
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        {flashMessage && <div className="alert alert-warning text-center">{flashMessage}</div>}
        <div className="card shadow-lg animate__fadeIn">
          <div className="card-body">
            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={handleBack}
            >
              Back to Articles
            </button>
            <h3 className="card-title text-center mb-4 fw-bold">{article.title}</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <p><strong>Category:</strong> <span className="badge bg-primary">{article.category}</span></p>
            <p><strong>Author:</strong> {article.username}</p>
            <p><strong>Content:</strong> {article.content}</p>
            {article.images && article.images.length > 0 && (
              <div className="mb-3">
                <h5 className="mb-3 fw-bold">Images</h5>
                <div className="article-image-wrapper">
                  <div id={`carousel-${article.articleId}`} className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {article.images.map((image, imgIndex) => (
                        <div key={imgIndex} className={`carousel-item ${imgIndex === 0 ? 'active' : ''}`}>
                          <img
                            src={image.url}
                            alt={image.caption || `Image ${imgIndex + 1}`}
                            className="d-block w-100 detail-img img-fluid"
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
              </div>
            )}
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
            {role !== 'author' && (
              <form onSubmit={handleCommentSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Add Comment</label>
                  <textarea
                    className="form-control"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Post Comment</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default UserArticleDetail;