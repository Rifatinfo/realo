import { useEffect, useState, Children } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  SearchIcon,
  HeartIcon,
  ShoppingCartIcon,
  MenuIcon,
  XIcon,
  MapPinIcon,
  PlusIcon,
  MinusIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "./navData";
import WhiteLogo from "../logo/WhiteLogo";
import BlackLogo from "../logo/BlackLogo";

type NavMode = "transparent" | "solid-light";
interface NavbarProps {
  mode: NavMode;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}
export interface MenuItem {
  label: string;
  href?: string;
  children?: MenuItem[];
}
// ============================================================
// FULL CATEGORY TREE — shared between desktop & mobile
// ============================================================

// ============================================================
// Helpers
// ============================================================
function hasChildren(item: MenuItem): boolean {
  return !!item.children && item.children.length > 0;
}
function ExpandToggle({
  open,
  size = "md",
}: {
  open: boolean;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <motion.span
      className="inline-flex items-center justify-center"
      animate={{
        rotate: open ? 180 : 0,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      {open ? (
        <MinusIcon className={sizeClass} />
      ) : (
        <PlusIcon className={sizeClass} />
      )}
    </motion.span>
  );
}
// ============================================================
// Desktop recursive dropdown panel
// ============================================================
interface DesktopPanelProps {
  items: MenuItem[];
  mode: NavMode;
  level: number;
}
function DesktopPanel({ items, mode, level }: DesktopPanelProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Theme: home (transparent) -> black bg, white text. Other pages -> white bg, black text.
  const isDark = mode === "transparent";
  const panelBg = isDark ? "bg-black" : "bg-white";
  const panelText = isDark ? "text-white/90" : "text-gray-700";
  const itemHover = isDark
    ? "hover:bg-white/5 hover:text-[#FF6B1A]"
    : "hover:bg-orange-50 hover:text-[#FF6B1A]";
  const itemActive = isDark
    ? "bg-white/5 text-[#FF6B1A]"
    : "bg-orange-50 text-[#FF6B1A]";
  const shadow = isDark ? "shadow-2xl shadow-black/50" : "shadow-2xl";
  // width based on level — first level wider for All Categories
  const minWidth = level === 0 ? "min-w-[260px]" : "min-w-[240px]";
  return (
    <div
      className={`${panelBg} ${panelText} ${shadow} rounded-md py-2 ${minWidth}`}
    >
      {items.map((item) => {
        const isOpen = hovered === item.label;
        const expandable = hasChildren(item);
        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => expandable && setHovered(item.label)}
            onMouseLeave={() => setHovered(null)}
          >
            {item.href ? (
              <Link
                href={item.href}
                className={`flex items-center justify-between px-5 py-2.5 text-[15px] transition-colors ${isOpen ? itemActive : itemHover}`}
              >
                <span>{item.label}</span>
                {expandable && <ExpandToggle open={isOpen} size="sm" />}
              </Link>
            ) : (
              <button
                className={`w-full flex items-center justify-between px-5 py-2.5 text-[15px] text-left transition-colors ${isOpen ? itemActive : itemHover}`}
              >
                <span>{item.label}</span>
                {expandable && <ExpandToggle open={isOpen} size="sm" />}
              </button>
            )}

            <AnimatePresence>
              {isOpen && expandable && (
                <motion.div
                  initial={{
                    opacity: 0,
                    x: -8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -8,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="absolute left-full top-0 pl-1 z-10"
                >
                  <DesktopPanel
                    items={item.children!}
                    mode={mode}
                    level={level + 1}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
// ============================================================
// Mobile recursive expandable item
// ============================================================
interface MobileItemProps {
  item: MenuItem;
  depth: number;
  pathKey: string;
  expandedKeys: string[];
  toggle: (key: string) => void;
  onNavigate: () => void;
}
function MobileItem({
  item,
  depth,
  pathKey,
  expandedKeys,
  toggle,
  onNavigate,
}: MobileItemProps) {
  const isOpen = expandedKeys.includes(pathKey);
  const expandable = hasChildren(item);
  const indent = depth * 16 + 20; // pl-5 base + nested indent
  const baseTextSize =
    depth === 0 ? "text-sm font-semibold tracking-wide" : "text-sm";
  const colorClass = isOpen && expandable ? "text-[#FF6B1A]" : "text-gray-800";
  return (
    <div
      className={
        depth === 0 ? "border-b border-gray-100" : "border-t border-gray-100"
      }
    >
      {item.href && !expandable ? (
        <Link
          href={item.href}
          onClick={onNavigate}
          style={{
            paddingLeft: indent,
          }}
          className={`flex items-center justify-between pr-5 py-3 ${baseTextSize} text-gray-700 hover:text-[#FF6B1A]`}
        >
          <span>{item.label}</span>
        </Link>
      ) : (
        <button
          onClick={() => expandable && toggle(pathKey)}
          style={{
            paddingLeft: indent,
          }}
          className={`w-full flex items-center justify-between pr-5 py-3 text-left ${baseTextSize} ${colorClass}`}
        >
          <span>{item.label}</span>
          {expandable && (
            <ExpandToggle open={isOpen} size={depth === 0 ? "md" : "sm"} />
          )}
        </button>
      )}

      <AnimatePresence>
        {isOpen && expandable && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="overflow-hidden bg-gray-50/60"
          >
            {item.children!.map((child) => (
              <MobileItem
                key={child.label}
                item={child}
                depth={depth + 1}
                pathKey={`${pathKey}/${child.label}`}
                expandedKeys={expandedKeys}
                toggle={toggle}
                onNavigate={onNavigate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// ============================================================
// Main Navbar
// ============================================================
export function Navbar({ mode }: NavbarProps) {



//   const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
//   const totalWishlistItems = wishlist.length;

  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string[]>([]);
  const [expandedBottom, setExpandedBottom] = useState<string[]>([]);
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const isTransparent = mode === "transparent" && !scrolled;
  const textClass = mode === "transparent" ? "text-white" : "text-gray-900";
  const iconClass = mode === "transparent" ? "text-white" : "text-gray-700";

  const toggleMobile = (key: string) => {
    setExpandedMobile((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };
  const toggleBottom = (key: string) => {
    setExpandedBottom((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };
  const closeMobile = () => {
    setMobileMenuOpen(false);
    setExpandedMobile([]);
  };

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    setHoveredItem(null);
    setMobileMenuOpen(false);
    setExpandedMobile([]);
    setExpandedBottom([]);
    setIsAiOpen(false);
  }, [pathname]);
  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={false}
        animate={{
          backgroundColor: isTransparent
            ? "rgba(0,0,0,0)"
            : mode === "transparent"
              ? "rgba(0,0,0,1)"
              : "rgba(255,255,255,1)",
          boxShadow: isTransparent
            ? "0 0 0 rgba(0,0,0,0)"
            : "0 2px 8px rgba(0,0,0,0.08)",
        }}
        transition={{
          duration: 0.3,
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden ${iconClass}`}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center mb-3">
              <p> {isHome ? <WhiteLogo /> : <BlackLogo />}</p>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center space-x-7">
              {navItems.map((item) => {
                const isOpen = hoveredItem === item.label;
                const expandable = hasChildren(item);
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-1.5 ${textClass} hover:text-[#C2410C] transition-colors font-medium`}
                      >
                        <span>{item.label}</span>
                        {expandable && <ExpandToggle open={isOpen} />}
                      </Link>
                    ) : (
                      <button
                        className={`flex items-center gap-1.5 ${textClass} hover:text-[#C2410C] transition-colors font-medium`}
                      >
                        <span>{item.label}</span>
                        {expandable && <ExpandToggle open={isOpen} />}
                      </button>
                    )}

                    <AnimatePresence>
                      {isOpen && expandable && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: -8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: -8,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                          className="absolute top-full left-0 pt-3"
                        >
                          <DesktopPanel
                            items={item.children!}
                            mode={mode}
                            level={0}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2 ">
              {/* Ask AI Button */}
             {/* <AskAIButton  onClick={() => setIsAiOpen(true)} /> */}
             <Link href="/login">
              <button
                className={`hidden lg:block ${iconClass} hover:text-[#FF6B1A] transition-colors cursor-pointer`}
                aria-label="Login"
              >
                <UserIcon className="w-6 h-6" />
              </button>
             </Link>
              <button
                className={`hidden lg:block ${iconClass} hover:text-[#FF6B1A] transition-colors cursor-pointer`}
                aria-label="Search"
              >
                <SearchIcon className="w-6 h-6" />
              </button>
              <button
                className={`hidden lg:block relative ${iconClass} hover:text-[#D94D1B] transition-colors cursor-pointer`}
                aria-label="Wishlist"
              >
                <HeartIcon className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-[#D94D1B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  0
                </span>
              </button>
              <button
                
                className={`relative ${iconClass} hover:text-[#FF6B1A] transition-colors`}
                aria-label="Cart"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-[#D94D1B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

       {/* =========================== AI MODAL ================================== */}
      {/* <AiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      /> */}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
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
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={closeMobile}
            />
            <motion.div
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "tween",
                duration: 0.3,
              }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-xs bg-white z-[70] lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 shrink-0">
                <BlackLogo />
                {/* social user icon */}

                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2 ">
                    <Link
                      href="/login"
                      className={`md:hidden block ${iconClass} hover:text-[#FF6B1A] transition-colors`}
                    >
                      <UserIcon className="w-6 h-6" />
                    </Link>
                    <button
                      className={`md:hidden block ${iconClass} hover:text-[#FF6B1A] transition-colors`}
                      aria-label="Search"
                    >
                      <SearchIcon className="w-6 h-6" />
                    </button>
                    <button
                      className={`md:hidden block relative ${iconClass} hover:text-[#D94D1B] transition-colors`}
                      aria-label="Wishlist"
                    >
                      <HeartIcon className="w-6 h-6" />
                      <span className="absolute -top-2 -right-2 bg-[#D94D1B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        0
                      </span>
                    </button>
                  </div>
                </div>
                <button
                  onClick={closeMobile}
                  aria-label="Close menu"
                  className="p-1"
                >
                  <XIcon className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* Menu Items — same structure as desktop */}
              <div className="flex-1 overflow-y-auto">
                {navItems.map((item) => (
                  <MobileItem
                    key={item.label}
                    item={item}
                    depth={0}
                    pathKey={item.label}
                    expandedKeys={expandedMobile}
                    toggle={toggleMobile}
                    onNavigate={closeMobile}
                  />
                ))}
              </div>

              {/* Bottom Section */}
              <div className="bg-[#1E293B] text-white shrink-0">
                <Link
                  href="#"
                  className="flex items-center gap-3 px-5 py-4 border-b border-white/10 font-semibold text-sm tracking-wide"
                >
                  <MapPinIcon className="w-5 h-5" />
                  <span>LOCATION</span>
                </Link>
                <Link
                  href="#"
                  className="block px-5 py-4 border-b border-white/10 font-semibold text-sm tracking-wide"
                >
                  CUSTOMER SERVICE
                </Link>
                <div>
                  <button
                    onClick={() => toggleBottom("MORE")}
                    className="w-full flex items-center justify-between px-5 py-4 font-semibold text-sm tracking-wide"
                  >
                    <span
                      className={
                        expandedBottom.includes("MORE") ? "text-[#FF6B1A]" : ""
                      }
                    >
                      MORE
                    </span>
                    <ExpandToggle open={expandedBottom.includes("MORE")} />
                  </button>
                  <AnimatePresence>
                    {expandedBottom.includes("MORE") && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className="overflow-hidden bg-[#0F172A]"
                      >
                        <Link
                          href="/about"
                          onClick={closeMobile}
                          className="block px-5 py-3 text-sm hover:bg-white/5"
                        >
                          ABOUT US
                        </Link>
                        <Link
                          href="#"
                          className="block px-5 py-3 text-sm hover:bg-white/5"
                        >
                          CAREERS
                        </Link>
                        <Link
                          href="#"
                          className="block px-5 py-3 text-sm hover:bg-white/5"
                        >
                          LOOKBOOK
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}