"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

const HeaderWrapper = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <Navbar 
    mode={isHome ? "transparent" : "solid-light"}
    sidebarOpen={sidebarOpen}
    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    />
  );
};

export default HeaderWrapper;