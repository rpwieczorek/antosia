
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
          <div className="relative overflow-hidden aspect-[4/5] bg-gray-100 mb-6">
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-semibold">
                {post.category}
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-grow">
            <time className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              {new Date(post.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <h3 className="text-xl serif leading-tight mb-3 group-hover:text-gray-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
              {post.excerpt}
            </p>
            <div className="mt-auto">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-black pb-1">
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
