import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface NavItem {
  title: string;
  onClick?: () => void;
}

interface Props {
  items: NavItem[];
  defaultIndex?: number;
  onChange?: (currentIndex: number) => void;
  className?: string;
}

export function RoundedNav({ items, defaultIndex, onChange, className }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(defaultIndex ?? 0);
  }, [defaultIndex]);

  return (
    <div className="flex">
      <div
        className={twMerge(`flex justify-between space-x-1 bg-gray-100 rounded-2xl ${className ?? ''}`)}
        aria-label="Tabs"
      >
        {items.map((item, index: number) => {
          const isActive = index === activeIndex;
          const activeCx = isActive ? 'bg-black text-white' : '';
          return (
            <a
              key={item.title}
              href=""
              className={twMerge(
                `px-10 py-2 font-medium font-heading rounded-3xl text-sm bg-gray-100 text-secondary ${activeCx}`
              )}
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(index);
                if (onChange) {
                  onChange(index);
                }
              }}
            >
              {item.title}
            </a>
          );
        })}
      </div>
    </div>
  );
}
