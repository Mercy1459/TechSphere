import React from 'react';
import { BlogPost } from '../types';
import { ArrowRight, Clock, Eye } from 'lucide-react';

interface HeroFeaturedProps {
  leadPost: BlogPost;
  secondaryPosts: BlogPost[];
  onSelectPost: (slug: string) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  leadPost,
  secondaryPosts,
  onSelectPost,
}) => {
  return (
    <section className="mb-14">
      {/* Editorial Header Kicker */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
        <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase">
          Featured Stories & Insights
        </h2>
        <span className="text-xs text-slate-400">Curated by ZENTEC Editorial Team</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Lead Main Story (7 columns) */}
        <div
          onClick={() => onSelectPost(leadPost.slug)}
          className="lg:col-span-7 group cursor-pointer bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
            <img
              src={leadPost.featuredImage}
              alt={leadPost.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-slate-950/85 text-white text-xs font-semibold px-2.5 py-1 rounded backdrop-blur-xs">
              Cover Feature
            </div>
          </div>

          <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                {leadPost.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-red-600 transition-colors mt-2 mb-3 leading-tight text-balance">
                {leadPost.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                {leadPost.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <img
                  src={leadPost.author.avatar}
                  alt={leadPost.author.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-semibold text-slate-900">{leadPost.author.name}</div>
                  <div className="text-[11px] text-slate-400">{leadPost.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{leadPost.readingTime} min read</span>
                </span>
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{leadPost.views.toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Featured Column (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {secondaryPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post.slug)}
              className="group cursor-pointer bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between flex-1"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-28 h-24 object-cover rounded-xl shrink-0 border border-slate-100 group-hover:scale-102 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 mt-1 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs text-slate-400">
                <span className="font-medium text-slate-600">{post.author.name}</span>
                <div className="flex items-center gap-2">
                  <span>{post.readingTime} min</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Newsletter Mini Banner (Zoho Blog Style) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
                Tech Briefing
              </span>
              <h3 className="text-lg font-bold mt-1 mb-2 text-white">
                Stay Ahead of Enterprise Shifts
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Join 45,000+ architects and engineering leads receiving weekly technical teardowns.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to ZENTEC Engineering Briefs!');
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter your work email"
                  required
                  className="bg-slate-800 text-xs px-3 py-2 rounded-lg text-white placeholder:text-slate-500 border border-slate-700 focus:outline-hidden focus:border-red-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
