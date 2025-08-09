var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// node_modules/@remix-run/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = {};
__export(entry_server_node_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  return userAgent ? "isbot" in isbotModule && typeof isbotModule.isbot == "function" ? isbotModule.isbot(userAgent) : "default" in isbotModule && typeof isbotModule.default == "function" ? isbotModule.default(userAgent) : !1 : !1;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links
});
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload
} from "@remix-run/react";

// app/tailwind.css?url
var tailwind_default = "/build/_assets/tailwind-MHO5HMHV.css?url";

// app/root.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var links = () => [
  { rel: "stylesheet", href: tailwind_default },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bangers&family=Noto+Sans+SC:wght@400;700&display=swap" }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx2("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx2("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx2(Meta, {}),
      /* @__PURE__ */ jsx2(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx2(Outlet, {}),
      /* @__PURE__ */ jsx2(Scripts, {}),
      /* @__PURE__ */ jsx2(LiveReload, {})
    ] })
  ] });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index
});
import { useState as useState2, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { LucideCat as LucideCat3, LucideShield, LucideBomb, LucideSwords, LucideTrophy as LucideTrophy3, LucideDices, LucideClipboardList, LucideMenu as LucideMenu2, LucidePlus as LucidePlus2 } from "lucide-react";

// app/constants/gameRules.ts
var GAME_RULES = {
  WIN_SCORE: 12,
  MAX_ROUNDS: 5,
  VP_MODES: [
    { name: "5\u5206\u5C40 (5/3/1)", scores: [5, 3, 1, 0, 0, 0] },
    { name: "5\u5206\u5C40 (5/4/3)", scores: [5, 4, 3, 0, 0, 0] },
    { name: "4\u5206\u5C40 (4/2/1)", scores: [4, 2, 1, 0, 0, 0] },
    { name: "4\u5206\u5C40 (4/3/2)", scores: [4, 3, 2, 0, 0, 0] },
    { name: "3\u5206\u5C40 (3/2/1)", scores: [3, 2, 1, 0, 0, 0] },
    { name: "3\u5206\u5C40 (3/1/0)", scores: [3, 1, 0, 0, 0, 0] }
  ],
  SPECIAL_RULES: [
    "\u65E0\u7279\u6B8A\u89C4\u5219",
    "\u624B\u724C\u660E\u724C",
    "\u7981\u6B62\u4F7F\u7528 Skip",
    "\u732B\u724C\u89C6\u4E3A Skip"
  ],
  AVATARS: [
    "\u{1F63C}",
    "\u{1F63B}",
    "\u{1F640}",
    "\u{1F63F}",
    "\u{1F63E}",
    "\u{1F638}",
    "\u{1F639}",
    "\u{1F63A}",
    "\u{1F63D}",
    "\u{1F431}",
    "\u{1F408}",
    "\u{1F408}\u200D\u2B1B",
    "\u{1F981}",
    "\u{1F405}",
    "\u{1F406}",
    "\u{1F42F}",
    "\u{1F648}",
    "\u{1F649}",
    "\u{1F64A}",
    "\u{1F435}",
    "\u{1F98A}",
    "\u{1F43A}",
    "\u{1F436}",
    "\u{1F415}",
    "\u{1F99D}",
    "\u{1F428}",
    "\u{1F43C}",
    "\u{1F439}",
    "\u{1F42D}",
    "\u{1F430}",
    "\u{1F43B}",
    "\u{1F43B}\u200D\u2744\uFE0F",
    "\u{1F438}",
    "\u{1F432}",
    "\u{1F984}",
    "\u{1F3AD}"
  ]
};

// app/constants/supabase.ts
var SUPABASE_CONFIG = {
  url: "https://gatiuwpldvmxeeraldue.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdGl1d3BsZHZteGVlcmFsZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MDAwNjQsImV4cCI6MjA3MDI3NjA2NH0.Ncs_pWIXZJ5gVw9PasggTAGWgQX9OnUGTnpjHg1eZvE"
};

// app/utils/gameUtils.ts
var UTILS = {
  getRandomElement: (arr) => arr[Math.floor(Math.random() * arr.length)],
  calculatePlayerStats: (player) => {
    let history = player.history || [], totalGames = history.length, placements = history.reduce((acc, game) => (acc[game.placement] = (acc[game.placement] || 0) + 1, acc), {}), averagePlacement = totalGames > 0 ? (history.reduce((sum, game) => sum + game.placement, 0) / totalGames).toFixed(1) : "N/A", winRate = totalGames > 0 ? ((placements[1] || 0) / totalGames * 100).toFixed(1) : "0";
    return {
      totalGames,
      placements,
      averagePlacement,
      winRate,
      championships: player.championships || 0
    };
  }
};

// app/contexts/ThemeContext.tsx
import { createContext, useContext } from "react";
var ThemeContext = createContext(void 0), useTheme = () => {
  let context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

// app/components/layout/Sidebar.tsx
import { LucideCat, LucideHome, LucideUserPlus, LucideGamepad2, LucideBarChart3, LucideX, LucideSun, LucideMoon, LucidePanelLeftClose, LucidePanelLeftOpen, LucideVolumeX, LucidePlay, LucidePause, LucideBook } from "lucide-react";
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var Sidebar = ({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  musicPlaying,
  setMusicPlaying,
  musicMuted,
  setMusicMuted,
  players,
  onPlayerClick
}) => {
  let { theme, toggleTheme } = useTheme();
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    sidebarOpen && /* @__PURE__ */ jsx3(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
        onClick: () => setSidebarOpen(!1)
      }
    ),
    /* @__PURE__ */ jsxs2("div", { className: `fixed left-0 top-0 h-full ${theme === "dark" ? "bg-black/40" : "bg-white/80"} backdrop-blur-2xl border-r ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} z-50 transform transition-all duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto ${sidebarCollapsed ? "w-16 lg:w-16" : "w-72 sm:w-80 md:w-72 lg:w-64"} ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"}`, children: [
      /* @__PURE__ */ jsx3("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-white/5 to-transparent" : "bg-gradient-to-b from-gray-50/50 to-transparent"}` }),
      /* @__PURE__ */ jsxs2("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ jsx3("div", { className: `relative p-4 sm:p-6 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200/50"}`, children: /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-between relative z-10", children: [
          /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsx3("div", { className: "relative p-2 sm:p-2.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_20px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ jsx3(LucideCat, { className: "text-orange-400", size: 18 }) }),
            !sidebarCollapsed && /* @__PURE__ */ jsxs2("div", { children: [
              /* @__PURE__ */ jsx3("h2", { className: `text-sm sm:text-base font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Boom League" }),
              /* @__PURE__ */ jsx3("p", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-600"} font-medium hidden sm:block`, children: "Tournament Tracker" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs2("div", { className: `flex items-center ${sidebarCollapsed ? "flex-col gap-1" : "gap-2"}`, children: [
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: () => setSidebarCollapsed(!sidebarCollapsed),
                className: `hidden lg:flex p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
                title: sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar",
                children: sidebarCollapsed ? /* @__PURE__ */ jsx3(LucidePanelLeftOpen, { size: 16 }) : /* @__PURE__ */ jsx3(LucidePanelLeftClose, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: () => {
                  musicMuted ? (setMusicMuted(!1), setMusicPlaying(!0)) : musicPlaying ? (setMusicMuted(!0), setMusicPlaying(!1)) : setMusicPlaying(!0);
                },
                className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${musicPlaying && !musicMuted ? "text-orange-400 bg-orange-500/20 border-orange-500/30" : theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
                title: musicMuted ? "Unmute music" : musicPlaying ? "Pause music" : "Play music",
                children: musicMuted ? /* @__PURE__ */ jsx3(LucideVolumeX, { size: 16 }) : musicPlaying ? /* @__PURE__ */ jsx3(LucidePause, { size: 16 }) : /* @__PURE__ */ jsx3(LucidePlay, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: () => {
                  window.open("https://docs.google.com/document/d/1zJaKW7T4Lz0537q-SPOSN5mYH0btt6K8Yvd6craN504/edit?usp=sharing", "_blank");
                },
                className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
                title: "Open rulebook (external link)",
                children: /* @__PURE__ */ jsx3(LucideBook, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: toggleTheme,
                className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
                title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
                children: theme === "dark" ? /* @__PURE__ */ jsx3(LucideSun, { size: 16 }) : /* @__PURE__ */ jsx3(LucideMoon, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: () => setSidebarOpen(!1),
                className: `lg:hidden ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`,
                children: /* @__PURE__ */ jsx3(LucideX, { size: 20 })
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx3("nav", { className: `flex-1 ${sidebarCollapsed ? "p-2" : "p-3 sm:p-4"} relative z-10`, children: /* @__PURE__ */ jsx3("ul", { className: `space-y-1 sm:space-y-1.5 ${sidebarCollapsed ? "flex flex-col items-center" : ""}`, children: [
          { id: "home", name: "\u9996\u9875", icon: LucideHome },
          { id: "registration", name: "\u73A9\u5BB6\u6CE8\u518C", icon: LucideUserPlus },
          { id: "league", name: "\u8054\u8D5B\u7BA1\u7406", icon: LucideGamepad2 },
          { id: "rankings", name: "\u6392\u884C\u699C", icon: LucideBarChart3 }
        ].map((item) => {
          let Icon = item.icon, isActive = currentPage === item.id;
          return /* @__PURE__ */ jsx3("li", { children: /* @__PURE__ */ jsxs2(
            "button",
            {
              onClick: () => {
                setCurrentPage(item.id), setSidebarOpen(!1);
              },
              className: `group relative ${sidebarCollapsed ? "w-10 h-10" : "w-full"} flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"} px-3 sm:px-4 py-3 sm:py-3 rounded-lg transition-all duration-200 overflow-hidden text-sm sm:text-base ${isActive ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.2)]" : theme === "dark" ? "text-white/70 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10" : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent hover:border-gray-200"}`,
              title: sidebarCollapsed ? item.name : void 0,
              children: [
                isActive && /* @__PURE__ */ jsx3("div", { className: "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-sm" }),
                /* @__PURE__ */ jsx3(Icon, { size: 18, className: "relative z-10 flex-shrink-0" }),
                !sidebarCollapsed && /* @__PURE__ */ jsx3("span", { className: "font-medium relative z-10 truncate", children: item.name })
              ]
            }
          ) }, item.id);
        }) }) }),
        !sidebarCollapsed && currentPage !== "rankings" && players.length > 0 && /* @__PURE__ */ jsxs2("div", { className: `relative p-3 sm:p-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200/50"}`, children: [
          /* @__PURE__ */ jsx3("h3", { className: `text-xs font-semibold ${theme === "dark" ? "text-white/60" : "text-gray-500"} mb-2 sm:mb-3 uppercase tracking-wider`, children: "Quick Access" }),
          /* @__PURE__ */ jsx3("div", { className: "space-y-1 max-h-28 sm:max-h-32 overflow-y-auto", children: players.slice(0, 3).map((player) => /* @__PURE__ */ jsxs2(
            "button",
            {
              onClick: () => onPlayerClick(player),
              className: `relative w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:bg-white/5 hover:text-white hover:border-white/10" : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 hover:border-gray-200"}`,
              children: [
                /* @__PURE__ */ jsx3("span", { className: "text-sm sm:text-base flex-shrink-0", children: player.avatar }),
                /* @__PURE__ */ jsx3("span", { className: "truncate font-medium", children: player.name })
              ]
            },
            player.id
          )) })
        ] })
      ] })
    ] })
  ] });
}, Sidebar_default = Sidebar;

