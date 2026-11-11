import React, { useState, useMemo } from 'react';
import { BlogPost, Category } from '../types';
import { ArticleCard } from './ArticleCard';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogListingProps {
  posts: BlogPost[];
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
  onSelectPost: (slug: string) => void;
}

export const BlogListing: React.FC<BlogListingProps> = ({
  posts,
  categories,
  activeCategory,
  onSelectCategory,
  onSelectPost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'readingTime'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtered & Sorted Posts
  const filteredPosts = useMemo(() => {
    let result = posts.filter((p) => p.status === 'published');

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.author.name.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === 'readingTime') {
        return a.readingTime - b.readingTime;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [posts, activeCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(start, start + itemsPerPage);
  }, [filteredPosts, currentPage, itemsPerPage]);

  return (
    <div className="py-8">
      {/* Title & Deck */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          All Technology Articles & Research
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Explore architectural blueprints, system design case studies, security protocols, and industry analyses published by ZENTEC engineers.
        </p>
      </div>

      {/* Filter and Search Bar Ribbon */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Keyword Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by keyword, tech, author..."
              className="w-full text-xs bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-red-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Category Dropdown & Sorting Options */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={activeCategory || ''}
                onChange={(e) => {
                  onSelectCategory(e.target.value || null);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden focus:border-red-500 font-medium"
              >
                <option value="">All Categories ({posts.filter((p) => p.status === 'published').length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden focus:border-red-500 font-medium"
              >
                <option value="newest">Sort: Latest Published</option>
                <option value="popular">Sort: Most Viewed</option>
                <option value="readingTime">Sort: Shortest Read Time</option>
              </select>
            </div>
          </div>

        </div>

        {/* Active Filter Tags */}
        {(activeCategory || searchQuery) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Active filters:</span>
            {activeCategory && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                Category: {activeCategory}
                <button
                  onClick={() => onSelectCategory(null)}
                  className="hover:text-red-600 ml-1 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                Search: &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-red-600 ml-1 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                onSelectCategory(null);
                setSearchQuery('');
              }}
              className="text-red-600 hover:underline text-[11px] ml-auto font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
        <span>
          Showing <strong className="text-slate-800">{filteredPosts.length}</strong> published articles
        </span>
        {totalPages > 1 && (
          <span>
            Page <strong className="text-slate-800">{currentPage}</strong> of {totalPages}
          </span>
        )}
      </div>

      {/* Articles Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map((post) => (
            <ArticleCard key={post.id} post={post} onSelect={onSelectPost} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm font-semibold text-slate-800">No articles match your criteria</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search terms or selecting a different category.
          </p>
          <button
            onClick={() => {
              onSelectCategory(null);
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-slate-200">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
