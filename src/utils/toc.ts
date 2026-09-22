/*
 * @Author: Conghao Wong
 * @Date: 2026-09-22 11:08:56
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-22 16:05:02
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */


let observer: IntersectionObserver | null = null;
let scrollHandler: (() => void) | null = null;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function openTOC() {
  const layoutContainer = document.getElementById("main-layout-container");
  const tocContainer = document.getElementById("dynamic-toc-container");
  const restoreBtn = document.getElementById("toc-restore-btn");

  if (!layoutContainer || !tocContainer) return;

  layoutContainer.classList.remove("toc-collapsed");
  layoutContainer.classList.add("toc-expanded");
  tocContainer.classList.remove("d-none");

  if (restoreBtn) {
    restoreBtn.classList.add("d-none");
  }

  localStorage.setItem("toc-preference", "expanded");
}

export function closeTOC() {
  const layoutContainer = document.getElementById("main-layout-container");
  const tocContainer = document.getElementById("dynamic-toc-container");
  const restoreBtn = document.getElementById("toc-restore-btn");

  if (!layoutContainer || !tocContainer) return;

  layoutContainer.classList.remove("toc-expanded");
  layoutContainer.classList.add("toc-collapsed");
  tocContainer.classList.add("d-none");

  if (restoreBtn) {
    restoreBtn.classList.remove("d-none");
  }

  localStorage.setItem("toc-preference", "collapsed");
}

export function initTOC() {
  // Cleanup previous listeners to prevent memory leaks across page navigations
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
  }

  const tocRoot = document.getElementById("TABLE_OF_CONTENTS");
  const layoutContainer = document.getElementById("main-layout-container");
  const tocContainer = document.getElementById("dynamic-toc-container");
  const restoreBtn = document.getElementById("toc-restore-btn");
  const closeBtn = document.getElementById("toc-close-btn");
  const detailsContainer = document.getElementById("toc-details-container") as HTMLDetailsElement | null;

  if (!tocRoot || !layoutContainer || !tocContainer) {
    return;
  }

  const contentArea = document.querySelector(".markdown-body");
  if (!contentArea) {
    tocContainer.classList.add("d-none");
    if (restoreBtn) restoreBtn.classList.add("d-none");
    layoutContainer.classList.add("toc-collapsed");
    return;
  }

  const headings = Array.from(
    contentArea.querySelectorAll<HTMLHeadingElement>("h2, h3, h4")
  );

  // If no headings found, silently hide TOC sidebar and restore button
  if (headings.length === 0) {
    tocContainer.classList.add("d-none");
    if (restoreBtn) restoreBtn.classList.add("d-none");
    layoutContainer.classList.add("toc-collapsed");
    layoutContainer.classList.remove("toc-expanded");
    return;
  }

  // Clear previous links
  tocRoot.innerHTML = "";

  const headingElements: { id: string; element: HTMLHeadingElement; link: HTMLAnchorElement }[] = [];

  headings.forEach((heading, idx) => {
    let id = heading.id;
    if (!id) {
      const slug = slugify(heading.textContent || "");
      id = slug ? `heading-${slug}` : `heading-${idx}`;
      heading.id = id;
    }

    const level = Number(heading.tagName.substring(1));
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.className = `toc-link toc-level-${level}`;
    link.textContent = heading.textContent?.trim() || "";
    link.setAttribute("data-target-id", id);

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(id);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 78;
        window.scrollTo({ top, behavior: "smooth" });
        history.pushState(null, "", `#${id}`);
      }
    });

    tocRoot.appendChild(link);
    headingElements.push({ id, element: heading, link });
  });

  // Bind Open and Close button events
  if (restoreBtn) {
    restoreBtn.onclick = (e) => {
      e.preventDefault();
      openTOC();
    };
  }
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.preventDefault();
      closeTOC();
    };
  }

  // Mobile viewport check: auto-collapse details on small screens
  const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
  if (detailsContainer) {
    if (isMobile) {
      detailsContainer.removeAttribute("open");
    } else {
      detailsContainer.setAttribute("open", "");
    }
  }

  // Restore user preference for desktop
  const savedPref = localStorage.getItem("toc-preference");
  if (savedPref === "collapsed") {
    closeTOC();
  } else {
    openTOC();
  }

  // IntersectionObserver ScrollSpy
  let activeId = "";

  function setActive(id: string) {
    if (activeId === id) return;
    activeId = id;
    headingElements.forEach(({ id: itemId, link }) => {
      if (itemId === id) {
        link.classList.add("active");
        link.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else {
        link.classList.remove("active");
      }
    });
  }

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length > 0) {
        setActive(visible[0].target.id);
      }
    },
    {
      rootMargin: "-80px 0px -70% 0px",
      threshold: 0,
    }
  );

  headingElements.forEach(({ element }) => observer?.observe(element));

  // Boundary condition scroll listener (top & bottom of page)
  scrollHandler = () => {
    const scrollPos = window.scrollY;
    if (scrollPos < 100 && headingElements.length > 0) {
      setActive(headingElements[0].id);
      return;
    }

    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 50
    ) {
      setActive(headingElements[headingElements.length - 1].id);
    }
  };

  window.addEventListener("scroll", scrollHandler, { passive: true });
}
