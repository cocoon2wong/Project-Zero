/*
 * @Author: Conghao Wong
 * @Date: 2026-09-24 09:56:21
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-24 11:41:49
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */


export function initDetailsAnimation(): void {
  if (typeof document === "undefined") return;

  const detailsList = document.querySelectorAll<HTMLDetailsElement>(
    ".markdown-body details:not([data-details-animated]), details:not(#toc-details-container):not([data-details-animated])"
  );

  detailsList.forEach((details) => {
    const summary = details.querySelector("summary");
    if (!summary) return;

    details.setAttribute("data-details-animated", "true");

    let detailsAnim: Animation | null = null;
    let summaryAnim: Animation | null = null;
    let isClosing = false;
    let isOpening = false;

    // 缓存闭合态几何指标
    let closedHeight = !details.open ? details.offsetHeight : 0;
    let closedSummaryHeight = !details.open
      ? summary.offsetHeight
      : Math.max(0, summary.offsetHeight - 11);

    summary.addEventListener("click", (e) => {
      e.preventDefault();

      // 无障碍：如果系统启用了减弱动画，直接原生瞬间切换
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        details.open = !details.open;
        return;
      }

      if (isClosing || !details.open) {
        open();
      } else if (isOpening || details.open) {
        close();
      }
    });

    function open() {
      // 打断保护：停止当前正在执行的反向动画
      if (detailsAnim) detailsAnim.cancel();
      if (summaryAnim) summaryAnim.cancel();

      const wasClosing = isClosing;
      isClosing = false;
      isOpening = true;

      // 1. 确定起始参数（被打断时取当前瞬时高度，正常启动时取闭合基准高度）
      const startHeight = wasClosing
        ? `${details.offsetHeight}px`
        : `${closedHeight || details.offsetHeight}px`;

      const startPadding = wasClosing
        ? `${parseFloat(getComputedStyle(summary).paddingTop) || 3}px`
        : "3px";

      // 2. 标记 open=true（在自然外边距折叠状态下精确测量真实展开高度）
      details.open = true;

      // 3. 测量展开后的真实自然高度
      const endHeight = `${details.offsetHeight}px`;

      // 4. 测量完成后，再开启 overflow: hidden 执行截断补间动画
      details.style.overflow = "hidden";

      // 5. 纯净高度与透明度补间（外部 margin 由 CSS 静态恒定控制）
      detailsAnim = details.animate(
        [
          { height: startHeight, opacity: 0.85 },
          { height: endHeight, opacity: 1 },
        ],
        {
          duration: 280,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }
      );

      // Summary 内部 padding 与分割线同步平滑淡入
      summaryAnim = summary.animate(
        [
          {
            paddingTop: startPadding,
            paddingBottom: startPadding,
            borderBottomColor: "transparent",
          },
          {
            paddingTop: "8px",
            paddingBottom: "8px",
            borderBottomColor: "var(--details-open-border-col)",
          },
        ],
        {
          duration: 280,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }
      );

      detailsAnim.onfinish = () => {
        details.style.overflow = "";
        details.style.height = "";
        summary.style.paddingTop = "";
        summary.style.paddingBottom = "";
        summary.style.borderBottomColor = "";
        detailsAnim = null;
        summaryAnim = null;
        isOpening = false;
      };

      detailsAnim.oncancel = () => {
        isOpening = false;
      };
    }

    function close() {
      // 打断保护：停止当前正在执行的反向动画
      if (detailsAnim) detailsAnim.cancel();
      if (summaryAnim) summaryAnim.cancel();

      const wasOpening = isOpening;
      isOpening = false;
      isClosing = true;

      // 1. 确定起始参数
      const startHeight = `${details.offsetHeight}px`;
      const startPadding = wasOpening
        ? `${parseFloat(getComputedStyle(summary).paddingTop) || 8}px`
        : "8px";

      // 2. 确定收起目标终点：严格指向闭合态的高度
      const targetHeight = `${closedSummaryHeight > 0 ? closedSummaryHeight : Math.max(0, summary.offsetHeight - 11)}px`;

      details.style.overflow = "hidden";

      // 3. 纯净高度收缩补间（外部 margin 由 CSS 静态恒定控制）
      detailsAnim = details.animate(
        [
          { height: startHeight, opacity: 1 },
          { height: targetHeight, opacity: 0.85 },
        ],
        {
          duration: 240,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }
      );

      summaryAnim = summary.animate(
        [
          {
            paddingTop: startPadding,
            paddingBottom: startPadding,
            borderBottomColor: "var(--details-open-border-col)",
          },
          {
            paddingTop: "3px",
            paddingBottom: "3px",
            borderBottomColor: "transparent",
          },
        ],
        {
          duration: 240,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }
      );

      detailsAnim.onfinish = () => {
        // 动画完全收缩到 3px padding 后，才正式关闭 open 属性
        details.removeAttribute("open");
        details.style.overflow = "";
        details.style.height = "";
        summary.style.paddingTop = "";
        summary.style.paddingBottom = "";
        summary.style.borderBottomColor = "";

        // 重新校准闭合态基准尺寸
        closedHeight = details.offsetHeight;
        closedSummaryHeight = summary.offsetHeight;

        detailsAnim = null;
        summaryAnim = null;
        isClosing = false;
      };

      detailsAnim.oncancel = () => {
        isClosing = false;
      };
    }
  });
}
