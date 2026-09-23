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
