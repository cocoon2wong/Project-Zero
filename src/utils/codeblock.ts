/*
 * @Author: Conghao Wong
 * @Date: 2026-09-22 19:10:51
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-22 19:54:34
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */


/**
 * 现代代码块增强器：
 * 自动识别原生 Markdown 或 Astro 渲染的代码块，
 * 包裹同心圆角卡片容器并挂载右上角 Astro 胶囊 Copy 按钮。
 */
export function initCodeblocks(): void {
  if (typeof document === 'undefined') return;

  const preBlocks = document.querySelectorAll<HTMLPreElement>(
    '.markdown-body pre:not(.codebox-processed), article pre:not(.codebox-processed), main pre:not(.codebox-processed)'
  );

  preBlocks.forEach((pre) => {
    // 避免重复处理
    pre.classList.add('codebox-processed');

    // 1. 创建同心圆角外层卡片容器
    const wrapper = document.createElement('div');
    wrapper.className = 'codebox-wrapper';

    // 2. 创建右上角悬浮工具栏与胶囊复制按钮（直接使用 Astro 扁平纯色 btn-pure btn-sm 体系）
    const toolbar = document.createElement('div');
    toolbar.className = 'codebox-title';

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-pure btn-sm codebox-copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');

    copyBtn.addEventListener('click', async () => {
      const codeElement = pre.querySelector('code') || pre;
      const codeText = codeElement.innerText;

      try {
        await navigator.clipboard.writeText(codeText);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code: ', err);
      }
    });

    toolbar.appendChild(copyBtn);

    // 3. 将 pre 元素包裹进 wrapper 中
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(toolbar);
    wrapper.appendChild(pre);
  });
}
