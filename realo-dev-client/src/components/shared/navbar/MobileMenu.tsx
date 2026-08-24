"use client";

import  { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon, UserIcon, MapPinIcon, PlusIcon, MinusIcon } from 'lucide-react'
import { menuData } from '@/components/data/menuData';


interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}
const moreLinks = [
  'ABOUT US',
  'CAREERS',
  'LOOKBOOK',
  'PHOTOS & VIDEOS',
  'LATEST OFFERS',
  'NEWS & EVENTS',
  'STORIES',
  'DOWNLOAD ANDROID APP',
  'DOWNLOAD IOS APP',
  'TERMS & CONDITIONS',
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({})
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({})
  const [moreExpanded, setMoreExpanded] = useState(false)
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }))
  }
  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{
              x: '-100%',
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: '-100%',
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 flex flex-col lg:hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300">
              <button className="flex items-center gap-2 text-gray-900 hover:text-[#E8731A] transition-colors">
                <span className="text-3xl font-extrabold tracking-tighter text-[#E8731A] leading-none">
                  Realo Style
                </span>
              </button>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-900 hover:text-[#E8731A] transition-colors"
                aria-label="Close menu"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Menu Items - with custom orange scrollbar */}
            <div className="flex-1 overflow-y-auto mobile-drawer-scroll">
              <div className="flex flex-col">
                {menuData.map((category) => {
                  const isCategoryExpanded = expandedCategories[category.name]
                  const hasContent = category.columns.some(
                    (col) => col.length > 0,
                  )
                  return (
                    <div key={category.name}>
                      {/* Category button with bottom border */}
                      <button
                        onClick={() =>
                          hasContent && toggleCategory(category.name)
                        }
                        className={`w-full flex items-center justify-between px-4 py-4 text-left transition-colors border-b border-gray-200 ${isCategoryExpanded ? 'text-[#E8731A]' : 'text-gray-900'}`}
                      >
                        <span className="text-sm font-semibold tracking-wide uppercase">
                          {category.name}
                        </span>
                        {hasContent &&
                          (isCategoryExpanded ? (
                            <MinusIcon className="w-4 h-4 text-[#E8731A]" />
                          ) : (
                            <PlusIcon className="w-4 h-4 text-gray-400" />
                          ))}
                      </button>

                      {/* Expanded Category Content */}
                      <AnimatePresence>
                        {isCategoryExpanded && hasContent && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: 'auto',
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.25,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col">
                              {category.columns.flat().map((section, idx) => {
                                const sectionKey = `${category.name}-${section.title}-${idx}`
                                const hasItems =
                                  section.items && section.items.length > 0
                                const isSectionExpanded =
                                  expandedSections[sectionKey]
                                return (
                                  <div key={sectionKey}>
                                    {/* Section header with border */}
                                    <button
                                      onClick={() =>
                                        hasItems && toggleSection(sectionKey)
                                      }
                                      className={`w-full flex items-center justify-between px-6 py-3.5 text-left transition-colors border-b border-gray-200 ${isSectionExpanded ? 'text-[#E8731A]' : 'text-gray-800'}`}
                                    >
                                      <span className="text-sm uppercase tracking-wide font-medium">
                                        {section.title}
                                      </span>
                                      {hasItems &&
                                        (isSectionExpanded ? (
                                          <MinusIcon className="w-4 h-4 text-[#E8731A]" />
                                        ) : (
                                          <PlusIcon className="w-4 h-4 text-gray-400" />
                                        ))}
                                    </button>

                                    {/* Expanded Section Items */}
                                    <AnimatePresence>
                                      {isSectionExpanded && hasItems && (
                                        <motion.div
                                          initial={{
                                            height: 0,
                                            opacity: 0,
                                          }}
                                          animate={{
                                            height: 'auto',
                                            opacity: 1,
                                          }}
                                          exit={{
                                            height: 0,
                                            opacity: 0,
                                          }}
                                          transition={{
                                            duration: 0.2,
                                          }}
                                          className="overflow-hidden"
                                        >
                                          <ul className="flex flex-col">
                                            {section.items!.map(
                                              (item, itemIdx) => (
                                                <li key={itemIdx}>
                                                  <a
                                                    href="#"
                                                    className="block px-10 py-3 text-sm text-gray-600 hover:text-[#E8731A] transition-colors border-b border-gray-100"
                                                  >
                                                    {item}
                                                  </a>
                                                </li>
                                              ),
                                            )}
                                          </ul>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Dark Footer */}
            <div className="bg-[#1a2332] text-white flex-shrink-0 overflow-y-auto mobile-drawer-scroll-dark max-h-[45%]">
              <div className="flex flex-col">
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-4 border-b border-gray-600 hover:text-[#E8731A] transition-colors"
                >
                  <MapPinIcon className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-wide">LOCATION</span>
                </a>
                
                <a
                  href="#"
                  className="px-4 py-4 border-b border-gray-600 text-sm font-medium tracking-wide hover:text-[#E8731A] transition-colors"
                >
                  CUSTOMER SERVICE
                </a>

                {/* MORE expandable section */}
                <button
                  onClick={() => setMoreExpanded(!moreExpanded)}
                  className={`w-full flex items-center justify-between px-4 py-4 text-left transition-colors border-b border-gray-600 ${moreExpanded ? 'text-[#E8731A]' : 'text-white'}`}
                >
                  <span className="text-sm font-medium tracking-wide">
                    MORE
                  </span>
                  {moreExpanded ? (
                    <MinusIcon className="w-4 h-4 text-[#E8731A]" />
                  ) : (
                    <PlusIcon className="w-4 h-4" />
                  )}
                </button>

                <AnimatePresence>
                  {moreExpanded && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="overflow-hidden"
                    >
                      {moreLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href="#"
                          className="block px-4 py-4 border-b border-gray-600 text-sm font-medium tracking-wide text-white hover:text-[#E8731A] transition-colors"
                        >
                          {link}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}