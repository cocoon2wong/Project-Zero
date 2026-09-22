/*
 * @Author: Conghao Wong
 * @Date: 2026-09-22 18:05:46
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-22 18:45:29
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */

const ALERT_REGEX = /^\s*\[!(NOTE|IMPORTANT|WARNING)\]\s*(?:\r?\n)?/i;

const ICONS: Record<string, string> = {
  note: '<svg class="octicon octicon-info" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>',
  warning: '<svg class="octicon octicon-alert" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>',
  important: '<svg class="octicon octicon-report" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0ZM9 10.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>',
};

/**
 * Initializes and dynamically morphs GitHub-style Markdown alerts (> [!NOTE])
 * into full LiquidGlass-styled alert boxes.
 */
export function initMarkdownAlerts(): void {
  if (typeof document === 'undefined') return;

  const contentArea = document.querySelector('.markdown-body') || document.body;
  const blockquotes = contentArea.querySelectorAll<HTMLQuoteElement>('blockquote:not(.markdown-alert-processed)');

  blockquotes.forEach((bq) => {
    const firstP = bq.querySelector('p');
    if (!firstP) return;

    const text = firstP.textContent || '';
    const match = text.match(ALERT_REGEX);
    if (!match) return;

    bq.classList.add('markdown-alert-processed');
    const alertType = match[1].toLowerCase();
    const displayTitle = alertType.charAt(0).toUpperCase() + alertType.slice(1);

    // Remove the [!NOTE] prefix from DOM text nodes
    const walker = document.createTreeWalker(firstP, NodeFilter.SHOW_TEXT);
    const firstTextNode = walker.nextNode();
    if (firstTextNode && firstTextNode.nodeValue) {
      firstTextNode.nodeValue = firstTextNode.nodeValue.replace(ALERT_REGEX, '');
      if (firstTextNode.nodeValue.trim() === '' && firstP.childNodes.length === 1) {
        firstP.remove();
      }
    }

    // Build the replacement container using Astro's LiquidGlass structure
    const container = document.createElement('aside');
    container.className = `liquidGlass-wrapper markdown-alert markdown-alert-${alertType}`;
    container.setAttribute('role', 'alert');

    // 3 LiquidGlass physical layers + title
    container.innerHTML = `
      <div class="liquidGlass-effect" aria-hidden="true"></div>
      <div class="liquidGlass-tint" aria-hidden="true"></div>
      <div class="liquidGlass-shine" aria-hidden="true"></div>
      <p class="markdown-alert-title">
        <span class="markdown-alert-icon">${ICONS[alertType] || ICONS.note}</span>
        <span>${displayTitle}</span>
      </p>
    `;

    // Move all remaining blockquote content into the container
    while (bq.firstChild) {
      container.appendChild(bq.firstChild);
    }

    // Clean up any trailing empty text nodes to prevent pseudo-selector interference
    while (
      container.lastChild &&
      container.lastChild.nodeType === Node.TEXT_NODE &&
      !container.lastChild.nodeValue?.trim()
    ) {
      container.removeChild(container.lastChild);
    }

    bq.replaceWith(container);
  });
}
