import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export default function Breadcrumb({ items, className = '' }) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      <Link
        href="/admin"
        className="flex items-center text-gray-500 hover:text-gray-700"
      >
        <FiHome className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <FiChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-gray-700"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}