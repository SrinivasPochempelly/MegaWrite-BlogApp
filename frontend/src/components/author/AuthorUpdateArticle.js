import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AuthorUpdateArticle() {
  const [formData, setFormData] = useState({ title: '', category: '', content: '' });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [captions, setCaptions] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        const article = fetchedArticles.find((a) => a.articleId === articleId && a.status);
        if (article) {
          setFormData({ title: article.title, category: article.category, content: article.content });
          setExistingImages(article.images || []);
          setError('');
        } else {
          setError('Article not found or deleted.');
        }
      } catch (err) {
        console.error('Fetch error:', err.response || err);
        setError(err.response?.data?.message || 'Failed to fetch article.');
      }
    };
    fetchArticle();
  }, [articleId, username, token, navigate, role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleCaptionChange = (index, value) => {
    setCaptions({ ...captions, [index]: value });
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !username) {
      setError('Please log in to update articles.');
      return;
    }
    const form = new FormData();
    const articleData = {
      articleId,
      title: formData.title,
      category: formData.category,
      content: formData.content,
      username,
      existingImages,
    };
    form.append('articleData', JSON.stringify(articleData));
    newImages.forEach((image, index) => {
      form.append('images', image);
      if (captions[index]) {
        form.append(`caption_${image.name}`, captions[index]);
      }
    });
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/author-api/article`, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(response.data.message);
      setError('');
      alert("Article Updated!");
      setTimeout(() => navigate('/author/articles'), 600);
    } catch (err) {
      console.error('Update error:', err.response || err);
      setError(err.response?.data?.message || 'Failed to update article.');
      setSuccess('');
    }
  };

  const handleBack = () => {
    navigate('/author/articles');
  };

  return (
    <div className="container-fluid">
      <div className="form-container">
        <div className="card shadow-lg animate__fadeIn">
          <div className="card-body">
            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={handleBack}
            >
              Back to Articles
            </button>
            <h3 className="card-title text-center mb-4 fw-bold">Update Article</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Category</label>
                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Content</label>
                <textarea
                  name="content"
                  className="form-control"
                  value={formData.content}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>
              {existingImages.length > 0 && (
                <div className="mb-3">
                  <h5 className="mb-3 fw-bold">Existing Images</h5>
                  <div className="article-image-wrapper">
                    <div id={`carousel-${articleId}`} className="carousel slide" data-bs-ride="carousel">
                      <div className="carousel-inner">
                        {existingImages.map((image, imgIndex) => (
                          <div key={imgIndex} className={`carousel-item ${imgIndex === 0 ? 'active' : ''}`}>
                            <img
                              src={image.url}
                              alt={image.caption || `Image ${imgIndex + 1}`}
                              className="d-block w-100 update-img img-fluid"
                            />
                            <div className="image-overlay">
                              <p className="image-caption">{image.caption || 'No caption'}</p>
                            </div>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                              onClick={() => handleRemoveExistingImage(imgIndex)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      {existingImages.length > 1 && (
                        <>
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#carousel-${articleId}`}
                            data-bs-slide="prev"
                          >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#carousel-${articleId}`}
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
                <label className="form-label fw-bold">Upload New Images</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleImageChange}
                />
              </div>
              {newImages.map((image, index) => (
                <div key={index} className="mb-3">
                  <label className="form-label fw-bold">Caption for {image.name}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={captions[index] || ''}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                  />
                </div>
              ))}
              <button type="submit" className="btn btn-primary w-100">Update Article</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorUpdateArticle;