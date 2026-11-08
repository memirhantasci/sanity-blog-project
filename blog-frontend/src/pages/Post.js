import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react"; // Yeni eklenen kütüphane

const client = sanityClient({
  projectId: "qwbsg9fr",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Sorguda 'body' kısmını eksiksiz aldığımızdan emin olalım
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{
        title,
        body,
        _createdAt,
        mainImage,
        "author": author->{ _id, name, image, bio },
        "categories": categories[]->title
      }`,
        { slug }
      )
      .then(setPost);
  }, [slug]);

  if (!post) return <div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse text-2xl tracking-tighter uppercase">İçerik Hazırlanıyor...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-32 text-left">
      <header className="mb-16">
        <Link to="/" className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-12 inline-block hover:translate-x-[-5px] transition-transform">← ANA SAYFAYA DÖN</Link>
        <div className="flex gap-2 mb-8">
           {post.categories?.map(cat => (
             <span key={cat} className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase italic shadow-lg shadow-blue-100">{cat}</span>
           ))}
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-12 italic uppercase">{post.title}</h1>
        
        <Link to={`/author/${post.author?._id}`} className="flex items-center gap-6 group w-fit">
          {post.author?.image && (
            <img src={urlFor(post.author.image).width(120).url()} alt={post.author.name} className="w-16 h-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ring-4 ring-gray-50" />
          )}
          <div>
            <p className="text-xl font-black text-gray-800 leading-none group-hover:text-blue-600 transition-colors uppercase italic">{post.author?.name}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{new Date(post._createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </Link>
      </header>

      {post.mainImage && (
        <div className="w-full h-[550px] rounded-[60px] overflow-hidden mb-20 shadow-2xl">
          <img src={urlFor(post.mainImage).url()} className="w-full h-full object-cover" alt={post.title} />
        </div>
      )}

      {/* BLOG İÇERİĞİ (TAMAMI BURADA GÖZÜKÜR) */}
      <div className="bg-white rounded-[60px] p-12 md:p-24 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-3 h-full bg-blue-600"></div>
        
        <article className="prose prose-xl max-w-none text-gray-700 leading-[1.8] font-medium space-y-8">
          {/* PortableText bileşeni Sanity'den gelen tüm body içeriğini render eder */}
          <PortableText value={post.body} />
        </article>
      </div>
    </div>
  );
}