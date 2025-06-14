import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container-fluid">
      <div className="form-container">
        <div className="card shadow-lg animate__fadeIn">
          <div className="card-body text-center">
            <h3 className="card-title mb-4 fw-bold">Page Not Found</h3>
            <div className="alert alert-info">
              Sorry, the page you're looking for doesn't exist.
            </div>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;