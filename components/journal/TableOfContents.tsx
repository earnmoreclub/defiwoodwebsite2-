'use client';

import { useEffect, useState } from 'react';
import { TableOfContentsItem } from '@/types/journal';
import { BookOpen } from 'lucide-react';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="hidden xl:block sticky top-24 w-64 shrink-0"
    >
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span className="text-xs uppercase tracking-editorial text-slate-400 font-medium">
            目錄
          </span>
        </div>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`
                  block py-1.5 text-sm transition-colors duration-200 rounded px-2
                  ${
                    item.level === 1
                      ? 'font-medium'
                      : 'pl-4 text-slate-400'
                  }
                  ${
                    activeId === item.id
                      ? 'text-purple-400 bg-purple-400/10'
                      : 'text-slate-400 hover:text-white'
                  }
                `}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
