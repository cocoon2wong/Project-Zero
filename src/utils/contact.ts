/*
 * @Author: Conghao Wong
 * @Date: 2026-09-22 21:06:41
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-23 09:17:27
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */


const EMAIL_REGEX = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/;

/**
 * Universal anti-scraper email processor:
 * Automatically scans for any elements containing '@' (in attributes or text),
 * extracts the email address, and dynamically constructs safe mailto: links and displays.
 * No manual dictionary configuration needed!
 */
export function initEmailObfuscation(): void {
  if (typeof document === "undefined") return;

  // 1. Scan elements with email attributes containing '@'
  const emailAttrNodes = document.querySelectorAll<HTMLElement>(
    '[data-email*="@"], [data-email-id*="@"], a[href^="mailto:"]',
  );

  emailAttrNodes.forEach((el) => {
    const rawEmail =
      el.getAttribute("data-email") ||
      el.getAttribute("data-email-id") ||
      el.getAttribute("href")?.replace(/^mailto:/i, "") ||
      "";

    const match = rawEmail.match(EMAIL_REGEX);
    if (!match) return;

    const email = match[1];
    const display = el.getAttribute("data-email-display") || "auto";
    const tag = el.tagName.toLowerCase();

    if (tag === "a") {
      el.setAttribute("href", `mailto:${email}`);
      if (display === "text" && !el.textContent?.trim()) {
        el.textContent = email;
      } else if (display === "icon" || !el.textContent?.trim()) {
        el.textContent = "✉️";
      }
    } else {
      if (!el.textContent?.trim()) {
        el.textContent = email;
      }
    }
  });

  // 2. Scan elements with data-email-display that might have email in their text
  const emailDisplayNodes = document.querySelectorAll<HTMLElement>(
    "a[data-email-display]",
  );

  emailDisplayNodes.forEach((el) => {
    if (
      el.hasAttribute("href") &&
      el.getAttribute("href")?.startsWith("mailto:")
    ) {
      return;
    }
    const text = el.textContent || "";
    const match = text.match(EMAIL_REGEX);
    if (match) {
      const email = match[1];
      const display = el.getAttribute("data-email-display");
      el.setAttribute("href", `mailto:${email}`);
      if (display === "icon") {
        el.textContent = "✉️";
      }
    }
  });
}
