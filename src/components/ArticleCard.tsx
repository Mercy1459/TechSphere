import React from 'react';
import { BlogPost } from '../types';

interface ArticleCardProps {
  post: BlogPost;
  onSelect: (slug: string) => void;
  variant?: 'grid' | 'horizontal' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  post,
  onSelect,
  variant = 'grid',
}) => {
  if (variant === 'compact') {
    return (
      <article
        onClick={() => onSelect(post.slug)}
        className="group cursor-pointer py-3.5 border-b border-slate-100 last:border-b-0 flex items-start gap-3.5 hover:bg-slate-50/70 p-2 rounded-lg transition-colors"
      >
        <img
          src={post.featuredImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-20 h-16 object-cover rounded-md shrink-0 border border-slate-200/70 group-hover:scale-102 transition-transform duration-200"
        />
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold tracking-wide text-red-600 uppercase">
            {post.category}
          </span>
          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mt-0.5">
            {post.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
            <span>{post.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        onClick={() => onSelect(post.slug)}
        className="group cursor-pointer bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
      >
        <div className="md:col-span-5 overflow-hidden rounded-lg">
          <img
            src={post.featuredImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-48 md:h-52 object-cover rounded-lg group-hover:scale-103 transition-transform duration-300"
          />
        </div>
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
            <span>{post.category}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-tight mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
            <span className="font-medium text-slate-700">{post.author.name}</span>
            <span aria-hidden="true">·</span>
            <span>{post.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </article>
    );
  }

  // Standard Grid Card
  return (
    <article
      onClick={() => onSelect(post.slug)}
      className="group cursor-pointer bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all flex flex-col h-full"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={post.featuredImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
        />
        {post.isFeatured && (
          <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
            Featured
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill unboxed category label */}
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            {post.category}
          </span>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mt-1.5 mb-2 leading-snug line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {post.excerpt}
          </p>
        </div>

        {/* Clean unboxed metadata footer with typographic separators */}
        <div className="flex items-center gap-2.5 text-xs text-slate-500 pt-3 border-t border-slate-100 mt-auto">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <span className="font-medium text-slate-700 truncate">{post.author.name}</span>
          <span aria-hidden="true" className="shrink-0">·</span>
          <span className="shrink-0">{post.readingTime} min read</span>
        </div>
      </div>
    </article>
  );
};
