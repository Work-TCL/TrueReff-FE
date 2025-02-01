'use client';

import React, { useState } from 'react';
import {
  Home,
  Box,
  User,
  Megaphone,
  BarChart,
  DollarSign,
  LifeBuoy,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  link?: string;
  children?: { label: string; link: string }[];
};

const Sidebar: React.FC = () => {
  const pathname = usePathname(); // Get the current path
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems: MenuItem[] = [
    { label: 'Overview', icon: Home, link: '/' },
    {
      label: 'Product Catalog',
      icon: Box,
      children: [
        { label: 'Add New Product', link: '/product/add' },
        { label: 'Product List', link: '/product/list' },
      ],
    },
    { label: 'Creator & Collaboration', icon: User, link: '/creator' },
    {
      label: 'Campaign',
      icon: Megaphone,
      children: [
        { label: 'Campaign List', link: '/campaign/list' },
        { label: 'Campaign Metrics', link: '/campaign/metrics' },
      ],
    },
    { label: 'Bids', icon: BarChart, link: '/bids' },
    { label: 'Brand Analysis', icon: BarChart, link: '/brand-analysis' },
    { label: 'Account Recharge', icon: DollarSign, link: '/recharge' },
    { label: 'Payments', icon: DollarSign, link: '/payments' },
    { label: 'Support', icon: LifeBuoy, link: '/support' },
    { label: 'Settings', icon: Settings, link: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-50 border-r border-gray-200">
      <div className="p-4 text-pink-600 font-bold text-xl">truereff</div>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item, idx) => (
          <div key={idx} className="group">
            {item.children ? (
              <div>
                <div
                  onClick={() => toggleMenu(item.label)}
                  className={`flex items-center px-4 py-2 space-x-3 cursor-pointer rounded-md ${
                    item.children.some((child) => pathname === child.link)
                      ? 'bg-pink-100 text-pink-600'
                      : 'text-gray-700 hover:bg-pink-100'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      item.children.some((child) => pathname === child.link)
                        ? 'text-pink-600'
                        : 'text-gray-700'
                    }`}
                  />
                  <span>{item.label}</span>
                  {expandedMenus[item.label] ? (
                    <ChevronDown className="ml-auto w-4 h-4" />
                  ) : (
                    <ChevronRight className="ml-auto w-4 h-4" />
                  )}
                </div>
                {expandedMenus[item.label] && (
                  <div className="ml-6 border-l border-gray-300">
                    {item.children.map((child, idx) => (
                      <Link
                        key={idx}
                        href={child.link}
                        className={`relative block px-4 py-1 rounded-md ${
                          pathname === child.link
                            ? 'bg-pink-100 text-pink-600'
                            : 'text-gray-500 hover:text-gray-700'
                        } before:absolute before:-left-4 before:top-1/2 before:h-0.5 before:w-4 before:bg-gray-300`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.link!}
                className={`flex items-center px-4 py-2 space-x-3 rounded-md ${
                  pathname === item.link
                    ? 'bg-pink-100 text-pink-600'
                    : 'text-gray-700 hover:bg-pink-100'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    pathname === item.link ? 'text-pink-600' : 'text-gray-700'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
