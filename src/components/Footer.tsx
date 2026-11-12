import React from 'react';
import { Category } from '../types';
import { Twitter, Linkedin, Github, Globe, ArrowUp } from 'lucide-react';

interface FooterProps {
  categories: Category[];
  onSelectCategory: (name: string | null) => void;
  onNavigateHome: () => void;
  onNavigateArticles: () => void;
  onNavigateAdmin: () => void;
  onNavigateGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  onSelectCategory,
  onNavigateHome,
  onNavigateArticles,
  onNavigateAdmin,
  onNavigateGuide,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-base">
                Z
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                ZENTEC <span className="font-normal text-slate-400">Technology Blog</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-6">
              A full-stack corporate technology publication inspired by Zoho Blog. Delivering in-depth architectural guides, distributed systems blueprints, and engineering leadership insights.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <button
                onClick={scrollToTop}
                className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors ml-auto cursor-pointer flex items-center gap-1 text-[11px]"
                title="Scroll back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col 3: Categories Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Topics & Domains
            </h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onNavigateArticles();
                      onSelectCategory(cat.name);
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform & Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={onNavigateHome}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Featured Stories
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateArticles}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Research Articles
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateGuide}
                  className="hover:text-amber-400 font-semibold text-amber-300 transition-colors cursor-pointer"
                >
                  Interview & Viva Guide
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateAdmin}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Editorial CMS Panel
                </button>
              </li>
              <li>
                <span className="text-slate-500">XML Sitemap (/sitemap.xml)</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Compliance & Tech Stack Info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Stack & Governance
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Built on React 19, TypeScript, Tailwind CSS v4, Express REST API, and MongoDB data modeling.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-300">
              <span className="font-semibold text-white block mb-0.5">Zoho Blog Architecture</span>
              Complies with Enterprise Zero-Pill & Editorial Guidelines.
            </div>
          </div>

        </div>

        {/* Bottom Bar: Quiet Copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} ZENTEC Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span className="hover:text-slate-400">Terms of Service</span>
            <span className="hover:text-slate-400">Security Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
