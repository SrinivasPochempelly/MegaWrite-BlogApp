import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserAuth() {
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
    const endpoint = isLogin ? 'login' : 'user';
    const payload = isLogin
      ? { username: formData.username, password: formData.password }
      : formData;
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user-api/${endpoint}`, payload);
      // console.log(response);
     if (isLogin) {
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', formData.username);
        localStorage.setItem('role', 'user');
        setSuccess(response.data.message);
        setError('');
        setTimeout(() => navigate('/articles'), 1000);
      } else {

        setError(response.data.message);
        setSuccess('');
      }
    } else {
      setSuccess(response.data.message);
      setError('');
      setTimeout(() => navigate('/user/auth'), 1000);
      setIsLogin(true);
    }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isLogin ? 'login' : 'register'}`);
      setSuccess('');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', password: '', email: '' });
    setError('');
    setSuccess('');
  };

  return (
    <div className="container-fluid">
      {flashMessage && <div className="alert alert-warning text-center">{flashMessage}</div>}
      <div className="form-container">
        <div className="card shadow-lg animate__fadeIn">
          <div className="card-body">
            <h3 className="card-title text-center mb-4 fw-bold">
              {isLogin ? 'User Login' : 'User Registration'}
            </h3>
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
              <button type="submit" className="btn btn-primary w-100">
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={toggleForm}
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;