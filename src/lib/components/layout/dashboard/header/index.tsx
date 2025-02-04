import React from 'react'

export default function Header() {
  return (
    <header className="bg-white px-4 py-3 flex items-center">
      <h2 className="text-2xl font-medium text-gray-black">Overview</h2>
      <div className="ml-auto flex items-center gap-3">
        <div className="w-8 h-8 bg-background rounded-full"></div>
        <p className="text-gray-black">John Bing</p>
      </div>
    </header>
  )
}
