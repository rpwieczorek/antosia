import React from 'react';
import { Post } from '../types';

interface PostGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const PostGrid: React.FC<PostGridProps> = ({ posts, onPostClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {posts.map((post) => (
        <article 
          key={post.id} 
          className="group cursor-pointer flex flex-col"
          onClick={() => onPostClick(post)}
        >
          <div className="relative overflow-hidden aspect-[4/5] bg-gray-100 mb-6 rounded-[2rem]">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-100 group-hover:bg-gray-200 transition-colors duration-500">
                <div className="text-center space-y-2 opacity-20">
                  <div className="text-4xl text-gray-400">♥</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Antosia</p>
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-md shadow-sm">
                {post.category}
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-grow px-2">
            <time className="text-[10px] uppercase tracking-widest text-gray-300 mb-2 font-bold">
              {new Date(post.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <h3 className="text-xl serif leading-tight mb-3 group-hover:text-red-500 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 font-light">
              {post.excerpt}
            </p>
            <div className="mt-auto">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-200 pb-1 group-hover:border-red-500 transition-colors">
                Czytaj więcej
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default PostGrid;