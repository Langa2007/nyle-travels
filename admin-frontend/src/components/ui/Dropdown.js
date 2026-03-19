'use client';

import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';

export default function Dropdown({
  trigger,
  items,
  placement = 'bottom-end',
  className = '',
}) {
  const placements = {
    'bottom-start': 'left-0',
    'bottom-end': 'right-0',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
  };

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      {({ open }) => (
        <>
          <Menu.Button as={Fragment}>
            {trigger || (
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Options
                <FiChevronDown className={`ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
            )}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={`
                absolute z-10 mt-2 w-56 origin-top-right
                bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5
                divide-y divide-gray-100 focus:outline-none
                ${placements[placement]}
              `}
            >
              {items.map((item, index) => {
                if (item.divider) {
                  return <div key={index} className="h-px bg-gray-200 my-1" />;
                }

                const Icon = item.icon;
                return (
                  <Menu.Item key={item.key || index}>
                    {({ active }) => (
                      <button
                        onClick={item.onClick}
                        disabled={item.disabled}
                        className={`
                          w-full text-left px-4 py-3 text-sm flex items-center space-x-3
                          ${active ? 'bg-gray-50' : ''}
                          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                          ${item.danger ? 'text-red-600' : 'text-gray-700'}
                        `}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span className="flex-1">{item.label}</span>
                        {item.shortcut && (
                          <span className="text-xs text-gray-400">{item.shortcut}</span>
                        )}
                      </button>
                    )}
                  </Menu.Item>
                );
              })}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}