// app/components/ui/Leaderboard.tsx
import { LucideTrophy } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var Leaderboard = ({ players, onPlayerClick }) => {
  let { theme } = useTheme();
  return /* @__PURE__ */ jsxs3("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ jsx4("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }),
    /* @__PURE__ */ jsxs3("div", { className: "relative z-10 p-4 sm:p-6", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx4("div", { className: "relative p-1.5 sm:p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg shadow-[0_0_20px_rgba(251,191,36,0.2)]", children: /* @__PURE__ */ jsx4(LucideTrophy, { size: 14, className: "text-yellow-400 sm:w-4 sm:h-4" }) }),
        /* @__PURE__ */ jsx4("h3", { className: `text-base sm:text-lg font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Leaderboard" })
      ] }),
      /* @__PURE__ */ jsx4("div", { className: "space-y-1.5 sm:space-y-2", children: players.map((p, index) => /* @__PURE__ */ jsxs3(
        "div",
        {
          className: `group relative flex items-center justify-between p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98] ${theme === "dark" ? "hover:bg-white/5 hover:border-white/10 active:bg-white/10" : "hover:bg-gray-100/50 hover:border-gray-200 active:bg-gray-200/50"}`,
          onClick: () => onPlayerClick && onPlayerClick(p),
          children: [
            /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx4("div", { className: `relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm border flex-shrink-0 ${index === 0 ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : index === 1 ? `bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-gray-400/30 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}` : index === 2 ? "bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-orange-500/30 text-orange-400" : theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600"}`, children: index + 1 }),
              /* @__PURE__ */ jsx4("span", { className: "text-lg sm:text-xl flex-shrink-0", children: p.avatar }),
              /* @__PURE__ */ jsx4("span", { className: `font-medium text-sm sm:text-base truncate ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: p.name })
            ] }),
            /* @__PURE__ */ jsxs3("div", { className: "text-right flex-shrink-0", children: [
              /* @__PURE__ */ jsx4("div", { className: "font-semibold text-base sm:text-lg text-emerald-400", children: p.score }),
              /* @__PURE__ */ jsx4("div", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"} font-medium`, children: "VP" })
            ] })
          ]
        },
        p.id
      )) })
    ] })
  ] });
}, Leaderboard_default = Leaderboard;

// app/components/ui/PlayerProfiles.tsx
import { LucideUsers } from "lucide-react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var PlayerProfiles = ({ players, onPlayerClick }) => {
  let { theme } = useTheme();
  return /* @__PURE__ */ jsxs4("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ jsx5("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }),
    /* @__PURE__ */ jsxs4("div", { className: "relative z-10 p-4 sm:p-6", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx5("div", { className: "relative p-1.5 sm:p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)]", children: /* @__PURE__ */ jsx5(LucideUsers, { size: 14, className: "text-blue-400 sm:w-4 sm:h-4" }) }),
        /* @__PURE__ */ jsx5("h3", { className: `text-base sm:text-lg font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Player Profiles" })
      ] }),
      /* @__PURE__ */ jsx5("div", { className: "space-y-1.5 sm:space-y-2", children: players.map((p) => /* @__PURE__ */ jsxs4(
        "div",
        {
          className: `group relative p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98] ${theme === "dark" ? "hover:bg-white/5 hover:border-white/10 active:bg-white/10" : "hover:bg-gray-100/50 hover:border-gray-200 active:bg-gray-200/50"}`,
          onClick: () => onPlayerClick && onPlayerClick(p),
          children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3", children: [
              /* @__PURE__ */ jsx5("span", { className: "text-lg sm:text-xl flex-shrink-0", children: p.avatar }),
              /* @__PURE__ */ jsx5("span", { className: `font-medium text-sm sm:text-base truncate ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: p.name })
            ] }),
            /* @__PURE__ */ jsxs4("div", { className: "flex flex-wrap gap-1.5 sm:gap-2", children: [
              /* @__PURE__ */ jsxs4("div", { className: "inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs font-medium text-yellow-400", children: [
                /* @__PURE__ */ jsx5("span", { children: "\u{1F3C6}" }),
                /* @__PURE__ */ jsxs4("span", { className: "hidden xs:inline", children: [
                  p.championships || 0,
                  " \u51A0\u519B"
                ] }),
                /* @__PURE__ */ jsx5("span", { className: "xs:hidden", children: p.championships || 0 })
              ] }),
              /* @__PURE__ */ jsxs4("div", { className: `inline-flex items-center gap-1 px-2 py-0.5 bg-gray-400/10 border border-gray-400/20 rounded text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
                /* @__PURE__ */ jsx5("span", { children: "\u{1F948}" }),
                /* @__PURE__ */ jsxs4("span", { className: "hidden xs:inline", children: [
                  p.runnerUp || 0,
                  " \u4E9A\u519B"
                ] }),
                /* @__PURE__ */ jsx5("span", { className: "xs:hidden", children: p.runnerUp || 0 })
              ] }),
              /* @__PURE__ */ jsxs4("div", { className: "inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-xs font-medium text-orange-400", children: [
                /* @__PURE__ */ jsx5("span", { children: "\u{1F949}" }),
                /* @__PURE__ */ jsxs4("span", { className: "hidden xs:inline", children: [
                  p.thirdPlace || 0,
                  " \u5B63\u519B"
                ] }),
                /* @__PURE__ */ jsx5("span", { className: "xs:hidden", children: p.thirdPlace || 0 })
              ] }),
              /* @__PURE__ */ jsxs4("div", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600"} border`, children: [
                /* @__PURE__ */ jsx5("span", { className: "hidden sm:inline", children: p.history.length > 0 ? `${p.history.length} Games` : "New Player" }),
                /* @__PURE__ */ jsx5("span", { className: "sm:hidden", children: p.history.length > 0 ? `${p.history.length}G` : "New" })
              ] })
            ] })
          ]
        },
        p.id
      )) })
    ] })
  ] });
}, PlayerProfiles_default = PlayerProfiles;

