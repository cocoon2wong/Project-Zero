/*
 * @Author: Conghao Wong
 * @Date: 2026-09-23 17:38:10
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-23 17:51:45
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */


/**
 * Normalizes a URL path by prepending Astro's `BASE_URL` if configured.
 * Safely preserves external protocols, mailto links, and anchor fragments.
 *
 * @param path The incoming URL or relative path
 * @returns The resolved path respecting BASE_URL
 */
export function withBase(path?: string): string {
  if (!path) return "";

  // Preserve absolute protocol URLs (http://, https://, //), mailto, and anchors
  if (
    /^(?:[a-z]+:)?\/\//i.test(path) ||
    path.startsWith("mailto:") ||
    path.startsWith("#")
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (!base) return path;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Avoid redundant prefix if the path already starts with the base path
  if (cleanPath.startsWith(base + "/") || cleanPath === base) {
    return cleanPath;
  }

  return `${base}${cleanPath}`;
}

/**
 * Calculates the active navigation item index given the current pathname and all link hrefs.
 * Ensures single-item activation: exact matches take precedence, followed by longest prefix matches.
 * The home/root URL only activates on exact match or its index alias.
 *
 * @param pathname Current page pathname
 * @param hrefs Array of link href strings (already resolved with base)
 * @returns Index of the active link, or -1 if none match
 */
export function getActiveNavLinkIndex(pathname: string, hrefs: string[]): number {
  const normPath = pathname.replace(/\/$/, '') || '/';
  const homeHref = withBase('/').replace(/\/$/, '') || '/';
  const homeIndexHref = withBase('/index').replace(/\/$/, '') || '/index';

  // 1. Exact match pass
  for (let i = 0; i < hrefs.length; i++) {
    const normHref = hrefs[i].replace(/\/$/, '') || '/';
    if (normHref === homeHref) {
      if (normPath === homeHref || normPath === homeIndexHref) {
        return i;
      }
    } else if (normPath === normHref) {
      return i;
    }
  }

  // 2. Longest prefix match pass (ignoring root/home link to prevent it from matching everything)
  let bestIndex = -1;
  let maxPrefixLength = 0;

  for (let i = 0; i < hrefs.length; i++) {
    const normHref = hrefs[i].replace(/\/$/, '') || '/';
    if (normHref !== homeHref && normPath.startsWith(normHref + '/')) {
      if (normHref.length > maxPrefixLength) {
        maxPrefixLength = normHref.length;
        bestIndex = i;
      }
    }
  }

  return bestIndex;
}
