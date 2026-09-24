/*
 * @Author: Conghao Wong
 * @Date: 2026-09-24 10:57:35
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-24 11:42:11
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */


export function initSideNavbarDocking(): void {
  if (typeof document === 'undefined') return;

  const sideNavbar = document.getElementById('side-navbar');
  const secondNavContainer = document.querySelector<HTMLElement>('.second-nav-container');
  if (!sideNavbar || !secondNavContainer) return;

  const buttons = Array.from(
    secondNavContainer.querySelectorAll<HTMLElement>('.second-nav-btn-container')
  );
  if (buttons.length === 0) return;

  // 为每个单按钮在其原位置前建立占位节点，用于 100% 精准原位复原
  const anchors = buttons.map((btn) => {
    let placeholder = btn.previousElementSibling as HTMLElement | null;
    if (!placeholder || !placeholder.classList.contains('second-nav-btn-anchor')) {
      placeholder = document.createElement('span');
      placeholder.className = 'second-nav-btn-anchor';
      placeholder.style.display = 'none';
      btn.parentNode?.insertBefore(placeholder, btn);
    }
    return { btn, placeholder };
  });

  function update() {
    if (!sideNavbar || !secondNavContainer) return;

    // 1. 物理离开判定：次要导航栏底边缘 <= 0 代表完全滚出屏幕顶端
    const secondNavRect = secondNavContainer.getBoundingClientRect();
    const isOffscreen = secondNavRect.bottom <= 0;

    // 2. Side Navbar 可见性判定：实际几何宽度 > 0，由 CSS 数学函数直接驱动
    const isSideNavVisible = sideNavbar.offsetWidth > 0;

    const shouldDock = isOffscreen && isSideNavVisible;

    anchors.forEach(({ btn, placeholder }) => {
      if (shouldDock) {
        if (btn.parentElement !== sideNavbar) {
          sideNavbar.appendChild(btn);
          btn.classList.add('docked-to-side-nav');
        }
      } else {
        if (btn.parentElement !== secondNavContainer) {
          placeholder.parentNode?.insertBefore(btn, placeholder.nextSibling);
          btn.classList.remove('docked-to-side-nav');
        }
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}