// app/components/ui/InfoCard.tsx
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var InfoCard = ({ icon, title, value }) => {
  let { theme } = useTheme();
  return /* @__PURE__ */ jsxs5("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg p-3 sm:p-4 lg:p-5 transition-all duration-200 ${theme === "dark" ? "hover:bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.2)]" : "hover:bg-gray-100/50 shadow-[0_0_30px_rgba(0,0,0,0.1)]"}`, children: [
    /* @__PURE__ */ jsx6("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg` }),
    /* @__PURE__ */ jsxs5("div", { className: "relative z-10 flex items-center gap-2.5 sm:gap-3 lg:gap-4", children: [
      /* @__PURE__ */ jsx6("div", { className: `p-2 sm:p-2.5 backdrop-blur-sm border rounded-lg flex-shrink-0 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"}`, children: /* @__PURE__ */ jsx6("div", { className: "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center", children: icon }) }),
      /* @__PURE__ */ jsxs5("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx6("p", { className: `text-xs sm:text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"} truncate`, children: title }),
        /* @__PURE__ */ jsx6("p", { className: `font-semibold text-base sm:text-lg lg:text-xl ${theme === "dark" ? "text-white" : "text-gray-900"} truncate`, children: value })
      ] })
    ] })
  ] });
}, InfoCard_default = InfoCard;

// app/components/ui/ScheduleTimeline.tsx
import { LucideScrollText } from "lucide-react";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var ScheduleTimeline = ({ schedule, currentRound }) => {
  let { theme } = useTheme();
  return /* @__PURE__ */ jsxs6("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ jsx7("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }),
    /* @__PURE__ */ jsxs6("div", { className: "relative z-10 p-6", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx7("div", { className: "relative p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.2)]", children: /* @__PURE__ */ jsx7(LucideScrollText, { size: 16, className: "text-indigo-400" }) }),
        /* @__PURE__ */ jsx7("h3", { className: `text-lg font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Tournament Schedule" })
      ] }),
      /* @__PURE__ */ jsx7("div", { className: "space-y-2", children: schedule.map((roundInfo) => {
        let isActive = roundInfo.round === currentRound;
        return /* @__PURE__ */ jsxs6("div", { className: `relative p-4 rounded-lg transition-all duration-300 border ${isActive ? "bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.1)]" : theme === "dark" ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-100/50 border-gray-200 hover:bg-gray-200/50"}`, children: [
          /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs6("p", { className: `font-semibold text-base ${isActive ? "text-orange-400" : theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
              "Round ",
              roundInfo.round
            ] }),
            isActive && /* @__PURE__ */ jsx7("div", { className: "w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.5)]" })
          ] }),
          /* @__PURE__ */ jsxs6("p", { className: `text-sm mt-1 font-medium ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
            roundInfo.vpMode.name,
            " \u2022 ",
            roundInfo.specialRule
          ] })
        ] }, roundInfo.round);
      }) })
    ] })
  ] });
}, ScheduleTimeline_default = ScheduleTimeline;

// app/components/ui/Modal.tsx
import { LucideX as LucideX2 } from "lucide-react";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var Modal = ({ children, onClose, title }) => {
  let { theme } = useTheme();
  return /* @__PURE__ */ jsx8("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4", children: /* @__PURE__ */ jsxs7("div", { className: `relative ${theme === "dark" ? "bg-black/40" : "bg-white/90"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl ${theme === "dark" ? "shadow-[0_0_80px_rgba(0,0,0,0.5)]" : "shadow-[0_0_80px_rgba(0,0,0,0.2)]"} p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto`, children: [
    /* @__PURE__ */ jsx8("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }),
    /* @__PURE__ */ jsxs7("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxs7("div", { className: "flex justify-between items-start gap-4 mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx8("h3", { className: `text-lg sm:text-xl font-semibold tracking-tight flex-1 ${theme === "dark" ? "bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent" : "text-gray-900"}`, children: title }),
        /* @__PURE__ */ jsx8(
          "button",
          {
            onClick: onClose,
            className: `p-2 rounded-lg transition-all duration-200 border border-transparent flex-shrink-0 active:scale-95 ${theme === "dark" ? "text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
            children: /* @__PURE__ */ jsx8(LucideX2, { size: 18 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx8("div", { className: "space-y-4 sm:space-y-6", children })
    ] })
  ] }) });
}, Modal_default = Modal;

// app/components/ui/PlayerProfileModal.tsx
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var PlayerProfileModal = ({ player, onClose }) => {
  let { theme } = useTheme();
  if (!player)
    return null;
  let stats = UTILS.calculatePlayerStats(player);
  return /* @__PURE__ */ jsx9(Modal_default, { onClose, title: `${player.avatar} ${player.name} \u7684\u6863\u6848`, children: /* @__PURE__ */ jsxs8("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs8("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ jsx9("p", { className: "text-2xl font-bold text-yellow-400", children: player.championships || 0 }),
        /* @__PURE__ */ jsx9("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u{1F3C6} \u51A0\u519B\u6B21\u6570" })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ jsx9("p", { className: `text-2xl font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: player.runnerUp || 0 }),
        /* @__PURE__ */ jsx9("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u{1F948} \u4E9A\u519B\u6B21\u6570" })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ jsx9("p", { className: "text-2xl font-bold text-orange-400", children: player.thirdPlace || 0 }),
        /* @__PURE__ */ jsx9("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u{1F949} \u5B63\u519B\u6B21\u6570" })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ jsx9("p", { className: "text-2xl font-bold text-emerald-400", children: player.score }),
        /* @__PURE__ */ jsx9("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u5F53\u524D\u5206\u6570" })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ jsx9("p", { className: "text-2xl font-bold text-blue-400", children: stats.totalGames }),
        /* @__PURE__ */ jsx9("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u603B\u6E38\u620F\u6570" })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ jsx9("p", { className: "text-2xl font-bold text-purple-400", children: stats.averagePlacement }),
        /* @__PURE__ */ jsx9("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u5E73\u5747\u6392\u540D" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex justify-between items-center mb-2", children: [
        /* @__PURE__ */ jsx9("span", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`, children: "\u80DC\u7387" }),
        /* @__PURE__ */ jsxs8("span", { className: "text-orange-400 font-bold", children: [
          stats.winRate,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx9("div", { className: `w-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} rounded-full h-2`, children: /* @__PURE__ */ jsx9(
        "div",
        {
          className: "bg-orange-400 h-2 rounded-full transition-all duration-300",
          style: { width: `${stats.winRate}%` }
        }
      ) })
    ] }),
    stats.totalGames > 0 && /* @__PURE__ */ jsxs8("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ jsx9("h4", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold mb-3`, children: "\u6392\u540D\u5206\u5E03" }),
      /* @__PURE__ */ jsx9("div", { className: "space-y-2", children: [1, 2, 3, 4, 5, 6].map((place) => {
        let count = stats.placements[place] || 0, percentage = stats.totalGames > 0 ? (count / stats.totalGames * 100).toFixed(1) : 0;
        return count > 0 ? /* @__PURE__ */ jsxs8("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs8("span", { className: `text-sm ${place === 1 ? "text-yellow-400" : place === 2 ? "text-gray-300" : place === 3 ? "text-orange-400" : "text-gray-500"}`, children: [
            "\u7B2C",
            place,
            "\u540D"
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs8("span", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} text-sm`, children: [
              count,
              "\u6B21"
            ] }),
            /* @__PURE__ */ jsxs8("span", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xs`, children: [
              "(",
              percentage,
              "%)"
            ] })
          ] })
        ] }, place) : null;
      }) })
    ] }),
    player.history && player.history.length > 0 && /* @__PURE__ */ jsxs8("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ jsx9("h4", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold mb-3`, children: "\u6700\u8FD1\u6BD4\u8D5B" }),
      /* @__PURE__ */ jsx9("div", { className: "space-y-2 max-h-32 overflow-y-auto", children: player.history.slice(-5).reverse().map((game, index) => /* @__PURE__ */ jsxs8("div", { className: "flex justify-between items-center text-sm", children: [
        /* @__PURE__ */ jsxs8("span", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
          "\u7B2C",
          game.round,
          "\u8F6E"
        ] }),
        /* @__PURE__ */ jsxs8("span", { className: `font-semibold ${game.placement === 1 ? "text-yellow-400" : game.placement === 2 ? "text-gray-300" : game.placement === 3 ? "text-orange-400" : "text-gray-500"}`, children: [
          "\u7B2C",
          game.placement,
          "\u540D"
        ] })
      ] }, index)) })
    ] })
  ] }) });
}, PlayerProfileModal_default = PlayerProfileModal;

