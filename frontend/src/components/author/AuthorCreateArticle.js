import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthorCreateArticle() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  });
  const [images, setImages] = useState([]);
  const [captions, setCaptions] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || !username || role !== 'author') {
      localStorage.setItem('flashMessage', 'Please log in as an author.');
      navigate('/author/auth');
    }
  }, [token, username, role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleCaptionChange = (index, value) => {
    setCaptions({ ...captions, [index]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    const articleData = {
      ...formData,
      username,
      articleId: Date.now().toString(),
    };
    form.append('articleData', JSON.stringify(articleData));
    images.forEach((image, index) => {
      form.append('images', image);
      if (captions[index]) {
        form.append(`caption_${image.name}`, captions[index]);
      }
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/author-api/article`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(response.data.message);
      setError('');
      setTimeout(() => navigate('/author/articles'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article');
      setSuccess('');
    }
  };

  return (
    <div className="container-fluid">
      <div className="form-container">
        <div className="card shadow-lg animate__fadeIn">
          <div className="card-body">
            <h3 className="card-title text-center mb-4 fw-bold">Create Article</h3>
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
              <div className="mb-3">
                <label className="form-label fw-bold">Upload Images</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleImageChange}
                />
              </div>
              {images.map((image, index) => (
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
              <button type="submit" className="btn btn-primary w-100">Create Article</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorCreateArticle;