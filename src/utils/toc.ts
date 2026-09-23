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

export function openTOC(isInitial = false) {
  const layoutContainer = document.getElementById("main-layout-container");
  const tocContainer = document.getElementById("dynamic-toc-container");
  const contentArea = document.getElementById("dynamic-main-content");
  const restoreBtn = document.getElementById("toc-restore-btn");
  const panel = tocContainer?.querySelector<HTMLElement>(".table-of-contents-container");

  if (!layoutContainer || !tocContainer) return;

  const isDesktop = window.innerWidth >= 992;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. 获取圆形还原按钮几何参数
  const restoreBtnContainer =
    restoreBtn?.closest<HTMLElement>(".second-nav-btn-container") || restoreBtn;
  const btnRect =
    isDesktop && !isInitial && restoreBtnContainer && !prefersReducedMotion
      ? restoreBtnContainer.getBoundingClientRect()
      : null;
  const firstLeft =
    isDesktop && !isInitial && contentArea ? contentArea.getBoundingClientRect().left : null;

  // 2. 状态切换
  layoutContainer.classList.remove("toc-collapsed");
  layoutContainer.classList.add("toc-expanded");
  tocContainer.classList.remove("d-none");

  if (restoreBtn) {
    restoreBtn.classList.add("d-none");
  }
  if (restoreBtnContainer) {
    restoreBtnContainer.style.opacity = "";
  }

  // 3. 正文区域协同平滑滑动
  if (firstLeft !== null && contentArea && !prefersReducedMotion) {
    const lastLeft = contentArea.getBoundingClientRect().left;
    const deltaX = firstLeft - lastLeft;
    if (deltaX !== 0) {
      contentArea.animate(
        [
          { transform: `translateX(${deltaX}px)` },
          { transform: "translateX(0)" },
        ],
        { duration: 400, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }
  }

  // 4. TOC 面板自身：从圆形展开按钮均匀展开到最终位置（一步到位至 1.01x Hover 终态）
  if (btnRect && panel && btnRect.width > 0 && !prefersReducedMotion) {
    const targetRect = panel.getBoundingClientRect();
    const deltaX = btnRect.left - targetRect.left;
    const deltaY = btnRect.top - targetRect.top;
    const scaleX = btnRect.width / targetRect.width;
    const scaleY = btnRect.height / targetRect.height;

    // 展开时鼠标处于面板上方，直接以 1.01x 终态完成展开，与 CSS :hover 无缝吻合，消除动画结束后的二次顿挫
    const endScale = 1.01;

    panel.style.transformOrigin = "top left";
    panel.animate(
      [
        {
          transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
          borderRadius: "50%",
        },
        {
          transform: `translate(0, 0) scale(${endScale}, ${endScale})`,
          borderRadius: "var(--toc-radius-outer, 20px)",
        },
      ],
      {
        duration: 400,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      }
    );

    // 面板内部内容平滑淡入
    const details = panel.querySelector("details");
    if (details) {
      details.animate(
        [
          { opacity: 0 },
          { opacity: 0, offset: 0.35 },
          { opacity: 1 },
        ],
        { duration: 400, easing: "ease-out" }
      );
    }
  }

  localStorage.setItem("toc-preference", "expanded");
}

export function closeTOC(isInitial = false) {
  const layoutContainer = document.getElementById("main-layout-container");
  const tocContainer = document.getElementById("dynamic-toc-container");
  const contentArea = document.getElementById("dynamic-main-content");
  const restoreBtn = document.getElementById("toc-restore-btn");
  const panel = tocContainer?.querySelector<HTMLElement>(".table-of-contents-container");

  if (!layoutContainer || !tocContainer) return;

  const isDesktop = window.innerWidth >= 992;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isInitial || !isDesktop || prefersReducedMotion || !panel) {
    layoutContainer.classList.remove("toc-expanded");
    layoutContainer.classList.add("toc-collapsed");
    tocContainer.classList.add("d-none");
    if (restoreBtn) restoreBtn.classList.remove("d-none");
    localStorage.setItem("toc-preference", "collapsed");
    return;
  }

  // 1. 测量动画起始时刻的绝对几何参数
  const currentPanelRect = panel.getBoundingClientRect();
  const firstLeft = contentArea ? contentArea.getBoundingClientRect().left : null;

  // 获取还原按钮外层胶囊容器（LiquidGlass 包装层）
  const restoreBtnContainer =
    restoreBtn?.closest<HTMLElement>(".second-nav-btn-container") || restoreBtn;

  // 2. 提前让还原按钮及其容器进入 DOM 流占位（消除兄弟元素跳变），但设为完全透明
  if (restoreBtn) {
    restoreBtn.classList.remove("d-none");
  }
  if (restoreBtnContainer) {
    restoreBtnContainer.style.opacity = "0";
  }

  // 3. 将 TOC 面板提升为 fixed 定位，完全脱离文档流但保持当前视觉像素坐标完全不变
  panel.style.position = "fixed";
  panel.style.top = `${currentPanelRect.top}px`;
  panel.style.left = `${currentPanelRect.left}px`;
  panel.style.width = `${currentPanelRect.width}px`;
  panel.style.height = `${currentPanelRect.height}px`;
  panel.style.margin = "0";
  panel.style.zIndex = "1000";
  panel.style.pointerEvents = "none";
  panel.style.transformOrigin = "top left";

  // 让 aside 容器保持渲染树可见但脱离文档流，不推挤正文
  tocContainer.classList.add("toc-collapsing");

  // 4. 切换底层布局状态为 toc-collapsed
  layoutContainer.classList.remove("toc-expanded");
  layoutContainer.classList.add("toc-collapsed");

  // 5. 精确测量还原按钮在折叠布局中的真实像素位置
  const targetRect = restoreBtnContainer ? restoreBtnContainer.getBoundingClientRect() : null;
  const targetBtnX = targetRect && targetRect.width > 0 ? targetRect.left : currentPanelRect.left;
  const targetBtnY = targetRect && targetRect.height > 0 ? targetRect.top : currentPanelRect.top;
  const targetBtnW = targetRect && targetRect.width > 0 ? targetRect.width : 38;
  const targetBtnH = targetRect && targetRect.height > 0 ? targetRect.height : 38;

  const deltaX = targetBtnX - currentPanelRect.left;
  const deltaY = targetBtnY - currentPanelRect.top;
  const scaleX = targetBtnW / currentPanelRect.width;
  const scaleY = targetBtnH / currentPanelRect.height;

  // 6. 正文区域协同 FLIP 平滑向左舒展
  if (firstLeft !== null && contentArea) {
    const lastLeft = contentArea.getBoundingClientRect().left;
    const diffX = firstLeft - lastLeft;
    if (diffX !== 0) {
      contentArea.animate(
        [
          { transform: `translateX(${diffX}px)` },
          { transform: "translateX(0)" },
        ],
        { duration: 350, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }
  }

  // 7. TOC 面板内部文字迅速淡出
  const details = panel.querySelector("details");
  if (details) {
    details.animate(
      [
        { opacity: 1 },
        { opacity: 0 },
      ],
      { duration: 150, easing: "ease-in" }
    );
  }

  // 8. 还原按钮在收缩后半程（70%~100%）优雅淡入接管
  if (restoreBtnContainer) {
    restoreBtnContainer.animate(
      [
        { opacity: 0 },
        { opacity: 0, offset: 0.7 },
        { opacity: 1 },
      ],
      { duration: 350, easing: "ease-out" }
    );
  }

  // 9. 面板本身：从矩形面板平滑形变收缩到目标圆形按钮
  const anim = panel.animate(
    [
      {
        transform: "translate(0, 0) scale(1, 1)",
        borderRadius: "var(--toc-radius-outer, 20px)",
        opacity: 1,
      },
      {
        transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
        borderRadius: "50%",
        opacity: 0,
        offset: 1,
      },
    ],
    { duration: 350, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
  );

  anim.onfinish = () => {
    tocContainer.classList.remove("toc-collapsing");
    tocContainer.classList.add("d-none");
    panel.style.position = "";
    panel.style.top = "";
    panel.style.left = "";
    panel.style.width = "";
    panel.style.height = "";
    panel.style.margin = "";
    panel.style.zIndex = "";
    panel.style.pointerEvents = "";
    panel.style.transform = "";
    panel.style.transformOrigin = "";
    if (restoreBtnContainer) {
      restoreBtnContainer.style.opacity = "";
    }
  };

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
    closeTOC(true);
  } else {
    openTOC(true);
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
