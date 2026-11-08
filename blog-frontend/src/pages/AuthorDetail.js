import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

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

export default function AuthorDetail() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Yazar bilgilerini getir
    client
      .fetch(`*[_type == "author" && _id == $id][0]{ name, bio, image }`, { id })
      .then(setAuthor);

    // Yazara ait postları getir
    client
      .fetch(
        `*[_type == "post" && author._ref == $id] | order(_createdAt desc){
        title,
        "slug": slug.current,
        _createdAt,
        mainImage,
        "categories": categories[]->title
      }`,
        { id }
      )
      .then(setPosts);
  }, [id]);

  if (!author) return <div className="p-20 text-center font-black italic text-blue-600 animate-pulse uppercase tracking-widest">Yazar Bilgileri Yükleniyor...</div>;

  // Sanity'den gelen blok halindeki tüm biyografi paragraflarını birleştiren fonksiyon
  const getFullBio = (bio) => {
    if (!bio || !Array.isArray(bio)) return "Bu yazar hakkında henüz bir biyografi eklenmemiş.";
    
    return bio
      .map((block) => {
        if (block._type !== "block" || !block.children) return "";
        return block.children.map((child) => child.text).join("");
      })
      .join("\n\n"); // Paragraflar arasına gerçek boşluk ekler
  };

  const fullBioText = getFullBio(author.bio);

  return (
    <div className="w-full pb-32">
      {/* YAZAR PROFİL KARTI */}
      <section className="bg-white rounded-[60px] p-12 md:p-20 border border-gray-100 shadow-sm mb-20 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50 z-0"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
          {author.image && (
            <img
              src={urlFor(author.image).width(400).url()}
              alt={author.name}
              className="w-56 h-56 rounded-[50px] object-cover shadow-2xl ring-8 ring-blue-50 transition-transform hover:scale-105 duration-500"
            />
          )}
          
          <div className="flex-1">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4 block">PROFESYONEL YAZAR</span>
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-8 italic uppercase leading-none">{author.name}</h1>
            
            {/* BİYOGRAFİ ALANI */}
            <div className="relative max-w-2xl">
              <p className={`text-gray-500 leading-relaxed text-lg transition-all duration-700 whitespace-pre-line ${!isExpanded ? "line-clamp-2" : ""}`}>
                {fullBioText}
              </p>
              
              {/* Eğer metin yeterince uzunsa butonu göster (yaklaşık 120 karakter) */}
              {fullBioText.length > 120 && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-6 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  {isExpanded ? "Daha Az Göster ↑" : "Biyografinin Tamamını Oku ↓"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* YAZARIN BLOG YAZILARI */}
      <div className="mb-12 flex items-center justify-between border-l-8 border-blue-600 pl-6">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
          YAZARA AİT <span className="text-blue-600">İÇERİKLER.</span>
        </h2>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full">
            {posts.length} Yazı
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <article key={post.slug} className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
            <div className="h-64 overflow-hidden relative">
              {post.mainImage && (
                <img 
                  src={urlFor(post.mainImage).url()} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={post.title} 
                />
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                {post.categories?.slice(0, 2).map(cat => (
                  <span key={cat} className="text-[8px] font-black text-white uppercase bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-lg tracking-widest">{cat}</span>
                ))}
              </div>
            </div>
            
            <div className="p-10 text-left flex flex-col flex-grow">
              <h3 className="text-2xl font-black text-gray-800 mb-8 group-hover:text-blue-600 transition-colors line-clamp-2 italic leading-tight uppercase tracking-tighter">
                {post.title}
              </h3>
              
              <div className="mt-auto flex justify-between items-center pt-8 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  {new Date(post._createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
                <Link 
                  to={`/post/${post.slug}`} 
                  className="text-xs font-black text-gray-900 group-hover:text-blue-600 uppercase tracking-widest flex items-center gap-2"
                >
                  OKU <span className="transition-transform group-hover:translate-x-2">→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}