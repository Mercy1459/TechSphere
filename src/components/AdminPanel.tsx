import React, { useState } from 'react';
import { BlogPost, Category, Author, PostStatus, AdminUser } from '../types';
import { blogStorage } from '../services/storage';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  Star,
  Layers,
  Users,
  Search,
  Check,
  Calendar,
  Lock,
  Globe,
  Code,
  Share2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface AdminPanelProps {
  posts: BlogPost[];
  categories: Category[];
  authors: Author[];
  onRefreshData: () => void;
  onPreviewPost: (slug: string) => void;
}

type AdminTab = 'posts' | 'editor' | 'categories' | 'authors' | 'seo';

const AUTH_KEY = 'zentec_admin_auth';

const slugify = (val: string) =>
  val
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

export const AdminPanel: React.FC<AdminPanelProps> = ({
  posts,
  categories,
  authors,
  onRefreshData,
  onPreviewPost,
}) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? (JSON.parse(saved) as AdminUser) : null;
    } catch {
      return null;
    }
  });

  const [authEmail, setAuthEmail] = useState('admin@zentec.io');
  const [authPassword, setAuthPassword] = useState('mercy@2006');
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('posts');

  // Filter / Search in Posts list
  const [postSearch, setPostSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Editor Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.name || 'Cloud Computing');
  const [formTags, setFormTags] = useState('Cloud Computing, Architecture');
  const [formAuthorId, setFormAuthorId] = useState(authors[0]?.id || 'auth-1');
  const [formFeaturedImage, setFormFeaturedImage] = useState(
    '/src/assets/images/tech_cloud_architecture_1794390935363.jpg'
  );
  const [formImageCaption, setFormImageCaption] = useState('');
  const [formStatus, setFormStatus] = useState<PostStatus>('published');
  const [formScheduledFor, setFormScheduledFor] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formContent, setFormContent] = useState('');
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDescription, setFormSeoDescription] = useState('');
  const [formSeoKeywords, setFormSeoKeywords] = useState('');
  const [editorPreviewMode, setEditorPreviewMode] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Category Editor State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#2563EB');

  // Author Editor State
  const [newAuthName, setNewAuthName] = useState('');
  const [newAuthRole, setNewAuthRole] = useState('');
  const [newAuthBio, setNewAuthBio] = useState('');
  const [newAuthAvatar, setNewAuthAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  );
  const [newAuthEmail, setNewAuthEmail] = useState('');

  // Pre-generated corporate image gallery options
  const corporatePresetImages = [
    {
      name: 'Cloud Infrastructure & Servers',
      path: '/src/assets/images/tech_cloud_architecture_1794390935363.jpg',
    },
    {
      name: 'Artificial Intelligence & Neural Models',
      path: '/src/assets/images/tech_ai_neural_models_1794390935482.jpg',
    },
    {
      name: 'Cybersecurity & Zero Trust Shield',
      path: '/src/assets/images/tech_cybersecurity_shield_1794390936851.jpg',
    },
    {
      name: 'Software Developer Workspace & Code',
      path: '/src/assets/images/tech_software_dev_workspace_1794390936773.jpg',
    },
  ];

  const signIn = (email: string) => {
    const user: AdminUser = {
      id: 'usr-admin-1',
      email,
      name: 'Technical Editor & Admin',
      role: 'admin',
    };
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch {
      /* storage unavailable in restricted sandbox */
    }
    setAuthError('');
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail.trim() === 'admin@zentec.io' && authPassword === 'mercy@2006') {
      signIn(authEmail.trim());
    } else {
      setAuthError('Invalid credentials. Use admin@zentec.io / mercy@2006');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
  };

  // Automated Slug Generator from Title
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingPostId) {
      setFormSlug(slugify(val));
      if (!formSeoTitle) {
        setFormSeoTitle(`${val} | ZENTEC Blog`);
      }
    }
  };

  // Open New Post form
  const handleOpenNewPost = () => {
    setEditingPostId(null);
    setFormTitle('');
    setFormSlug('');
    setFormExcerpt('');
    setFormCategory(categories[0]?.name || 'Cloud Computing');
    setFormTags('Cloud, Engineering');
    setFormAuthorId(authors[0]?.id || 'auth-1');
    setFormFeaturedImage(corporatePresetImages[0].path);
    setFormImageCaption('');
    setFormStatus('published');
    setFormScheduledFor('');
    setFormIsFeatured(false);
    setFormContent(
      `## Introduction\n\nEnter your article content here with clean headers, paragraphs, and insights.\n\n> Key quote or principle goes here.\n\n### Architectural Approach\n\nExplain technical specifics and patterns.\n\n\`\`\`typescript\n// Code snippet example\nconst example = "Clean enterprise code";\n\`\`\`\n\n## Conclusion\n\nWrap up the key takeaways for technical leaders.`
    );
    setFormSeoTitle('');
    setFormSeoDescription('');
    setFormSeoKeywords('');
    setEditorPreviewMode(false);
    setActiveTab('editor');
  };

  // Open Edit Post form
  const handleEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt);
    setFormCategory(post.category);
    setFormTags(post.tags.join(', '));
    setFormAuthorId(post.author.id);
    setFormFeaturedImage(post.featuredImage);
    setFormImageCaption(post.imageCaption || '');
    setFormStatus(post.status);
    setFormScheduledFor(post.scheduledFor || '');
    setFormIsFeatured(post.isFeatured);
    setFormContent(post.content);
    setFormSeoTitle(post.seoTitle || `${post.title} | ZENTEC Blog`);
    setFormSeoDescription(post.seoDescription || post.excerpt);
    setFormSeoKeywords(post.seoKeywords?.join(', ') || post.tags.join(', '));
    setEditorPreviewMode(false);
    setActiveTab('editor');
  };

  // Save Post (Create / Update)
  const handleSavePost = (targetStatus?: PostStatus) => {
    if (!formTitle.trim()) {
      alert('Please enter an article title.');
      return;
    }

    const finalStatus = targetStatus || formStatus;

    if (finalStatus === 'scheduled' && !formScheduledFor) {
      alert('Please choose a date for the scheduled article.');
      return;
    }

    const selectedAuthor = authors.find((a) => a.id === formAuthorId) || authors[0];
    const tagsArray = formTags.split(',').map((t) => t.trim()).filter(Boolean);
    const keywordsArray = formSeoKeywords.split(',').map((k) => k.trim()).filter(Boolean);

    // Approximate reading time at 200 words per minute
    const wordCount = formContent.trim() ? formContent.trim().split(/\s+/).length : 0;
    const calculatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

    const existing = editingPostId ? posts.find((p) => p.id === editingPostId) : undefined;

    const postPayload: BlogPost = {
      id: editingPostId || `post-${Date.now()}`,
      title: formTitle,
      slug: formSlug || slugify(formTitle),
      excerpt: formExcerpt || formContent.slice(0, 160) + '...',
      content: formContent,
      category: formCategory,
      tags: tagsArray.length > 0 ? tagsArray : ['Technology'],
      author: selectedAuthor,
      featuredImage: formFeaturedImage,
      imageCaption: formImageCaption,
      status: finalStatus,
      isFeatured: formIsFeatured,
      publishedAt: existing?.publishedAt || new Date().toISOString().split('T')[0],
      scheduledFor: finalStatus === 'scheduled' ? formScheduledFor : undefined,
      readingTime: calculatedReadingTime,
      views: existing?.views || 0,
      seoTitle: formSeoTitle || `${formTitle} | ZENTEC Blog`,
      seoDescription: formSeoDescription || formExcerpt,
      seoKeywords: keywordsArray,
    };

    blogStorage.savePost(postPayload);
    onRefreshData();

    setSaveSuccessMessage(`Article successfully saved as ${finalStatus.toUpperCase()}!`);
    setTimeout(() => {
      setSaveSuccessMessage('');
      setActiveTab('posts');
    }, 1200);
  };

  // Delete Post
  const handleDeletePost = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      blogStorage.deletePost(id);
      onRefreshData();
    }
  };

  // Toggle Featured
  const handleToggleFeatured = (post: BlogPost) => {
    blogStorage.savePost({ ...post, isFeatured: !post.isFeatured });
    onRefreshData();
  };

  // Add Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: slugify(newCatName),
      description: newCatDesc.trim() || 'Technology articles and insights.',
      color: newCatColor,
    };
    blogStorage.saveCategory(cat);
    onRefreshData();
    setNewCatName('');
    setNewCatDesc('');
  };

  // Delete Category
  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      blogStorage.deleteCategory(id);
      onRefreshData();
    }
  };

  // Add Author
  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthName.trim()) return;
    const auth: Author = {
      id: `auth-${Date.now()}`,
      name: newAuthName.trim(),
      role: newAuthRole.trim() || 'Technical Contributor',
      bio: newAuthBio.trim() || 'Software engineer and technology contributor.',
      avatar: newAuthAvatar.trim(),
      email: newAuthEmail.trim() || 'editor@zentec.io',
    };
    blogStorage.saveAuthor(auth);
    onRefreshData();
    setNewAuthName('');
    setNewAuthRole('');
    setNewAuthBio('');
    setNewAuthEmail('');
  };

  // Filtered posts list
  const filteredPosts = posts.filter((post) => {
    const q = postSearch.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(q) || post.author.name.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Metrics
  const totalPostsCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const totalViewsCount = posts.reduce((acc, p) => acc + (p.views || 0), 0);

  const tabClass = (tab: AdminTab) =>
    `flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
      activeTab === tab
        ? 'border-red-600 text-red-600'
        : 'border-transparent text-slate-600 hover:text-slate-900'
    }`;

  const inputClass =
    'w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-red-500';
  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1';

  // Login Gate
  if (!currentUser) {
    return (
      <div className="py-16 max-w-md mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Admin CMS Authentication</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Sign in to manage blog articles, categories, authors, and SEO settings.
          </p>

          {authError && (
            <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-700 text-xs text-left">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className={labelClass}>Admin Email</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Sign In to CMS
            </button>
          </form>

          {/* Quick Demo Assist */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-left bg-slate-50 p-3 rounded-lg">
            <span className="text-[11px] font-bold text-slate-700 block mb-1">
              Campus Presentation Quick Access:
            </span>
            <p className="text-[11px] text-slate-500 mb-2">
              Credentials are pre-filled (
              <code className="text-slate-800 font-mono">admin@zentec.io</code> /{' '}
              <code className="text-slate-800 font-mono">admin123</code>).
            </p>
            <button
              type="button"
              onClick={() => {
                setAuthEmail('admin@zentec.io');
                setAuthPassword('admin123');
                signIn('admin@zentec.io');
              }}
              className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
            >
              Click here for Instant 1-Click Sign In →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto">
      {/* Top Admin Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
              Content Management System
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">
              v1.4.0
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            ZENTEC Editorial Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNewPost}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all posts and categories to factory default data?')) {
                blogStorage.resetToDefault();
                onRefreshData();
              }
            }}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Reset to initial mock data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="text-xs text-slate-500 hover:text-red-600 font-medium px-2 py-1 rounded transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4">
          <span className="text-xs text-slate-500 block">Total Articles</span>
          <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {totalPostsCount}
          </span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4">
          <span className="text-xs text-emerald-600 font-medium block">Published</span>
          <span className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
            {publishedCount}
          </span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4">
          <span className="text-xs text-amber-600 font-medium block">Drafts</span>
          <span className="text-2xl font-black text-amber-700 font-mono tabular-nums">
            {draftCount}
          </span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4">
          <span className="text-xs text-blue-600 font-medium block">Scheduled</span>
          <span className="text-2xl font-black text-blue-700 font-mono tabular-nums">
            {scheduledCount}
          </span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-500 block">Total Readership</span>
          <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {totalViewsCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto gap-1">
        <button onClick={() => setActiveTab('posts')} className={tabClass('posts')}>
          <FileText className="w-3.5 h-3.5" />
          <span>Articles Management ({posts.length})</span>
        </button>

        <button onClick={() => setActiveTab('editor')} className={tabClass('editor')}>
          <Edit className="w-3.5 h-3.5" />
          <span>{editingPostId ? 'Edit Article' : 'Article Editor'}</span>
        </button>

        <button onClick={() => setActiveTab('categories')} className={tabClass('categories')}>
          <Layers className="w-3.5 h-3.5" />
          <span>Categories ({categories.length})</span>
        </button>

        <button onClick={() => setActiveTab('authors')} className={tabClass('authors')}>
          <Users className="w-3.5 h-3.5" />
          <span>Authors ({authors.length})</span>
        </button>

        <button onClick={() => setActiveTab('seo')} className={tabClass('seo')}>
          <Globe className="w-3.5 h-3.5" />
          <span>SEO & Metadata Suite</span>
        </button>
      </div>

      {/* TAB 1: POSTS TABLE */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full text-xs bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-lg text-slate-900 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Article</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Author</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Views</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleFeatured(post)}
                            className={`p-1 rounded cursor-pointer ${
                              post.isFeatured
                                ? 'text-amber-500 hover:text-amber-600'
                                : 'text-slate-300 hover:text-slate-500'
                            }`}
                            title={post.isFeatured ? 'Featured cover story' : 'Mark as featured'}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                          <img
                            src={post.featuredImage}
                            alt=""
                            className="w-12 h-9 object-cover rounded shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <h4
                              className="font-bold text-slate-900 hover:text-red-600 cursor-pointer line-clamp-1"
                              onClick={() => handleEditPost(post)}
                            >
                              {post.title}
                            </h4>
                            <span className="font-mono text-[10px] text-slate-400 block truncate">
                              /{post.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{post.category}</span>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.avatar}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span>{post.author.name}</span>
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        {post.status === 'published' && (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Published
                          </span>
                        )}
                        {post.status === 'draft' && (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Draft
                          </span>
                        )}
                        {post.status === 'scheduled' && (
                          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Scheduled ({post.scheduledFor?.split('T')[0]})
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-slate-500">
                        {post.publishedAt}
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-right font-mono tabular-nums text-slate-600">
                        {post.views.toLocaleString()}
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onPreviewPost(post.slug)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                            title="Preview article on live reader"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            title="Edit article"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id, post.title)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARTICLE EDITOR (CREATE / EDIT) */}
      {activeTab === 'editor' && (
        <div className="space-y-6 max-w-5xl">
          {saveSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Header / Actions Row */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingPostId ? 'Edit Article' : 'Compose New Technology Article'}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorPreviewMode(!editorPreviewMode)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    editorPreviewMode
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {editorPreviewMode ? 'Return to Markdown Editor' : 'Live Preview'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePost('draft')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePost('published')}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors cursor-pointer"
                >
                  Publish Now
                </button>
              </div>
            </div>

            {/* Core Fields */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Title & Slug */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., Architecting High-Throughput Distributed Microservices"
                    className="w-full text-base font-bold px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug (SEO-friendly permalink) *
                  </label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-200 px-3 py-2 text-xs text-slate-500 rounded-l-lg font-mono">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="architecting-high-throughput-microservices"
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-r-lg text-slate-900 focus:outline-hidden focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Short Description / Excerpt (Lead summary for homepage & social cards)
                  </label>
                  <textarea
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="Brief 2-sentence executive summary..."
                    className="w-full text-xs px-3.5 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-red-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* Sidebar Meta Controls */}
              <div className="md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author *</label>
                  <select
                    value={formAuthorId}
                    onChange={(e) => setFormAuthorId(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as PostStatus)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="scheduled">Scheduled (Future)</option>
                  </select>
                </div>

                {formStatus === 'scheduled' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Scheduled Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formScheduledFor}
                      onChange={(e) => setFormScheduledFor(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Feature on Homepage Cover
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Cloud, Microservices, DevOps"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Featured Image Chooser */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Featured Cover Image
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {corporatePresetImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setFormFeaturedImage(img.path)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      formFeaturedImage === img.path
                        ? 'border-red-600 ring-2 ring-red-100 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img.path} alt="" className="w-full h-20 object-cover" />
                    <div className="p-1.5 text-[10px] text-slate-600 truncate bg-white">
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={formFeaturedImage}
                onChange={(e) => setFormFeaturedImage(e.target.value)}
                placeholder="Or paste external image URL..."
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg text-slate-700"
              />
              <input
                type="text"
                value={formImageCaption}
                onChange={(e) => setFormImageCaption(e.target.value)}
                placeholder="Optional figure caption (e.g., Fig 1. Enterprise topology diagram)"
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 mt-2"
              />
            </div>

            {/* Content Body Editor or Live Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  Article Body (Supports Markdown: ## Headings, ```code```, &gt; Quotes, | Tables |)
                </label>
                <span className="text-[11px] text-slate-400">
                  Words: {formContent.split(/\s+/).filter(Boolean).length} · Est. Read:{' '}
                  {Math.max(1, Math.ceil(formContent.split(/\s+/).filter(Boolean).length / 200))} min
                </span>
              </div>

              {!editorPreviewMode ? (
                <textarea
                  rows={14}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="## Section Heading&#10;&#10;Write detailed technical insights..."
                  className="w-full text-xs sm:text-sm font-mono px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-red-500 leading-relaxed bg-slate-50/50"
                />
              ) : (
                <div className="border border-slate-200 rounded-xl p-6 bg-white min-h-[350px]">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
                    Live Formatted Content Preview:
                  </h3>
                  <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                    {formContent}
                  </div>
                </div>
              )}
            </div>

            {/* SEO & Meta Fields Section */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-500" />
                <span>SEO Search Engine Optimization Metadata</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">SEO Meta Title</label>
                    <span className="text-[10px] text-slate-400">{formSeoTitle.length}/60</span>
                  </div>
                  <input
                    type="text"
                    value={formSeoTitle}
                    onChange={(e) => setFormSeoTitle(e.target.value)}
                    placeholder="Concise 50-60 character Google search title"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    SEO Keywords (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formSeoKeywords}
                    onChange={(e) => setFormSeoKeywords(e.target.value)}
                    placeholder="cloud computing, microservices, kubernetes"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      SEO Meta Description (Google SERP snippet)
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {formSeoDescription.length}/160
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={formSeoDescription}
                    onChange={(e) => setFormSeoDescription(e.target.value)}
                    placeholder="120-160 characters summary with compelling call to action..."
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              {/* Live Google Search Result Simulator */}
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Google Search Snippet Simulator
                </span>
                <div className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer">
                  {formSeoTitle || `${formTitle || 'Article Title'} | ZENTEC Blog`}
                </div>
                <div className="text-xs text-[#006621] mt-0.5">
                  https://zentec.io/blog/{formSlug || 'article-slug'}
                </div>
                <div className="text-xs text-[#545454] mt-1 line-clamp-2">
                  {formSeoDescription || formExcerpt || 'Article summary description...'}
                </div>
              </div>
            </div>

            {/* Save Buttons at Bottom */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('posts')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSavePost('draft')}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSavePost('published')}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-500 shadow-xs cursor-pointer"
              >
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Categories List */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Configured Categories ({categories.length})
              </h3>
              <span className="text-[11px] text-slate-400">Required initial 7 categories</span>
            </div>

            <div className="divide-y divide-slate-100">
              {categories.map((cat) => {
                const count = posts.filter((p) => p.category === cat.name).length;
                return (
                  <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">/{cat.slug}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{cat.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {count} {count === 1 ? 'post' : 'posts'}
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Category Form */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs h-fit">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g., Quantum Computing"
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="What topics belong in this category?"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="text-xs font-mono px-3 py-1.5 border border-slate-200 rounded-lg w-28 text-slate-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: AUTHORS MANAGEMENT */}
      {activeTab === 'authors' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Authors List */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Editorial Authors & Contributors ({authors.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {authors.map((author) => {
                const count = posts.filter((p) => p.author.id === author.id).length;
                return (
                  <div key={author.id} className="p-4 flex items-start gap-4 hover:bg-slate-50">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{author.name}</h4>
                        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                          {count} {count === 1 ? 'article' : 'articles'}
                        </span>
                      </div>
                      <p className="text-xs text-red-600 font-medium">{author.role}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{author.bio}</p>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">{author.email}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Author Form */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs h-fit">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Add Editorial Author</h3>
            <form onSubmit={handleAddAuthor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Author Full Name *
                </label>
                <input
                  type="text"
                  value={newAuthName}
                  onChange={(e) => setNewAuthName(e.target.value)}
                  placeholder="e.g., Rajesh Kumar"
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role / Job Title *
                </label>
                <input
                  type="text"
                  value={newAuthRole}
                  onChange={(e) => setNewAuthRole(e.target.value)}
                  placeholder="e.g., Staff Security Engineer"
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newAuthEmail}
                  onChange={(e) => setNewAuthEmail(e.target.value)}
                  placeholder="rajesh.k@zentec.io"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={newAuthAvatar}
                  onChange={(e) => setNewAuthAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Author Bio (1-2 sentences)
                </label>
                <textarea
                  rows={2}
                  value={newAuthBio}
                  onChange={(e) => setNewAuthBio(e.target.value)}
                  placeholder="Bio and technical specializations..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Register Author
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: SEO & TECHNICAL METADATA SUITE */}
      {activeTab === 'seo' && (
        <div className="space-y-8">
          {/* SEO Overview Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Production Search Engine Optimization & Crawl Configuration
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              Complies with modern Search Console directives: dynamic XML sitemaps, robots.txt
              indexing rules, Open Graph rich snippet cards, and Schema.org structured data
              (JSON-LD) for enhanced SERP visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live XML Sitemap Generator */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-red-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Live XML Sitemap (/sitemap.xml)
                  </h4>
                </div>
                <button
                  onClick={() => {
                    const xml = blogStorage.generateSitemapXml(window.location.origin);
                    navigator.clipboard.writeText(xml);
                    alert('Sitemap XML copied to clipboard!');
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  Copy XML
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed">
                <code>{blogStorage.generateSitemapXml(window.location.origin)}</code>
              </pre>
            </div>

            {/* Live Robots.txt */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Robots.txt Crawler Directives (/robots.txt)
                  </h4>
                </div>
                <button
                  onClick={() => {
                    const txt = blogStorage.generateRobotsTxt(window.location.origin);
                    navigator.clipboard.writeText(txt);
                    alert('Robots.txt copied to clipboard!');
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  Copy robots.txt
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed">
                <code>{blogStorage.generateRobotsTxt(window.location.origin)}</code>
              </pre>
            </div>

            {/* Open Graph Social Card Simulator */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Share2 className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Social Sharing Card Preview (LinkedIn & X / Twitter)
                </h4>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Simulating Open Graph meta tags (<code className="font-mono">og:image</code>,{' '}
                <code className="font-mono">og:title</code>,{' '}
                <code className="font-mono">og:description</code>) for top featured post.
              </p>

              {posts[0] && (
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 max-w-md mx-auto shadow-2xs">
                  <img
                    src={posts[0].featuredImage}
                    alt=""
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4 bg-white border-t border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                      zentec.io
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                      {posts[0].title}
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {posts[0].excerpt}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Schema.org BlogPosting JSON-LD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Schema.org BlogPosting JSON-LD (Search Rich Snippets)
                  </h4>
                </div>
                <button
                  onClick={() => {
                    if (posts[0]) {
                      const jsonLd = blogStorage.generateArticleJsonLd(
                        posts[0],
                        window.location.origin
                      );
                      navigator.clipboard.writeText(jsonLd);
                      alert('JSON-LD copied to clipboard!');
                    }
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  Copy JSON-LD
                </button>
              </div>
              {posts[0] && (
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed">
                  <code>
                    {blogStorage.generateArticleJsonLd(posts[0], window.location.origin)}
                  </code>
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};