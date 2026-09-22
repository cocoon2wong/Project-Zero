/*
 * @Author: Conghao Wong
 * @Date: 2026-09-21 17:33:48
 * @LastEditors: Conghao Wong
 * @LastEditTime: 2026-09-22 11:52:03
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
  secondNavbarRadius?: string;
  secondNavbarMargin?: string;
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
    navbarIndicatorGrayLight: string;
    navbarIndicatorGrayDark: string;

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

    // Secondary navigation (次要导航栏: Breadcrumb, Table of Contents, etc.)
    secondNavBgColor: string;
    secondNavBgColorDark: string;
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
  secondNavbarRadius: "19px",
  secondNavbarMargin: "4px",

  navLinks: [
    {
      title: "HOME",
      url: "/",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5Z"/></svg>',
    },
    {
      title: "TEAM",
      url: "/team/",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" fill="currentColor" class="bi bi-person-vcard" viewBox="0 0 16 16"><path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5ZM9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8Zm1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z"/><path fill-rule="evenodd" d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2ZM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12V4Z"/></svg>',
    },
    {
      title: "PAPERS",
      url: "/publications/",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" fill="currentColor" class="bi bi-book" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/></svg>',
    },
    {
      title: "REPOS",
      url: "/repos/",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16"><path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/></svg>',
    },
    {
      title: "POSTS",
      url: "/posts/",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" fill="currentColor" class="bi bi-stickies" viewBox="0 0 16 16"><path d="M1.5 0A1.5 1.5 0 0 0 0 1.5V13a1 1 0 0 0 1 1V1.5a.5.5 0 0 1 .5-.5H14a1 1 0 0 0-1-1H1.5z"/><path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v11A1.5 1.5 0 0 0 3.5 16h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 16 9.586V3.5A1.5 1.5 0 0 0 14.5 2h-11zM3 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V9h-4.5A1.5 1.5 0 0 0 9 10.5V15H3.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V10.5a.5.5 0 0 1 .5-.5h4.293L10 14.793z"/></svg>',
    },
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
    navbarBgColor: "#EAEAEA80",
    navbarBgColorDark: "#14141460",
    navbarBorderColor: "#b1b1b150",
    navbarTextColor: "#404040",
    navbarFloatActiveBgColor: "#ffffffa0",
    navbarIndicatorGrayLight: "#00000015",
    navbarIndicatorGrayDark: "#ffffff22",

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
    footerBgColor: "#f7f7f8",
    footerBgColorDark: "#1c1c1e",
    footerTextColor: "#777777",
    footerLinkColor: "#404040",
    footerHoverColor: "#0085a1",

    // Shadows
    pageShadowColor: "#00000060",

    // Secondary navigation (次要导航栏: Breadcrumb, Table of Contents, etc.)
    secondNavBgColor: "#fafafc",
    secondNavBgColorDark: "#3d3d3d",
  },
};
