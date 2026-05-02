import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Category from './pages/Category';
import Post from './pages/Post';
import FreeSourceCode from './pages/FreeSourceCode';
import Blog from './pages/Blog';
import Portfolio from './pages/Portfolio';
import MCQ from './pages/MCQ';
import BookChapters from './pages/BookChapters';
import ChapterMCQs from './pages/ChapterMCQs';
import MCQQuiz from './pages/MCQQuiz';
import Search from './pages/Search';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './admin/Login';
import AdminDashboard from './admin/Dashboard';
import AdminPosts from './admin/Posts';
import AdminPostEdit from './admin/PostEdit';
import AdminCategories from './admin/Categories';
import AdminBooks from './admin/Books';
import AdminMCQs from './admin/MCQs';
import AdminComments from './admin/Comments';
import AdminSettings from './admin/Settings';
import AdminPortfolio from './admin/Portfolio';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/posts" element={
          <ProtectedRoute>
            <AdminPosts />
          </ProtectedRoute>
        } />
        <Route path="/admin/posts/new" element={
          <ProtectedRoute>
            <AdminPostEdit />
          </ProtectedRoute>
        } />
        <Route path="/admin/posts/:id/edit" element={
          <ProtectedRoute>
            <AdminPostEdit />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute>
            <AdminCategories />
          </ProtectedRoute>
        } />
        <Route path="/admin/books" element={
          <ProtectedRoute>
            <AdminBooks />
          </ProtectedRoute>
        } />
        <Route path="/admin/mcqs" element={
          <ProtectedRoute>
            <AdminMCQs />
          </ProtectedRoute>
        } />
        <Route path="/admin/comments" element={
          <ProtectedRoute>
            <AdminComments />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        } />
        <Route path="/admin/portfolio" element={
          <ProtectedRoute>
            <AdminPortfolio />
          </ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path="*" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:slug" element={<Category />} />
                <Route path="/post/:slug" element={<Post />} />
                <Route path="/free-source-code" element={<FreeSourceCode />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/mcqs" element={<MCQ />} />
                <Route path="/mcqs/book/:slug" element={<BookChapters />} />
                <Route path="/mcqs/book/:slug/chapter/:chapterId" element={<ChapterMCQs />} />
                <Route path="/mcqs/:id" element={<MCQQuiz />} />
                <Route path="/search" element={<Search />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
