"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as NProgress from "nprogress";
import "@/app/nprogress.css";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: "ease",
  speed: 500,
});

export default function TopLoadingBar() {
  const pathname = usePathname();

  useEffect(() => {
    // Finish loading when pathname changes
    NProgress.done();
  }, [pathname]);

  useEffect(() => {
    // Function to handle click events on links
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const isExternal =
          href &&
          (href.startsWith("http") ||
            href.startsWith("//") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:"));
        const isSamePage = href && href.startsWith("#");

        // Only show loading bar for internal navigation
        if (href && !isExternal && !isSamePage) {
          NProgress.start();
        }
      }
    };

    // Add click listener to document
    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return null;
}
