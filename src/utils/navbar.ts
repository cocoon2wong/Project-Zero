/*
 * @Author: Conghao Wong
 * @Date: 2026-09-21 18:52:27
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-23 20:10:42
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */


import { siteConfig } from '@site.config';

function linear(rate: number, start: number, end: number): number {
  return rate * (end - start) + start;
}

function parseColor(c: string): [number, number, number, number] {
  c = (c || '').trim();
  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((x) => x + x).join('') + 'ff';
    } else if (hex.length === 6) {
      hex += 'ff';
    } else if (hex.length === 8) {
      // already RRGGBBAA
    } else {
      return [0, 0, 0, 255];
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = parseInt(hex.slice(6, 8), 16);
    return [r, g, b, a];
  }

  const match = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : 255;
    return [r, g, b, a];
  }

  return [0, 0, 0, 255];
}

function linear_color(
  rate: number,
  start: string | [number, number, number, number],
  end: string | [number, number, number, number]
): string {
  const [r1, g1, b1, a1] = typeof start === 'string' ? parseColor(start) : start;
  const [r2, g2, b2, a2] = typeof end === 'string' ? parseColor(end) : end;

  const r = Math.round(linear(rate, r1, r2));
  const g = Math.round(linear(rate, g1, g2));
  const b = Math.round(linear(rate, b1, b2));
  const a = Math.round(linear(rate, a1, a2));

  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
}

