import React, { useEffect, useState, useMemo } from 'react';
import { BlogPost, TableOfContentItem } from '../types';
import {
  Clock,
  Eye,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  ArrowLeft,
  Copy,
} from 'lucide-react';
import { ArticleCard } from './ArticleCard';

interface BlogDetailProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onSelectPost: (slug: string) => void;
  onBack: () => void;
  onIncrementView: (id: string) => void;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({
  post,
  allPosts,
  onSelectPost,
  onBack,
  onIncrementView,
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // Increment view on load
  useEffect(() => {
    onIncrementView(post.id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [post.id]);

  // Track scroll reading progress and active heading
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }

      // Check headings
      const headingElements = Array.from(document.querySelectorAll('h2[id], h3[id]'));
      const scrollPosition = window.scrollY + 140;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i] as HTMLElement;
        if (el.offsetTop <= scrollPosition) {
          setActiveSectionId(el.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse Table of Contents dynamically from Markdown headers
  const tableOfContents: TableOfContentItem[] = useMemo(() => {
    const lines = post.content.split('\n');
    const items: TableOfContentItem[] = [];

    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);

      if (h2Match) {
        const text = h2Match[1].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        items.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        items.push({ id, text, level: 3 });
      }
    });

    return items;
  }, [post.content]);

  // Previous and Next published posts
  const publishedPosts = useMemo(
    () => allPosts.filter((p) => p.status === 'published'),
    [allPosts]
  );
  const currentIndex = publishedPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < publishedPosts.length - 1
      ? publishedPosts[currentIndex + 1]
      : null;

  // Related posts (same category, excluding current)
  const relatedPosts = useMemo(() => {
    return publishedPosts
      .filter((p) => p.category === post.category && p.id !== post.id)
      .slice(0, 3);
  }, [publishedPosts, post]);

  // Copy link handler
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    });
  };

  // Render markdown content safely
  const renderContent = () => {
    const sections = post.content.split('\n\n');
    let codeBlockCounter = 0;

    return sections.map((section, idx) => {
      const trimmed = section.trim();

      // H2 Heading
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '');
        const id = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        return (
          <h2
            key={idx}
            id={id}
            className="text-2xl font-bold text-slate-900 mt-10 mb-4 pt-4 scroll-mt-24 border-t border-slate-100 first:border-t-0"
          >
            {title}
          </h2>
        );
      }

      // H3 Heading
      if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '');
        const id = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        return (
          <h3
            key={idx}
            id={id}
            className="text-lg font-semibold text-slate-900 mt-6 mb-3 scroll-mt-24"
          >
            {title}
          </h3>
        );
      }

      // Code Block
      if (trimmed.startsWith('```')) {
        codeBlockCounter++;
        const codeId = `code-block-${codeBlockCounter}`;
        const lines = trimmed.split('\n');
        const lang = lines[0].replace('```', '').trim() || 'code';
        const codeText = lines.slice(1, -1).join('\n');

        return (
          <div key={idx} className="my-6 rounded-xl overflow-hidden border border-slate-800 bg-[#0F172A] shadow-md">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold text-[11px] text-slate-300">
                {lang}
              </span>
              <button
                onClick={() => handleCopyCode(codeText, codeId)}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded hover:bg-slate-800"
              >
                {copiedCodeId === codeId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy Snippet</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-slate-100 font-mono">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Blockquote / Pull quote
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s*/gm, '');
        return (
          <blockquote
            key={idx}
            className="my-8 py-4 px-6 border-y border-slate-200/90 text-slate-800 italic text-base sm:text-lg leading-relaxed font-medium bg-slate-50/60 rounded-sm"
          >
            {quoteText}
          </blockquote>
        );
      }

      // Markdown Table
      if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
        const rows = trimmed.split('\n').filter((r) => r.trim().startsWith('|'));
        if (rows.length >= 2) {
          const headerCells = rows[0]
            .split('|')
            .filter((_, i, arr) => i > 0 && i < arr.length - 1)
            .map((c) => c.trim());

          const bodyRows = rows.slice(2).map((r) =>
            r
              .split('|')
              .filter((_, i, arr) => i > 0 && i < arr.length - 1)
              .map((c) => c.trim())
          );

          return (
            <div key={idx} className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx} className="p-3">
                        {h.replace(/\*\*/g, '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {bodyRows.map((r, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50">
                      {r.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3">
                          {cell.replace(/\*\*/g, '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Checklists
      if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
        const items = trimmed.split('\n');
        return (
          <ul key={idx} className="my-4 space-y-2 text-xs sm:text-sm text-slate-700">
            {items.map((item, itemIdx) => {
              const checked = item.includes('[x]');
              const text = item.replace(/-\s+\[[ x]\]\s*/, '');
              return (
                <li key={itemIdx} className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      checked
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3" />}
                  </div>
                  <span>{text}</span>
                </li>
              );
            })}
          </ul>
        );
      }

      // Bullet lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n');
        return (
          <ul key={idx} className="my-4 space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-700 leading-relaxed">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>
                {item.replace(/^[-*]\s+/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Numbered lists
      if (trimmed.match(/^\d+\.\s+/)) {
        const items = trimmed.split('\n');
        return (
          <ol key={idx} className="my-4 space-y-2 list-decimal list-inside text-xs sm:text-sm text-slate-700 leading-relaxed">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>
                {item.replace(/^\d+\.\s+/, '')}
              </li>
            ))}
          </ol>
        );
      }

      // Standard Paragraph
      return (
        <p
          key={idx}
          className="text-slate-700 text-sm sm:text-base leading-relaxed my-4"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div>
      {/* Fixed Reading Progress Bar at the top of the viewport */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100 z-50">
        <div
          className="h-full bg-red-600 reading-progress-bar"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="py-6 max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-slate-900 transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-red-600 font-semibold">{post.category}</span>
          <span aria-hidden="true">/</span>
          <span className="truncate max-w-xs">{post.title}</span>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mb-6">
            {post.excerpt}
          </p>

          {/* Author Byline & Article Stats */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">{post.author.name}</div>
                <div className="text-xs text-slate-500">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{post.publishedAt}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.readingTime} min read</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono tabular-nums">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.views.toLocaleString()} views</span>
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-10 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-16/9 max-h-[500px]">
          <img
            src={post.featuredImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        {post.imageCaption && (
          <p className="text-center text-xs text-slate-500 italic -mt-6 mb-8">
            {post.imageCaption}
          </p>
        )}

        {/* 2-Column Asymmetric Reading Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article Prose Column (8 Columns) */}
          <div className="lg:col-span-8">
            
            {/* Mobile collapsible Table of Contents */}
            {tableOfContents.length > 0 && (
              <div className="lg:hidden mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  Table of Contents
                </span>
                <nav className="space-y-1.5 text-xs">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-slate-600 hover:text-red-600 py-0.5"
                    >
                      {item.level === 3 ? '↳ ' : ''}{item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Rendered Prose Content */}
            <div className="prose-clean">{renderContent()}</div>

            {/* Tags Ribbon */}
            <div className="mt-10 pt-6 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-500 mr-2">Tags:</span>
              <div className="inline-flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Share Bar */}
            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share this article:</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        post.title
                      )}&url=${encodeURIComponent(window.location.href)}`,
                      '_blank'
                    )
                  }
                  className="p-2 text-slate-600 hover:text-[#1DA1F2] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                  title="Share on Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        window.location.href
                      )}`,
                      '_blank'
                    )
                  }
                  className="p-2 text-slate-600 hover:text-[#0A66C2] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`,
                      '_blank'
                    )
                  }
                  className="p-2 text-slate-600 hover:text-[#1877F2] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                  title="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Copy permanent link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Author Bio Card */}
            <div className="mt-8 p-6 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{post.author.name}</h3>
                    <p className="text-xs text-red-600 font-medium">{post.author.role}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{post.author.bio}</p>
              </div>
            </div>

            {/* Previous and Next Navigation Cards */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevPost ? (
                <div
                  onClick={() => onSelectPost(prevPost.slug)}
                  className="group cursor-pointer p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase mb-2">
                    <ChevronLeft className="w-3 h-3" />
                    <span>Previous Article</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-red-600 line-clamp-2 transition-colors">
                    {prevPost.title}
                  </h4>
                </div>
              ) : (
                <div />
              )}

              {nextPost && (
                <div
                  onClick={() => onSelectPost(nextPost.slug)}
                  className="group cursor-pointer p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all flex flex-col justify-between text-right"
                >
                  <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-slate-400 uppercase mb-2">
                    <span>Next Article</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-red-600 line-clamp-2 transition-colors">
                    {nextPost.title}
                  </h4>
                </div>
              )}
            </div>

          </div>

          {/* Sticky Desktop Table of Contents & Utilities (4 Columns) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Dynamic Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                      In This Article
                    </span>
                    <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <nav className="space-y-1.5 text-xs max-h-[380px] overflow-y-auto pr-1">
                    {tableOfContents.map((item) => {
                      const isActive = activeSectionId === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block transition-colors py-1 leading-snug rounded-sm ${
                            item.level === 3 ? 'pl-4 text-[11px]' : 'font-medium'
                          } ${
                            isActive
                              ? 'text-red-600 font-bold bg-red-50/50 pl-2'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {item.text}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* Author Widget in Sidebar */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs text-center">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-slate-100 mb-3"
                />
                <h4 className="text-sm font-bold text-slate-900">{post.author.name}</h4>
                <p className="text-xs text-red-600 font-medium mb-2">{post.author.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {post.author.bio}
                </p>
              </div>

              {/* Quick Share Widget */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
                <span className="text-xs font-semibold text-slate-600 block mb-3">
                  Found this valuable?
                </span>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Article Link</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </aside>

        </div>

        {/* Related Articles Block */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                  More on {post.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Related Articles</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <ArticleCard key={related.id} post={related} onSelect={onSelectPost} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
