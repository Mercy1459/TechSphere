import React, { useState } from 'react';
import {
  BookOpen,
  Server,
  Database,
  Code2,
  Cpu,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const PresentationGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'mern' | 'walkthrough' | 'viva' | 'setup'>('overview');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const vivaQuestions = [
    {
      q: '1. What is the core objective of this project and what inspired its architecture?',
      a: `Objective: To develop an enterprise-grade, content-focused Full-Stack Technology Blog Platform inspired by Zoho Blog's clean corporate aesthetics, structured taxonomy, and editorial reading experience.

Key Value Proposition:
- Decouples content authoring (CMS Admin Panel) from the reading experience (SSR/Static/CSR-ready client).
- Provides rich technical reading tools: dynamic Table of Contents with scrollspy, reading progress indicator, code snippets with copy button, and reading time estimation.
- Built-in SEO suite: XML sitemaps, robots.txt, Open Graph meta tags, and Schema.org JSON-LD structured data.`,
    },
    {
      q: '2. How does the MERN Stack architecture map onto this solution?',
      a: `M - MongoDB: Document-oriented database storing Posts, Categories, Authors, and Admin Users. Schema designs include indexing on 'slug' and 'tags' for sub-millisecond retrieval.
E - Express.js: RESTful API router handling CRUD operations (/api/posts, /api/categories, /api/authors, /api/auth), input sanitization, and role-based middleware.
R - React 19: Component-driven UI using hooks (useState, useEffect, useMemo), Tailwind CSS v4 for zero-runtime styling, and responsive layout grids.
N - Node.js: Asynchronous runtime executing the backend Express server, handling sitemap generation, and managing environment configurations.`,
    },
    {
      q: '3. How does the dynamic Table of Contents (TOC) track the active section during scroll?',
      a: `1. Content Parsing: The component scans the article markdown for headers matching /^##\\s+(.+)$/ and /^###\\s+(.+)$/.
2. Anchor Assignment: Each heading is assigned a normalized URL-safe ID (e.g., 'the-modern-multi-cloud-imperative').
3. Scroll Listener: A throttled window scroll listener compares window.scrollY with the el.offsetTop of all heading DOM elements.
4. Active State: The highest heading that has crossed the viewport threshold (scrollPosition = window.scrollY + 140px) is set as 'activeSectionId', highlighting the corresponding TOC link in real time.`,
    },
    {
      q: '4. How is the estimated reading time calculated?',
      a: `We use the standard cognitive reading benchmark of 200-220 words per minute (WPM):
\`\`\`typescript
const wordCount = content.trim().split(/\\s+/).filter(Boolean).length;
const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
\`\`\`
This calculation runs automatically whenever an author composes or saves an article in the Admin CMS.`,
    },
    {
      q: '5. How do you handle SEO (Search Engine Optimization) in this blog?',
      a: `Four complementary SEO layers are implemented:
1. Canonical Slugs: Semantic URLs (e.g., /blog/architecting-resilient-multi-cloud-microservices) instead of non-descriptive numeric IDs.
2. Open Graph & Twitter Cards: Generates og:title, og:description, and og:image tags so links shared on LinkedIn/Twitter preview with rich visuals.
3. Schema.org JSON-LD: Embeds structured 'BlogPosting' and 'Blog' schemas to enable Google Search rich snippets.
4. Dynamic Sitemaps & robots.txt: Automatically indexes all published articles and instructs search engine web crawlers.`,
    },
    {
      q: '6. How does the Admin CMS handle Post Scheduling and Drafts?',
      a: `Articles have three lifecycle statuses:
- 'published': Visible immediately to all public visitors.
- 'draft': Hidden from public views; visible only to authenticated admins in the CMS.
- 'scheduled': Includes a ISO-8601 'scheduledFor' timestamp. The public retrieval query filters articles where (status === 'published' || (status === 'scheduled' && new Date(scheduledFor) <= new Date())).`,
    },
    {
      q: '7. How is Admin CMS security and authentication enforced?',
      a: `In production, we use JWT (JSON Web Tokens) or session cookies:
1. Login credentials (/api/auth/login) are verified against hashed bcrypt passwords in MongoDB.
2. A signed JWT containing user ID and role ('admin') is returned to the client and stored in HttpOnly cookies or secure storage.
3. Protected routes (POST, PUT, DELETE on /api/posts) require the 'authMiddleware' to verify the Bearer token before permitting execution.`,
    },
    {
      q: '8. How did you design the user experience to match Zoho Blog standards?',
      a: `Zoho Blog is recognized for its distraction-free corporate minimalism:
- Zero-Pill Discipline: Unboxed, clean category labels and typographic bullet separators (·) rather than childish colorful badge pills.
- 60-30-10 Color Rule: 60% clean neutral canvas (#FBFBFC), 30% structural white card surfaces with subtle hairline borders, and 10% high-intent corporate red/slate accents.
- Dual-Column Asymmetric Layout: 8 columns for readable prose (65-75 characters measure) and 4 columns for sticky TOC and author bio.`,
    },
    {
      q: '9. How are images optimized to prevent Cumulative Layout Shift (CLS)?',
      a: `1. Defined Aspect Ratios: Containers use CSS aspect-ratio (aspect-16/9, aspect-16/10) with reserved dimensions so the browser knows the height before image download finishes.
2. Fallback Handlers: Styled CSS/SVG fallback containers prevent broken image icons if an external asset fails.
3. Lazy Loading & Modern Formats: Images use modern WebP/AVIF formats with loading="lazy" for offscreen cards.`,
    },
    {
      q: '10. What are the key MongoDB schemas used in this application?',
      a: `Four collections:
1. 'posts': { _id, title, slug (indexed, unique), excerpt, content, category, tags: [String], author: ObjectId, featuredImage, status, isFeatured, publishedAt, readingTime, views, seoTitle, seoDescription }
2. 'categories': { _id, name, slug (unique), description, color }
3. 'authors': { _id, name, role, bio, avatar, email }
4. 'users': { _id, email, passwordHash, role }`,
    },
  ];

  return (
    <div className="py-8 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Interview Presentation & Viva Guide
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Full Stack Technology Blog (Zoho Blog Architecture)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Comprehensive project walkthrough, MERN stack technical blueprints, viva questions with detailed answers, and Tamil/English presentation scripts prepared for your campus evaluation.
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-700/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            1. Project Summary & Elevator Pitch
          </button>
          <button
            onClick={() => setActiveTab('mern')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'mern'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            2. MERN Stack Architecture
          </button>
          <button
            onClick={() => setActiveTab('walkthrough')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'walkthrough'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            3. Feature-by-Feature Flow
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'viva'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            4. Top 10 Viva Questions & Answers
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'setup'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            5. Deployment & Run Guide
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & ELEVATOR PITCH */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Tamil Pitch Card */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                தமிழ் விளக்கம் – இன்டர்வியூவில் எப்படி பேச வேண்டும்? (Tamil Pitch Script)
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    `"வணக்கம் சார்/மேடம், இந்த ப்ராஜெக்ட் Zoho Blog-ஐ inspiration-ஆக வச்சு உருவாக்கப்பட்ட ஒரு Full-Stack Corporate Technology Blog Platform. 
இதில் இரண்டு முக்கிய பகுதிகள் இருக்கு:
1. Public Reader Portal: Visitors டெக்னாலஜி ஆர்ட்டிகிள்ஸ் படிக்கலாம், Category filter பண்ணலாம், Search பண்ணலாம், Real-time Table of Contents மற்றும் Reading Time கணக்கிடப்படும்.
2. Admin CMS Panel: Content team புதிய ஆர்ட்டிகிள்ஸ் எழுதலாம், Drafts சேமிக்கலாம், Future Date-க்கு Schedule பண்ணலாம், SEO meta data, Sitemap XML மற்றும் Schema.org markup-ஐ generate பண்ணலாம்.
இந்த ப்ராஜெக்ட் MERN Stack (MongoDB, Express, React, Node.js) மற்றும் Tailwind CSS பயன்படுத்தி சுத்தமான corporate standard-ல் உருவாக்கப்பட்டுள்ளது."`,
                    'tamil-pitch'
                  )
                }
                className="flex items-center gap-1 text-xs text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                {copiedSection === 'tamil-pitch' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Script</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-sans">
              <strong>இன்டர்வியூவில் சொல்ல வேண்டிய 2 நிமிட விளக்கம்:</strong>
              <br />
              &ldquo;வணக்கம் சார்/மேடம், இந்த ப்ராஜெக்ட் <strong>Zoho Blog</strong>-ஐ reference-ஆக கொண்டு உருவாக்கப்பட்ட ஒரு <strong>Full-Stack Corporate Technology Blog Website</strong>.
              <br />
              கம்பெனிகள் தங்களின் டெக்னாலஜி ஆர்ட்டிகிள்ஸ், கிளவுட் ஆர்க்கிடெக்சர், AI மற்றும் சைபர்செக்யூரிட்டி அப்டேட்களை எளிதாக வெளியிட இது உருவாக்கப்பட்டுள்ளது.
              <br />
              இதில் இரண்டு முக்கிய பிரிவுகள் உள்ளன:
              <br />
              1. <strong>Public Reader Platform</strong>: வாசகர்கள் எளிதாக ஆர்ட்டிகிள்ஸ் படிக்க, கேடகோரி வாரியாக ஃபில்டர் செய்ய, ரியல்-டைம் தேடல் (Search), dynamic Table of Contents, ரீடிங் டைம் மற்றும் சோசியல் ஷேர் வசதிகள் உள்ளது.
              <br />
              2. <strong>Admin CMS Panel</strong>: இன்டர்னல் எடிட்டோரியல் டீம் டெவலப்பர்கள் உதவி இல்லாமலே புதிய ஆர்ட்டிகிள்ஸ் எழுத, வரைவாக (Draft) வைக்க, எதிர்கால தேதிக்கு Schedule செய்ய, படங்கள் இணைக்க மற்றும் SEO Meta/Sitemap அமைக்க முடியும்.
              <br />
              முழு ஆர்க்கிடெக்சரும் MERN Stack விதிகளுக்கு ஏற்ப வடிவமைக்கப்பட்டுள்ளது.&rdquo;
            </p>
          </div>

          {/* English 2-Minute Professional Pitch */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                English Elevator Pitch (Professional Technical Panel Script)
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    `"Good morning / afternoon. I built a Full-Stack Corporate Technology Blog Platform inspired by Zoho Blog's content-first architecture. The goal is to provide engineering organizations with a self-sufficient editorial ecosystem.

Architecturally, the platform is divided into two distinct subsystems:
1. An optimized Public Content Reader featuring responsive category navigation across all 7 core technology pillars, keyword search, reading progress indicators, and automated Schema.org JSON-LD structured data for Google Search.
2. A comprehensive Admin Content Management System (CMS) that gives editorial teams complete CRUD autonomy—including draft-to-publish workflows, future post scheduling, slug generation, author and category management, and dynamic XML sitemap generation.

It follows the MERN stack paradigm with a type-safe React 19 frontend, clean Tailwind CSS v4 design without generic AI clutter, and a RESTful Express/MongoDB architecture."`,
                    'eng-pitch'
                  )
                }
                className="flex items-center gap-1 text-xs text-red-600 font-semibold hover:underline cursor-pointer"
              >
                {copiedSection === 'eng-pitch' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Script</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              &ldquo;Good morning / afternoon. I built a Full-Stack Corporate Technology Blog Platform inspired by Zoho Blog&apos;s content-first architecture. The goal is to provide engineering organizations with a self-sufficient editorial ecosystem.
              <br /><br />
              Architecturally, the platform is divided into two distinct subsystems:
              <br />
              <strong>1. Public Content Reader:</strong> Featuring responsive category navigation across all 7 core technology pillars, keyword search, reading progress indicators, code snippets with copy button, and automated Schema.org JSON-LD structured data for Google Search.
              <br />
              <strong>2. Admin Content Management System (CMS):</strong> Giving editorial teams complete CRUD autonomy—including draft-to-publish workflows, future post scheduling, slug generation, author and category management, and dynamic XML sitemap generation.
              <br /><br />
              It follows the MERN stack paradigm with a type-safe React 19 frontend, clean Tailwind CSS v4 design without generic AI clutter, and a RESTful Express/MongoDB architecture.&rdquo;
            </p>
          </div>

          {/* Key Deliverables Alignment Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Project Requirements Compliance Matrix
            </h3>
            <div className="space-y-3">
              {[
                {
                  req: 'Homepage with Logo, Featured Posts, Category Nav, Search & Popular Section',
                  status: 'Fully Implemented',
                  detail: 'Zoho-style top bar, cover story, 7-category horizontal scroll bar, instant search modal, and trending post rankings.',
                },
                {
                  req: 'Blog Listing Page with Categories, Keywords Search & Pagination',
                  status: 'Fully Implemented',
                  detail: 'Dedicated listing view with category filters, live search, 3 sorting modes (date, views, read time), and paginated grid.',
                },
                {
                  req: 'Blog Detail Page with Reading Time, TOC, Social Share, Prev/Next Navigation',
                  status: 'Fully Implemented',
                  detail: 'Dynamic Markdown rendering (code copy, tables, quotes), sticky scrollspy Table of Contents, top progress bar, and related posts.',
                },
                {
                  req: 'Admin CMS with Full CRUD, Drafts, Scheduling, Featured Toggle & Image Selection',
                  status: 'Fully Implemented',
                  detail: 'Secure auth gate, real-time KPI metrics, post editor with live preview, category & author managers, and factory reset option.',
                },
                {
                  req: 'Initial 7 Technology Categories Configured',
                  status: 'Fully Implemented',
                  detail: 'Software Development, AI & ML, Web & Mobile, Tech & Innovation, Cybersecurity, Cloud Computing, Industry Insights.',
                },
                {
                  req: 'SEO Deliverables: URLs, XML Sitemap, Robots.txt, Open Graph, Schema.org',
                  status: 'Fully Implemented',
                  detail: 'Automated sitemap.xml generator, robots.txt directives, OpenGraph social card simulator, and valid BlogPosting JSON-LD.',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.req}</span>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MERN STACK ARCHITECTURE */}
      {activeTab === 'mern' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* MongoDB Schemas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  M - MongoDB Schemas (Mongoose)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Normalized relational references for Authors and Categories with indexes on <code className="font-mono">slug</code> for fast URL resolution.
              </p>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`// models/Post.js
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true, index: true },
  tags: [{ type: String, index: true }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  featuredImage: { type: String, required: true },
  status: { type: String, enum: ['published', 'draft', 'scheduled'], default: 'published' },
  scheduledFor: { type: Date },
  isFeatured: { type: Boolean, default: false },
  readingTime: { type: Number, default: 5 },
  views: { type: Number, default: 0 },
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: [{ type: String }]
}, { timestamps: true });`}
              </pre>
            </div>

            {/* Express.js REST API */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  E - Express.js REST API Routing
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Clean RESTful endpoints with parameter validation, pagination, and role-based middleware.
              </p>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`// routes/posts.js
router.get('/api/posts', async (req, res) => {
  const { category, search, page = 1, limit = 6 } = req.query;
  const query = { status: 'published' };
  if (category) query.category = category;
  if (search) query.$text = { $search: search };
  
  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json(posts);
});

router.post('/api/posts', authMiddleware, async (req, res) => {
  const newPost = await Post.create(req.body);
  res.status(201).json(newPost);
});`}
              </pre>
            </div>

            {/* React 19 Frontend */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="w-5 h-5 text-cyan-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  R - React 19 Client Architecture
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Component breakdown, custom hooks, and zero-pill typographic discipline.
              </p>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`src/
├── components/
│   ├── Header.tsx         # Zoho Top Bar & Category Ribbon
│   ├── HeroFeatured.tsx   # 7/5 Asymmetric Grid Cover Story
│   ├── ArticleCard.tsx    # Zero-pill typography & separators
│   ├── BlogDetail.tsx     # Scrollspy TOC & Markdown Reader
│   ├── BlogListing.tsx    # Filterable grid with pagination
│   ├── AdminPanel.tsx     # CMS Editor & SEO Generator Suite
│   └── Footer.tsx         # Corporate corporate info & links
├── services/
│   └── storage.ts         # LocalStorage fallback & API client
└── types/
    └── index.ts           # Type-safe Post, Category & Author`}
              </pre>
            </div>

            {/* Node.js Runtime */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  N - Node.js Server Environment
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Runs Vite dev middlewares in development, serves static assets in production, and provides dynamic XML sitemap generation.
              </p>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`// server.ts
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Dynamic XML Sitemap Endpoint
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.send(generateXmlSitemap());
});

app.listen(3000, () => {
  console.log('Server operational on port 3000');
});`}
              </pre>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: FEATURE-BY-FEATURE WALKTHROUGH */}
      {activeTab === 'walkthrough' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">
            Step-by-Step Feature Walkthrough for the Interview Demonstration
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Follow this chronological presentation sequence when screen sharing or presenting live to the interviewers:
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                Step 1: Homepage & Editorial Hierarchy
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Show the top navigation bar with the clean single-wordmark brand. Point out the horizontal Category Ribbon inspired by Zoho Blog. Point out the 7/5 column asymmetric Hero Section featuring the cover story (&ldquo;Architecting Resilient Multi-Cloud Microservices&rdquo;) alongside the secondary features and newsletter subscription card.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                Step 2: Interactive Category Filtering & Real-Time Search
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Click on category tabs (e.g., &ldquo;Cybersecurity&rdquo; or &ldquo;Cloud Computing&rdquo;) to show instant filtering. Then click the search icon in the header to show the real-time search modal that searches across titles, descriptions, and tags with instant article cards.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                Step 3: Dedicated Blog Detail Reader Experience
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Click on any article to open the dedicated reader. Demonstrate:
                <br />
                • The red reading progress bar tracking scroll at the very top.
                <br />
                • The dynamic Table of Contents on the right sidebar that updates its active highlight as you scroll through headings.
                <br />
                • The embedded code blocks with one-click &ldquo;Copy Snippet&rdquo; feedback.
                <br />
                • The previous and next article navigation cards and related articles at the bottom.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                Step 4: Admin CMS & Content Publishing Workflow
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Click &ldquo;Admin CMS&rdquo; in the top right. Demonstrate:
                <br />
                • Secure login screen with pre-filled credentials.
                <br />
                • Dashboard metrics showing Total Articles, Published, Drafts, Scheduled, and Readership.
                <br />
                • Click &ldquo;Write New Article&rdquo; to show the automated slug generator, corporate image chooser, category selector, and live Markdown preview.
                <br />
                • Show the Google Search SERP simulator showing real-time title/meta snippet limits.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                Step 5: Production SEO & Metadata Suite
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Open the &ldquo;SEO & Metadata Suite&rdquo; tab inside Admin CMS. Show the generated XML Sitemap, robots.txt, Open Graph social share card preview, and the Schema.org JSON-LD structured data block.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TOP 10 VIVA QUESTIONS & ANSWERS */}
      {activeTab === 'viva' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Technical Viva Questions & Model Answers
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Click on each question to review the in-depth technical explanation. Practice these answers before your interview!
            </p>
          </div>

          <div className="space-y-3">
            {vivaQuestions.map((item, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full text-left p-4.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {item.q}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4.5 pt-0 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: DEPLOYMENT & RUN GUIDE */}
      {activeTab === 'setup' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">
            Local Setup & Production Build Instructions
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Commands to run or showcase this project in any standard development environment:
          </p>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl">
              <span className="text-slate-400 block mb-2 font-sans font-semibold text-[11px]">
                1. Clone repository and install dependencies
              </span>
              <code>git clone &lt;repo-url&gt;</code>
              <br />
              <code>cd tech-blog-mern</code>
              <br />
              <code>npm install</code>
            </div>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl">
              <span className="text-slate-400 block mb-2 font-sans font-semibold text-[11px]">
                2. Run development server (Vite on port 3000)
              </span>
              <code>npm run dev</code>
            </div>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl">
              <span className="text-slate-400 block mb-2 font-sans font-semibold text-[11px]">
                3. Compile production bundle
              </span>
              <code>npm run build</code>
            </div>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl">
              <span className="text-slate-400 block mb-2 font-sans font-semibold text-[11px]">
                4. Production Preview
              </span>
              <code>npm run preview</code>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
