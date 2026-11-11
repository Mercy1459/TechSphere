import React, { useState } from 'react';
import { Search, ShieldCheck, BookOpen, X, Sparkles } from 'lucide-react';
import { Category, BlogPost } from '../types';

interface HeaderProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
  onNavigateHome: () => void;
  onNavigateArticles: () => void;
  onNavigateAdmin: () => void;
  onNavigateGuide: () => void;
  currentView: string;
  allPosts: BlogPost[];
  onSelectPost: (slug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  onNavigateHome,
  onNavigateArticles,
  onNavigateAdmin,
  onNavigateGuide,
  currentView,
  allPosts,
  onSelectPost,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery.trim()
    ? allPosts
        .filter((p) => p.status === 'published')
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <>
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav Links) - Zone 3 (Action) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">
            
            {/* Zone 1: Single Wordmark Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-2.5 text-left group cursor-pointer"
                aria-label="ZENTEC Technology Blog Home"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-lg tracking-tight group-hover:bg-red-600 transition-colors shadow-xs">
                  Z
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-red-600 transition-colors whitespace-nowrap">
                    ZENTEC <span className="font-medium text-slate-500">Blog</span>
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <button
                onClick={onNavigateHome}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
                  currentView === 'home' && !activeCategory ? 'text-red-600 font-semibold' : ''
                }`}
              >
                Featured
              </button>
              <button
                onClick={onNavigateArticles}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
                  currentView === 'articles' ? 'text-red-600 font-semibold' : ''
                }`}
              >
                All Articles
              </button>
              <button
                onClick={() => {
                  onNavigateArticles();
                  onSelectCategory('Cloud Computing');
                }}
                className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                Cloud & AI
              </button>
              <button
                onClick={onNavigateGuide}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  currentView === 'guide'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Interview & Architecture Guide</span>
              </button>
            </nav>

            {/* Zone 3: Search affordance & Primary CTA (Admin CMS) */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Search articles"
                aria-label="Search articles"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateAdmin}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  currentView === 'admin'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin CMS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Ribbon: Zoho Blog style sub-navigation bar */}
        <div className="border-t border-slate-100 bg-[#FAFBFD]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth">
              <button
                onClick={() => {
                  onSelectCategory(null);
                  if (currentView === 'detail') onNavigateArticles();
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  activeCategory === null
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                All Topics
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    if (currentView === 'detail') onNavigateArticles();
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                    activeCategory === cat.name
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Real-time Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, tech stack, or topic..."
                autoFocus
                className="w-full text-sm outline-hidden text-slate-900 placeholder:text-slate-400"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {searchQuery.trim() ? (
              <div className="p-3 max-h-96 overflow-y-auto divide-y divide-slate-100">
                {searchResults.length > 0 ? (
                  searchResults.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => {
                        onSelectPost(post.slug);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors flex items-start gap-4 group"
                    >
                      <img
                        src={post.featuredImage}
                        alt=""
                        className="w-16 h-12 object-cover rounded-md shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-red-600 font-medium mb-1">
                          {post.category}
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {post.excerpt}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-slate-500">
                    No articles found matching &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
                <span>Quick suggestion: Try &ldquo;Cloud&rdquo;, &ldquo;Zero Trust&rdquo;, or &ldquo;React 19&rdquo;</span>
                <span className="font-mono text-[11px] bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700">ESC to close</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
