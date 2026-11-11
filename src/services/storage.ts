import { BlogPost, Category, Author, PostStatus } from '../types';
import { INITIAL_POSTS, INITIAL_CATEGORIES, INITIAL_AUTHORS } from '../data/mockData';

const STORAGE_KEY_POSTS = 'zentec_blog_posts_v1';
const STORAGE_KEY_CATEGORIES = 'zentec_blog_categories_v1';
const STORAGE_KEY_AUTHORS = 'zentec_blog_authors_v1';

export const blogStorage = {
  getPosts: (): BlogPost[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_POSTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_POSTS));
        return INITIAL_POSTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_POSTS;
    }
  },

  getPublishedPosts: (): BlogPost[] => {
    const posts = blogStorage.getPosts();
    const now = new Date();
    return posts.filter((post) => {
      if (post.status === 'published') return true;
      if (post.status === 'scheduled' && post.scheduledFor) {
        const sched = new Date(post.scheduledFor);
        return sched <= now;
      }
      return false;
    });
  },

  getPostBySlug: (slug: string): BlogPost | undefined => {
    const posts = blogStorage.getPosts();
    return posts.find((p) => p.slug === slug || p.id === slug);
  },

  savePost: (post: BlogPost): BlogPost => {
    const posts = blogStorage.getPosts();
    const existingIndex = posts.findIndex((p) => p.id === post.id);

    let updatedPosts: BlogPost[];
    if (existingIndex >= 0) {
      updatedPosts = [...posts];
      updatedPosts[existingIndex] = post;
    } else {
      updatedPosts = [post, ...posts];
    }

    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(updatedPosts));
    return post;
  },

  deletePost: (id: string): boolean => {
    const posts = blogStorage.getPosts();
    const filtered = posts.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(filtered));
    return true;
  },

  incrementViewCount: (id: string): void => {
    try {
      const posts = blogStorage.getPosts();
      const post = posts.find((p) => p.id === id || p.slug === id);
      if (post) {
        post.views = (post.views || 0) + 1;
        blogStorage.savePost(post);
      }
    } catch {
      // Ignore storage errors in restricted iframe
    }
  },

  getCategories: (): Category[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategory: (category: Category): Category => {
    const categories = blogStorage.getCategories();
    const existingIdx = categories.findIndex((c) => c.id === category.id);
    let updated: Category[];
    if (existingIdx >= 0) {
      updated = [...categories];
      updated[existingIdx] = category;
    } else {
      updated = [...categories, category];
    }
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
    return category;
  },

  deleteCategory: (id: string): boolean => {
    const categories = blogStorage.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(filtered));
    return true;
  },

  getAuthors: (): Author[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_AUTHORS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_AUTHORS, JSON.stringify(INITIAL_AUTHORS));
        return INITIAL_AUTHORS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_AUTHORS;
    }
  },

  saveAuthor: (author: Author): Author => {
    const authors = blogStorage.getAuthors();
    const existingIdx = authors.findIndex((a) => a.id === author.id);
    let updated: Author[];
    if (existingIdx >= 0) {
      updated = [...authors];
      updated[existingIdx] = author;
    } else {
      updated = [...authors, author];
    }
    localStorage.setItem(STORAGE_KEY_AUTHORS, JSON.stringify(updated));
    return author;
  },

  resetToDefault: (): void => {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_POSTS));
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEY_AUTHORS, JSON.stringify(INITIAL_AUTHORS));
  },

  // SEO Helpers
  generateSitemapXml: (baseUrl: string): string => {
    const posts = blogStorage.getPublishedPosts();
    const categories = blogStorage.getCategories();

    const postUrls = posts
      .map(
        (p) => `  <url>
    <loc>${baseUrl}/blog/${p.slug}</loc>
    <lastmod>${p.publishedAt}T00:00:00Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join('\n');

    const catUrls = categories
      .map(
        (c) => `  <url>
    <loc>${baseUrl}/category/${c.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/articles</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${catUrls}
${postUrls}
</urlset>`;
  },

  generateRobotsTxt: (baseUrl: string): string => {
    return `# Robots.txt for ZENTEC Corporate Technology Blog
User-agent: *
Allow: /
Allow: /blog/
Allow: /articles
Allow: /category/
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  },

  generateArticleJsonLd: (post: BlogPost, baseUrl: string): string => {
    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.seoDescription || post.excerpt,
        image: post.featuredImage.startsWith('http')
          ? post.featuredImage
          : `${baseUrl}${post.featuredImage}`,
        author: {
          '@type': 'Person',
          name: post.author.name,
          jobTitle: post.author.role,
        },
        publisher: {
          '@type': 'Organization',
          name: 'ZENTEC Technologies',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
        datePublished: `${post.publishedAt}T00:00:00Z`,
        dateModified: `${post.publishedAt}T00:00:00Z`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/blog/${post.slug}`,
        },
        keywords: post.seoKeywords?.join(', ') || post.tags.join(', '),
        articleSection: post.category,
        wordCount: post.content.split(/\s+/).length,
      },
      null,
      2
    );
  },
};
