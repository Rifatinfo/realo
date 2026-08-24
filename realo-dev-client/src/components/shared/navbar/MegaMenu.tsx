"use client";

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { MenuCategory } from '@/components/data/menuData';


interface MegaMenuProps {
  category: MenuCategory
}
export function MegaMenu({ category }: MegaMenuProps) {
  const totalColumns = category.columns.length
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 5,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 5,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-8 py-8 flex gap-0">
        {/* Columns Container */}
        <div className="flex-1 flex">
          {category.columns.map((column, colIdx) => (
            <Fragment key={colIdx}>
              <div className="flex-1 flex flex-col gap-6 px-6 first:pl-0 last:pr-0">
                {column.map((section, secIdx) => (
                  <div key={secIdx} className="flex flex-col">
                    <a
                      href="#"
                      className="text-[13px] font-bold text-gray-900 uppercase tracking-wide mb-3 hover:text-[#E8731A] transition-colors"
                    >
                      {section.title}
                    </a>
                    {section.items && section.items.length > 0 && (
                      <ul className="flex flex-col gap-2">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <a
                              href="#"
                              className="text-[13px] text-gray-500 hover:text-[#E8731A] transition-colors"
                            >
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              {/* Vertical line separator between columns */}
              {colIdx < totalColumns - 1 && (
                <div className="w-px bg-gray-200 self-stretch flex-shrink-0" />
              )}
            </Fragment>
          ))}
        </div>

        {/* Promotional Image */}
        {category.image && (
          <>
            <div className="w-px bg-gray-200 self-stretch flex-shrink-0 ml-6" />
            <div className="w-[280px] flex-shrink-0 ml-6">
              <img
                src={category.image}
                alt={`${category.name} promotional`}
                className="w-full h-full object-cover"
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}