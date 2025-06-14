import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthorAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [flashMessage, setFlashMessage] = useState(localStorage.getItem('flashMessage') || '');
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      localStorage.removeItem('flashMessage');
      setFlashMessage('');
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${process.env.REACT_APP_API_URL}/author-api/login`, {
          userType: 'author',
          username: formData.username,
          password: formData.password,
        });
        if (response.data.message === 'login successful') {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', response.data.userData.username);
          localStorage.setItem('role', 'author');
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => navigate('/author/articles'), 1000);
        } else {
          setError(response.data.message);
        }
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}/author-api/author`, {
          userType: 'author',
          username: formData.username,
          password: formData.password,
          email: formData.email,
          isActive: true,
        });
        if (response.data.message === 'User registration Successful') {
          setSuccess('Registration successful! Please log in.');
          setIsLogin(true);
          setFormData({ username: '', password: '', email: '' });
        } else {
          setError(response.data.message);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || (isLogin ? 'Login failed' : 'Registration failed'));
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ username: '', password: '', email: '' });
  };

  return (
    <div className="container-fluid">
      {flashMessage && <div className="alert alert-warning text-center">{flashMessage}</div>}
      <div className="form-container">
        <div className="card shadow-lg animate__fadeIn">
          <div className="card-body">
            <h3 className="card-title text-center mb-4 fw-bold">{isLogin ? 'Author Login' : 'Author Registration'}</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <button type="submit" className="btn btn-primary w-100"> {isLogin ? 'Login' : 'Register'}</button>
            </form>
            <div className="text-center mt-3">
              <button className="btn btn-outline-primary" onClick={toggleForm}>
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorAuth;