/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BlogPost, Category, Author } from './types';
import { blogStorage } from './services/storage';
import { Header } from './components/Header';
import { HeroFeatured } from './components/HeroFeatured';
import { ArticleCard } from './components/ArticleCard';
import { BlogDetail } from './components/BlogDetail';
import { BlogListing } from './components/BlogListing';
import { AdminPanel } from './components/AdminPanel';
import { PresentationGuide } from './components/PresentationGuide';
import { Footer } from './components/Footer';
import {
  TrendingUp,
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
  Terminal,
} from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'articles' | 'detail' | 'admin' | 'guide'>(window.location.pathname === '/admin' ? 'admin' :'home');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Load Initial Data
  const refreshData = () => {
    setPosts(blogStorage.getPosts());
    setCategories(blogStorage.getCategories());
    setAuthors(blogStorage.getAuthors());
  };

  useEffect(() => {
    refreshData();
    if (window.location.pathname === '/admin') {
      setCurrentView('admin');
    }
  }, []);

  // Filter Published Posts for Public Views
  const publishedPosts = useMemo(() => {
    return posts.filter((p) => p.status === 'published');
  }, [posts]);

  // Featured and Secondary Posts for Homepage
  const leadFeaturedPost = useMemo(() => {
    return publishedPosts.find((p) => p.isFeatured) || publishedPosts[0];
  }, [publishedPosts]);

  const secondaryFeaturedPosts = useMemo(() => {
    if (!leadFeaturedPost) return [];
    return publishedPosts
      .filter((p) => p.id !== leadFeaturedPost.id)
      .slice(0, 2);
  }, [publishedPosts, leadFeaturedPost]);

  // Popular / Trending Posts (Sorted by Views)
  const trendingPosts = useMemo(() => {
    return [...publishedPosts]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [publishedPosts]);

  // Latest Posts (filtered by active category if selected)
  const latestPosts = useMemo(() => {
    let list = publishedPosts;
    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }
    return list;
  }, [publishedPosts, activeCategory]);

  // Selected Post for Detail View
  const currentPost = useMemo(() => {
    if (!selectedSlug) return null;
    return posts.find((p) => p.slug === selectedSlug || p.id === selectedSlug) || null;
  }, [posts, selectedSlug]);

  // Navigation Handlers
  const handleSelectPost = (slug: string) => {
    setSelectedSlug(slug);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectCategory = (categoryName: string | null) => {
    setActiveCategory(categoryName);
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateArticles = () => {
    setCurrentView('articles');
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateAdmin = () => {
    setCurrentView('admin');
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateGuide = () => {
    setCurrentView('guide');
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleIncrementView = (id: string) => {
    blogStorage.incrementViewCount(id);
    // Silent update in state
    setPosts((prev) =>
      prev.map((p) => (p.id === id || p.slug === id ? { ...p, views: (p.views || 0) + 1 } : p))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFC] text-slate-800">
      
      {/* Top Navigation & Sub-Category Ribbon */}
      <Header
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onNavigateHome={handleNavigateHome}
        onNavigateArticles={handleNavigateArticles}
        onNavigateAdmin={handleNavigateAdmin}
        onNavigateGuide={handleNavigateGuide}
        currentView={currentView}
        allPosts={posts}
        onSelectPost={handleSelectPost}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: HOMEPAGE */}
        {currentView === 'home' && (
          <div>
            {/* Campus Interview Quick Banner */}
            <div className="mb-8 p-3.5 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Campus Evaluation Guide Available:</strong> Review the MERN architecture, Tamil pitch, and 10 technical viva answers.
                </span>
              </div>
              <button
                onClick={handleNavigateGuide}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                Open Interview Guide →
              </button>
            </div>

            {/* Featured Hero Stories (Zoho Blog Style) */}
            {leadFeaturedPost && (
              <HeroFeatured
                leadPost={leadFeaturedPost}
                secondaryPosts={secondaryFeaturedPosts}
                onSelectPost={handleSelectPost}
              />
            )}

            {/* Main Content Split: Latest Articles (8 Cols) vs Popular Trending Articles (4 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Latest Articles Feed (8 Cols) */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {activeCategory ? `${activeCategory} Articles` : 'Latest Articles & Research'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Technical engineering briefs, cloud design patterns, and case studies.
                    </p>
                  </div>
                  
                  {activeCategory && (
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Clear Category Filter
                    </button>
                  )}
                </div>

                {latestPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {latestPosts.map((post) => (
                      <ArticleCard
                        key={post.id}
                        post={post}
                        onSelect={handleSelectPost}
                        variant="grid"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
                    No articles found in {activeCategory}. Check back soon or select another topic.
                  </div>
                )}

                {/* Explore All Articles Button */}
                <div className="mt-10 text-center">
                  <button
                    onClick={handleNavigateArticles}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                  >
                    <span>Browse All Technology Articles ({publishedPosts.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sidebar: Popular / Trending Articles & Topics (4 Cols) */}
              <aside className="lg:col-span-4 space-y-8">
                
                {/* Popular / Trending Widget */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Popular & Trending
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {trendingPosts.map((post, index) => (
                      <div
                        key={post.id}
                        onClick={() => handleSelectPost(post.slug)}
                        className="group cursor-pointer py-3 border-b border-slate-100 last:border-b-0 flex items-start gap-3"
                      >
                        <span className="text-xl font-black text-slate-300 group-hover:text-red-600 font-mono transition-colors w-6 shrink-0 pt-0.5">
                          0{index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wide">
                            {post.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 mt-0.5 leading-snug">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                            <span>{post.readingTime} min</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{post.views.toLocaleString()} reads</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explore Categories Box */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                    <Layers className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Technology Domains
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {categories.map((cat) => {
                      const count = publishedPosts.filter((p) => p.category === cat.name).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setActiveCategory(cat.name);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                            activeCategory === cat.name
                              ? 'bg-red-50 text-red-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="truncate">{cat.name}</span>
                          </div>
                          <span className="font-mono text-[11px] text-slate-400 shrink-0">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Enterprise Tech Newsletter Widget */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Engineering Newsletter
                  </h4>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Weekly curated distributed systems insights, security analyses, and software blueprints.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert('Subscribed successfully!');
                    }}
                    className="space-y-2"
                  >
                    <input
                      type="email"
                      placeholder="name@company.com"
                      required
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-red-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Subscribe Free
                    </button>
                  </form>
                </div>

              </aside>

            </div>
          </div>
        )}

        {/* VIEW 2: ALL ARTICLES LISTING */}
        {currentView === 'articles' && (
          <BlogListing
            posts={posts}
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            onSelectPost={handleSelectPost}
          />
        )}

        {/* VIEW 3: DEDICATED ARTICLE DETAIL */}
        {currentView === 'detail' && currentPost && (
          <BlogDetail
            post={currentPost}
            allPosts={posts}
            onSelectPost={handleSelectPost}
            onBack={handleNavigateArticles}
            onIncrementView={handleIncrementView}
          />
        )}

        {/* VIEW 4: ADMIN CMS PANEL */}
        {currentView === 'admin' && (
          <AdminPanel
            posts={posts}
            categories={categories}
            authors={authors}
            onRefreshData={refreshData}
            onPreviewPost={handleSelectPost}
          />
        )}

        {/* VIEW 5: PRESENTATION & INTERVIEW GUIDE */}
        {currentView === 'guide' && <PresentationGuide />}

      </main>

      {/* Global Corporate Footer */}
      <Footer
        categories={categories}
        onSelectCategory={handleSelectCategory}
        onNavigateHome={handleNavigateHome}
        onNavigateArticles={handleNavigateArticles}
        onNavigateAdmin={handleNavigateAdmin}
        onNavigateGuide={handleNavigateGuide}
      />

    </div>
  );
}