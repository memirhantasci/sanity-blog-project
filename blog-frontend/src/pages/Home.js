import { useEffect, useState } from "react";
import sanityClient from "@sanity/client";
import { Link } from "react-router-dom";
import imageUrlBuilder from "@sanity/image-url";

const client = sanityClient({
  projectId: "qwbsg9fr",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);
function urlFor(source) { return builder.image(source); }

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "post"]{ 
        title, "slug": slug.current, _createdAt, mainImage,
        "categories": categories[]->title
      } | order(_createdAt desc)`)
      .then(setPosts);
  }, []);

  return (
    <div className="w-full">
      <div className="mb-16 text-center">
        <h2 className="text-6xl font-black text-gray-900 mb-4 tracking-tighter">KEŞFET.</h2>
        <p className="text-gray-400 font-medium">Geleceğin teknolojilerini bugünden okuyun.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <article key={post.slug} className="group bg-white rounded-[35px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="h-64 overflow-hidden bg-gray-100 relative">
              {post.mainImage ? (
                <img 
                  src={urlFor(post.mainImage).url()} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-blue-600" />
              )}
            </div>
            
            <div className="p-8 text-left">
              <div className="flex gap-2 mb-4">
                {post.categories?.map(cat => (
                  <span key={cat} className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{cat}</span>
                ))}
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-6 group-hover:text-blue-600 transition-colors leading-tight">
                {post.title}
              </h3>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                  {new Date(post._createdAt).toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' })}
                </span>
                <Link to={`/post/${post.slug}`} className="text-xs font-black text-gray-900 group-hover:text-blue-600 uppercase tracking-widest flex items-center">
                  OKU <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}