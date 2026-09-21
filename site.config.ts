/*
 * @Author: Conghao Wong
 * @Date: 2026-09-21 17:33:48
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-21 18:29:43
 * @Github: https://cocoon2wong.github.io
 * Copyright 2026 Conghao Wong, All Rights Reserved.
 */


export interface NavLink {
  title: string;
  url: string;
  icon?: string;
}

export interface SiteConfig {
  title: string;
  subtitle: string;
  description: string;
  author: string;
  language: string;
  avatar?: string;
  roundAvatar?: boolean;
  navLinks: NavLink[];
  colors: {
    // Page backgrounds
    pageBgColor: string;
    pageBgColorGray: string;
    pageBgColorDark: string;
    pageBgColorDarkGray: string;

    // Text colors
    textColor: string;
    textColorDark: string;

    // Theme & accents
    themeColor: string;
    hoverColor: string;
    linkColor: string;

    // Header & hero
    headerBgColor: string;
    headerBgColorDark: string;

    // Navbar
    navbarBgColor: string;
    navbarBgColorDark: string;
    navbarBorderColor: string;
    navbarTextColor: string;
    navbarFloatActiveBgColor: string;

    // Capsule Buttons (100% faithful to Conghao Wong's original visual values)
    buttonNormalBg: string;
    buttonNormalBgDark: string;
    buttonNormalText: string;
    buttonNormalTextDark: string;
    buttonThemeBg: string;
    buttonThemeText: string;

    // Pills & Segmented Controls
    pillText: string;
    pillTextDark: string;
    pillActiveText: string;

    // Footer
    footerBgColor: string;
    footerBgColorDark: string;
    footerTextColor: string;
    footerLinkColor: string;
    footerHoverColor: string;

    // Shadows
    pageShadowColor: string;
  };
}

export const siteConfig: SiteConfig = {
  title: "My website",
  subtitle: "This is where I will tell my friends way too much about me",
  description: "A modern website built with Astro",
  author: "Conghao Wong",
  language: "en",
  avatar: "/assets/img/avatar-icon.png",
  roundAvatar: true,

  navLinks: [
    { title: "Home", url: "/" },
    { title: "About", url: "/about" },
  ],

  // =========================================================================
  // All website colors are centralized here (Fully customizable by user)
  // =========================================================================
  colors: {
    // Page backgrounds
    pageBgColor: "#ffffff",
    pageBgColorGray: "#f5f5f7",
    pageBgColorDark: "#1e1e1c",
    pageBgColorDarkGray: "#1d1d1f",

    // Text colors
    textColor: "#404040",
    textColorDark: "#ffffff",

    // Theme & accents
    themeColor: "#0085a1",
    hoverColor: "#0085a1",
    linkColor: "#008aff",

    // Header & hero
    headerBgColor: "#ffffff",
    headerBgColorDark: "#000000",

    // Navbar
    navbarBgColor: "#eaeaeaff",
    navbarBgColorDark: "#14141460",
    navbarBorderColor: "#b1b1b150",
    navbarTextColor: "#404040",
    navbarFloatActiveBgColor: "#ffffffa0",

    // Capsule Buttons (100% faithful to Conghao Wong's original visual values)
    buttonNormalBg: "#fcfcfe",
    buttonNormalBgDark: "#3c3c3c",
    buttonNormalText: "#3c3c3c",
    buttonNormalTextDark: "#ffffff",
    buttonThemeBg: "#0085a1",
    buttonThemeText: "#ffffff",

    // Pills & Segmented Controls
    pillText: "#3c3c3c",
    pillTextDark: "#ffffff",
    pillActiveText: "#0085a1",

    // Footer
    footerBgColor: "#eaeaeaff",
    footerBgColorDark: "#404040",
    footerTextColor: "#777777",
    footerLinkColor: "#404040",
    footerHoverColor: "#0085a1",

    // Shadows
    pageShadowColor: "#00000060",
  },
};
