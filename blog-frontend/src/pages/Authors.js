import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const client = sanityClient({ projectId: "qwbsg9fr", dataset: "production", useCdn: true });
const builder = imageUrlBuilder(client);
function urlFor(source) { return builder.image(source); }

export default function Authors() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    client.fetch(`*[_type == "author"]{ _id, name, image }`).then(setAuthors);
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-5xl font-black mb-12 text-center italic tracking-tighter">EKİBİMİZ.</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {authors.map((author) => (
          <Link to={`/author/${author._id}`} key={author._id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 text-center flex flex-col items-center group">
            {author.image && (
              <img src={urlFor(author.image).width(200).url()} alt={author.name} className="w-24 h-24 rounded-full object-cover mb-4 group-hover:scale-110 transition-transform" />
            )}
            <h2 className="text-xl font-black text-gray-800">{author.name}</h2>
            <p className="text-[10px] text-blue-600 font-bold mt-2 uppercase tracking-widest">Profili Gör</p>
          </Link>
        ))}
      </div>
    </div>
  );
}