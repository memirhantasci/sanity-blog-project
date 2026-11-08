import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home"; 
import Post from "./pages/Post";
import AuthorDetail from "./pages/AuthorDetail";
import Authors from "./pages/Authors";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <BrowserRouter>
        <nav className="w-full bg-white border-b border-gray-200 py-5 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">DEVBLOG.</Link>
          <div className="hidden md:flex space-x-8 text-xs font-black text-gray-500 uppercase tracking-widest">
            <Link to="/" className="hover:text-blue-600 transition">Ana Sayfa</Link>
            <Link to="/categories" className="hover:text-blue-600 transition">Kategoriler</Link>
            <Link to="/authors" className="hover:text-blue-600 transition">Yazarlar</Link>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black hover:bg-blue-700 transition shadow-lg uppercase tracking-widest">Abone Ol</button>
        </nav>

        <main className="w-full max-w-7xl p-6 md:p-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:title" element={<CategoryDetail />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/author/:id" element={<AuthorDetail />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}