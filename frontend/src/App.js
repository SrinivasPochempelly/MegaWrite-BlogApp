import { Routes, Route } from 'react-router-dom';
import AuthorAuth from './components/author/AuthorAuth';
import AuthorCreateArticle from './components/author/AuthorCreateArticle';
import AuthorUpdateArticle from './components/author/AuthorUpdateArticle';
import ArticleList from './components/author/ArticleList';
import ArticleDetail from './components/author/ArticleDetail';
import UserArticleDetail from './components/user/UserArticleDetail';
import UserArticleList from './components/user/UserArticleList';
import UserAuth from './components/user/UserAuth';
import AboutUs from './components/AboutUs';
import CustomNavbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <CustomNavbar />

      <div className="container mt-5 mb-5 flex-grow-1 d-flex flex-column">
        <h1 className="text-center mb-4 fw-bold">MegaWrite - BlogApp</h1>
        <Routes>
          <Route path="/" element={<UserArticleList />} />
          <Route path="/author/auth" element={<AuthorAuth />} />
          <Route path="/author/create" element={<AuthorCreateArticle />} />
          <Route path="/author/update/:articleId" element={<AuthorUpdateArticle />} />
          <Route path="/author/article/:articleId" element={<ArticleDetail />} />
          <Route path="/author/articles" element={<ArticleList userType="author" />} />
          <Route path="/user/auth" element={<UserAuth />} />
          <Route path="/articles" element={<UserArticleList />} />
          <Route path="/article/:id" element={<UserArticleDetail />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