export function initNavbar(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => { };
  }

  const navContainer = document.querySelector<HTMLElement>('.top-nav-container');
  const bgContainer = document.querySelector<HTMLElement>('.top-nav-background-container');
  const floatContainer = document.querySelector<HTMLElement>('.top-nav-float-container');
  const liquidDivs = document.querySelectorAll<HTMLElement>('.top-nav-float-container > div[class^="liquidGlass"]');
  const navLinks = document.querySelectorAll<HTMLElement>('.navbar-nav .nav-link');
  const toggler = document.querySelector<HTMLElement>('.navbar-toggler');
  const collapse = document.querySelector<HTMLElement>('.navbar-collapse');
  const mainPageContainer = document.querySelector<HTMLElement>('.main-page-container');

  if (!navContainer || !bgContainer || !floatContainer) {
    return () => { };
  }

  // Sync active nav item based on window.location
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll<HTMLLIElement>('.navbar-nav li').forEach((li) => {
    const anchor = li.querySelector<HTMLAnchorElement>('a');
    if (anchor) {
      const rawHref = anchor.getAttribute('href') || '';
      const href = rawHref.replace(/\/$/, '') || '/';
      const isActive =
        href === '/'
          ? pathname === '/' || pathname === '/index'
          : pathname === href || pathname.startsWith(href + '/');

      li.classList.toggle('top-nav-active', isActive);
      let indicator = li.querySelector<HTMLElement>('.top-nav-active-background-container');
      if (isActive) {
        if (!indicator) {
          indicator = document.createElement('nav');
          indicator.className = 'top-nav-active-background-container nav-item-active';
          li.appendChild(indicator);
        }
      } else {
        if (indicator) {
          indicator.remove();
        }
      }
    }
  });

  // Mobile toggler listener
  const toggleHandler = () => {
    if (collapse) {
      collapse.classList.toggle('is-open');
    }
  };
  if (toggler) {
    toggler.addEventListener('click', toggleHandler);
  }

  const navMode = navContainer.getAttribute('data-nav-mode') || 'regular';
  const shorten = navMode === 'regular';

  function getColors() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    const navCol = isDark ? siteConfig.colors.navbarBgColorDark : siteConfig.colors.navbarBgColor;
    const borderCol = siteConfig.colors.navbarBorderColor;
    const hoverCol = siteConfig.colors.hoverColor;
    return { navCol, borderCol, hoverCol };
  }

  function setNavBarCss(rate: number, noAnimation: boolean = false) {
    if (!navContainer || !bgContainer || !floatContainer) return;

    const { navCol, borderCol, hoverCol } = getColors();

    if (rate < 1) {
      navContainer.classList.add('top-nav-float');
    } else {
      navContainer.classList.remove('top-nav-float');
    }

    // Outer container padding
    navContainer.style.paddingTop = `${linear(rate, 10, 0)}px`;
    navContainer.style.paddingBottom = `${linear(rate, 10, 0)}px`;
    navContainer.style.paddingRight = `${linear(rate, 10, 16)}px`;

    // Layer 1 background
    const sat = linear(Math.pow(rate, 4), 100, 180);
    const blur = linear(Math.pow(rate, 4), 0, 20);
    bgContainer.style.backdropFilter = `saturate(${sat}%) blur(${blur}px)`;

    const [nr, ng, nb, na] = parseColor(navCol);
    bgContainer.style.backgroundColor = linear_color(Math.pow(rate, 2), [nr, ng, nb, 0], [nr, ng, nb, na]);

    const [br, bg, bb, ba] = parseColor(borderCol);
    bgContainer.style.borderBottom = `1px solid ${linear_color(Math.pow(rate, 2), [br, bg, bb, 0], [br, bg, bb, ba])}`;

    // Layer 2 float container shadow and padding
    const shadowY = linear(Math.pow(rate, 0.5), 3, 0);
    const shadowBlur = linear(Math.pow(rate, 0.5), 20, 0);
    const shadowAlpha = linear(Math.pow(rate, 0.5), 0.336, 0);
    floatContainer.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha})`;
    floatContainer.style.paddingLeft = `${linear(rate, 1, 20)}px`;
    floatContainer.style.paddingRight = `${linear(rate, 1, 1)}px`;

    // Liquid glass opacity
    const liquidOpacity = String(linear(Math.pow(rate, 0.8), 1, 0));
    liquidDivs.forEach((div) => {
      div.style.opacity = liquidOpacity;
    });

    // Nav links padding
    const navLinkPadding = `${linear(rate, 10, 15)}px`;
    navLinks.forEach((link) => {
      if (!link.querySelector('.top-nav-float-icon')) {
        link.style.paddingTop = navLinkPadding;
        link.style.paddingBottom = navLinkPadding;
      } else {
        const iconPadding = `${linear(rate, 2, 15)}px`;
        link.style.paddingTop = iconPadding;
        link.style.paddingBottom = iconPadding;
        link.style.fontSize = `${linear(Math.pow(rate, 1.1), 8, 13)}px`;
      }
    });

    // Active indicator morphing
    const activeIndicators = document.querySelectorAll<HTMLElement>('.nav-item-active');
    const activeRadius = `${linear(Math.pow(rate, 0.95), 30, 1)}px`;
    const activeTop = `${linear(Math.pow(rate, 0.5), 5, 10)}px`;

    // Check strictly if hero cover image is present (big-img / has-img)
    const hasImg = Boolean(
      document.querySelector('.intro-header.big-img') ||
      document.querySelector('.header-section.has-img')
    );

    let activeBgCol: string;
    if (hasImg) {
      // With img: strictly keep the original white gradient to transparent
      activeBgCol = linear_color(Math.pow(rate, 0.15), [255, 255, 255, 160], [255, 255, 255, 0]);
    } else {
      // Without img: fade from light/dark gray at rate=0 to completely transparent at rate=1
      const isDark = document.documentElement.classList.contains('dark-mode');
      const grayLight = siteConfig.colors.navbarIndicatorGrayLight || 'rgba(0, 0, 0, 0.12)';
      const grayDark = siteConfig.colors.navbarIndicatorGrayDark || 'rgba(255, 255, 255, 0.16)';
      const targetGray = isDark ? grayDark : grayLight;
      const [gr, gg, gb, ga] = parseColor(targetGray);
      activeBgCol = linear_color(Math.pow(rate, 0.15), [gr, gg, gb, ga], [gr, gg, gb, 0]);
    }

    const [hr, hg, hb, ha] = parseColor(hoverCol);
    const activeBorderBottom = `1px solid ${linear_color(Math.pow(rate, 8), [hr, hg, hb, 0], [hr, hg, hb, ha])}`;

    activeIndicators.forEach((indicator) => {
      indicator.style.borderRadius = activeRadius;
      indicator.style.top = activeTop;
      indicator.style.backgroundColor = activeBgCol;
      indicator.style.borderBottom = activeBorderBottom;
    });

    // Icons
    const icons = document.querySelectorAll<HTMLElement>('.top-nav-float-icon');
    const iconSize = `${linear(rate, 30, 0)}px`;
    const iconHeight = `${linear(rate, 20, 0)}px`;
    const iconMarginTop = `${linear(rate, 5, 0)}px`;
    const iconOpacity = String(linear(Math.pow(rate, 0.1), 1, 0));

    icons.forEach((icon) => {
      icon.style.fontSize = iconSize;
      icon.style.height = iconHeight;
      icon.style.marginTop = iconMarginTop;
      icon.style.opacity = iconOpacity;
      // Animate the SVG directly so it shrinks like the original font icons (not clipped)
      const svg = icon.querySelector<SVGElement>('svg');
      if (svg) {
        svg.style.height = iconHeight;
        svg.style.width = 'auto';
      }
    });

    // Left brand title text: site title at rate=0, page title at rate=1
    // Left brand title text: page title only when rate === 1 and animation is allowed (!noAnimation); otherwise site title
    const brand = document.querySelector<HTMLAnchorElement>('.navbar-brand');
    if (brand) {
      const siteTitle = brand.getAttribute('data-site-title') || '';
      const pageTitle = brand.getAttribute('data-page-title') || siteTitle;
      brand.textContent = rate < 0.5 ? siteTitle : pageTitle;
      brand.textContent = rate === 1 && !noAnimation ? pageTitle : siteTitle;
    }

    // Main page shadow animation: only active when hero cover image is present
    if (!noAnimation && mainPageContainer) {
      if (hasImg) {
        const [sr, sg, sb, sa] = parseColor(siteConfig.colors.pageShadowColor || '#00000060');
        mainPageContainer.style.boxShadow = `-5px -5px 10px -4px ${linear_color(rate, [sr, sg, sb, sa], [sr, sg, sb, 0])}`;
      } else {
        mainPageContainer.style.boxShadow = 'none';
      }
    }
  }

  function getScrollRate(): number {
    const hero =
      document.querySelector<HTMLElement>('.intro-header') ||
      document.querySelector<HTMLElement>('.header-section');
    const heroHeight = hero ? hero.offsetHeight : 0;
    const maxScroll = heroHeight > 0 ? Math.max(heroHeight - 50, 100) : 100;
    const currentScroll = Math.max(window.scrollY, 0); // guard against negative scrollY (pull-to-refresh overscroll)
    const rate = currentScroll / maxScroll;
    return Math.min(rate, 1.0);
  }

  let rafId: number | null = null;
  function onScroll() {
    if (window.innerWidth <= 1199 || !shorten) return;
    if (window.scrollY < 0) return; // bail out during pull-to-refresh overscroll
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      setNavBarCss(getScrollRate());
      rafId = null;
    });
  }

  function update() {
    if (window.innerWidth > 1199) {
      if (shorten) {
        setNavBarCss(getScrollRate());
      } else {
        setNavBarCss(0.0, true);
      }
    } else {
      setNavBarCss(1.0, true);
    }
  }

  // Initial execution
  update();

  if (window.innerWidth > 1199 && shorten) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Handle dark mode toggle update
  const onThemeChange = () => {
    update();
  };
  window.addEventListener('theme-change', onThemeChange);

  // Handle window resize
  const onResize = () => {
    update();
  };
  window.addEventListener('resize', onResize);

  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('theme-change', onThemeChange);
    window.removeEventListener('resize', onResize);
    if (toggler) {
      toggler.removeEventListener('click', toggleHandler);
    }
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}