// app/components/ui/ResultsModal.tsx
import { useState } from "react";
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
var ResultsModal = ({ players, onClose, onSubmit, round }) => {
  let { theme } = useTheme(), [rankedPlayers, setRankedPlayers] = useState(players.map((p) => p.id)), handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index.toString());
  }, handleDrop = (e, dropIndex) => {
    let draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex")), newRankedPlayers = [...rankedPlayers], [draggedItem] = newRankedPlayers.splice(draggedIndex, 1);
    newRankedPlayers.splice(dropIndex, 0, draggedItem), setRankedPlayers(newRankedPlayers);
  }, getPlayerById = (id) => players.find((p) => p.id === id);
  return /* @__PURE__ */ jsx10(Modal_default, { onClose, title: `\u8F93\u5165\u7B2C ${round} \u8F6E\u6BD4\u8D5B\u7ED3\u679C`, children: /* @__PURE__ */ jsxs9("div", { children: [
    /* @__PURE__ */ jsx10("p", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4 text-sm sm:text-base`, children: "\u8BF7\u62D6\u52A8\u73A9\u5BB6\u5361\u7247\u4EE5\u786E\u5B9A\u672C\u8F6E\u540D\u6B21\uFF08\u4ECE\u4E0A\u5230\u4E0B\u4E3A 1-N \u540D\uFF09\u3002" }),
    /* @__PURE__ */ jsx10("div", { className: "space-y-2 sm:space-y-3 max-h-60 sm:max-h-72 overflow-y-auto", children: rankedPlayers.map((playerId, index) => {
      let player = getPlayerById(playerId);
      return player ? /* @__PURE__ */ jsxs9(
        "div",
        {
          draggable: !0,
          onDragStart: (e) => handleDragStart(e, index),
          onDragOver: (e) => e.preventDefault(),
          onDrop: (e) => handleDrop(e, index),
          className: `flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 active:scale-[0.98] ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 active:bg-gray-600" : "bg-gray-200 hover:bg-gray-300 active:bg-gray-300"}`,
          children: [
            /* @__PURE__ */ jsx10("span", { className: "font-bold text-base sm:text-lg text-orange-400 w-5 sm:w-6 flex-shrink-0 text-center", children: index + 1 }),
            /* @__PURE__ */ jsx10("span", { className: "text-xl sm:text-2xl flex-shrink-0", children: player.avatar }),
            /* @__PURE__ */ jsx10("span", { className: `font-semibold text-sm sm:text-base truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: player.name })
          ]
        },
        playerId
      ) : null;
    }) }),
    /* @__PURE__ */ jsx10(
      "button",
      {
        onClick: () => onSubmit(rankedPlayers),
        className: "w-full mt-4 sm:mt-6 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3 sm:py-4 rounded-lg transition-all duration-200 active:scale-[0.98] text-sm sm:text-base",
        children: "\u786E\u8BA4\u5E76\u8FDB\u5165\u4E0B\u4E00\u8F6E"
      }
    )
  ] }) });
}, ResultsModal_default = ResultsModal;

// app/components/pages/HomePage.tsx
import { LucideCat as LucideCat2, LucideCrown } from "lucide-react";
import { Fragment as Fragment2, jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
var HomePage = ({
  leagueState,
  players,
  handleStartLeague,
  handleResetLeague,
  handlePlayerClick
}) => {
  let { theme } = useTheme();
  return !leagueState || leagueState.status === "setup" ? /* @__PURE__ */ jsxs10("div", { className: "space-y-6 sm:space-y-8", children: [
    /* @__PURE__ */ jsx11("div", { className: "text-center", children: /* @__PURE__ */ jsxs10("div", { className: "inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8", children: [
      /* @__PURE__ */ jsx11("div", { className: "relative p-4 sm:p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ jsx11(LucideCat2, { className: "text-orange-400", size: 32 }) }),
      /* @__PURE__ */ jsxs10("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ jsx11("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-orange-500 bg-clip-text text-transparent"}`, children: "Boom League" }),
        /* @__PURE__ */ jsx11("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "Professional Tournament Management" })
      ] })
    ] }) }),
    players.length > 0 && /* @__PURE__ */ jsxs10("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"}`, children: [
      /* @__PURE__ */ jsx11("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }),
      /* @__PURE__ */ jsxs10("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6", children: [
          /* @__PURE__ */ jsx11("div", { className: "w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]" }),
          /* @__PURE__ */ jsx11("h2", { className: `text-xl sm:text-2xl font-semibold tracking-tight ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "Quick Start" })
        ] }),
        /* @__PURE__ */ jsxs10("p", { className: `text-base sm:text-lg mb-6 sm:mb-8 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: [
          /* @__PURE__ */ jsx11("span", { className: "text-orange-400 font-semibold", children: players.length }),
          " players registered and ready to compete"
        ] }),
        /* @__PURE__ */ jsxs10(
          "button",
          {
            onClick: handleStartLeague,
            disabled: players.length < 2,
            className: `relative group bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 active:from-orange-500/40 active:to-orange-600/40 text-orange-400 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg border border-orange-500/30 shadow-[0_0_30px_rgba(251,146,60,0.2)] transition-all duration-200 hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] active:scale-[0.98] text-sm sm:text-base ${players.length < 2 ? "disabled:from-white/5 disabled:to-white/5 disabled:text-white/40 disabled:border-white/10 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100" : ""}`,
            children: [
              /* @__PURE__ */ jsx11("span", { className: "relative z-10", children: "Start New Tournament" }),
              /* @__PURE__ */ jsx11("div", { className: "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" })
            ]
          }
        )
      ] })
    ] })
  ] }) : leagueState.status === "in_progress" ? /* @__PURE__ */ jsxs10("div", { className: "space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxs10("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx11("h2", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-2", children: "\u8054\u8D5B\u8FDB\u884C\u4E2D" }),
      /* @__PURE__ */ jsxs10("p", { className: `text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
        "\u7B2C ",
        leagueState.current_round,
        " / ",
        GAME_RULES.MAX_ROUNDS,
        " \u8F6E"
      ] })
    ] }),
    /* @__PURE__ */ jsxs10("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: [
      /* @__PURE__ */ jsx11(Leaderboard_default, { players, onPlayerClick: handlePlayerClick }),
      /* @__PURE__ */ jsx11(PlayerProfiles_default, { players, onPlayerClick: handlePlayerClick })
    ] })
  ] }) : leagueState.status === "finished" ? /* @__PURE__ */ jsx11("div", { className: "space-y-4 sm:space-y-6", children: /* @__PURE__ */ jsxs10("div", { className: `text-center p-6 sm:p-8 lg:p-10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg flex flex-col items-center gap-3 sm:gap-4 border-2 border-yellow-400 ${theme === "dark" ? "bg-gray-800/70" : "bg-white/80"}`, children: [
    /* @__PURE__ */ jsx11(LucideCrown, { className: "text-yellow-400", size: 60 }),
    /* @__PURE__ */ jsx11("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-300", children: "\u8054\u8D5B\u7ED3\u675F\uFF01" }),
    leagueState.winner && /* @__PURE__ */ jsxs10(Fragment2, { children: [
      /* @__PURE__ */ jsx11("div", { className: "text-4xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4", children: leagueState.winner.avatar }),
      /* @__PURE__ */ jsx11("p", { className: `text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.winner.name }),
      /* @__PURE__ */ jsx11("p", { className: `text-base sm:text-lg lg:text-xl mt-2 px-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: leagueState.winner.reason })
    ] }),
    /* @__PURE__ */ jsx11(
      "button",
      {
        onClick: handleResetLeague,
        className: "mt-6 sm:mt-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base",
        children: "\u5F00\u542F\u65B0\u8054\u8D5B"
      }
    )
  ] }) }) : null;
}, HomePage_default = HomePage;

