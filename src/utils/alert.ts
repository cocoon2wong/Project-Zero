/*
 * @Author: Conghao Wong
 * @Date: 2026-09-22 18:05:46
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-23 14:02:48
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */

/**
 * Initializes and dynamically morphs GitHub-style Markdown alerts (> [!NOTE])
 * into full LiquidGlass-styled alert boxes.
 */
export function initMarkdownAlerts(): void {
  if (typeof document === 'undefined') return;

  const contentArea = document.querySelector('.markdown-body') || document.body;
  const blockquotes = contentArea.querySelectorAll<HTMLQuoteElement>(
    'blockquote:not(.markdown-alert-processed)'
  );

  blockquotes.forEach((bq) => {
    const firstP = bq.querySelector('p');
    if (!firstP) return;

    const text = firstP.textContent || '';
    const match = text.match(/^\s*\[!(NOTE|IMPORTANT|WARNING)\]\s*(?:\r?\n)?/i);
    if (!match) return;

    bq.classList.add('markdown-alert-processed');
    const alertType = match[1].toLowerCase();

    // 移除 [!NOTE] 前缀文本
    const walker = document.createTreeWalker(firstP, NodeFilter.SHOW_TEXT);
    const firstTextNode = walker.nextNode();
    if (firstTextNode?.nodeValue) {
      firstTextNode.nodeValue = firstTextNode.nodeValue.replace(
        /^\s*\[!(NOTE|IMPORTANT|WARNING)\]\s*(?:\r?\n)?/i, ''
      );
      if (firstTextNode.nodeValue.trim() === '' && firstP.childNodes.length === 1) {
        firstP.remove();
      }
    }

    // 从 Alert.astro 预渲染的 <template> 克隆 shell
    const tpl = document.getElementById(`alert-tpl-${alertType}`) as HTMLTemplateElement | null;
    if (!tpl) return;

    const container = tpl.content.cloneNode(true) as DocumentFragment;
    const aside = container.querySelector('aside')!;

    // 将 blockquote 剩余内容移入容器
    while (bq.firstChild) {
      aside.appendChild(bq.firstChild);
    }

    // 清理末尾空文本节点
    while (
      aside.lastChild?.nodeType === Node.TEXT_NODE &&
      !aside.lastChild.nodeValue?.trim()
    ) {
      aside.removeChild(aside.lastChild);
    }

    bq.replaceWith(aside);
  });
}
