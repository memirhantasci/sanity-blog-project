import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sanityClient from "@sanity/client";

const client = sanityClient({ projectId: "qwbsg9fr", dataset: "production", useCdn: true });

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    client.fetch(`*[_type == "category"]{ title, description }`).then(setCategories);
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-5xl font-black mb-12 text-center uppercase italic tracking-tighter">Tüm Kategoriler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link to={`/category/${cat.title}`} key={cat.title} className="bg-white p-10 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-xl hover:bg-blue-600 hover:text-white transition-all duration-300 group">
            <h2 className="text-2xl font-bold mb-2">{cat.title}</h2>
            <p className="text-sm opacity-60 group-hover:opacity-100 italic">İlgili yazıları gör →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}