// app/components/pages/PlayerRegistrationPage.tsx
import { LucidePlus, LucideTrash2 } from "lucide-react";
import { jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
var PlayerRegistrationPage = ({
  players,
  handleAddPlayer,
  handleDeletePlayer,
  handlePlayerClick,
  newPlayerName,
  setNewPlayerName,
  selectedAvatar,
  setSelectedAvatar,
  showPlayerModal,
  setShowPlayerModal
}) => {
  let { theme } = useTheme();
  return /* @__PURE__ */ jsxs11("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs11("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx12("h2", { className: `text-4xl font-bold mb-3 ${theme === "dark" ? "bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent" : "bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"}`, children: "\u73A9\u5BB6\u6CE8\u518C" }),
      /* @__PURE__ */ jsx12("p", { className: `text-lg ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`, children: "\u7BA1\u7406\u53C2\u4E0E\u8054\u8D5B\u7684\u73A9\u5BB6" })
    ] }),
    /* @__PURE__ */ jsxs11("div", { className: `backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${theme === "dark" ? "bg-slate-800/40 border-slate-700/30" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs11("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsxs11("h3", { className: `text-2xl font-bold flex items-center gap-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
          /* @__PURE__ */ jsx12("div", { className: "w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" }),
          "\u5DF2\u6CE8\u518C\u73A9\u5BB6",
          /* @__PURE__ */ jsxs11("span", { className: "text-orange-400", children: [
            "(",
            players.length,
            "/6)"
          ] })
        ] }),
        /* @__PURE__ */ jsxs11(
          "button",
          {
            onClick: () => setShowPlayerModal(!0),
            disabled: players.length >= 6,
            className: "flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none",
            children: [
              /* @__PURE__ */ jsx12(LucidePlus, { size: 18 }),
              " \u6DFB\u52A0\u73A9\u5BB6"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx12("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: players.map((p) => {
        let stats = UTILS.calculatePlayerStats(p);
        return /* @__PURE__ */ jsxs11("div", { className: `flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-lg ${theme === "dark" ? "bg-slate-800/50 hover:bg-slate-700/60 border-slate-700/30" : "bg-white/50 hover:bg-gray-100/60 border-gray-200/30"}`, children: [
          /* @__PURE__ */ jsxs11(
            "div",
            {
              className: "flex items-center gap-4 flex-1",
              onClick: () => handlePlayerClick(p),
              children: [
                /* @__PURE__ */ jsx12("div", { className: "text-4xl", children: p.avatar }),
                /* @__PURE__ */ jsxs11("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx12("span", { className: `font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: p.name }),
                  /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap gap-2 mt-1", children: [
                    stats.championships > 0 && /* @__PURE__ */ jsxs11("span", { className: "text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full", children: [
                      "\u{1F3C6} ",
                      stats.championships,
                      "\u51A0"
                    ] }),
                    /* @__PURE__ */ jsx12("span", { className: `text-xs px-2 py-1 rounded-full ${theme === "dark" ? "bg-slate-700/50 text-slate-300" : "bg-gray-200/50 text-gray-600"}`, children: stats.totalGames > 0 ? `${stats.totalGames}\u573A \u2022 ${stats.winRate}%\u80DC\u7387` : "\u65B0\u73A9\u5BB6" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx12(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation(), handleDeletePlayer(p.id);
              },
              className: "p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200",
              children: /* @__PURE__ */ jsx12(LucideTrash2, { size: 18 })
            }
          )
        ] }, p.id);
      }) })
    ] })
  ] });
}, PlayerRegistrationPage_default = PlayerRegistrationPage;

// app/components/pages/LeagueManagementPage.tsx
import { LucideCrown as LucideCrown2 } from "lucide-react";
import { Fragment as Fragment3, jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
var LeagueManagementPage = ({
  leagueState,
  players,
  handleStartLeague,
  handleResetLeague,
  renderInProgress,
  setShowResultsModal
}) => {
  let { theme } = useTheme();
  return !leagueState || leagueState.status === "setup" ? /* @__PURE__ */ jsxs12("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs12("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx13("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u8054\u8D5B\u7BA1\u7406" }),
      /* @__PURE__ */ jsx13("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: "\u521B\u5EFA\u548C\u7BA1\u7406\u4F60\u7684 Boom League" })
    ] }),
    /* @__PURE__ */ jsxs12("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsx13("h3", { className: `text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "\u521B\u5EFA\u65B0\u8054\u8D5B" }),
      /* @__PURE__ */ jsxs12("p", { className: `mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
        "\u5F53\u524D\u6709 ",
        players.length,
        " \u540D\u73A9\u5BB6\u6CE8\u518C\u3002\u9700\u8981\u81F3\u5C11 2 \u540D\u73A9\u5BB6\u624D\u80FD\u5F00\u59CB\u8054\u8D5B\u3002"
      ] }),
      /* @__PURE__ */ jsx13(
        "button",
        {
          onClick: handleStartLeague,
          disabled: players.length < 2,
          className: "bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100",
          children: "\u5F00\u59CB\u8054\u8D5B"
        }
      )
    ] })
  ] }) : leagueState.status === "in_progress" ? /* @__PURE__ */ jsxs12("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs12("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx13("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u8054\u8D5B\u7BA1\u7406" }),
      /* @__PURE__ */ jsx13("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: "\u5F53\u524D\u8054\u8D5B\u8FDB\u884C\u4E2D" })
    ] }),
    renderInProgress()
  ] }) : leagueState.status === "finished" ? /* @__PURE__ */ jsxs12("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs12("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx13("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u8054\u8D5B\u7BA1\u7406" }),
      /* @__PURE__ */ jsx13("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: "\u8054\u8D5B\u5DF2\u7ED3\u675F" })
    ] }),
    /* @__PURE__ */ jsxs12("div", { className: `text-center p-10 backdrop-blur-md rounded-3xl shadow-lg flex flex-col items-center gap-4 border-2 border-yellow-400 ${theme === "dark" ? "bg-gray-800/70" : "bg-white/80"}`, children: [
      /* @__PURE__ */ jsx13(LucideCrown2, { className: "text-yellow-400", size: 80 }),
      /* @__PURE__ */ jsx13("h2", { className: "text-3xl font-bold text-yellow-300", children: "\u8054\u8D5B\u7ED3\u675F\uFF01" }),
      leagueState.winner && /* @__PURE__ */ jsxs12(Fragment3, { children: [
        /* @__PURE__ */ jsx13("div", { className: "text-4xl mt-4", children: leagueState.winner.avatar }),
        /* @__PURE__ */ jsx13("p", { className: `text-2xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.winner.name }),
        /* @__PURE__ */ jsx13("p", { className: `text-lg mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: leagueState.winner.reason })
      ] }),
      /* @__PURE__ */ jsx13(
        "button",
        {
          onClick: handleResetLeague,
          className: "mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105",
          children: "\u5F00\u542F\u65B0\u8054\u8D5B"
        }
      )
    ] })
  ] }) : null;
}, LeagueManagementPage_default = LeagueManagementPage;

// app/components/pages/PlayerRankingsPage.tsx
import { LucideTrophy as LucideTrophy2, LucideUsers as LucideUsers2 } from "lucide-react";
import { jsx as jsx14, jsxs as jsxs13 } from "react/jsx-runtime";
var PlayerRankingsPage = ({ players, onPlayerClick }) => {
  let { theme } = useTheme(), sortedPlayers = [...players].sort((a, b) => b.championships !== a.championships ? (b.championships || 0) - (a.championships || 0) : b.score - a.score);
  return /* @__PURE__ */ jsxs13("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs13("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx14("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u73A9\u5BB6\u6392\u884C\u699C" }),
      /* @__PURE__ */ jsx14("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: "\u67E5\u770B\u6240\u6709\u73A9\u5BB6\u7684\u8BE6\u7EC6\u7EDF\u8BA1\u548C\u6392\u540D" })
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs13("h3", { className: `text-2xl font-bold mb-6 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
        /* @__PURE__ */ jsx14(LucideTrophy2, { className: "text-yellow-400" }),
        "\u603B\u6392\u884C\u699C"
      ] }),
      /* @__PURE__ */ jsx14("div", { className: "space-y-4", children: sortedPlayers.map((player, index) => {
        let stats = UTILS.calculatePlayerStats(player);
        return /* @__PURE__ */ jsxs13(
          "div",
          {
            className: `flex items-center justify-between p-4 rounded-lg shadow-md cursor-pointer transition-colors ${theme === "dark" ? "bg-gray-700/70 hover:bg-gray-600/70" : "bg-white/70 hover:bg-gray-100/70"}`,
            onClick: () => onPlayerClick(player),
            children: [
              /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx14("span", { className: `font-bold text-2xl w-8 text-center ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : "text-gray-500"}`, children: index + 1 }),
                /* @__PURE__ */ jsx14("span", { className: "text-3xl", children: player.avatar }),
                /* @__PURE__ */ jsxs13("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx14("span", { className: `font-semibold text-xl ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: player.name }),
                  /* @__PURE__ */ jsxs13("div", { className: `flex gap-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                    /* @__PURE__ */ jsxs13("span", { children: [
                      "\u{1F3C6} ",
                      stats.championships,
                      "\u51A0"
                    ] }),
                    /* @__PURE__ */ jsxs13("span", { children: [
                      "\u{1F3AE} ",
                      stats.totalGames,
                      "\u573A"
                    ] }),
                    /* @__PURE__ */ jsxs13("span", { children: [
                      "\u{1F4CA} \u80DC\u7387",
                      stats.winRate,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxs13("span", { children: [
                      "\u{1F4C8} \u5E73\u5747\u6392\u540D",
                      stats.averagePlacement
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs13("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx14("div", { className: "text-2xl font-bold text-green-400", children: player.score }),
                /* @__PURE__ */ jsx14("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "\u5F53\u524D\u5206\u6570" })
              ] })
            ]
          },
          player.id
        );
      }) }),
      players.length === 0 && /* @__PURE__ */ jsxs13("div", { className: `text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
        /* @__PURE__ */ jsx14(LucideUsers2, { size: 48, className: "mx-auto mb-4 opacity-50" }),
        /* @__PURE__ */ jsx14("p", { children: "\u8FD8\u6CA1\u6709\u6CE8\u518C\u7684\u73A9\u5BB6" }),
        /* @__PURE__ */ jsx14("p", { className: "text-sm", children: "\u524D\u5F80\u73A9\u5BB6\u6CE8\u518C\u9875\u9762\u6DFB\u52A0\u73A9\u5BB6" })
      ] })
    ] })
  ] });
}, PlayerRankingsPage_default = PlayerRankingsPage;

