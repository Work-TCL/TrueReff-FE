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

const NavLink = ({ link = '', isActive = false, Icon = undefined, label = '', hasSubmenu = false, handleToggle = () => { }, expended = false, isChild = false }: any) => {
  const childLinkClasses = `relative block px-4 py-2 rounded-md ${isActive
    ? 'bg-primary-color text-white'
    : 'text-gray-500 hover:text-gray-700'
    } before:absolute before:-left-4 before:top-1/2 before:h-0.5 before:w-4 before:bg-gray-300 before:rounded-xl text-nowrap`

  const classNames = isChild ? childLinkClasses : `flex items-center px-4 py-3 space-x-3 rounded-md text-nowrap  ${isActive
    ? 'bg-primary-color text-white'
    : 'text-font-grey hover:bg-pink-100'
    }`
  const iconClassNames = `w-5 h-5 ${isActive ? 'text-white' : 'text-font-grey'
    }`
  if (hasSubmenu) {
    return <div
      onClick={handleToggle}
      className={classNames}
    >
      {Icon && <Icon
        className={iconClassNames}
      />}
      <span>{label}</span>
      {expended ? (
        <ChevronDown className="ml-auto w-4 h-4" />
      ) : (
        <ChevronRight className="ml-auto w-4 h-4" />
      )}
    </div>
  }

  return (
    <Link
      href={link}
      className={classNames}
    >
      {Icon && <Icon
        className={iconClassNames}
      />}
      <span>{label}</span>
    </Link>
  )
}

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
    // { label: 'Overview', icon: Home, link: '/dashboard' },
    // {
    //   label: 'Product Catalog',
    //   icon: Box,
    //   children: [
    //     { label: 'Add New Product', link: '/product/add' },
    //     { label: 'Product List', link: '/product/list' },
    //   ],
    // },
    // { label: 'Creator & Collaboration', icon: User, link: '/creator' },
    // {
    //   label: 'Campaign',
    //   icon: Megaphone,
    //   children: [
    //     { label: 'Campaign List', link: '/campaign/list' },
    //     { label: 'Campaign Metrics', link: '/campaign/metrics' },
    //   ],
    // },
    // { label: 'Bids', icon: BarChart, link: '/bids' },
    // { label: 'Brand Analysis', icon: BarChart, link: '/brand-analysis' },
    // { label: 'Account Recharge', icon: DollarSign, link: '/recharge' },
    // { label: 'Payments', icon: DollarSign, link: '/payments' },
    // { label: 'Support', icon: LifeBuoy, link: '/support' },
    // { label: 'Settings', icon: Settings, link: '/settings' },
    { label: 'Overview', icon: Home, link: '/dashboard' },
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
        { label: 'Add New Campaign', link: '/campaign/add' },
        { label: 'Campaign List', link: '/campaign/list' },
        // { label: 'Campaign Metrics', link: '/campaign/metrics' },
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
    <aside className="max-w-[300px] w-full h-screen bg-white flex flex-col overflow-hidden">
      <div className="p-4 pb-8 text-primary-color font-bold text-4xl text-center">truereff</div>
      <nav className="flex flex-col space-y-2 px-3 overflow-auto flex-1">
        {menuItems.map((item, idx) => (
          <div key={idx} className="group">
            {item.children ? (
              <div>
                <NavLink
                  key={idx}
                  isActive={item.children.some((child) => pathname === child.link)}
                  handleToggle={() => !Boolean(item.children && item.children.some((child) => pathname === child.link)) && toggleMenu(item.label)}
                  label={item.label}
                  Icon={item.icon}
                  hasSubmenu
                  expended={expandedMenus[item.label] || item.children.some((child) => pathname === child.link)}
                />
                {expandedMenus[item.label] || Boolean(item.children.some((child) => pathname === child.link)) && (
                  <div className="px-4">
                    <div className="px-4 border-l border-gray-300 pt-2">
                      {item.children.map((child, idx) => (
                        <NavLink
                          key={idx}
                          link={child.link}
                          isActive={pathname === child.link}
                          label={child.label}
                          isChild
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={idx}
                link={item.link}
                isActive={pathname === item.link}
                Icon={item.icon}
                label={item.label}
              />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
