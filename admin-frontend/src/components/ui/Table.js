'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiChevronsUp, FiChevronsDown } from 'react-icons/fi';

export default function Table({
  columns,
  data,
  loading = false,
  onSort,
  onRowClick,
  emptyMessage = 'No data found',
  isLoading = false,
}) {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (column) => {
    if (!column.sortable) return;

    let direction = 'asc';
    if (sortConfig?.key === column.key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    setSortConfig({ key: column.key, direction });
    onSort?.({ key: column.key, direction });
  };

  const getSortIcon = (column) => {
    if (!column.sortable) return null;
    if (sortConfig?.key !== column.key) {
      return <FiChevronsUp className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />;
    }
    return sortConfig.direction === 'asc' ? (
      <FiChevronUp className="w-4 h-4 text-primary-600" />
    ) : (
      <FiChevronDown className="w-4 h-4 text-primary-600" />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* Header */}
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className={`
                  px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer group' : ''}
                `}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-200">
          <AnimatePresence>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <motion.tr
                  key={row.id || rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    hover:bg-gray-50 transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}