// app/routes/_index.tsx
import { jsx as jsx15, jsxs as jsxs14 } from "react/jsx-runtime";
var supabase;
function Index() {
  let [leagueState, setLeagueState] = useState2(null), [players, setPlayers] = useState2([]), [session, setSession] = useState2(null), [isAuthReady, setIsAuthReady] = useState2(!1), [showPlayerModal, setShowPlayerModal] = useState2(!1), [showResultsModal, setShowResultsModal] = useState2(!1), [newPlayerName, setNewPlayerName] = useState2(""), [selectedAvatar, setSelectedAvatar] = useState2(GAME_RULES.AVATARS[0]), [showPlayerProfileModal, setShowPlayerProfileModal] = useState2(!1), [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState2(null), [winner, setWinner] = useState2(null), [appId, setAppId] = useState2("default"), [currentPage, setCurrentPage] = useState2("home"), [sidebarOpen, setSidebarOpen] = useState2(!1), [sidebarCollapsed, setSidebarCollapsed] = useState2(!1), [musicPlaying, setMusicPlaying] = useState2(!1), [musicMuted, setMusicMuted] = useState2(!0);
  useEffect(() => {
    if (typeof window < "u") {
      let savedCollapsed = localStorage.getItem("sidebarCollapsed");
      savedCollapsed !== null && setSidebarCollapsed(JSON.parse(savedCollapsed));
    }
  }, []), useEffect(() => {
    typeof window < "u" && localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]), useEffect(() => {
    if (typeof window < "u") {
      let savedMuted = localStorage.getItem("musicMuted");
      savedMuted !== null && setMusicMuted(JSON.parse(savedMuted));
    }
  }, []), useEffect(() => {
    typeof window < "u" && localStorage.setItem("musicMuted", JSON.stringify(musicMuted));
  }, [musicMuted]);
  let [theme, setTheme] = useState2("dark");
  useEffect(() => {
    if (typeof window < "u") {
      let canvasAppId = new URLSearchParams(window.location.search).get("app_id") || "default";
      setAppId(canvasAppId);
      let savedTheme = localStorage.getItem("boom-league-theme");
      savedTheme && setTheme(savedTheme), supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey), supabase.auth.getSession().then(({ data: { session: session2 } }) => {
        setSession(session2), session2 || supabase.auth.signInAnonymously(), setIsAuthReady(!0);
      });
      let {
        data: { subscription }
      } = supabase.auth.onAuthStateChange((_event, session2) => {
        setSession(session2), setIsAuthReady(!0);
      });
      return () => subscription.unsubscribe();
    }
  }, []), useEffect(() => {
    if (!isAuthReady || !supabase)
      return;
    (async () => {
      let { data: leagueData, error: leagueError } = await supabase.from("league_state").select("*").eq("app_id", appId).single();
      leagueData ? (setLeagueState(leagueData), leagueData.winner ? setWinner(leagueData.winner) : setWinner(null)) : setLeagueState(null), leagueError && leagueError.code !== "PGRST116" && console.error("Error fetching league state:", leagueError);
      let { data: playersData, error: playersError } = await supabase.from("players").select("*").eq("app_id", appId).order("score", { ascending: !1 });
      playersData && setPlayers(playersData), playersError && console.error("Error fetching players:", playersError);
    })();
    let leagueChannel = supabase.channel(`league-state:${appId}`).on("postgres_changes", { event: "*", schema: "public", table: "league_state", filter: `app_id=eq.${appId}` }, (payload) => {
      let updatedState = payload.new;
      setLeagueState(updatedState), updatedState.winner ? setWinner(updatedState.winner) : setWinner(null);
    }).subscribe(), playersChannel = supabase.channel(`players:${appId}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players", filter: `app_id=eq.${appId}` },
      (payload) => {
        payload.eventType === "INSERT" && setPlayers((currentPlayers) => (currentPlayers.some((p) => p.id === payload.new.id) ? currentPlayers : [...currentPlayers, payload.new]).sort((a, b) => b.score - a.score)), payload.eventType === "UPDATE" && setPlayers((currentPlayers) => currentPlayers.map((p) => p.id === payload.new.id ? payload.new : p).sort((a, b) => b.score - a.score)), payload.eventType === "DELETE" && setPlayers((currentPlayers) => currentPlayers.filter((p) => p.id !== payload.old.id));
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(leagueChannel), supabase.removeChannel(playersChannel);
    };
  }, [isAuthReady, appId]);
  let handleAddPlayer = async () => {
    if (newPlayerName.trim() === "" || players.length >= 6)
      return;
    let tempPlayer = {
      id: `temp_${Date.now()}`,
      app_id: appId,
      name: newPlayerName.trim(),
      avatar: selectedAvatar,
      score: 0,
      history: [],
      championships: 0,
      runnerUp: 0,
      thirdPlace: 0
    };
    setPlayers((curr) => [...curr, tempPlayer].sort((a, b) => b.score - a.score));
    let { data, error } = await supabase.from("players").insert({
      app_id: appId,
      name: tempPlayer.name,
      avatar: selectedAvatar,
      score: 0,
      history: [],
      championships: 0,
      runnerUp: 0,
      thirdPlace: 0
    }).select().single();
    error ? (setPlayers((curr) => curr.filter((p) => p.id !== tempPlayer.id)), console.error("Add player failed:", error)) : data && setPlayers(
      (curr) => curr.map((p) => p.id === tempPlayer.id ? data : p).sort((a, b) => b.score - a.score)
    ), setNewPlayerName(""), setSelectedAvatar(GAME_RULES.AVATARS[0]), setShowPlayerModal(!1);
  }, handleDeletePlayer = async (playerId) => {
    let previous = players;
    setPlayers((curr) => curr.filter((p) => p.id !== playerId));
    let { error } = await supabase.from("players").delete().match({ id: playerId, app_id: appId });
    error && (console.error("Delete player failed:", error), setPlayers(previous));
  }, generateSchedule = (playerCount) => {
    let schedule = [];
    for (let i = 0; i < GAME_RULES.MAX_ROUNDS; i++) {
      let safeCardMultipliers = [1, 2, 3, 4], bombCardAdditions = [1, playerCount + 1], handLimits = [4, 5, 6, 1 / 0];
      schedule.push({
        round: i + 1,
        safeCards: playerCount * UTILS.getRandomElement(safeCardMultipliers),
        bombCards: UTILS.getRandomElement(bombCardAdditions),
        handLimit: UTILS.getRandomElement(handLimits),
        vpMode: UTILS.getRandomElement(GAME_RULES.VP_MODES),
        specialRule: UTILS.getRandomElement(GAME_RULES.SPECIAL_RULES)
      });
    }
    return schedule;
  }, handleStartLeague = async () => {
    if (players.length < 2)
      return;
    let schedule = generateSchedule(players.length);
    setLeagueState({
      app_id: appId,
      status: "in_progress",
      current_round: 1,
      schedule,
      winner: null
    });
    let { error } = await supabase.from("league_state").upsert(
      {
        app_id: appId,
        status: "in_progress",
        current_round: 1,
        schedule,
        winner: null
      },
      { onConflict: "app_id" }
    );
    error && console.error("Start league failed:", error);
  }, handleResetLeague = async () => {
    setPlayers((curr) => curr.map((p) => ({ ...p, score: 0, history: [] }))), setLeagueState({
      app_id: appId,
      status: "setup",
      current_round: 0,
      schedule: [],
      winner: null
    }), setWinner(null);
    let [{ error: pErr }, { error: lErr }] = await Promise.all([
      supabase.from("players").update({ score: 0, history: [] }).eq("app_id", appId),
      supabase.from("league_state").upsert(
        {
          app_id: appId,
          status: "setup",
          current_round: 0,
          schedule: [],
          winner: null
        },
        { onConflict: "app_id" }
      )
    ]);
    (pErr || lErr) && console.error("Reset league errors:", pErr, lErr);
  }, handlePlayerClick = (player) => {
    setSelectedPlayerForProfile(player), setShowPlayerProfileModal(!0);
  }, toggleTheme = () => {
    let newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme), typeof window < "u" && localStorage.setItem("boom-league-theme", newTheme);
  }, handleAdvanceRound = async (results) => {
    if (!leagueState)
      return;
    let currentRoundIndex = leagueState.current_round - 1, vpMode = leagueState.schedule[currentRoundIndex].vpMode, updatedPlayersData = [...players], playerUpdates = [];
    for (let [index, playerId] of results.entries()) {
      let player = updatedPlayersData.find((p) => p.id === playerId);
      if (!player)
        continue;
      let points = vpMode.scores[index] || 0, newScore = player.score + points;
      player.score = newScore, player.history = [...player.history, { round: leagueState.current_round, placement: index + 1 }], playerUpdates.push(
        supabase.from("players").update({ score: newScore, history: player.history }).match({ id: playerId, app_id: appId })
      );
    }
    setPlayers(updatedPlayersData.sort((a, b) => b.score - a.score)), await Promise.all(playerUpdates);
    let potentialWinners = updatedPlayersData.filter((p) => p.score >= GAME_RULES.WIN_SCORE).sort((a, b) => b.score - a.score), potentialWinner = potentialWinners.length > 0 ? potentialWinners[0] : null, nextRound = leagueState.current_round + 1, newStatus = leagueState.status, finalWinner = null;
    if (potentialWinner)
      finalWinner = { name: potentialWinner.name, avatar: potentialWinner.avatar, reason: `\u5728\u7B2C ${leagueState.current_round} \u8F6E\u7387\u5148\u8FBE\u5230 ${potentialWinner.score} \u5206\uFF01` }, newStatus = "finished", potentialWinner.championships += 1, playerUpdates.push(
        supabase.from("players").update({ championships: potentialWinner.championships }).match({ id: potentialWinner.id, app_id: appId })
      );
    else if (nextRound > GAME_RULES.MAX_ROUNDS) {
      newStatus = "finished";
      let sortedPlayers = updatedPlayersData.sort((a, b) => b.score - a.score), topScore = sortedPlayers[0].score, winners = sortedPlayers.filter((p) => p.score === topScore);
      if (winners.length > 1)
        finalWinner = { name: winners.map((w) => w.name).join(" \u548C "), avatar: "\u2694\uFE0F", reason: `5\u8F6E\u540E\u5E73\u5206 (${topScore}\u5206)\uFF0C\u9700\u8981\u8FDB\u884C\u52A0\u8D5B\u5BF9\u51B3\uFF01` };
      else {
        finalWinner = { name: sortedPlayers[0].name, avatar: sortedPlayers[0].avatar, reason: `5\u8F6E\u540E\u4EE5\u6700\u9AD8\u5206 (${topScore}\u5206) \u83B7\u80DC\uFF01` };
        let champion = sortedPlayers[0];
        if (champion.championships += 1, playerUpdates.push(
          supabase.from("players").update({ championships: champion.championships }).match({ id: champion.id, app_id: appId })
        ), sortedPlayers.length >= 2) {
          let runnerUp = sortedPlayers[1];
          runnerUp.runnerUp += 1, playerUpdates.push(
            supabase.from("players").update({ runnerUp: runnerUp.runnerUp }).match({ id: runnerUp.id, app_id: appId })
          );
        }
        if (sortedPlayers.length >= 3) {
          let thirdPlace = sortedPlayers[2];
          thirdPlace.thirdPlace += 1, playerUpdates.push(
            supabase.from("players").update({ thirdPlace: thirdPlace.thirdPlace }).match({ id: thirdPlace.id, app_id: appId })
          );
        }
      }
    }
    setLeagueState((curr) => ({
      ...curr ?? {},
      app_id: appId,
      current_round: nextRound,
      status: newStatus,
      winner: finalWinner,
      schedule: curr?.schedule ?? leagueState.schedule
    })), await supabase.from("league_state").update({
      current_round: nextRound,
      status: newStatus,
      winner: finalWinner
    }).eq("app_id", appId), setShowResultsModal(!1);
  }, renderInProgress = () => {
    if (!leagueState || !leagueState.schedule || leagueState.schedule.length === 0)
      return /* @__PURE__ */ jsx15("div", { className: "text-white", children: "\u52A0\u8F7D\u4E2D..." });
    let currentRoundConfig = leagueState.schedule[leagueState.current_round - 1];
    return currentRoundConfig ? /* @__PURE__ */ jsxs14("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6", children: [
      /* @__PURE__ */ jsxs14("div", { className: "xl:col-span-1 flex flex-col gap-4 sm:gap-6 order-2 xl:order-1", children: [
        /* @__PURE__ */ jsx15(Leaderboard_default, { players, onPlayerClick: handlePlayerClick }),
        /* @__PURE__ */ jsx15("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx15(PlayerProfiles_default, { players, onPlayerClick: handlePlayerClick }) })
      ] }),
      /* @__PURE__ */ jsxs14("div", { className: "xl:col-span-2 flex flex-col gap-4 sm:gap-6 order-1 xl:order-2", children: [
        /* @__PURE__ */ jsxs14("div", { className: `backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
          /* @__PURE__ */ jsxs14("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6", children: [
            /* @__PURE__ */ jsxs14("h2", { className: "text-xl sm:text-2xl lg:text-3xl font-bold text-orange-400", children: [
              "\u7B2C ",
              leagueState.current_round,
              " / ",
              GAME_RULES.MAX_ROUNDS,
              " \u8F6E"
            ] }),
            /* @__PURE__ */ jsxs14(
              "button",
              {
                onClick: () => setShowResultsModal(!0),
                className: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base",
                children: [
                  /* @__PURE__ */ jsx15(LucideClipboardList, { size: 18, className: "flex-shrink-0" }),
                  /* @__PURE__ */ jsx15("span", { className: "hidden xs:inline", children: "\u8F93\u5165\u672C\u8F6E\u7ED3\u679C" }),
                  /* @__PURE__ */ jsx15("span", { className: "xs:hidden", children: "\u7ED3\u679C" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs14("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base lg:text-lg", children: [
            /* @__PURE__ */ jsx15(InfoCard_default, { icon: /* @__PURE__ */ jsx15(LucideShield, { className: "text-blue-400" }), title: "\u5B89\u5168\u724C\u6570\u91CF", value: currentRoundConfig.safeCards }),
            /* @__PURE__ */ jsx15(InfoCard_default, { icon: /* @__PURE__ */ jsx15(LucideBomb, { className: "text-red-400" }), title: "\u70B8\u5F39\u724C\u6570\u91CF", value: currentRoundConfig.bombCards }),
            /* @__PURE__ */ jsx15(InfoCard_default, { icon: /* @__PURE__ */ jsx15(LucideSwords, { className: "text-yellow-400" }), title: "\u51FA\u6218\u624B\u724C\u4E0A\u9650", value: currentRoundConfig.handLimit === 1 / 0 ? "\u65E0\u9650\u5236" : currentRoundConfig.handLimit }),
            /* @__PURE__ */ jsx15(InfoCard_default, { icon: /* @__PURE__ */ jsx15(LucideTrophy3, { className: "text-green-400" }), title: "VP \u5956\u52B1\u6A21\u5F0F", value: currentRoundConfig.vpMode.name }),
            /* @__PURE__ */ jsx15(InfoCard_default, { icon: /* @__PURE__ */ jsx15(LucideDices, { className: "text-purple-400" }), title: "\u7279\u6B8A\u89C4\u5219", value: currentRoundConfig.specialRule })
          ] })
        ] }),
        /* @__PURE__ */ jsx15(ScheduleTimeline_default, { schedule: leagueState.schedule, currentRound: leagueState.current_round })
      ] }),
      /* @__PURE__ */ jsx15("div", { className: "md:hidden xl:hidden order-3", children: /* @__PURE__ */ jsx15(PlayerProfiles_default, { players, onPlayerClick: handlePlayerClick }) })
    ] }) : /* @__PURE__ */ jsx15("div", { className: "text-white", children: "\u6BD4\u8D5B\u7ED3\u675F\uFF01" });
  }, renderCurrentPage = () => {
    if (!isAuthReady)
      return /* @__PURE__ */ jsx15("div", { className: "text-center text-2xl p-8", children: "\u6B63\u5728\u8FDE\u63A5\u670D\u52A1\u5668..." });
    switch (currentPage) {
      case "home":
        return /* @__PURE__ */ jsx15(
          HomePage_default,
          {
            leagueState,
            players,
            handleStartLeague,
            handleResetLeague,
            handlePlayerClick
          }
        );
      case "registration":
        return /* @__PURE__ */ jsx15(
          PlayerRegistrationPage_default,
          {
            players,
            handleAddPlayer,
            handleDeletePlayer,
            handlePlayerClick,
            newPlayerName,
            setNewPlayerName,
            selectedAvatar,
            setSelectedAvatar,
            showPlayerModal,
            setShowPlayerModal
          }
        );
      case "league":
        return /* @__PURE__ */ jsx15(
          LeagueManagementPage_default,
          {
            leagueState,
            players,
            handleStartLeague,
            handleResetLeague,
            renderInProgress,
            setShowResultsModal
          }
        );
      case "rankings":
        return /* @__PURE__ */ jsx15(
          PlayerRankingsPage_default,
          {
            players,
            onPlayerClick: handlePlayerClick
          }
        );
      default:
        return /* @__PURE__ */ jsx15(
          HomePage_default,
          {
            leagueState,
            players,
            handleStartLeague,
            handleResetLeague,
            handlePlayerClick
          }
        );
    }
  }, themeClasses = {
    container: theme === "dark" ? "min-h-screen bg-[#0a0a0a] text-white font-sans flex relative overflow-hidden" : "min-h-screen bg-gray-50 text-gray-900 font-sans flex relative overflow-hidden",
    background: theme === "dark" ? "absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" : "absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100",
    radialGlow1: theme === "dark" ? "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.03)_0%,_transparent_50%)]" : "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(0,0,0,0.02)_0%,_transparent_50%)]",
    radialGlow2: theme === "dark" ? "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(251,146,60,0.08)_0%,_transparent_50%)]" : "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(251,146,60,0.06)_0%,_transparent_50%)]",
    pattern: theme === "dark" ? "absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(255,255,255,0.02)_49%,_rgba(255,255,255,0.02)_51%,_transparent_52%)] bg-[length:20px_20px]" : "absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(0,0,0,0.01)_49%,_rgba(0,0,0,0.01)_51%,_transparent_52%)] bg-[length:20px_20px]"
  };
  return /* @__PURE__ */ jsx15(ThemeContext.Provider, { value: { theme, toggleTheme }, children: /* @__PURE__ */ jsxs14("div", { className: themeClasses.container, children: [
    /* @__PURE__ */ jsx15("div", { className: themeClasses.background }),
    /* @__PURE__ */ jsx15("div", { className: themeClasses.radialGlow1 }),
    /* @__PURE__ */ jsx15("div", { className: themeClasses.radialGlow2 }),
    /* @__PURE__ */ jsx15("div", { className: themeClasses.pattern }),
    /* @__PURE__ */ jsx15(
      Sidebar_default,
      {
        currentPage,
        setCurrentPage,
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        musicPlaying,
        setMusicPlaying,
        musicMuted,
        setMusicMuted,
        players,
        onPlayerClick: handlePlayerClick
      }
    ),
    /* @__PURE__ */ jsxs14("div", { className: `flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-0"} relative`, children: [
      /* @__PURE__ */ jsxs14("header", { className: `lg:hidden flex items-center justify-between p-3 sm:p-4 border-b ${theme === "dark" ? "border-white/10 bg-black/40" : "border-gray-200/50 bg-white/80"} backdrop-blur-2xl sticky top-0 z-40`, children: [
        /* @__PURE__ */ jsx15(
          "button",
          {
            onClick: () => setSidebarOpen(!0),
            className: `p-2 sm:p-2.5 rounded-lg transition-all duration-200 border border-transparent active:scale-95 ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
            children: /* @__PURE__ */ jsx15(LucideMenu2, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxs14("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx15("div", { className: "p-1.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg", children: /* @__PURE__ */ jsx15(LucideCat3, { className: "text-orange-400", size: 16 }) }),
          /* @__PURE__ */ jsx15("h1", { className: `text-sm sm:text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} tracking-tight`, children: "Boom League" })
        ] }),
        /* @__PURE__ */ jsx15("div", { className: "w-8 sm:w-10" }),
        " "
      ] }),
      /* @__PURE__ */ jsx15("main", { className: "p-3 sm:p-4 md:p-6 lg:p-8 relative z-10 min-h-screen", children: renderCurrentPage() })
    ] }),
    showPlayerModal && /* @__PURE__ */ jsx15(Modal_default, { onClose: () => setShowPlayerModal(!1), title: "Add New Player", children: /* @__PURE__ */ jsxs14("div", { children: [
      /* @__PURE__ */ jsxs14("div", { className: "mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx15("label", { className: `font-medium mb-2 block text-sm ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "Player Name" }),
        /* @__PURE__ */ jsx15(
          "input",
          {
            type: "text",
            value: newPlayerName,
            onChange: (e) => setNewPlayerName(e.target.value),
            placeholder: "Enter player name",
            className: `w-full p-3 sm:p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200 backdrop-blur-sm text-base ${theme === "dark" ? "bg-white/5 text-white border-white/10" : "bg-white/80 text-gray-900 border-gray-200"}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxs14("div", { className: "mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx15("label", { className: `font-medium mb-2 sm:mb-3 block text-sm ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "Choose Avatar" }),
        /* @__PURE__ */ jsx15("div", { className: `grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-40 sm:max-h-48 overflow-y-auto p-3 sm:p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50/80 border-gray-200"}`, children: GAME_RULES.AVATARS.map((avatar, index) => /* @__PURE__ */ jsx15(
          "button",
          {
            onClick: () => setSelectedAvatar(avatar),
            className: `text-lg sm:text-xl p-2 sm:p-2.5 rounded-lg transition-all duration-200 border active:scale-95 ${selectedAvatar === avatar ? "bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.3)] scale-110" : theme === "dark" ? "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105" : "bg-white/50 border-gray-200 hover:bg-gray-100/50 hover:scale-105"}`,
            children: avatar
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs14(
        "button",
        {
          onClick: handleAddPlayer,
          className: "relative group w-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 active:from-emerald-500/40 active:to-emerald-600/40 text-emerald-400 font-semibold py-3 sm:py-4 px-6 rounded-lg border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98]",
          children: [
            /* @__PURE__ */ jsxs14("span", { className: "relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base", children: [
              /* @__PURE__ */ jsx15(LucidePlus2, { size: 18 }),
              "Add Player"
            ] }),
            /* @__PURE__ */ jsx15("div", { className: "absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" })
          ]
        }
      )
    ] }) }),
    showResultsModal && leagueState && /* @__PURE__ */ jsx15(
      ResultsModal_default,
      {
        players,
        onClose: () => setShowResultsModal(!1),
        onSubmit: handleAdvanceRound,
        round: leagueState.current_round
      }
    ),
    showPlayerProfileModal && selectedPlayerForProfile && /* @__PURE__ */ jsx15(
      PlayerProfileModal_default,
      {
        player: selectedPlayerForProfile,
        onClose: () => {
          setShowPlayerProfileModal(!1), setSelectedPlayerForProfile(null);
        }
      }
    ),
    !musicMuted && /* @__PURE__ */ jsx15("div", { className: "fixed bottom-4 right-4 z-50 max-w-[90vw] sm:max-w-none", children: /* @__PURE__ */ jsxs14("div", { className: `${theme === "dark" ? "bg-black/80" : "bg-white/80"} backdrop-blur-md rounded-lg border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} p-2 sm:p-3 shadow-lg`, children: [
      /* @__PURE__ */ jsx15(
        "iframe",
        {
          width: "280",
          height: "160",
          src: `https://www.youtube.com/embed/FeJKBFWYB0o?autoplay=${musicPlaying ? "1" : "0"}&loop=1&playlist=FeJKBFWYB0o&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&volume=30`,
          title: "Background Music",
          frameBorder: "0",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          className: "rounded w-full max-w-[280px] h-[160px]"
        }
      ),
      /* @__PURE__ */ jsxs14("div", { className: "flex items-center justify-between mt-2", children: [
        /* @__PURE__ */ jsx15("span", { className: `text-xs ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "Background Music" }),
        /* @__PURE__ */ jsx15(
          "button",
          {
            onClick: () => {
              setMusicMuted(!0), setMusicPlaying(!1);
            },
            className: `text-xs px-2 py-1 rounded transition-colors ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`,
            children: "Hide"
          }
        )
      ] })
    ] }) })
  ] }) });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-P76I4LKJ.js", imports: ["/build/_shared/chunk-325MXIUO.js", "/build/_shared/chunk-TANAHWHW.js", "/build/_shared/chunk-ADMCF34Z.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-5FCQPEEB.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-4YAVG4ZZ.js", imports: ["/build/_shared/chunk-5EDNXG7T.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "f83c7e8c", hmr: void 0, url: "/build/manifest-F83C7E8C.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public\\build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_node_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
