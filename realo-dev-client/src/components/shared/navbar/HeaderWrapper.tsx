"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import { getPublicMenu, type ServerNode } from "@/services/menus/menus";
import { Navbar, type MenuItem } from "./Navbar";
import { navItems as fallbackNavItems } from "./navData";

/** Server nodes carry ids and nulls the navbar does not need. */
const toMenuItems = (nodes: ServerNode[]): MenuItem[] =>
  nodes.map((node) => {
    const children = toMenuItems(node.children ?? []);
    return {
      label: node.label,
      ...(node.url ? { href: node.url } : {}),
      ...(children.length ? { children } : {}),
    };
  });

const HeaderWrapper = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Starts on the built-in navigation so the header renders immediately, then
  // swaps to whatever an admin has saved in the dashboard.
  const [items, setItems] = useState<MenuItem[]>(fallbackNavItems);

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    let cancelled = false;

    getPublicMenu("primary")
      .then((response) => {
        if (cancelled || !response.data?.items?.length) return;
        setItems(toMenuItems(response.data.items));
      })
      // No saved menu, or the API is unreachable: keep the built-in one.
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Navbar
      mode={isHome ? "transparent" : "solid-light"}
      items={items}
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    />
  );
};

export default HeaderWrapper;