/*
 * @Author: Conghao Wong
 * @Date: 2026-09-21 18:23:16
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-21 18:30:05
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */


export type Theme = 'light' | 'dark';

/**
 * Returns the current active theme.
 */
export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
}

/**
 * Sets the active theme and persists to localStorage.
 */
export function setTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  if (theme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    document.body?.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
    document.body?.classList.remove('dark-mode');
  }

  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    // Gracefully handle storage errors
  }

  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
}

/**
 * Toggles between light and dark themes.
 */
export function toggleTheme(): Theme {
  const nextTheme: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  return nextTheme;
}

/**
 * Automatically binds click events on all elements with [data-theme-toggle].
 */
export function initThemeToggles(): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('[data-theme-toggle]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });
}

