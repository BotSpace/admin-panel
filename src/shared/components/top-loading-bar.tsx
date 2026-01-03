"use client";

import { useEffect } from "react";
import { usePathname } from "@/shared/i18n/routing";
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
    // Finish loading when pathname changes (only if already started)
    NProgress.done();
  }, [pathname]);

  useEffect(() => {
    // Function to handle click events on links
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");
        
        // Don't show loading bar for:
        // - External links
        // - Links that open in new tab/window
        // - mailto/tel links
        // - Same-page anchors
        // - Links without href
        const isExternal =
          href &&
          (href.startsWith("http") ||
            href.startsWith("//") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:"));
        const isSamePage = href && href.startsWith("#");
        const opensNewTab = targetAttr === "_blank" || targetAttr === "_parent" || targetAttr === "_top";

        // Only show loading bar for internal navigation in same window
        if (href && !isExternal && !isSamePage && !opensNewTab) {
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
