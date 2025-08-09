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
var tailwind_default = "/build/_assets/tailwind-JX2SYWEZ.css?url";

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
import { useState as useState5, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { LucideCat as LucideCat3, LucideShield as LucideShield3, LucideBomb as LucideBomb4, LucideSwords as LucideSwords3, LucideTrophy as LucideTrophy6, LucideDices as LucideDices3, LucideClipboardList, LucideMenu as LucideMenu2, LucidePlus as LucidePlus2, LucideGamepad2 as LucideGamepad22, LucideChevronLeft as LucideChevronLeft2, LucideX as LucideX3, LucideCrown as LucideCrown5 } from "lucide-react";

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
    "\u7981\u6B62\u643A\u5E26 Skip",
    "\u6240\u6709\u732B\u724C\u89C6\u4E3A Skip",
    "\u81F3\u591A\u643A\u5E261\u5F20skip",
    "\u81F3\u591A\u643A\u5E261\u5F20defuse",
    "\u7981\u6B62\u643A\u5E26attack",
    "\u81F3\u591A\u643A\u5E261\u5F20attack",
    "1\u6B21\u514D\u8D39see the future (x3)",
    "3-of-a-kind\uFF1A\u6253\u51FA\u4E09\u5F20\u540C\u540D\u724C\uFF0C\u6307\u5B9A\u5E76\u7D22\u53D6\u76EE\u6807\u73A9\u5BB6\u7684\u8BE5\u724C\uFF0C\u82E5\u65E0\u5219\u65E0\u6548\u3002",
    "\u4EFB\u610F2\u5F20\u76F8\u540C\u7684\u724C\u90FD\u53EF\u4EE5\u6253\u51FAsteal\u4E00\u540D\u73A9\u5BB6\u7684\u624B\u724C",
    "\u6240\u6709\u732B\u724C\u89C6\u4E3Anope",
    "Tacocat=Reverse",
    "Ralphing Rainbow Cat= attack (2x)",
    "Beard Cat=Alter the future\xD73",
    "Zombie cat = defuse",
    "\u589E\u5F3Amark\uFF1A\u82E5\u88AB\u6807\u8BB0\u7684\u724C\u672A\u5728\u4E0B\u56DE\u5408\u6253\u51FA\uFF0C\u5219\u81EA\u52A8\u5F52\u4F60\u3002"
  ],
  // 互斥规则定义
  RULE_CONFLICTS: {
    \u65E0\u7279\u6B8A\u89C4\u5219: ["\u624B\u724C\u660E\u724C", "\u7981\u6B62\u643A\u5E26 Skip", "\u6240\u6709\u732B\u724C\u89C6\u4E3A Skip", "\u81F3\u591A\u643A\u5E261\u5F20skip", "\u81F3\u591A\u643A\u5E261\u5F20defuse", "\u7981\u6B62\u643A\u5E26attack", "\u81F3\u591A\u643A\u5E261\u5F20attack", "1\u6B21\u514D\u8D39see the future (x3)", "3-of-a-kind\uFF1A\u6253\u51FA\u4E09\u5F20\u540C\u540D\u724C\uFF0C\u6307\u5B9A\u5E76\u7D22\u53D6\u76EE\u6807\u73A9\u5BB6\u7684\u8BE5\u724C\uFF0C\u82E5\u65E0\u5219\u65E0\u6548\u3002", "\u4EFB\u610F2\u5F20\u76F8\u540C\u7684\u724C\u90FD\u53EF\u4EE5\u6253\u51FAsteal\u4E00\u540D\u73A9\u5BB6\u7684\u624B\u724C", "\u6240\u6709\u732B\u724C\u89C6\u4E3Anope", "Tacocat=Reverse", "Ralphing Rainbow Cat= attack (2x)", "Beard Cat=Alter the future\xD73", "Zombie cat = defuse", "\u589E\u5F3Amark\uFF1A\u82E5\u88AB\u6807\u8BB0\u7684\u724C\u672A\u5728\u4E0B\u56DE\u5408\u6253\u51FA\uFF0C\u5219\u81EA\u52A8\u5F52\u4F60\u3002"],
    "\u7981\u6B62\u643A\u5E26 Skip": ["\u6240\u6709\u732B\u724C\u89C6\u4E3A Skip", "\u81F3\u591A\u643A\u5E261\u5F20skip"],
    "\u6240\u6709\u732B\u724C\u89C6\u4E3A Skip": ["\u7981\u6B62\u643A\u5E26 Skip", "\u81F3\u591A\u643A\u5E261\u5F20skip"],
    \u81F3\u591A\u643A\u5E261\u5F20skip: ["\u7981\u6B62\u643A\u5E26 Skip", "\u6240\u6709\u732B\u724C\u89C6\u4E3A Skip"],
    \u7981\u6B62\u643A\u5E26attack: ["\u81F3\u591A\u643A\u5E261\u5F20attack", "Ralphing Rainbow Cat= attack (2x)"],
    \u81F3\u591A\u643A\u5E261\u5F20attack: ["\u7981\u6B62\u643A\u5E26attack", "Ralphing Rainbow Cat= attack (2x)"],
    "Ralphing Rainbow Cat= attack (2x)": ["\u7981\u6B62\u643A\u5E26attack", "\u81F3\u591A\u643A\u5E261\u5F20attack"],
    \u81F3\u591A\u643A\u5E261\u5F20defuse: ["Zombie cat = defuse"],
    "Zombie cat = defuse": ["\u81F3\u591A\u643A\u5E261\u5F20defuse"]
  },
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
      championships: player.championships || 0,
      totalVP: player.totalVP || 0
    };
  },
  // Calculate player statistics based on league history (not round history)
  // This should only be called with league-level data, not round-level data
  updatePlayerStatistics: (player) => ({
    ...player,
    totalGames: player.totalGames || 0,
    averagePlacement: player.averagePlacement || 0,
    winRate: player.winRate || 0
  }),
  // Calculate and update league-level statistics when a league finishes
  updateLeagueStatistics: (players, leagueResults) => {
    let updatedPlayers = [...players];
    return leagueResults.forEach((result) => {
      let player = updatedPlayers.find((p) => p.id === result.playerId);
      player && (player.total_games = (player.total_games || 0) + 1, result.finalPlacement === 1 ? player.championships = (player.championships || 0) + 1 : result.finalPlacement === 2 ? player.runner_up = (player.runner_up || 0) + 1 : result.finalPlacement === 3 && (player.third_place = (player.third_place || 0) + 1), player.leagueChampionships = player.championships, player.leagueRunnerUp = player.runner_up, player.leagueThirdPlace = player.third_place, player.totalLeagues = player.total_games, player.totalGames = player.total_games);
    }), updatedPlayers;
  },
  // Calculate and update round-level statistics when a round finishes
  updateRoundStatistics: (players, roundResults) => {
    let updatedPlayers = [...players];
    return roundResults.forEach((result) => {
      let player = updatedPlayers.find((p) => p.id === result.playerId);
      if (!player)
        return;
      let totalRounds = (player.history || []).length;
      if (result.placement === 1 ? player.single_round_firsts = (player.single_round_firsts || 0) + 1 : result.placement === 2 ? player.single_round_seconds = (player.single_round_seconds || 0) + 1 : result.placement === 3 && (player.single_round_thirds = (player.single_round_thirds || 0) + 1), player.history && player.history.length > 0) {
        let totalPlacementSum = player.history.reduce((sum, h) => sum + h.placement, 0);
        player.average_placement = parseFloat((totalPlacementSum / player.history.length).toFixed(2));
      } else
        player.average_placement = result.placement;
      let roundWins = (player.single_round_firsts || 0) + (player.single_round_seconds || 0) + (player.single_round_thirds || 0);
      player.win_rate = totalRounds > 0 ? parseFloat((roundWins / totalRounds * 100).toFixed(1)) : 0, player.roundChampionships = player.single_round_firsts, player.roundRunnerUp = player.single_round_seconds, player.roundThirdPlace = player.single_round_thirds, player.totalRounds = totalRounds, player.roundAveragePlacement = player.average_placement, player.roundWinRate = player.win_rate, player.averagePlacement = player.average_placement, player.winRate = player.win_rate;
    }), updatedPlayers;
  }
};

// app/utils/rankingUtils.ts
var calculatePlayerRankings = (players) => {
  if (!players || players.length === 0)
    return [];
  let playersWithRankings = [...players], calculateRanking = (statGetter, descending = !0) => {
    let values = players.map(statGetter), sortedUniqueValues = [...new Set(values)].sort(
      (a, b) => descending ? b - a : a - b
    );
    return values.map((value) => sortedUniqueValues.indexOf(value) + 1);
  }, championshipsRanks = calculateRanking((p) => p.championships || 0), runnerUpRanks = calculateRanking((p) => p.runner_up || 0), thirdPlaceRanks = calculateRanking((p) => p.third_place || 0), singleRoundFirstsRanks = calculateRanking((p) => p.single_round_firsts || 0), singleRoundSecondsRanks = calculateRanking((p) => p.single_round_seconds || 0), singleRoundThirdsRanks = calculateRanking((p) => p.single_round_thirds || 0), totalVPRanks = calculateRanking((p) => p.total_vp || 0), totalGamesRanks = calculateRanking((p) => p.total_games || 0), averagePlacementRanks = calculateRanking(
    (p) => p.average_placement || 999,
    // Use 999 as default for players with no games
    !1
    // ascending order (lower average placement is better)
  ), winRateRanks = calculateRanking((p) => p.win_rate || 0);
  return playersWithRankings.forEach((player, index) => {
    player.rankings = {
      championships: championshipsRanks[index],
      runner_up: runnerUpRanks[index],
      third_place: thirdPlaceRanks[index],
      single_round_firsts: singleRoundFirstsRanks[index],
      single_round_seconds: singleRoundSecondsRanks[index],
      single_round_thirds: singleRoundThirdsRanks[index],
      total_vp: totalVPRanks[index],
      total_games: totalGamesRanks[index],
      average_placement: averagePlacementRanks[index],
      win_rate: winRateRanks[index]
    };
  }), playersWithRankings;
}, getRankingSuffix = (rank) => rank === 1 ? "1st" : rank === 2 ? "2nd" : rank === 3 ? "3rd" : `${rank}th`, getRankingColorClass = (rank) => rank === 1 ? "text-yellow-400" : rank === 2 ? "text-gray-300" : rank === 3 ? "text-orange-400" : rank <= 5 ? "text-blue-400" : rank <= 10 ? "text-green-400" : "text-gray-500";

// app/utils/supabaseMapping.ts
var playerToSupabase = (player) => {
  let supabasePlayer = {};
  return player.id !== void 0 && (supabasePlayer.id = player.id), player.app_id !== void 0 && (supabasePlayer.app_id = player.app_id), player.name !== void 0 && (supabasePlayer.name = player.name), player.avatar !== void 0 && (supabasePlayer.avatar = player.avatar), player.score !== void 0 && (supabasePlayer.score = player.score), player.history !== void 0 && (supabasePlayer.history = player.history), player.championships !== void 0 && (supabasePlayer.championships = player.championships), player.runner_up !== void 0 && (supabasePlayer.runner_up = player.runner_up), player.third_place !== void 0 && (supabasePlayer.third_place = player.third_place), player.total_vp !== void 0 && (supabasePlayer.total_vp = player.total_vp), player.total_games !== void 0 && (supabasePlayer.total_games = player.total_games), player.average_placement !== void 0 && (supabasePlayer.average_placement = player.average_placement), player.win_rate !== void 0 && (supabasePlayer.win_rate = player.win_rate), player.single_round_firsts !== void 0 && (supabasePlayer.single_round_firsts = player.single_round_firsts), player.single_round_seconds !== void 0 && (supabasePlayer.single_round_seconds = player.single_round_seconds), player.single_round_thirds !== void 0 && (supabasePlayer.single_round_thirds = player.single_round_thirds), player.created_at !== void 0 && (supabasePlayer.created_at = player.created_at), player.updated_at !== void 0 && (supabasePlayer.updated_at = player.updated_at), player.leagueChampionships !== void 0 && (supabasePlayer.championships = player.leagueChampionships), player.leagueRunnerUp !== void 0 && (supabasePlayer.runner_up = player.leagueRunnerUp), player.leagueThirdPlace !== void 0 && (supabasePlayer.third_place = player.leagueThirdPlace), player.roundChampionships !== void 0 && (supabasePlayer.single_round_firsts = player.roundChampionships), player.roundRunnerUp !== void 0 && (supabasePlayer.single_round_seconds = player.roundRunnerUp), player.roundThirdPlace !== void 0 && (supabasePlayer.single_round_thirds = player.roundThirdPlace), player.totalVP !== void 0 && (supabasePlayer.total_vp = player.totalVP), player.totalLeagues !== void 0 && (supabasePlayer.total_games = player.totalLeagues), player.roundAveragePlacement !== void 0 && (supabasePlayer.average_placement = player.roundAveragePlacement), player.roundWinRate !== void 0 && (supabasePlayer.win_rate = player.roundWinRate), player.totalGames !== void 0 && (supabasePlayer.total_games = player.totalGames), player.averagePlacement !== void 0 && (supabasePlayer.average_placement = player.averagePlacement), player.winRate !== void 0 && (supabasePlayer.win_rate = player.winRate), supabasePlayer;
}, playerFromSupabase = (supabasePlayer) => {
  let totalRounds = supabasePlayer.history ? supabasePlayer.history.length : 0;
  return {
    id: supabasePlayer.id,
    app_id: supabasePlayer.app_id,
    name: supabasePlayer.name,
    avatar: supabasePlayer.avatar,
    score: supabasePlayer.score || 0,
    history: supabasePlayer.history || [],
    // Direct database fields
    championships: supabasePlayer.championships || 0,
    runner_up: supabasePlayer.runner_up || 0,
    third_place: supabasePlayer.third_place || 0,
    total_vp: supabasePlayer.total_vp || 0,
    total_games: supabasePlayer.total_games || 0,
    average_placement: supabasePlayer.average_placement || 0,
    win_rate: supabasePlayer.win_rate || 0,
    single_round_firsts: supabasePlayer.single_round_firsts || 0,
    single_round_seconds: supabasePlayer.single_round_seconds || 0,
    single_round_thirds: supabasePlayer.single_round_thirds || 0,
    // Timestamp fields
    created_at: supabasePlayer.created_at,
    updated_at: supabasePlayer.updated_at,
    // Legacy compatibility fields (mapped from database fields)
    leagueChampionships: supabasePlayer.championships || 0,
    leagueRunnerUp: supabasePlayer.runner_up || 0,
    leagueThirdPlace: supabasePlayer.third_place || 0,
    roundChampionships: supabasePlayer.single_round_firsts || 0,
    roundRunnerUp: supabasePlayer.single_round_seconds || 0,
    roundThirdPlace: supabasePlayer.single_round_thirds || 0,
    totalVP: supabasePlayer.total_vp || 0,
    totalLeagues: supabasePlayer.total_games || 0,
    totalRounds,
    roundAveragePlacement: supabasePlayer.average_placement || 0,
    roundWinRate: supabasePlayer.win_rate || 0,
    totalGames: supabasePlayer.total_games || 0,
    averagePlacement: supabasePlayer.average_placement || 0,
    winRate: supabasePlayer.win_rate || 0
  };
}, leagueStateToSupabase = (leagueState) => {
  let supabaseLeagueState = {};
  return leagueState.app_id !== void 0 && (supabaseLeagueState.app_id = leagueState.app_id), leagueState.status !== void 0 && (supabaseLeagueState.status = leagueState.status), leagueState.current_round !== void 0 && (supabaseLeagueState.current_round = leagueState.current_round), leagueState.schedule !== void 0 && (supabaseLeagueState.schedule = leagueState.schedule), leagueState.winner !== void 0 && (supabaseLeagueState.winner = leagueState.winner), leagueState.league_name !== void 0 && (supabaseLeagueState.league_name = leagueState.league_name), leagueState.season_number !== void 0 && (supabaseLeagueState.season_number = leagueState.season_number), leagueState.start_date !== void 0 && (supabaseLeagueState.start_date = leagueState.start_date), leagueState.end_date !== void 0 && (supabaseLeagueState.end_date = leagueState.end_date), leagueState.created_at !== void 0 && (supabaseLeagueState.created_at = leagueState.created_at), leagueState.selected_special_rules !== void 0 && (supabaseLeagueState.selected_special_rules = leagueState.selected_special_rules), supabaseLeagueState;
}, leagueStateFromSupabase = (supabaseLeagueState) => ({
  app_id: supabaseLeagueState.app_id,
  status: supabaseLeagueState.status || "setup",
  current_round: supabaseLeagueState.current_round || 0,
  schedule: supabaseLeagueState.schedule || [],
  winner: supabaseLeagueState.winner || null,
  league_name: supabaseLeagueState.league_name,
  season_number: supabaseLeagueState.season_number,
  start_date: supabaseLeagueState.start_date,
  end_date: supabaseLeagueState.end_date,
  created_at: supabaseLeagueState.created_at,
  selected_special_rules: supabaseLeagueState.selected_special_rules
}), leagueHistoryToSupabase = (leagueHistory) => {
  let supabaseLeagueHistory = {};
  return leagueHistory.id !== void 0 && (supabaseLeagueHistory.id = leagueHistory.id), leagueHistory.app_id !== void 0 && (supabaseLeagueHistory.app_id = leagueHistory.app_id), leagueHistory.league_name !== void 0 && (supabaseLeagueHistory.league_name = leagueHistory.league_name), leagueHistory.season_number !== void 0 && (supabaseLeagueHistory.season_number = leagueHistory.season_number), leagueHistory.start_date !== void 0 && (supabaseLeagueHistory.start_date = leagueHistory.start_date), leagueHistory.end_date !== void 0 && (supabaseLeagueHistory.end_date = leagueHistory.end_date), leagueHistory.winner !== void 0 && (supabaseLeagueHistory.winner = leagueHistory.winner), leagueHistory.final_standings !== void 0 && (supabaseLeagueHistory.final_standings = leagueHistory.final_standings), leagueHistory.total_rounds !== void 0 && (supabaseLeagueHistory.total_rounds = leagueHistory.total_rounds), leagueHistory.total_players !== void 0 && (supabaseLeagueHistory.total_players = leagueHistory.total_players), leagueHistory.created_at !== void 0 && (supabaseLeagueHistory.created_at = leagueHistory.created_at), supabaseLeagueHistory;
}, leagueHistoryFromSupabase = (supabaseLeagueHistory) => ({
  id: supabaseLeagueHistory.id,
  app_id: supabaseLeagueHistory.app_id,
  league_name: supabaseLeagueHistory.league_name,
  season_number: supabaseLeagueHistory.season_number,
  start_date: supabaseLeagueHistory.start_date,
  end_date: supabaseLeagueHistory.end_date,
  winner: supabaseLeagueHistory.winner,
  final_standings: supabaseLeagueHistory.final_standings || [],
  total_rounds: supabaseLeagueHistory.total_rounds,
  total_players: supabaseLeagueHistory.total_players,
  created_at: supabaseLeagueHistory.created_at
});
var leagueHistoryArrayFromSupabase = (supabaseLeagueHistory) => supabaseLeagueHistory.map(leagueHistoryFromSupabase);

// app/contexts/ThemeContext.tsx
import { createContext, useContext } from "react";
var ThemeContext = createContext(void 0), useTheme = () => {
  let context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

// app/components/layout/Sidebar.tsx
import { useState, useRef } from "react";
import { LucideCat, LucideHome, LucideUserPlus, LucideGamepad2, LucideBarChart3, LucideX, LucideSun, LucideMoon, LucideVolumeX, LucideVolume2, LucidePlay, LucidePause, LucideBook, LucideChevronLeft, LucideChevronRight, LucideChevronDown, LucideChevronUp, LucideSmile, LucideFrown, LucideBomb, LucidePartyPopper, LucideWind, LucideHelpCircle } from "lucide-react";

// app/constants/typography.ts
var TYPOGRAPHY = {
  // Font Weights - Limited palette for consistency
  WEIGHTS: {
    light: "font-light",
    // 300 - For subtle text
    normal: "font-normal",
    // 400 - Default body text
    medium: "font-medium",
    // 500 - Emphasized text
    semibold: "font-semibold",
    // 600 - Section headers
    bold: "font-bold",
    // 700 - Main titles
    extrabold: "font-extrabold"
    // 800 - Hero elements (rare use)
  },
  // Font Sizes - Responsive scale system
  SIZES: {
    // Body text sizes
    xs: "text-xs",
    // 12px - Fine print, captions
    sm: "text-sm",
    // 14px - Secondary text
    base: "text-base",
    // 16px - Primary body text
    lg: "text-lg",
    // 18px - Emphasized body text
    // Heading sizes
    xl: "text-xl",
    // 20px - Small headings
    "2xl": "text-2xl",
    // 24px - Section headings
    "3xl": "text-3xl",
    // 30px - Page headings
    "4xl": "text-4xl",
    // 36px - Main titles
    "5xl": "text-5xl"
    // 48px - Hero titles (rare)
  },
  // Responsive combinations for common use cases
  COMBINATIONS: {
    // Display text (main titles, hero elements)
    hero: "text-3xl sm:text-4xl lg:text-5xl font-bold",
    // Page titles
    pageTitle: "text-2xl sm:text-3xl font-bold",
    // Section headings
    sectionTitle: "text-xl sm:text-2xl font-semibold",
    // Card titles
    cardTitle: "text-lg sm:text-xl font-semibold",
    // Subsection headings
    subheading: "text-lg font-medium",
    // Body text variations
    bodyLarge: "text-base sm:text-lg font-normal",
    body: "text-sm sm:text-base font-normal",
    bodySmall: "text-xs sm:text-sm font-normal",
    // Emphasized text
    emphasized: "text-sm sm:text-base font-medium",
    // Labels and captions
    label: "text-xs sm:text-sm font-medium",
    caption: "text-xs font-normal",
    // Button text
    buttonLarge: "text-base font-semibold",
    button: "text-sm font-semibold",
    buttonSmall: "text-xs font-medium",
    // Navigation
    navItem: "text-sm font-medium",
    navTitle: "text-base font-semibold",
    // Status and badges
    badge: "text-xs font-semibold",
    status: "text-sm font-medium",
    // Numbers and stats
    statNumber: "text-lg sm:text-xl font-bold",
    statLabel: "text-xs sm:text-sm font-medium",
    // Form elements
    formLabel: "text-sm font-medium",
    formInput: "text-sm font-normal",
    formHelper: "text-xs font-normal",
    // Modal and dialog
    modalTitle: "text-xl font-semibold",
    modalBody: "text-sm font-normal",
    // Table elements
    tableHeader: "text-xs font-semibold",
    tableCell: "text-sm font-normal",
    // Sidebar elements
    sidebarTitle: "text-sm font-semibold",
    sidebarItem: "text-sm font-medium",
    sidebarCaption: "text-xs font-normal"
  }
};
var LINE_HEIGHTS = {
  tight: "leading-tight",
  // 1.25 - For headings
  snug: "leading-snug",
  // 1.375 - For large text
  normal: "leading-normal",
  // 1.5 - For body text
  relaxed: "leading-relaxed",
  // 1.625 - For comfortable reading
  loose: "leading-loose"
  // 2 - For very spaced text
}, LETTER_SPACING = {
  tighter: "tracking-tighter",
  // -0.05em
  tight: "tracking-tight",
  // -0.025em
  normal: "tracking-normal",
  // 0em
  wide: "tracking-wide",
  // 0.025em
  wider: "tracking-wider",
  // 0.05em
  widest: "tracking-widest"
  // 0.1em
};

// app/components/layout/Sidebar.tsx
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
  setMusicMuted
}) => {
  let { theme, toggleTheme } = useTheme(), [soundBoxCollapsed, setSoundBoxCollapsed] = useState(!1), audioRefs = useRef({}), youtubeRefs = useRef({}), handleMusicToggle = () => {
    musicMuted ? (setMusicMuted(!1), setMusicPlaying(!0)) : musicPlaying ? (setMusicMuted(!0), setMusicPlaying(!1)) : setMusicPlaying(!0);
  }, handleRulebookClick = () => {
    window.open("https://docs.google.com/document/d/1zJaKW7T4Lz0537q-SPOSN5mYH0btt6K8Yvd6craN504/edit?usp=sharing", "_blank");
  }, soundEffects = [
    {
      id: "fart",
      name: "\u{1F4A8} \u653E\u5C41",
      icon: /* @__PURE__ */ jsx3(LucideWind, { size: 16 }),
      color: "from-yellow-500/20 to-brown-500/20 border-yellow-500/30 text-yellow-400",
      youtubeId: "KJotmmDJWAg"
    },
    {
      id: "bomb",
      name: "\u{1F4A3} \u7206\u70B8",
      icon: /* @__PURE__ */ jsx3(LucideBomb, { size: 16 }),
      color: "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400",
      youtubeId: "HTXiJpCDiH4"
    },
    {
      id: "laugh",
      name: "\u{1F602} \u5927\u7B11",
      icon: /* @__PURE__ */ jsx3(LucideSmile, { size: 16 }),
      color: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
      youtubeId: "USerehPnsEE"
    },
    {
      id: "cry",
      name: "\u{1F62D} \u54ED\u6CE3",
      icon: /* @__PURE__ */ jsx3(LucideFrown, { size: 16 }),
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
      youtubeId: "pBUs2R9JV5M"
    },
    {
      id: "happy",
      name: "\u{1F60A} \u5F00\u5FC3",
      icon: /* @__PURE__ */ jsx3(LucidePartyPopper, { size: 16 }),
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
      youtubeId: "NSU2hJ5wT08"
    },
    {
      id: "huh",
      name: "\u{1F914} huh?",
      icon: /* @__PURE__ */ jsx3(LucideHelpCircle, { size: 16 }),
      color: "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400",
      youtubeId: "igO9SmiY4hs"
    }
  ], stopAllSounds = () => {
    try {
      Object.keys(youtubeRefs.current).forEach((soundId) => {
        let iframe = youtubeRefs.current[soundId];
        iframe && iframe.src && (iframe.src = "");
      }), Object.values(audioRefs.current).forEach((audio) => {
        audio && !audio.paused && (audio.pause(), audio.currentTime = 0);
      });
    } catch (error) {
      console.log("Error stopping sounds:", error);
    }
  }, playSound = (soundEffect) => {
    try {
      if (stopAllSounds(), soundEffect.youtubeId) {
        playYouTubeSound(soundEffect.id, soundEffect.youtubeId);
        return;
      }
      playBeepSound();
    } catch (error) {
      console.log("Sound creation failed:", error), playBeepSound();
    }
  }, playYouTubeSound = (soundId, youtubeId) => {
    try {
      let iframe = youtubeRefs.current[soundId];
      if (iframe) {
        let playbackRate = ["fart", "happy", "huh"].includes(soundId) ? 1 : 2;
        iframe.src = "", iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&mute=0&volume=50&start=1&enablejsapi=1&origin=${window.location.origin}`;
        let handleLoad = () => {
          setTimeout(() => {
            try {
              iframe.contentWindow && iframe.contentWindow.postMessage(
                JSON.stringify({
                  event: "command",
                  func: "setPlaybackRate",
                  args: [playbackRate]
                }),
                "https://www.youtube.com"
              );
            } catch (postMessageError) {
              console.log("Could not set playback rate:", postMessageError);
            }
          }, 500);
        };
        iframe.onload = handleLoad;
      }
    } catch (error) {
      console.log("YouTube sound failed:", error), playBeepSound();
    }
  }, playBeepSound = () => {
    try {
      let audioContext = new (window.AudioContext || window.webkitAudioContext)(), oscillator = audioContext.createOscillator(), gainNode = audioContext.createGain();
      oscillator.connect(gainNode), gainNode.connect(audioContext.destination), oscillator.frequency.setValueAtTime(800, audioContext.currentTime), oscillator.type = "sine", gainNode.gain.setValueAtTime(0.3, audioContext.currentTime), gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3), oscillator.start(), oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      console.log("Web Audio API not supported");
    }
  }, menuItems = [
    { id: "home", name: "\u9996\u9875", icon: LucideHome },
    { id: "registration", name: "\u73A9\u5BB6\u6CE8\u518C", icon: LucideUserPlus },
    { id: "league", name: "\u8054\u8D5B\u7BA1\u7406", icon: LucideGamepad2 },
    { id: "rankings", name: "\u6392\u884C\u699C", icon: LucideBarChart3 }
  ];
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    sidebarOpen && /* @__PURE__ */ jsx3(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
        onClick: () => setSidebarOpen(!1)
      }
    ),
    /* @__PURE__ */ jsxs2("div", { className: `fixed left-0 top-0 h-screen ${theme === "dark" ? "bg-black/40" : "bg-white/80"} backdrop-blur-2xl border-r ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} z-50 transform transition-all duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${sidebarCollapsed ? "w-16 lg:w-16" : "w-72 sm:w-80 md:w-72 lg:w-64"} ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"}`, children: [
      /* @__PURE__ */ jsx3("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-white/5 to-transparent" : "bg-gradient-to-b from-gray-50/50 to-transparent"}` }),
      /* @__PURE__ */ jsxs2("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ jsx3("div", { className: `relative p-4 sm:p-6 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200/50"}`, children: /* @__PURE__ */ jsxs2("div", { className: `flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`, children: [
          !sidebarCollapsed && /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsx3("div", { className: "relative p-2 sm:p-2.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_20px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ jsx3(LucideCat, { className: "text-orange-400", size: 18 }) }),
            /* @__PURE__ */ jsxs2("div", { children: [
              /* @__PURE__ */ jsx3("h2", { className: `${TYPOGRAPHY.COMBINATIONS.navTitle} ${theme === "dark" ? "text-white/95" : "text-gray-900"} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`, children: "Boom League" }),
              /* @__PURE__ */ jsx3("p", { className: `${TYPOGRAPHY.COMBINATIONS.sidebarCaption} ${theme === "dark" ? "text-white/60" : "text-gray-600"} hidden sm:block ${LINE_HEIGHTS.normal}`, children: "Tournament Tracker" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: () => setSidebarCollapsed(!sidebarCollapsed),
                className: `hidden lg:flex w-8 h-8 items-center justify-center rounded-md transition-all duration-200 ${theme === "dark" ? "text-white/60 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`,
                title: sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar",
                children: sidebarCollapsed ? /* @__PURE__ */ jsx3(LucideChevronRight, { size: 16 }) : /* @__PURE__ */ jsx3(LucideChevronLeft, { size: 16 })
              }
            ),
            !sidebarCollapsed && /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: () => setSidebarOpen(!1),
                className: `lg:hidden w-8 h-8 flex items-center justify-center rounded-md transition-colors ${theme === "dark" ? "text-white/60 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`,
                children: /* @__PURE__ */ jsx3(LucideX, { size: 16 })
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx3("nav", { className: `flex-1 ${sidebarCollapsed ? "p-2" : "p-3 sm:p-4"} relative z-10`, children: /* @__PURE__ */ jsx3("ul", { className: `space-y-1 sm:space-y-1.5 ${sidebarCollapsed ? "flex flex-col items-center" : ""}`, children: menuItems.map((item) => {
          let Icon = item.icon, isActive = currentPage === item.id;
          return /* @__PURE__ */ jsx3("li", { children: /* @__PURE__ */ jsxs2(
            "button",
            {
              onClick: () => {
                setCurrentPage(item.id), setSidebarOpen(!1);
              },
              className: `group relative ${sidebarCollapsed ? "w-10 h-10" : "w-full"} flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"} px-3 sm:px-4 py-3 sm:py-3 rounded-lg transition-all duration-200 overflow-hidden ${isActive ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.2)]" : theme === "dark" ? "text-white/70 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10" : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent hover:border-gray-200"}`,
              title: sidebarCollapsed ? item.name : void 0,
              children: [
                isActive && /* @__PURE__ */ jsx3("div", { className: "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-sm" }),
                /* @__PURE__ */ jsx3(Icon, { size: 18, className: "relative z-10 flex-shrink-0" }),
                !sidebarCollapsed && /* @__PURE__ */ jsx3("span", { className: `${TYPOGRAPHY.COMBINATIONS.sidebarItem} relative z-10 truncate ${LINE_HEIGHTS.tight}`, children: item.name })
              ]
            }
          ) }, item.id);
        }) }) }),
        !sidebarCollapsed && /* @__PURE__ */ jsx3("div", { className: `mx-3 sm:mx-4 mb-3 sm:mb-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} pt-3 sm:pt-4`, children: /* @__PURE__ */ jsxs2("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs2(
            "button",
            {
              onClick: () => setSoundBoxCollapsed(!soundBoxCollapsed),
              className: `w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"}`,
              children: [
                /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx3(LucideVolume2, { size: 16 }),
                  /* @__PURE__ */ jsx3("span", { className: `${TYPOGRAPHY.COMBINATIONS.sidebarTitle} ${LINE_HEIGHTS.tight}`, children: "\u97F3\u6548\u76D2" })
                ] }),
                soundBoxCollapsed ? /* @__PURE__ */ jsx3(LucideChevronDown, { size: 16 }) : /* @__PURE__ */ jsx3(LucideChevronUp, { size: 16 })
              ]
            }
          ),
          !soundBoxCollapsed && /* @__PURE__ */ jsxs2("div", { className: "mt-2 space-y-2", children: [
            /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-2 gap-1.5", children: soundEffects.map((sound) => /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: () => playSound(sound),
                className: `p-2 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-br ${sound.color} hover:shadow-md group`,
                title: `\u64AD\u653E ${sound.name}`,
                children: /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx3("div", { className: "transition-transform duration-200 group-hover:scale-110", children: sound.icon }),
                  /* @__PURE__ */ jsx3("span", { className: `${TYPOGRAPHY.COMBINATIONS.buttonSmall} truncate ${LINE_HEIGHTS.tight}`, children: sound.name.split(" ")[1] || sound.name })
                ] })
              },
              sound.id
            )) }),
            /* @__PURE__ */ jsx3("div", { className: `p-2 rounded-lg text-center ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: /* @__PURE__ */ jsx3("p", { className: `${TYPOGRAPHY.COMBINATIONS.caption} ${theme === "dark" ? "text-white/50" : "text-gray-500"} ${LINE_HEIGHTS.normal}`, children: "\u{1F4A1} \u70B9\u51FB\u64AD\u653E\u97F3\u6548" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx3("div", { className: `relative p-3 sm:p-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} mt-auto`, children: sidebarCollapsed ? /* @__PURE__ */ jsxs2("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: handleMusicToggle,
              className: `w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${musicPlaying && !musicMuted ? "text-orange-400 bg-orange-500/20 border-orange-500/30" : theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
              title: musicMuted ? "Unmute music" : musicPlaying ? "Pause music" : "Play music",
              children: musicMuted ? /* @__PURE__ */ jsx3(LucideVolumeX, { size: 14 }) : musicPlaying ? /* @__PURE__ */ jsx3(LucidePause, { size: 14 }) : /* @__PURE__ */ jsx3(LucidePlay, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: toggleTheme,
              className: `w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
              title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
              children: theme === "dark" ? /* @__PURE__ */ jsx3(LucideSun, { size: 14 }) : /* @__PURE__ */ jsx3(LucideMoon, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: handleRulebookClick,
              className: `w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
              title: "Open rulebook (external link)",
              children: /* @__PURE__ */ jsx3(LucideBook, { size: 14 })
            }
          )
        ] }) : /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: handleMusicToggle,
                className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${musicPlaying && !musicMuted ? "text-orange-400 bg-orange-500/20 border-orange-500/30" : theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
                title: musicMuted ? "Unmute music" : musicPlaying ? "Pause music" : "Play music",
                children: musicMuted ? /* @__PURE__ */ jsx3(LucideVolumeX, { size: 16 }) : musicPlaying ? /* @__PURE__ */ jsx3(LucidePause, { size: 16 }) : /* @__PURE__ */ jsx3(LucidePlay, { size: 16 })
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
                onClick: handleRulebookClick,
                className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
                title: "Open rulebook (external link)",
                children: /* @__PURE__ */ jsx3(LucideBook, { size: 16 })
              }
            )
          ] }),
          /* @__PURE__ */ jsx3("div", { className: `${TYPOGRAPHY.COMBINATIONS.caption} ${theme === "dark" ? "text-white/40" : "text-gray-400"} ${LINE_HEIGHTS.normal} ${LETTER_SPACING.wide}`, children: "Controls" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "hidden", children: soundEffects.filter((sound) => sound.youtubeId).map((sound) => /* @__PURE__ */ jsx3(
      "iframe",
      {
        ref: (el) => youtubeRefs.current[sound.id] = el,
        width: "0",
        height: "0",
        src: `https://www.youtube.com/embed/${sound.youtubeId}?controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&mute=1&start=1&enablejsapi=1&origin=${typeof window < "u" ? window.location.origin : ""}`,
        title: `${sound.name} Sound Effect`,
        frameBorder: "0",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        style: { display: "none", position: "absolute", left: "-9999px", top: "-9999px" }
      },
      sound.id
    )) })
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
        /* @__PURE__ */ jsx4("h3", { className: `${TYPOGRAPHY.COMBINATIONS.cardTitle} ${theme === "dark" ? "text-white/95" : "text-gray-900"} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`, children: "Leaderboard" })
      ] }),
      /* @__PURE__ */ jsx4("div", { className: "space-y-1.5 sm:space-y-2", children: players.map((p, index) => /* @__PURE__ */ jsxs3(
        "div",
        {
          className: `group relative flex items-center justify-between p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98] ${theme === "dark" ? "hover:bg-white/5 hover:border-white/10 active:bg-white/10" : "hover:bg-gray-100/50 hover:border-gray-200 active:bg-gray-200/50"}`,
          onClick: () => onPlayerClick && onPlayerClick(p),
          children: [
            /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx4("div", { className: `relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${TYPOGRAPHY.COMBINATIONS.badge} border flex-shrink-0 ${LINE_HEIGHTS.tight} ${index === 0 ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : index === 1 ? `bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-gray-400/30 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}` : index === 2 ? "bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-orange-500/30 text-orange-400" : theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600"}`, children: index + 1 }),
              /* @__PURE__ */ jsx4("span", { className: "text-lg sm:text-xl flex-shrink-0", children: p.avatar }),
              /* @__PURE__ */ jsx4("span", { className: `${TYPOGRAPHY.COMBINATIONS.emphasized} truncate ${theme === "dark" ? "text-white/90" : "text-gray-900"} ${LINE_HEIGHTS.tight}`, children: p.name })
            ] }),
            /* @__PURE__ */ jsxs3("div", { className: "text-right flex-shrink-0", children: [
              /* @__PURE__ */ jsx4("div", { className: `${TYPOGRAPHY.COMBINATIONS.statNumber} text-emerald-400 ${LINE_HEIGHTS.tight}`, children: p.score }),
              /* @__PURE__ */ jsx4("div", { className: `${TYPOGRAPHY.COMBINATIONS.statLabel} ${theme === "dark" ? "text-white/60" : "text-gray-500"} ${LINE_HEIGHTS.normal} ${LETTER_SPACING.wide}`, children: "VP" })
            ] })
          ]
        },
        p.id
      )) })
    ] })
  ] });
}, Leaderboard_default = Leaderboard;

// app/components/ui/InfoCard.tsx
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var InfoCard = ({ icon, title, value }) => {
  let { theme } = useTheme();
  return /* @__PURE__ */ jsxs4("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg p-3 sm:p-4 lg:p-5 transition-all duration-200 ${theme === "dark" ? "hover:bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.2)]" : "hover:bg-gray-100/50 shadow-[0_0_30px_rgba(0,0,0,0.1)]"}`, children: [
    /* @__PURE__ */ jsx5("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg` }),
    /* @__PURE__ */ jsxs4("div", { className: "relative z-10 flex items-center gap-2.5 sm:gap-3 lg:gap-4", children: [
      /* @__PURE__ */ jsx5("div", { className: `p-2 sm:p-2.5 backdrop-blur-sm border rounded-lg flex-shrink-0 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"}`, children: /* @__PURE__ */ jsx5("div", { className: "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center", children: icon }) }),
      /* @__PURE__ */ jsxs4("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx5("p", { className: `${TYPOGRAPHY.COMBINATIONS.statLabel} ${theme === "dark" ? "text-white/60" : "text-gray-500"} truncate ${LINE_HEIGHTS.normal} ${LETTER_SPACING.wide}`, children: title }),
        /* @__PURE__ */ jsx5("p", { className: `${TYPOGRAPHY.COMBINATIONS.statNumber} ${theme === "dark" ? "text-white" : "text-gray-900"} truncate ${LINE_HEIGHTS.tight}`, children: value })
      ] })
    ] })
  ] });
}, InfoCard_default = InfoCard;

// app/components/ui/ScheduleTimeline.tsx
import { LucideScrollText, LucideShield, LucideBomb as LucideBomb2, LucideSwords } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var ScheduleTimeline = ({ schedule, currentRound }) => {
  let { theme } = useTheme();
  return /* @__PURE__ */ jsxs5("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ jsx6("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }),
    /* @__PURE__ */ jsxs5("div", { className: "relative z-10 p-6", children: [
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx6("div", { className: "relative p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.2)]", children: /* @__PURE__ */ jsx6(LucideScrollText, { size: 16, className: "text-indigo-400" }) }),
        /* @__PURE__ */ jsx6("h3", { className: `text-lg font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Tournament Schedule" })
      ] }),
      /* @__PURE__ */ jsx6("div", { className: "space-y-2", children: schedule.map((roundInfo) => {
        let isActive = roundInfo.round === currentRound;
        return /* @__PURE__ */ jsxs5("div", { className: `relative p-4 rounded-lg transition-all duration-300 border ${isActive ? "bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.1)]" : theme === "dark" ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-100/50 border-gray-200 hover:bg-gray-200/50"}`, children: [
          /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxs5("p", { className: `font-semibold text-base ${isActive ? "text-orange-400" : theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
              "Round ",
              roundInfo.round
            ] }),
            isActive && /* @__PURE__ */ jsx6("div", { className: "w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.5)]" })
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "grid grid-cols-3 gap-2 mb-3", children: [
            /* @__PURE__ */ jsxs5("div", { className: `flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium ${theme === "dark" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" : "bg-blue-100/80 border border-blue-200 text-blue-600"}`, children: [
              /* @__PURE__ */ jsx6(LucideShield, { size: 12 }),
              /* @__PURE__ */ jsx6("span", { className: "hidden sm:inline", children: "\u5B89\u5168\u724C" }),
              /* @__PURE__ */ jsx6("span", { className: "font-bold", children: roundInfo.safeCards })
            ] }),
            /* @__PURE__ */ jsxs5("div", { className: `flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium ${theme === "dark" ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-red-100/80 border border-red-200 text-red-600"}`, children: [
              /* @__PURE__ */ jsx6(LucideBomb2, { size: 12 }),
              /* @__PURE__ */ jsx6("span", { className: "hidden sm:inline", children: "\u70B8\u5F39\u724C" }),
              /* @__PURE__ */ jsx6("span", { className: "font-bold", children: roundInfo.bombCards })
            ] }),
            /* @__PURE__ */ jsxs5("div", { className: `flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium ${theme === "dark" ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400" : "bg-yellow-100/80 border border-yellow-200 text-yellow-600"}`, children: [
              /* @__PURE__ */ jsx6(LucideSwords, { size: 12 }),
              /* @__PURE__ */ jsx6("span", { className: "hidden sm:inline", children: "\u624B\u724C" }),
              /* @__PURE__ */ jsx6("span", { className: "font-bold", children: roundInfo.handLimit === 1 / 0 ? "\u221E" : roundInfo.handLimit })
            ] })
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs5("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/70" : "text-gray-700"}`, children: [
              "\u{1F3C6} ",
              roundInfo.vpMode.name
            ] }),
            /* @__PURE__ */ jsx6("div", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: roundInfo.specialRules && roundInfo.specialRules.length > 1 ? /* @__PURE__ */ jsxs5("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx6("div", { className: "text-xs font-semibold", children: "\u{1F3AF} \u7279\u6B8A\u89C4\u5219:" }),
              roundInfo.specialRules.map((rule, idx) => /* @__PURE__ */ jsxs5("div", { className: "text-xs pl-3", children: [
                "\u2022 ",
                rule
              ] }, idx))
            ] }) : /* @__PURE__ */ jsxs5("p", { children: [
              "\u{1F3AF} ",
              roundInfo.specialRule
            ] }) })
          ] })
        ] }, roundInfo.round);
      }) })
    ] })
  ] });
}, ScheduleTimeline_default = ScheduleTimeline;

// app/components/ui/Modal.tsx
import { LucideX as LucideX2 } from "lucide-react";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var Modal = ({ children, onClose, title }) => {
  let { theme } = useTheme();
  return /* @__PURE__ */ jsx7("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4", children: /* @__PURE__ */ jsxs6("div", { className: `relative ${theme === "dark" ? "bg-black/40" : "bg-white/90"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl ${theme === "dark" ? "shadow-[0_0_80px_rgba(0,0,0,0.5)]" : "shadow-[0_0_80px_rgba(0,0,0,0.2)]"} p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto`, children: [
    /* @__PURE__ */ jsx7("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }),
    /* @__PURE__ */ jsxs6("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-start gap-4 mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx7("h3", { className: `text-lg sm:text-xl font-semibold tracking-tight flex-1 ${theme === "dark" ? "bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent" : "text-gray-900"}`, children: title }),
        /* @__PURE__ */ jsx7(
          "button",
          {
            onClick: onClose,
            className: `p-2 rounded-lg transition-all duration-200 border border-transparent flex-shrink-0 active:scale-95 ${theme === "dark" ? "text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
            children: /* @__PURE__ */ jsx7(LucideX2, { size: 18 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx7("div", { className: "space-y-4 sm:space-y-6", children })
    ] })
  ] }) });
}, Modal_default = Modal;

// app/components/ui/PlayerProfileModal.tsx
import { useMemo } from "react";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var PlayerProfileModal = ({ player, onClose }) => {
  let { theme } = useTheme();
  if (!player)
    return null;
  let { totalRounds, placementCounts } = useMemo(() => {
    let history = Array.isArray(player.history) ? player.history : [], counts = {};
    for (let h of history)
      !h || typeof h.placement != "number" || (counts[h.placement] = (counts[h.placement] || 0) + 1);
    return { totalRounds: history.length, placementCounts: counts };
  }, [player.history]), StatWithRanking = ({ icon, label, value, ranking, className }) => /* @__PURE__ */ jsxs7("div", { className: `inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${className || ""}`, children: [
    /* @__PURE__ */ jsx8("span", { children: icon }),
    /* @__PURE__ */ jsxs7("span", { className: "hidden sm:inline", children: [
      value,
      " ",
      label
    ] }),
    /* @__PURE__ */ jsx8("span", { className: "sm:hidden", children: value }),
    !!ranking && /* @__PURE__ */ jsxs7("span", { className: `ml-1 font-bold ${getRankingColorClass(ranking)}`, children: [
      "#",
      getRankingSuffix(ranking)
    ] })
  ] });
  return /* @__PURE__ */ jsx8(Modal_default, { onClose, title: `${player.avatar} ${player.name} \u7684\u6863\u6848`, children: /* @__PURE__ */ jsxs7("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs7("div", { className: `flex items-center justify-between p-4 rounded-lg border ${theme === "dark" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"}`, children: [
      /* @__PURE__ */ jsx8("div", { className: `text-sm ${theme === "dark" ? "text-emerald-300" : "text-emerald-700"}`, children: "\u2B50 \u5F53\u524D\u5206\u6570" }),
      /* @__PURE__ */ jsx8("div", { className: "text-2xl font-bold text-emerald-400", children: player.score || 0 })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx8("div", { className: `text-xs font-semibold ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "\u8054\u8D5B\u7EDF\u8BA1" }),
      /* @__PURE__ */ jsxs7("div", { className: "flex flex-wrap gap-1.5", children: [
        /* @__PURE__ */ jsx8(
          StatWithRanking,
          {
            icon: "\u{1F3C6}",
            label: "\u8054\u8D5B\u51A0\u519B",
            value: player.championships || 0,
            ranking: player.rankings?.championships,
            className: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
          }
        ),
        /* @__PURE__ */ jsx8(
          StatWithRanking,
          {
            icon: "\u{1F948}",
            label: "\u8054\u8D5B\u4E9A\u519B",
            value: player.runner_up || 0,
            ranking: player.rankings?.runner_up,
            className: `bg-gray-400/10 border-gray-400/20 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`
          }
        ),
        /* @__PURE__ */ jsx8(
          StatWithRanking,
          {
            icon: "\u{1F949}",
            label: "\u8054\u8D5B\u5B63\u519B",
            value: player.third_place || 0,
            ranking: player.rankings?.third_place,
            className: "bg-orange-500/10 border-orange-500/20 text-orange-400"
          }
        ),
        /* @__PURE__ */ jsx8(
          StatWithRanking,
          {
            icon: "\u{1F3AE}",
            label: "\u603B\u8054\u8D5B\u6570",
            value: player.total_games || 0,
            ranking: player.rankings?.total_games,
            className: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx8("div", { className: `text-xs font-semibold ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "\u5355\u8F6E\u7EDF\u8BA1" }),
      /* @__PURE__ */ jsxs7("div", { className: "flex flex-wrap gap-1.5", children: [
        /* @__PURE__ */ jsx8(
          StatWithRanking,
          {
            icon: "\u{1F3AF}",
            label: "\u5355\u8F6E\u51A0\u519B",
            value: player.single_round_firsts || 0,
            ranking: player.rankings?.single_round_firsts,
            className: "bg-blue-500/10 border-blue-500/20 text-blue-400"
          }
        ),
        /* @__PURE__ */ jsx8(
          StatWithRanking,
          {
            icon: "\u{1F3B2}",
            label: "\u5355\u8F6E\u4E9A\u519B",
            value: player.single_round_seconds || 0,
            ranking: player.rankings?.single_round_seconds,
            className: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
          }
        ),
        /* @__PURE__ */ jsx8(
          StatWithRanking,
          {
            icon: "\u26A1",
            label: "\u5355\u8F6E\u5B63\u519B",
            value: player.single_round_thirds || 0,
            ranking: player.rankings?.single_round_thirds,
            className: "bg-purple-500/10 border-purple-500/20 text-purple-400"
          }
        ),
        /* @__PURE__ */ jsxs7("div", { className: `inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600"}`, children: [
          /* @__PURE__ */ jsx8("span", { children: "\u{1F504}" }),
          /* @__PURE__ */ jsxs7("span", { className: "hidden sm:inline", children: [
            "\u603B\u8F6E\u6B21: ",
            totalRounds
          ] }),
          /* @__PURE__ */ jsxs7("span", { className: "sm:hidden", children: [
            totalRounds,
            "\u8F6E"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx8("div", { className: `text-xs font-semibold ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "\u7EFC\u5408\u8868\u73B0" }),
      /* @__PURE__ */ jsxs7("div", { className: "flex flex-wrap gap-1.5", children: [
        /* @__PURE__ */ jsx8(
          StatWithRanking,
          {
            icon: "\u{1F48E}",
            label: "\u603BVP",
            value: player.total_vp || 0,
            ranking: player.rankings?.total_vp,
            className: "bg-green-500/10 border-green-500/20 text-green-400"
          }
        ),
        /* @__PURE__ */ jsx8(
          StatWithRanking,
          {
            icon: "\u{1F4CA}",
            label: "\u5E73\u5747\u6392\u540D",
            value: Number((player.average_placement || 0).toFixed(1)),
            ranking: player.rankings?.average_placement,
            className: "bg-teal-500/10 border-teal-500/20 text-teal-400"
          }
        ),
        /* @__PURE__ */ jsxs7("div", { className: "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border bg-rose-500/10 border-rose-500/20 text-rose-400", children: [
          /* @__PURE__ */ jsx8("span", { children: "\u{1F3AA}" }),
          /* @__PURE__ */ jsxs7("span", { className: "hidden sm:inline", children: [
            (player.win_rate || 0).toFixed(0),
            "% \u80DC\u7387"
          ] }),
          /* @__PURE__ */ jsxs7("span", { className: "sm:hidden", children: [
            (player.win_rate || 0).toFixed(0),
            "%"
          ] }),
          !!player.rankings?.win_rate && /* @__PURE__ */ jsxs7("span", { className: `ml-1 font-bold ${getRankingColorClass(player.rankings.win_rate)}`, children: [
            "#",
            getRankingSuffix(player.rankings.win_rate)
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ jsxs7("div", { className: "flex justify-between items-center mb-2", children: [
        /* @__PURE__ */ jsx8("span", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`, children: "\u80DC\u7387" }),
        /* @__PURE__ */ jsxs7("span", { className: "text-orange-400 font-bold", children: [
          (player.win_rate || 0).toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx8("div", { className: `w-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} rounded-full h-2`, children: /* @__PURE__ */ jsx8(
        "div",
        {
          className: "bg-orange-400 h-2 rounded-full transition-all duration-300",
          style: { width: `${Math.max(0, Math.min(100, Number((player.win_rate || 0).toFixed(0))))}%` }
        }
      ) })
    ] }),
    totalRounds > 0 && /* @__PURE__ */ jsxs7("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ jsx8("h4", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold mb-3`, children: "\u6392\u540D\u5206\u5E03" }),
      /* @__PURE__ */ jsx8("div", { className: "space-y-2", children: [1, 2, 3, 4, 5, 6].map((place) => {
        let count = placementCounts[place] || 0, percentage = totalRounds > 0 ? (count / totalRounds * 100).toFixed(1) : 0;
        return count > 0 ? /* @__PURE__ */ jsxs7("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs7("span", { className: `text-sm ${place === 1 ? "text-yellow-400" : place === 2 ? "text-gray-300" : place === 3 ? "text-orange-400" : "text-gray-500"}`, children: [
            "\u7B2C",
            place,
            "\u540D"
          ] }),
          /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs7("span", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} text-sm`, children: [
              count,
              "\u6B21"
            ] }),
            /* @__PURE__ */ jsxs7("span", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xs`, children: [
              "(",
              percentage,
              "%)"
            ] })
          ] })
        ] }, place) : null;
      }) })
    ] }),
    player.history && player.history.length > 0 && /* @__PURE__ */ jsxs7("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ jsx8("h4", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold mb-3`, children: "\u6700\u8FD1\u6BD4\u8D5B" }),
      /* @__PURE__ */ jsx8("div", { className: "space-y-2 max-h-32 overflow-y-auto", children: player.history.slice(-5).reverse().map((game, index) => /* @__PURE__ */ jsxs7("div", { className: "flex justify-between items-center text-sm", children: [
        /* @__PURE__ */ jsxs7("span", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
          "\u7B2C",
          game.round,
          "\u8F6E"
        ] }),
        /* @__PURE__ */ jsxs7("span", { className: `font-semibold ${game.placement === 1 ? "text-yellow-400" : game.placement === 2 ? "text-gray-300" : game.placement === 3 ? "text-orange-400" : "text-gray-500"}`, children: [
          "\u7B2C",
          game.placement,
          "\u540D"
        ] })
      ] }, index)) })
    ] })
  ] }) });
}, PlayerProfileModal_default = PlayerProfileModal;

// app/components/ui/ResultsModal.tsx
import { useState as useState2 } from "react";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var ResultsModal = ({ players, onClose, onSubmit, round }) => {
  let { theme } = useTheme(), [rankedPlayers, setRankedPlayers] = useState2(players.map((p) => p.id)), [draggedIndex, setDraggedIndex] = useState2(null), [dragOverIndex, setDragOverIndex] = useState2(null), handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index.toString()), e.dataTransfer.effectAllowed = "move", setDraggedIndex(index);
    let dragElement = e.currentTarget;
    dragElement.style.opacity = "0.5", setTimeout(() => {
      dragElement.style.opacity = "1";
    }, 0);
  }, handleDragOver = (e, index) => {
    e.preventDefault(), e.dataTransfer.dropEffect = "move", setDragOverIndex(index);
  }, handleDragEnter = (e, index) => {
    e.preventDefault(), setDragOverIndex(index);
  }, handleDragLeave = (e) => {
    e.preventDefault();
    let rect = e.currentTarget.getBoundingClientRect(), x = e.clientX, y = e.clientY;
    (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) && setDragOverIndex(null);
  }, handleDrop = (e, dropIndex) => {
    e.preventDefault();
    let draggedIdx = parseInt(e.dataTransfer.getData("draggedIndex"));
    if (draggedIdx !== dropIndex) {
      let newRankedPlayers = [...rankedPlayers], [draggedItem] = newRankedPlayers.splice(draggedIdx, 1);
      newRankedPlayers.splice(dropIndex, 0, draggedItem), setRankedPlayers(newRankedPlayers);
    }
    setDraggedIndex(null), setDragOverIndex(null);
  }, handleDragEnd = (e) => {
    e.preventDefault(), setDraggedIndex(null), setDragOverIndex(null);
    let dragElement = e.currentTarget;
    dragElement.style.opacity = "1";
  }, getPlayerById = (id) => players.find((p) => p.id === id);
  return /* @__PURE__ */ jsx9(Modal_default, { onClose, title: `\u8F93\u5165\u7B2C ${round} \u8F6E\u6BD4\u8D5B\u7ED3\u679C`, children: /* @__PURE__ */ jsxs8("div", { children: [
    /* @__PURE__ */ jsxs8("div", { className: `mb-4 p-3 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-100/50"}`, children: [
      /* @__PURE__ */ jsx9("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"} text-sm sm:text-base font-medium`, children: "\u{1F3C6} \u786E\u5B9A\u672C\u8F6E\u540D\u6B21\u6392\u5E8F" }),
      /* @__PURE__ */ jsxs8("p", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm mt-1`, children: [
        "\u62D6\u62FD\u73A9\u5BB6\u5361\u7247\u91CD\u65B0\u6392\u5E8F\uFF0C\u4ECE\u4E0A\u5230\u4E0B\u4E3A\u7B2C 1 \u540D\u5230\u7B2C ",
        players.length,
        " \u540D"
      ] })
    ] }),
    /* @__PURE__ */ jsx9("div", { className: "space-y-2 sm:space-y-3", children: rankedPlayers.map((playerId, index) => {
      let player = getPlayerById(playerId);
      if (!player)
        return null;
      let isDragging = draggedIndex === index, isDragOver = dragOverIndex === index, isAboveDragOver = dragOverIndex !== null && index < dragOverIndex && draggedIndex !== null && draggedIndex > dragOverIndex, isBelowDragOver = dragOverIndex !== null && index > dragOverIndex && draggedIndex !== null && draggedIndex < dragOverIndex;
      return /* @__PURE__ */ jsxs8(
        "div",
        {
          draggable: !0,
          onDragStart: (e) => handleDragStart(e, index),
          onDragOver: (e) => handleDragOver(e, index),
          onDragEnter: (e) => handleDragEnter(e, index),
          onDragLeave: handleDragLeave,
          onDrop: (e) => handleDrop(e, index),
          onDragEnd: handleDragEnd,
          className: `
                                    flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-grab active:cursor-grabbing 
                                    transition-all duration-300 ease-in-out transform-gpu
                                    ${isDragging ? "scale-105 rotate-2 shadow-2xl z-50" : "scale-100 rotate-0"}
                                    ${isDragOver && !isDragging ? "scale-[1.02] shadow-lg ring-2 ring-orange-400/50" : ""}
                                    ${isAboveDragOver ? "translate-y-2" : ""}
                                    ${isBelowDragOver ? "-translate-y-2" : ""}
                                    ${theme === "dark" ? `bg-gray-700 hover:bg-gray-600 active:bg-gray-600 
                                           ${isDragging ? "bg-gray-600 border-2 border-orange-400/50" : ""} 
                                           ${isDragOver && !isDragging ? "bg-gray-600 border-2 border-orange-400" : ""}` : `bg-gray-200 hover:bg-gray-300 active:bg-gray-300 
                                           ${isDragging ? "bg-gray-300 border-2 border-orange-400/50" : ""} 
                                           ${isDragOver && !isDragging ? "bg-gray-300 border-2 border-orange-400" : ""}`}
                                    ${isDragging ? "opacity-80" : "opacity-100"}
                                `,
          style: {
            transformOrigin: "center",
            willChange: "transform, opacity, box-shadow"
          },
          children: [
            /* @__PURE__ */ jsx9("span", { className: `font-bold text-base sm:text-lg text-orange-400 w-5 sm:w-6 flex-shrink-0 text-center transition-all duration-300 ${isDragging ? "scale-110 text-orange-300" : ""}`, children: index + 1 }),
            /* @__PURE__ */ jsx9("span", { className: `text-xl sm:text-2xl flex-shrink-0 transition-all duration-300 ${isDragging ? "scale-110" : ""}`, children: player.avatar }),
            /* @__PURE__ */ jsx9("span", { className: `font-semibold text-sm sm:text-base truncate transition-all duration-300 ${theme === "dark" ? "text-white" : "text-gray-900"} ${isDragging ? "text-orange-300" : ""}`, children: player.name }),
            /* @__PURE__ */ jsxs8("div", { className: `ml-auto flex flex-col gap-1 opacity-40 transition-opacity duration-300 ${isDragging ? "opacity-70" : "group-hover:opacity-70"}`, children: [
              /* @__PURE__ */ jsx9("div", { className: "w-1.5 h-1.5 bg-current rounded-full" }),
              /* @__PURE__ */ jsx9("div", { className: "w-1.5 h-1.5 bg-current rounded-full" }),
              /* @__PURE__ */ jsx9("div", { className: "w-1.5 h-1.5 bg-current rounded-full" })
            ] })
          ]
        },
        playerId
      );
    }) }),
    /* @__PURE__ */ jsx9(
      "button",
      {
        onClick: () => onSubmit(rankedPlayers),
        className: "w-full mt-4 sm:mt-6 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3 sm:py-4 rounded-lg transition-all duration-200 active:scale-[0.98] text-sm sm:text-base",
        children: "\u786E\u8BA4\u5E76\u8FDB\u5165\u4E0B\u4E00\u8F6E"
      }
    )
  ] }) });
}, ResultsModal_default = ResultsModal;

// app/components/ui/CardDrawReminder.tsx
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
var CardDrawReminder = ({ players, onClose, round }) => {
  let { theme } = useTheme(), getCardCount = (ranking) => [2, 3, 4, 5, 6][ranking - 1] || 6, sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  return /* @__PURE__ */ jsx10("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsxs9("div", { className: `relative w-full max-w-md mx-auto rounded-2xl shadow-2xl border backdrop-blur-xl ${theme === "dark" ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-gray-200"}`, children: [
    /* @__PURE__ */ jsx10("div", { className: `p-6 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3 mb-2", children: [
      /* @__PURE__ */ jsx10("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-orange-500/20 border border-orange-500/30" : "bg-orange-100 border border-orange-200"}`, children: /* @__PURE__ */ jsx10("span", { className: "text-orange-500 text-lg", children: "\u{1F0CF}" }) }),
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsxs9("h2", { className: `${TYPOGRAPHY.COMBINATIONS.modalTitle} ${theme === "dark" ? "text-white" : "text-gray-900"} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`, children: [
          "\u7B2C ",
          round,
          " \u8F6E\u62BD\u5361\u63D0\u9192"
        ] }),
        /* @__PURE__ */ jsx10("p", { className: `${TYPOGRAPHY.COMBINATIONS.modalBody} ${theme === "dark" ? "text-gray-400" : "text-gray-600"} ${LINE_HEIGHTS.normal}`, children: "\u8BF7\u6839\u636E\u672C\u8F6E\u6392\u540D\u62BD\u53D6\u76F8\u5E94\u6570\u91CF\u7684\u5361\u7247" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs9("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx10("div", { className: "space-y-3", children: sortedPlayers.map((player, index) => {
        let ranking = index + 1, cardCount = getCardCount(ranking);
        return /* @__PURE__ */ jsxs9(
          "div",
          {
            className: `flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${theme === "dark" ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`,
            children: [
              /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx10("div", { className: `flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${ranking === 1 ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" : ranking === 2 ? "bg-gray-400/20 text-gray-400 border border-gray-400/30" : ranking === 3 ? "bg-orange-600/20 text-orange-600 border border-orange-600/30" : theme === "dark" ? "bg-gray-600/20 text-gray-300 border border-gray-600/30" : "bg-gray-300/50 text-gray-600 border border-gray-300"}`, children: ranking }),
                /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx10("span", { className: "text-xl", children: player.avatar }),
                  /* @__PURE__ */ jsx10("span", { className: `font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: player.name })
                ] })
              ] }),
              /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx10("span", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "\u62BD\u53D6" }),
                /* @__PURE__ */ jsxs9("div", { className: `px-3 py-1.5 rounded-lg font-bold text-lg ${theme === "dark" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-blue-100 text-blue-600 border border-blue-200"}`, children: [
                  cardCount,
                  " \u5F20"
                ] })
              ] })
            ]
          },
          player.id
        );
      }) }),
      /* @__PURE__ */ jsxs9("div", { className: `mt-6 p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/30 border border-gray-700" : "bg-gray-100/50 border border-gray-200"}`, children: [
        /* @__PURE__ */ jsx10("h3", { className: `text-sm font-semibold mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "\u{1F4CB} \u62BD\u5361\u89C4\u5219" }),
        /* @__PURE__ */ jsxs9("div", { className: `text-xs space-y-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
          /* @__PURE__ */ jsx10("p", { children: "\u2022 \u7B2C 1 \u540D\uFF1A2 \u5F20\u5361\u7247" }),
          /* @__PURE__ */ jsx10("p", { children: "\u2022 \u7B2C 2 \u540D\uFF1A3 \u5F20\u5361\u7247" }),
          /* @__PURE__ */ jsx10("p", { children: "\u2022 \u7B2C 3 \u540D\uFF1A4 \u5F20\u5361\u7247" }),
          /* @__PURE__ */ jsx10("p", { children: "\u2022 \u7B2C 4 \u540D\uFF1A5 \u5F20\u5361\u7247" }),
          /* @__PURE__ */ jsx10("p", { children: "\u2022 \u7B2C 5 \u540D\u53CA\u4EE5\u540E\uFF1A6 \u5F20\u5361\u7247" })
        ] })
      ] }),
      /* @__PURE__ */ jsx10(
        "button",
        {
          onClick: onClose,
          className: `w-full mt-6 py-3 px-4 rounded-lg ${TYPOGRAPHY.COMBINATIONS.buttonLarge} transition-all duration-200 ${theme === "dark" ? "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white" : "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"} active:scale-[0.98] ${LINE_HEIGHTS.tight}`,
          children: "\u2705 \u77E5\u9053\u4E86\uFF0C\u5F00\u59CB\u62BD\u5361"
        }
      )
    ] })
  ] }) });
}, CardDrawReminder_default = CardDrawReminder;

// app/utils/specialRulesUtils.ts
function selectSpecialRules(availableRules) {
  if (availableRules.length === 1 && availableRules[0] === "\u65E0\u7279\u6B8A\u89C4\u5219")
    return ["\u65E0\u7279\u6B8A\u89C4\u5219"];
  let nonNullRules = availableRules.filter((rule) => rule !== "\u65E0\u7279\u6B8A\u89C4\u5219");
  if (nonNullRules.length === 0)
    return ["\u65E0\u7279\u6B8A\u89C4\u5219"];
  if ((Math.random() < 0.6 ? 1 : 2) === 1 || nonNullRules.length === 1) {
    let randomIndex = Math.floor(Math.random() * nonNullRules.length);
    return [nonNullRules[randomIndex]];
  } else
    return selectTwoNonConflictingRules(nonNullRules);
}
function selectTwoNonConflictingRules(availableRules) {
  let attempts = 0;
  for (; attempts < 50; ) {
    let firstRuleIndex = Math.floor(Math.random() * availableRules.length), firstRule = availableRules[firstRuleIndex], compatibleRules = availableRules.filter(
      (rule) => rule !== firstRule && !areRulesConflicting(firstRule, rule)
    );
    if (compatibleRules.length > 0) {
      let secondRuleIndex = Math.floor(Math.random() * compatibleRules.length), secondRule = compatibleRules[secondRuleIndex];
      return [firstRule, secondRule];
    }
    attempts++;
  }
  let fallbackIndex = Math.floor(Math.random() * availableRules.length);
  return [availableRules[fallbackIndex]];
}
function areRulesConflicting(rule1, rule2) {
  let conflicts = GAME_RULES.RULE_CONFLICTS;
  return !!(conflicts[rule1]?.includes(rule2) || conflicts[rule2]?.includes(rule1));
}
function formatSpecialRules(rules) {
  return rules.length === 0 ? "\u65E0\u7279\u6B8A\u89C4\u5219" : rules.length === 1 ? rules[0] : rules.join(" + ");
}

// app/components/pages/HomePage.tsx
import { LucideCat as LucideCat2, LucideCrown } from "lucide-react";

// app/components/ui/PlayerProfiles.tsx
import { LucideUsers } from "lucide-react";
import { jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
var PlayerProfiles = ({ players, onPlayerClick }) => {
  let { theme } = useTheme(), StatWithRanking = ({ icon, value, label, shortLabel, ranking, bgClass }) => /* @__PURE__ */ jsxs10("div", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${bgClass || (theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600")}`, children: [
    /* @__PURE__ */ jsx11("span", { children: icon }),
    /* @__PURE__ */ jsxs10("span", { className: "hidden xs:inline", children: [
      value,
      " ",
      label,
      ranking && /* @__PURE__ */ jsxs10("span", { className: `ml-1 font-bold ${getRankingColorClass(ranking)}`, children: [
        "#",
        getRankingSuffix(ranking)
      ] })
    ] }),
    /* @__PURE__ */ jsxs10("span", { className: "xs:hidden", children: [
      value,
      ranking && /* @__PURE__ */ jsxs10("span", { className: `ml-0.5 font-bold ${getRankingColorClass(ranking)}`, children: [
        "#",
        ranking
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxs10("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ jsx11("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }),
    /* @__PURE__ */ jsxs10("div", { className: "relative z-10 p-4 sm:p-6", children: [
      /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx11("div", { className: "relative p-1.5 sm:p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)]", children: /* @__PURE__ */ jsx11(LucideUsers, { size: 14, className: "text-blue-400 sm:w-4 sm:h-4" }) }),
        /* @__PURE__ */ jsx11("h3", { className: `text-base sm:text-lg font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Player Profiles" })
      ] }),
      /* @__PURE__ */ jsx11("div", { className: "space-y-1.5 sm:space-y-2", children: players.map((p) => /* @__PURE__ */ jsxs10(
        "div",
        {
          className: `group relative p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98] ${theme === "dark" ? "hover:bg-white/5 hover:border-white/10 active:bg-white/10" : "hover:bg-gray-100/50 hover:border-gray-200 active:bg-gray-200/50"}`,
          onClick: () => onPlayerClick && onPlayerClick(p),
          children: [
            /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3", children: [
              /* @__PURE__ */ jsx11("span", { className: "text-lg sm:text-xl flex-shrink-0", children: p.avatar }),
              /* @__PURE__ */ jsx11("span", { className: `font-medium text-sm sm:text-base truncate ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: p.name })
            ] }),
            /* @__PURE__ */ jsxs10("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20", children: [
                /* @__PURE__ */ jsx11("span", { className: "text-lg", children: "\u2B50" }),
                /* @__PURE__ */ jsxs10("span", { className: `font-semibold text-sm ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`, children: [
                  "\u5F53\u524D\u5206\u6570: ",
                  p.score || 0
                ] })
              ] }),
              /* @__PURE__ */ jsxs10("div", { children: [
                /* @__PURE__ */ jsx11("h4", { className: `text-xs font-semibold mb-1.5 ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "\u8054\u8D5B\u7EDF\u8BA1" }),
                /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap gap-1.5 sm:gap-2", children: [
                  /* @__PURE__ */ jsx11(
                    StatWithRanking,
                    {
                      icon: "\u{1F3C6}",
                      value: p.championships || 0,
                      label: "\u8054\u8D5B\u51A0\u519B",
                      shortLabel: "\u51A0\u519B",
                      ranking: p.rankings?.championships,
                      bgClass: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                    }
                  ),
                  /* @__PURE__ */ jsx11(
                    StatWithRanking,
                    {
                      icon: "\u{1F948}",
                      value: p.runner_up || 0,
                      label: "\u8054\u8D5B\u4E9A\u519B",
                      shortLabel: "\u4E9A\u519B",
                      ranking: p.rankings?.runner_up,
                      bgClass: `bg-gray-400/10 border-gray-400/20 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`
                    }
                  ),
                  /* @__PURE__ */ jsx11(
                    StatWithRanking,
                    {
                      icon: "\u{1F949}",
                      value: p.third_place || 0,
                      label: "\u8054\u8D5B\u5B63\u519B",
                      shortLabel: "\u5B63\u519B",
                      ranking: p.rankings?.third_place,
                      bgClass: "bg-orange-500/10 border-orange-500/20 text-orange-400"
                    }
                  ),
                  /* @__PURE__ */ jsx11(
                    StatWithRanking,
                    {
                      icon: "\u{1F3AE}",
                      value: p.total_games || 0,
                      label: "\u603B\u8054\u8D5B\u6570",
                      shortLabel: "\u8054\u8D5B",
                      ranking: p.rankings?.total_games,
                      bgClass: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs10("div", { children: [
                /* @__PURE__ */ jsx11("h4", { className: `text-xs font-semibold mb-1.5 ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "\u5355\u8F6E\u7EDF\u8BA1" }),
                /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap gap-1.5 sm:gap-2", children: [
                  /* @__PURE__ */ jsx11(
                    StatWithRanking,
                    {
                      icon: "\u{1F3AF}",
                      value: p.single_round_firsts || 0,
                      label: "\u5355\u8F6E\u51A0\u519B",
                      shortLabel: "\u5355\u51A0",
                      ranking: p.rankings?.single_round_firsts,
                      bgClass: "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    }
                  ),
                  /* @__PURE__ */ jsx11(
                    StatWithRanking,
                    {
                      icon: "\u{1F3B2}",
                      value: p.single_round_seconds || 0,
                      label: "\u5355\u8F6E\u4E9A\u519B",
                      shortLabel: "\u5355\u4E9A",
                      ranking: p.rankings?.single_round_seconds,
                      bgClass: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                    }
                  ),
                  /* @__PURE__ */ jsx11(
                    StatWithRanking,
                    {
                      icon: "\u26A1",
                      value: p.single_round_thirds || 0,
                      label: "\u5355\u8F6E\u5B63\u519B",
                      shortLabel: "\u5355\u5B63",
                      ranking: p.rankings?.single_round_thirds,
                      bgClass: "bg-purple-500/10 border-purple-500/20 text-purple-400"
                    }
                  ),
                  /* @__PURE__ */ jsxs10("div", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600"}`, children: [
                    /* @__PURE__ */ jsx11("span", { children: "\u{1F504}" }),
                    /* @__PURE__ */ jsxs10("span", { className: "hidden sm:inline", children: [
                      "\u603B\u8F6E\u6B21: ",
                      (p.history || []).length
                    ] }),
                    /* @__PURE__ */ jsxs10("span", { className: "sm:hidden", children: [
                      (p.history || []).length,
                      "\u8F6E"
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs10("div", { children: [
                /* @__PURE__ */ jsx11("h4", { className: `text-xs font-semibold mb-1.5 ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "\u7EFC\u5408\u8868\u73B0" }),
                /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap gap-1.5 sm:gap-2", children: [
                  /* @__PURE__ */ jsx11(
                    StatWithRanking,
                    {
                      icon: "\u{1F48E}",
                      value: p.total_vp || 0,
                      label: "\u603BVP",
                      shortLabel: "VP",
                      ranking: p.rankings?.total_vp,
                      bgClass: "bg-green-500/10 border-green-500/20 text-green-400"
                    }
                  ),
                  /* @__PURE__ */ jsx11(
                    StatWithRanking,
                    {
                      icon: "\u{1F4CA}",
                      value: parseFloat((p.average_placement || 0).toFixed(1)),
                      label: "\u5E73\u5747\u6392\u540D",
                      shortLabel: "\u5E73\u5747",
                      ranking: p.rankings?.average_placement,
                      bgClass: "bg-teal-500/10 border-teal-500/20 text-teal-400"
                    }
                  ),
                  /* @__PURE__ */ jsxs10("div", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border bg-rose-500/10 border-rose-500/20 text-rose-400", children: [
                    /* @__PURE__ */ jsx11("span", { children: "\u{1F3AA}" }),
                    /* @__PURE__ */ jsxs10("span", { className: "hidden xs:inline", children: [
                      (p.win_rate || 0).toFixed(0),
                      "% \u80DC\u7387",
                      p.rankings?.win_rate && /* @__PURE__ */ jsxs10("span", { className: `ml-1 font-bold ${getRankingColorClass(p.rankings.win_rate)}`, children: [
                        "#",
                        getRankingSuffix(p.rankings.win_rate)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs10("span", { className: "xs:hidden", children: [
                      (p.win_rate || 0).toFixed(0),
                      "%",
                      p.rankings?.win_rate && /* @__PURE__ */ jsxs10("span", { className: `ml-0.5 font-bold ${getRankingColorClass(p.rankings.win_rate)}`, children: [
                        "#",
                        p.rankings.win_rate
                      ] })
                    ] })
                  ] })
                ] })
              ] }),
              (p.created_at || p.updated_at) && /* @__PURE__ */ jsxs10("div", { className: `text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"} pt-2 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`, children: [
                p.created_at && /* @__PURE__ */ jsxs10("div", { children: [
                  "\u6CE8\u518C\u65F6\u95F4: ",
                  new Date(p.created_at).toLocaleDateString("zh-CN")
                ] }),
                p.updated_at && /* @__PURE__ */ jsxs10("div", { children: [
                  "\u6700\u540E\u66F4\u65B0: ",
                  new Date(p.updated_at).toLocaleDateString("zh-CN")
                ] })
              ] })
            ] })
          ]
        },
        p.id
      )) })
    ] })
  ] });
}, PlayerProfiles_default = PlayerProfiles;

// app/components/pages/HomePage.tsx
import { Fragment as Fragment2, jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
var HomePage = ({
  leagueState,
  players,
  handleStartLeague,
  handleResetLeague,
  handlePlayerClick,
  setCurrentPage
}) => {
  let { theme } = useTheme();
  return !leagueState || leagueState.status === "setup" ? /* @__PURE__ */ jsxs11("div", { className: "space-y-6 sm:space-y-8", children: [
    /* @__PURE__ */ jsx12("div", { className: "text-center", children: /* @__PURE__ */ jsxs11("div", { className: "inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8", children: [
      /* @__PURE__ */ jsx12("div", { className: "relative p-4 sm:p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ jsx12(LucideCat2, { className: "text-orange-400", size: 32 }) }),
      /* @__PURE__ */ jsxs11("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ jsx12("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-orange-500 bg-clip-text text-transparent"}`, children: "Boom League" }),
        /* @__PURE__ */ jsx12("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "Professional Tournament Management" })
      ] })
    ] }) }),
    players.length > 0 && /* @__PURE__ */ jsxs11("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"}`, children: [
      /* @__PURE__ */ jsx12("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }),
      /* @__PURE__ */ jsxs11("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6", children: [
          /* @__PURE__ */ jsx12("div", { className: "w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]" }),
          /* @__PURE__ */ jsx12("h2", { className: `text-xl sm:text-2xl font-semibold tracking-tight ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "Quick Start" })
        ] }),
        /* @__PURE__ */ jsxs11("p", { className: `text-base sm:text-lg mb-6 sm:mb-8 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: [
          /* @__PURE__ */ jsx12("span", { className: "text-orange-400 font-semibold", children: players.length }),
          " players registered and ready to compete"
        ] }),
        /* @__PURE__ */ jsxs11(
          "button",
          {
            onClick: () => setCurrentPage("league"),
            disabled: players.length < 2,
            className: `relative group bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 active:from-orange-500/40 active:to-orange-600/40 text-orange-400 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg border border-orange-500/30 shadow-[0_0_30px_rgba(251,146,60,0.2)] transition-all duration-200 hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] active:scale-[0.98] text-sm sm:text-base ${players.length < 2 ? "disabled:from-white/5 disabled:to-white/5 disabled:text-white/40 disabled:border-white/10 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100" : ""}`,
            children: [
              /* @__PURE__ */ jsx12("span", { className: "relative z-10", children: "Start New Tournament" }),
              /* @__PURE__ */ jsx12("div", { className: "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" })
            ]
          }
        )
      ] })
    ] })
  ] }) : leagueState.status === "in_progress" ? /* @__PURE__ */ jsxs11("div", { className: "space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxs11("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx12("h2", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-2", children: leagueState.league_name || "\u8054\u8D5B\u8FDB\u884C\u4E2D" }),
      /* @__PURE__ */ jsxs11("p", { className: `text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
        "\u7B2C ",
        leagueState.current_round,
        " / ",
        GAME_RULES.MAX_ROUNDS,
        " \u8F6E",
        leagueState.season_number && /* @__PURE__ */ jsxs11("span", { className: "ml-2", children: [
          "\u2022 Season ",
          leagueState.season_number
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: [
      /* @__PURE__ */ jsx12(Leaderboard_default, { players, onPlayerClick: handlePlayerClick }),
      /* @__PURE__ */ jsx12(PlayerProfiles_default, { players, onPlayerClick: handlePlayerClick })
    ] })
  ] }) : leagueState.status === "finished" ? /* @__PURE__ */ jsx12("div", { className: "space-y-4 sm:space-y-6", children: /* @__PURE__ */ jsxs11("div", { className: `text-center p-6 sm:p-8 lg:p-10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg flex flex-col items-center gap-3 sm:gap-4 border-2 border-yellow-400 ${theme === "dark" ? "bg-gray-800/70" : "bg-white/80"}`, children: [
    /* @__PURE__ */ jsx12(LucideCrown, { className: "text-yellow-400", size: 60 }),
    /* @__PURE__ */ jsxs11("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx12("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-300", children: leagueState.league_name || "\u8054\u8D5B\u7ED3\u675F\uFF01" }),
      leagueState.season_number && /* @__PURE__ */ jsxs11("p", { className: `text-lg sm:text-xl mt-2 ${theme === "dark" ? "text-yellow-400/80" : "text-yellow-600"}`, children: [
        "Season ",
        leagueState.season_number,
        " \u5B8C\u6210"
      ] })
    ] }),
    leagueState.winner && /* @__PURE__ */ jsxs11(Fragment2, { children: [
      /* @__PURE__ */ jsx12("div", { className: "text-4xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4", children: leagueState.winner.avatar }),
      /* @__PURE__ */ jsx12("p", { className: `text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.winner.name }),
      /* @__PURE__ */ jsx12("p", { className: `text-base sm:text-lg lg:text-xl mt-2 px-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: leagueState.winner.reason })
    ] }),
    /* @__PURE__ */ jsx12(
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
import { jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs12("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs12("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx13("h2", { className: `text-4xl font-bold mb-3 ${theme === "dark" ? "bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent" : "bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"}`, children: "\u73A9\u5BB6\u6CE8\u518C" }),
      /* @__PURE__ */ jsx13("p", { className: `text-lg ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`, children: "\u7BA1\u7406\u53C2\u4E0E\u8054\u8D5B\u7684\u73A9\u5BB6" })
    ] }),
    /* @__PURE__ */ jsxs12("div", { className: `backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${theme === "dark" ? "bg-slate-800/40 border-slate-700/30" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs12("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsxs12("h3", { className: `text-2xl font-bold flex items-center gap-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
          /* @__PURE__ */ jsx13("div", { className: "w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" }),
          "\u5DF2\u6CE8\u518C\u73A9\u5BB6",
          /* @__PURE__ */ jsxs12("span", { className: "text-orange-400", children: [
            "(",
            players.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs12(
          "button",
          {
            onClick: () => setShowPlayerModal(!0),
            className: "flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105",
            children: [
              /* @__PURE__ */ jsx13(LucidePlus, { size: 18 }),
              " \u6DFB\u52A0\u73A9\u5BB6"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx13("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: players.map((p) => {
        let stats = UTILS.calculatePlayerStats(p);
        return /* @__PURE__ */ jsxs12("div", { className: `flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-lg ${theme === "dark" ? "bg-slate-800/50 hover:bg-slate-700/60 border-slate-700/30" : "bg-white/50 hover:bg-gray-100/60 border-gray-200/30"}`, children: [
          /* @__PURE__ */ jsxs12(
            "div",
            {
              className: "flex items-center gap-4 flex-1",
              onClick: () => handlePlayerClick(p),
              children: [
                /* @__PURE__ */ jsx13("div", { className: "text-4xl", children: p.avatar }),
                /* @__PURE__ */ jsxs12("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx13("span", { className: `font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: p.name }),
                  /* @__PURE__ */ jsxs12("div", { className: "flex flex-wrap gap-2 mt-1", children: [
                    stats.championships > 0 && /* @__PURE__ */ jsxs12("span", { className: "text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full", children: [
                      "\u{1F3C6} ",
                      stats.championships,
                      "\u51A0"
                    ] }),
                    /* @__PURE__ */ jsx13("span", { className: `text-xs px-2 py-1 rounded-full ${theme === "dark" ? "bg-slate-700/50 text-slate-300" : "bg-gray-200/50 text-gray-600"}`, children: stats.totalGames > 0 ? `${stats.totalGames}\u573A \u2022 ${stats.winRate}%\u80DC\u7387` : "\u65B0\u73A9\u5BB6" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx13(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation(), handleDeletePlayer(p.id);
              },
              className: "p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200",
              children: /* @__PURE__ */ jsx13(LucideTrash2, { size: 18 })
            }
          )
        ] }, p.id);
      }) })
    ] })
  ] });
}, PlayerRegistrationPage_default = PlayerRegistrationPage;

// app/components/pages/LeagueManagementPage.tsx
import { useState as useState3 } from "react";
import { LucideCrown as LucideCrown2, LucideSettings, LucideCheck, LucideHistory as LucideHistory2, LucidePlay as LucidePlay2, LucideTrophy as LucideTrophy2, LucideCalendar, LucideUsers as LucideUsers2 } from "lucide-react";
import { jsx as jsx14, jsxs as jsxs13 } from "react/jsx-runtime";
var LeagueManagementPage = ({
  leagueState,
  players,
  handleStartLeague,
  handleResetLeague,
  currentLeagueName,
  setCurrentLeagueName,
  nextSeasonNumber,
  leagueHistory,
  setCurrentPage
}) => {
  let { theme } = useTheme(), [selectedSpecialRules, setSelectedSpecialRules] = useState3(GAME_RULES.SPECIAL_RULES.slice()), [viewMode, setViewMode] = useState3("ongoing"), toggleSpecialRule = (rule) => {
    setSelectedSpecialRules(
      (prev) => prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
    );
  }, handleStartLeagueWithRules = () => {
    if (selectedSpecialRules.length === 0) {
      alert("\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u79CD\u7279\u6B8A\u89C4\u5219\u53EF\u80FD\u6027\uFF01");
      return;
    }
    handleStartLeague(selectedSpecialRules);
  }, formatDate = (dateString) => new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }), formatDuration = (startDate, endDate) => {
    let start = new Date(startDate), end = new Date(endDate), diffTime = Math.abs(end.getTime() - start.getTime());
    return `${Math.ceil(diffTime / (1e3 * 60 * 60 * 24))} \u5929`;
  };
  return /* @__PURE__ */ jsxs13("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs13("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx14("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u8054\u8D5B\u7BA1\u7406" }),
      /* @__PURE__ */ jsx14("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: "\u521B\u5EFA\u548C\u7BA1\u7406\u4F60\u7684 Boom League" })
    ] }),
    (!leagueState || leagueState.status === "setup") && /* @__PURE__ */ jsxs13("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"} backdrop-blur-sm shadow-xl`, children: [
      /* @__PURE__ */ jsx14("h3", { className: `text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "\u521B\u5EFA\u65B0\u8054\u8D5B" }),
      /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx14("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "\u8054\u8D5B\u540D\u79F0" }),
        /* @__PURE__ */ jsx14(
          "input",
          {
            type: "text",
            value: currentLeagueName,
            onChange: (e) => setCurrentLeagueName(e.target.value),
            placeholder: `Boom League S${nextSeasonNumber}`,
            className: `w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200 backdrop-blur-sm ${theme === "dark" ? "bg-white/5 text-white border-white/10" : "bg-white/80 text-gray-900 border-gray-200"}`
          }
        ),
        /* @__PURE__ */ jsxs13("p", { className: `text-xs mt-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
          "\u7559\u7A7A\u5C06\u4F7F\u7528\u9ED8\u8BA4\u540D\u79F0: Boom League S",
          nextSeasonNumber
        ] })
      ] }),
      /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsx14(LucideSettings, { className: "text-orange-400", size: 20 }),
          /* @__PURE__ */ jsx14("label", { className: `text-sm font-medium ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "\u7279\u6B8A\u89C4\u5219\u53EF\u80FD\u6027\u9009\u62E9" })
        ] }),
        /* @__PURE__ */ jsx14("p", { className: `text-xs mb-3 ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u9009\u62E9\u8054\u8D5B\u4E2D\u53EF\u80FD\u51FA\u73B0\u7684\u7279\u6B8A\u89C4\u5219\u3002\u7CFB\u7EDF\u5C06\u4ECE\u9009\u4E2D\u7684\u89C4\u5219\u4E2D\u968F\u673A\u9009\u62E9\u3002" }),
        /* @__PURE__ */ jsx14("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: GAME_RULES.SPECIAL_RULES.map((rule) => /* @__PURE__ */ jsx14(
          "button",
          {
            onClick: () => toggleSpecialRule(rule),
            className: `p-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left ${selectedSpecialRules.includes(rule) ? theme === "dark" ? "bg-orange-500/20 border-orange-500/50 text-orange-400" : "bg-orange-100 border-orange-300 text-orange-700" : theme === "dark" ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"}`,
            children: /* @__PURE__ */ jsxs13("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx14("span", { children: rule }),
              selectedSpecialRules.includes(rule) && /* @__PURE__ */ jsx14(LucideCheck, { size: 16, className: "text-orange-400" })
            ] })
          },
          rule
        )) }),
        /* @__PURE__ */ jsxs13("div", { className: `mt-2 text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
          "\u5DF2\u9009\u62E9 ",
          selectedSpecialRules.length,
          " / ",
          GAME_RULES.SPECIAL_RULES.length,
          " \u79CD\u53EF\u80FD\u6027"
        ] })
      ] }),
      /* @__PURE__ */ jsxs13("p", { className: `mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
        "\u5F53\u524D\u6709 ",
        players.length,
        " \u540D\u73A9\u5BB6\u6CE8\u518C\u3002\u9700\u8981\u81F3\u5C11 2 \u540D\u73A9\u5BB6\u624D\u80FD\u5F00\u59CB\u8054\u8D5B\u3002"
      ] }),
      /* @__PURE__ */ jsx14(
        "button",
        {
          onClick: handleStartLeagueWithRules,
          disabled: players.length < 2 || selectedSpecialRules.length === 0,
          className: "bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100",
          children: "\u5F00\u59CB\u8054\u8D5B"
        }
      )
    ] }),
    leagueState && leagueState.status !== "setup" && /* @__PURE__ */ jsxs13("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"} backdrop-blur-sm shadow-xl`, children: [
      /* @__PURE__ */ jsxs13("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx14("h3", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "\u5F53\u524D\u8054\u8D5B\u72B6\u6001" }),
        leagueState.status === "in_progress" && /* @__PURE__ */ jsxs13(
          "button",
          {
            onClick: () => setCurrentPage("in_progress"),
            className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx14(LucidePlay2, { size: 16 }),
              "\u8FDB\u5165\u8054\u8D5B"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs13("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs13("div", { className: `p-4 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsx14("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u8054\u8D5B\u540D\u79F0" }),
          /* @__PURE__ */ jsx14("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: leagueState.league_name || "\u672A\u547D\u540D\u8054\u8D5B" })
        ] }),
        /* @__PURE__ */ jsxs13("div", { className: `p-4 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsx14("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u72B6\u6001" }),
          /* @__PURE__ */ jsx14("p", { className: `font-bold text-lg ${leagueState.status === "in_progress" ? "text-green-400" : leagueState.status === "finished" ? "text-yellow-400" : leagueState.status === "pending_confirmation" ? "text-orange-400" : "text-gray-400"}`, children: leagueState.status === "in_progress" ? "\u8FDB\u884C\u4E2D" : leagueState.status === "finished" ? "\u5DF2\u7ED3\u675F" : leagueState.status === "pending_confirmation" ? "\u5F85\u786E\u8BA4" : "\u8BBE\u7F6E\u4E2D" })
        ] }),
        /* @__PURE__ */ jsxs13("div", { className: `p-4 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsx14("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u5F53\u524D\u8F6E\u6B21" }),
          /* @__PURE__ */ jsxs13("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            leagueState.current_round,
            " / ",
            leagueState.schedule?.length || 5
          ] })
        ] })
      ] }),
      leagueState.status === "finished" && leagueState.winner && /* @__PURE__ */ jsxs13("div", { className: `mt-4 p-4 rounded-lg border-2 border-yellow-400 ${theme === "dark" ? "bg-yellow-500/10" : "bg-yellow-50"}`, children: [
        /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx14(LucideCrown2, { className: "text-yellow-400", size: 24 }),
          /* @__PURE__ */ jsxs13("div", { children: [
            /* @__PURE__ */ jsxs13("p", { className: `font-bold ${theme === "dark" ? "text-yellow-400" : "text-yellow-700"}`, children: [
              "\u{1F3C6} ",
              leagueState.winner.name
            ] }),
            /* @__PURE__ */ jsx14("p", { className: `text-sm ${theme === "dark" ? "text-yellow-300/80" : "text-yellow-600"}`, children: leagueState.winner.reason })
          ] })
        ] }),
        /* @__PURE__ */ jsx14(
          "button",
          {
            onClick: handleResetLeague,
            className: "mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105",
            children: "\u5F00\u542F\u65B0\u8054\u8D5B"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"} backdrop-blur-sm shadow-xl`, children: [
      /* @__PURE__ */ jsxs13("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx14("h3", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "\u8054\u8D5B\u8BB0\u5F55" }),
        /* @__PURE__ */ jsxs13("div", { className: "flex rounded-lg overflow-hidden", children: [
          /* @__PURE__ */ jsx14(
            "button",
            {
              onClick: () => setViewMode("ongoing"),
              className: `px-4 py-2 text-sm font-medium transition-colors ${viewMode === "ongoing" ? "bg-orange-500 text-white" : theme === "dark" ? "bg-white/10 text-white/70 hover:bg-white/20" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`,
              children: "\u6B63\u5728\u8FDB\u884C"
            }
          ),
          /* @__PURE__ */ jsx14(
            "button",
            {
              onClick: () => setViewMode("history"),
              className: `px-4 py-2 text-sm font-medium transition-colors ${viewMode === "history" ? "bg-orange-500 text-white" : theme === "dark" ? "bg-white/10 text-white/70 hover:bg-white/20" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`,
              children: "\u5386\u53F2\u8BB0\u5F55"
            }
          )
        ] })
      ] }),
      viewMode === "ongoing" ? /* @__PURE__ */ jsx14("div", { className: "space-y-4", children: leagueState && leagueState.status !== "setup" && leagueState.status !== "finished" ? /* @__PURE__ */ jsx14("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`, children: /* @__PURE__ */ jsxs13("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs13("div", { children: [
          /* @__PURE__ */ jsx14("h4", { className: `font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.league_name || "\u5F53\u524D\u8054\u8D5B" }),
          /* @__PURE__ */ jsxs13("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
            "\u7B2C ",
            leagueState.current_round,
            " \u8F6E / \u5171 ",
            leagueState.schedule?.length || 5,
            " \u8F6E"
          ] })
        ] }),
        /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx14("span", { className: `px-2 py-1 text-xs rounded-full ${leagueState.status === "in_progress" ? "bg-green-500/20 text-green-400" : leagueState.status === "pending_confirmation" ? "bg-orange-500/20 text-orange-400" : "bg-gray-500/20 text-gray-400"}`, children: leagueState.status === "in_progress" ? "\u8FDB\u884C\u4E2D" : leagueState.status === "pending_confirmation" ? "\u5F85\u786E\u8BA4" : "\u672A\u77E5" }),
          /* @__PURE__ */ jsx14(
            "button",
            {
              onClick: () => setCurrentPage("in_progress"),
              className: "bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition-colors",
              children: "\u67E5\u770B"
            }
          )
        ] })
      ] }) }) : /* @__PURE__ */ jsxs13("div", { className: `p-8 text-center ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
        /* @__PURE__ */ jsx14(LucidePlay2, { size: 48, className: "mx-auto mb-3 opacity-50" }),
        /* @__PURE__ */ jsx14("p", { children: "\u6682\u65E0\u6B63\u5728\u8FDB\u884C\u7684\u8054\u8D5B" }),
        /* @__PURE__ */ jsx14("p", { className: "text-sm mt-1", children: "\u521B\u5EFA\u65B0\u8054\u8D5B\u5F00\u59CB\u6E38\u620F\u5427\uFF01" })
      ] }) }) : /* @__PURE__ */ jsx14("div", { className: "space-y-4", children: leagueHistory.length > 0 ? /* @__PURE__ */ jsx14("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: leagueHistory.map((league) => /* @__PURE__ */ jsxs13("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`, children: [
        /* @__PURE__ */ jsxs13("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxs13("div", { children: [
            /* @__PURE__ */ jsx14("h4", { className: `font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: league.league_name }),
            /* @__PURE__ */ jsxs13("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
              "Season ",
              league.season_number
            ] })
          ] }),
          /* @__PURE__ */ jsxs13("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx14("p", { className: `text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`, children: formatDate(league.end_date) }),
            /* @__PURE__ */ jsx14("p", { className: `text-xs ${theme === "dark" ? "text-white/40" : "text-gray-400"}`, children: formatDuration(league.start_date, league.end_date) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsx14("div", { className: "text-2xl", children: league.winner.avatar }),
          /* @__PURE__ */ jsx14("div", { children: /* @__PURE__ */ jsxs13("p", { className: `font-medium ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`, children: [
            "\u{1F3C6} ",
            league.winner.name
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs13("div", { className: "grid grid-cols-3 gap-3 text-center", children: [
          /* @__PURE__ */ jsxs13("div", { className: `p-2 rounded ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`, children: [
            /* @__PURE__ */ jsx14(LucideUsers2, { size: 14, className: `mx-auto mb-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}` }),
            /* @__PURE__ */ jsxs13("p", { className: `text-xs ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
              league.total_players,
              "\u4EBA"
            ] })
          ] }),
          /* @__PURE__ */ jsxs13("div", { className: `p-2 rounded ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`, children: [
            /* @__PURE__ */ jsx14(LucideCalendar, { size: 14, className: `mx-auto mb-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}` }),
            /* @__PURE__ */ jsxs13("p", { className: `text-xs ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
              league.total_rounds,
              "\u8F6E"
            ] })
          ] }),
          /* @__PURE__ */ jsxs13("div", { className: `p-2 rounded ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`, children: [
            /* @__PURE__ */ jsx14(LucideTrophy2, { size: 14, className: `mx-auto mb-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}` }),
            /* @__PURE__ */ jsx14("p", { className: `text-xs ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: "\u5B8C\u6210" })
          ] })
        ] })
      ] }, league.id)) }) : /* @__PURE__ */ jsxs13("div", { className: `p-8 text-center ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
        /* @__PURE__ */ jsx14(LucideHistory2, { size: 48, className: "mx-auto mb-3 opacity-50" }),
        /* @__PURE__ */ jsx14("p", { children: "\u6682\u65E0\u5386\u53F2\u8054\u8D5B\u8BB0\u5F55" }),
        /* @__PURE__ */ jsx14("p", { className: "text-sm mt-1", children: "\u5B8C\u6210\u9996\u573A\u8054\u8D5B\u540E\uFF0C\u8BB0\u5F55\u5C06\u663E\u793A\u5728\u8FD9\u91CC" })
      ] }) })
    ] })
  ] });
}, LeagueManagementPage_default = LeagueManagementPage;

// app/components/pages/PlayerRankingsPage.tsx
import { useState as useState4 } from "react";
import { LucideTrophy as LucideTrophy3, LucideUsers as LucideUsers3, LucideCrown as LucideCrown3, LucideMedal, LucideAward, LucideTarget, LucideDices, LucideZap, LucideGem, LucideBarChart3 as LucideBarChart32, LucidePercent } from "lucide-react";
import { jsx as jsx15, jsxs as jsxs14 } from "react/jsx-runtime";
var PlayerRankingsPage = ({ players, onPlayerClick }) => {
  let { theme } = useTheme(), [selectedCategory, setSelectedCategory] = useState4("championships"), categories = [
    {
      key: "championships",
      name: "\u8054\u8D5B\u51A0\u519B",
      icon: /* @__PURE__ */ jsx15(LucideCrown3, { className: "w-5 h-5" }),
      getValue: (p) => p.championships || 0,
      isDescending: !0,
      unit: "\u6B21",
      bgColor: "bg-yellow-500/10 border-yellow-500/20",
      textColor: "text-yellow-400"
    },
    {
      key: "runner_up",
      name: "\u8054\u8D5B\u4E9A\u519B",
      icon: /* @__PURE__ */ jsx15(LucideMedal, { className: "w-5 h-5" }),
      getValue: (p) => p.runner_up || 0,
      isDescending: !0,
      unit: "\u6B21",
      bgColor: "bg-gray-400/10 border-gray-400/20",
      textColor: "text-gray-300"
    },
    {
      key: "third_place",
      name: "\u8054\u8D5B\u5B63\u519B",
      icon: /* @__PURE__ */ jsx15(LucideAward, { className: "w-5 h-5" }),
      getValue: (p) => p.third_place || 0,
      isDescending: !0,
      unit: "\u6B21",
      bgColor: "bg-orange-500/10 border-orange-500/20",
      textColor: "text-orange-400"
    },
    {
      key: "single_round_firsts",
      name: "\u5355\u8F6E\u51A0\u519B",
      icon: /* @__PURE__ */ jsx15(LucideTarget, { className: "w-5 h-5" }),
      getValue: (p) => p.single_round_firsts || 0,
      isDescending: !0,
      unit: "\u6B21",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      textColor: "text-blue-400"
    },
    {
      key: "single_round_seconds",
      name: "\u5355\u8F6E\u4E9A\u519B",
      icon: /* @__PURE__ */ jsx15(LucideDices, { className: "w-5 h-5" }),
      getValue: (p) => p.single_round_seconds || 0,
      isDescending: !0,
      unit: "\u6B21",
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
      textColor: "text-cyan-400"
    },
    {
      key: "single_round_thirds",
      name: "\u5355\u8F6E\u5B63\u519B",
      icon: /* @__PURE__ */ jsx15(LucideZap, { className: "w-5 h-5" }),
      getValue: (p) => p.single_round_thirds || 0,
      isDescending: !0,
      unit: "\u6B21",
      bgColor: "bg-purple-500/10 border-purple-500/20",
      textColor: "text-purple-400"
    },
    {
      key: "total_vp",
      name: "\u603BVP",
      icon: /* @__PURE__ */ jsx15(LucideGem, { className: "w-5 h-5" }),
      getValue: (p) => p.total_vp || 0,
      isDescending: !0,
      unit: "VP",
      bgColor: "bg-green-500/10 border-green-500/20",
      textColor: "text-green-400"
    },
    {
      key: "total_games",
      name: "\u603B\u8054\u8D5B\u6570",
      icon: /* @__PURE__ */ jsx15(LucideTrophy3, { className: "w-5 h-5" }),
      getValue: (p) => p.total_games || 0,
      isDescending: !0,
      unit: "\u573A",
      bgColor: "bg-indigo-500/10 border-indigo-500/20",
      textColor: "text-indigo-400"
    },
    {
      key: "average_placement",
      name: "\u5E73\u5747\u6392\u540D",
      icon: /* @__PURE__ */ jsx15(LucideBarChart32, { className: "w-5 h-5" }),
      getValue: (p) => p.average_placement || 999,
      isDescending: !1,
      // Lower is better for average placement
      unit: "",
      bgColor: "bg-teal-500/10 border-teal-500/20",
      textColor: "text-teal-400"
    },
    {
      key: "win_rate",
      name: "\u80DC\u7387",
      icon: /* @__PURE__ */ jsx15(LucidePercent, { className: "w-5 h-5" }),
      getValue: (p) => p.win_rate || 0,
      isDescending: !0,
      unit: "%",
      bgColor: "bg-rose-500/10 border-rose-500/20",
      textColor: "text-rose-400"
    }
  ], currentCategory = categories.find((cat) => cat.key === selectedCategory) || categories[0], sortedPlayers = [...players].filter((player) => currentCategory.getValue(player) > 0 || currentCategory.key === "roundAveragePlacement").sort((a, b) => {
    let valueA = currentCategory.getValue(a), valueB = currentCategory.getValue(b);
    return currentCategory.isDescending ? valueB - valueA : valueA - valueB;
  }), getRankingForCategory = (player, categoryKey) => player.rankings && player.rankings[categoryKey] || 0;
  return /* @__PURE__ */ jsxs14("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs14("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx15("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u73A9\u5BB6\u6392\u884C\u699C" }),
      /* @__PURE__ */ jsx15("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: "\u6309\u4E0D\u540C\u7EDF\u8BA1\u9879\u76EE\u67E5\u770B\u73A9\u5BB6\u6392\u540D" })
    ] }),
    /* @__PURE__ */ jsxs14("div", { className: `rounded-2xl p-4 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsx15("h3", { className: `text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "\u9009\u62E9\u6392\u540D\u7C7B\u522B" }),
      /* @__PURE__ */ jsx15("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2", children: categories.map((category) => /* @__PURE__ */ jsxs14(
        "button",
        {
          onClick: () => setSelectedCategory(category.key),
          className: `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${selectedCategory === category.key ? `${category.bgColor} ${category.textColor} border-current` : theme === "dark" ? "bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-600/50" : "bg-gray-100/50 text-gray-600 border-gray-200/50 hover:bg-gray-200/50"}`,
          children: [
            category.icon,
            /* @__PURE__ */ jsx15("span", { className: "hidden sm:inline", children: category.name })
          ]
        },
        category.key
      )) })
    ] }),
    /* @__PURE__ */ jsxs14("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs14("h3", { className: `text-2xl font-bold mb-6 flex items-center gap-3 ${currentCategory.textColor}`, children: [
        currentCategory.icon,
        currentCategory.name,
        "\u6392\u884C\u699C"
      ] }),
      /* @__PURE__ */ jsx15("div", { className: "space-y-3", children: sortedPlayers.map((player, index) => {
        let value = currentCategory.getValue(player), ranking = getRankingForCategory(player, currentCategory.key), displayValue = currentCategory.key === "average_placement" ? value === 999 ? "0.0" : value.toFixed(1) : currentCategory.key === "win_rate" ? value.toFixed(0) : value.toString();
        return /* @__PURE__ */ jsxs14(
          "div",
          {
            className: `flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border ${index === 0 ? `${currentCategory.bgColor} border-current shadow-lg` : theme === "dark" ? "bg-gray-700/50 border-gray-600/30 hover:bg-gray-600/50" : "bg-white/70 border-gray-200/30 hover:bg-gray-100/70"}`,
            onClick: () => onPlayerClick(player),
            children: [
              /* @__PURE__ */ jsxs14("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs14("div", { className: "flex flex-col items-center", children: [
                  /* @__PURE__ */ jsx15("span", { className: `font-bold text-xl w-8 text-center ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : theme === "dark" ? "text-gray-500" : "text-gray-400"}`, children: index + 1 }),
                  ranking > 0 && /* @__PURE__ */ jsxs14("span", { className: `text-xs font-medium ${getRankingColorClass(ranking)}`, children: [
                    "#",
                    getRankingSuffix(ranking)
                  ] })
                ] }),
                /* @__PURE__ */ jsx15("span", { className: "text-2xl", children: player.avatar }),
                /* @__PURE__ */ jsxs14("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx15("span", { className: `font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: player.name }),
                  /* @__PURE__ */ jsxs14("div", { className: `flex gap-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                    /* @__PURE__ */ jsxs14("span", { children: [
                      "\u{1F3C6} ",
                      player.championships || 0
                    ] }),
                    /* @__PURE__ */ jsxs14("span", { children: [
                      "\u{1F3AE} ",
                      player.total_games || 0,
                      "\u573A"
                    ] }),
                    /* @__PURE__ */ jsxs14("span", { children: [
                      "\u26A1 ",
                      player.single_round_firsts || 0,
                      "\u5355\u51A0"
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs14("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxs14("div", { className: `text-2xl font-bold ${index === 0 ? currentCategory.textColor : theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
                  displayValue,
                  currentCategory.unit
                ] }),
                /* @__PURE__ */ jsx15("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: currentCategory.name })
              ] })
            ]
          },
          player.id
        );
      }) }),
      sortedPlayers.length === 0 && /* @__PURE__ */ jsxs14("div", { className: `text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
        /* @__PURE__ */ jsx15(LucideUsers3, { size: 48, className: "mx-auto mb-4 opacity-50" }),
        /* @__PURE__ */ jsx15("p", { children: "\u8BE5\u7C7B\u522B\u6682\u65E0\u6570\u636E" }),
        /* @__PURE__ */ jsx15("p", { className: "text-sm", children: "\u73A9\u5BB6\u9700\u8981\u53C2\u4E0E\u6E38\u620F\u540E\u624D\u4F1A\u6709\u7EDF\u8BA1\u6570\u636E" })
      ] })
    ] }),
    players.length === 0 && /* @__PURE__ */ jsxs14("div", { className: `text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
      /* @__PURE__ */ jsx15(LucideUsers3, { size: 48, className: "mx-auto mb-4 opacity-50" }),
      /* @__PURE__ */ jsx15("p", { children: "\u8FD8\u6CA1\u6709\u6CE8\u518C\u7684\u73A9\u5BB6" }),
      /* @__PURE__ */ jsx15("p", { className: "text-sm", children: "\u524D\u5F80\u73A9\u5BB6\u6CE8\u518C\u9875\u9762\u6DFB\u52A0\u73A9\u5BB6" })
    ] })
  ] });
}, PlayerRankingsPage_default = PlayerRankingsPage;

// app/components/pages/LeagueHistoryPage.tsx
import { LucideHistory as LucideHistory3, LucideTrophy as LucideTrophy4, LucideCrown as LucideCrown4, LucideCalendar as LucideCalendar2, LucideUsers as LucideUsers4, LucideTarget as LucideTarget2 } from "lucide-react";
import { jsx as jsx16, jsxs as jsxs15 } from "react/jsx-runtime";
var LeagueHistoryPage = ({ leagueHistory }) => {
  let { theme } = useTheme(), formatDate = (dateString) => new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }), formatDuration = (startDate, endDate) => {
    let start = new Date(startDate), end = new Date(endDate), diffTime = Math.abs(end.getTime() - start.getTime()), diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    return diffDays === 1 ? "1 \u5929" : `${diffDays} \u5929`;
  };
  return leagueHistory.length === 0 ? /* @__PURE__ */ jsxs15("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx16("div", { className: "text-center", children: /* @__PURE__ */ jsxs15("div", { className: "inline-flex items-center gap-4 mb-6", children: [
      /* @__PURE__ */ jsx16("div", { className: "relative p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-[0_0_40px_rgba(147,51,234,0.3)]", children: /* @__PURE__ */ jsx16(LucideHistory3, { className: "text-purple-400", size: 32 }) }),
      /* @__PURE__ */ jsxs15("div", { className: "text-left", children: [
        /* @__PURE__ */ jsx16("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-purple-500 bg-clip-text text-transparent"}`, children: "\u8054\u8D5B\u5386\u53F2" }),
        /* @__PURE__ */ jsx16("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "League History" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs15("div", { className: `text-center p-10 ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg shadow-lg`, children: [
      /* @__PURE__ */ jsx16(LucideHistory3, { className: `mx-auto mb-4 ${theme === "dark" ? "text-white/40" : "text-gray-400"}`, size: 64 }),
      /* @__PURE__ */ jsx16("h3", { className: `text-xl font-semibold mb-2 ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: "\u6682\u65E0\u5386\u53F2\u8BB0\u5F55" }),
      /* @__PURE__ */ jsx16("p", { className: `${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "\u5B8C\u6210\u7B2C\u4E00\u4E2A\u8054\u8D5B\u540E\uFF0C\u5386\u53F2\u8BB0\u5F55\u5C06\u5728\u8FD9\u91CC\u663E\u793A" })
    ] })
  ] }) : /* @__PURE__ */ jsxs15("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx16("div", { className: "text-center", children: /* @__PURE__ */ jsxs15("div", { className: "inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6", children: [
      /* @__PURE__ */ jsx16("div", { className: "relative p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-[0_0_40px_rgba(147,51,234,0.3)]", children: /* @__PURE__ */ jsx16(LucideHistory3, { className: "text-purple-400", size: 32 }) }),
      /* @__PURE__ */ jsxs15("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ jsx16("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-purple-500 bg-clip-text text-transparent"}`, children: "\u8054\u8D5B\u5386\u53F2" }),
        /* @__PURE__ */ jsxs15("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
          leagueHistory.length,
          " \u4E2A\u5DF2\u5B8C\u6210\u7684\u8054\u8D5B"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx16("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: leagueHistory.map((league, index) => /* @__PURE__ */ jsxs15("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl shadow-lg overflow-hidden`, children: [
      /* @__PURE__ */ jsx16("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }),
      /* @__PURE__ */ jsxs15("div", { className: "relative z-10 p-4 sm:p-6", children: [
        /* @__PURE__ */ jsxs15("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx16("div", { className: `p-2 rounded-lg ${index === 0 ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30" : theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsx16(LucideTrophy4, { className: index === 0 ? "text-yellow-400" : theme === "dark" ? "text-white/70" : "text-gray-600", size: 16 }) }),
            /* @__PURE__ */ jsxs15("div", { children: [
              /* @__PURE__ */ jsx16("h3", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.league_name }),
              /* @__PURE__ */ jsxs15("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
                "Season ",
                league.season_number
              ] })
            ] })
          ] }),
          index === 0 && /* @__PURE__ */ jsx16("div", { className: "px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded text-xs font-medium text-yellow-400", children: "\u6700\u65B0" })
        ] }),
        /* @__PURE__ */ jsx16("div", { className: `p-3 rounded-lg mb-4 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx16(LucideCrown4, { className: "text-yellow-400", size: 20 }),
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx16("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u51A0\u519B" }),
            /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx16("span", { className: "text-lg", children: league.winner.avatar }),
              /* @__PURE__ */ jsx16("span", { className: `font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.winner.name })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs15("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
          /* @__PURE__ */ jsxs15("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
            /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx16(LucideUsers4, { size: 14, className: theme === "dark" ? "text-white/60" : "text-gray-500" }),
              /* @__PURE__ */ jsx16("span", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u53C2\u8D5B\u4EBA\u6570" })
            ] }),
            /* @__PURE__ */ jsx16("span", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.total_players })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
            /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx16(LucideTarget2, { size: 14, className: theme === "dark" ? "text-white/60" : "text-gray-500" }),
              /* @__PURE__ */ jsx16("span", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u603B\u8F6E\u6570" })
            ] }),
            /* @__PURE__ */ jsx16("span", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.total_rounds })
          ] })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx16(LucideCalendar2, { size: 14, className: theme === "dark" ? "text-white/60" : "text-gray-500" }),
            /* @__PURE__ */ jsx16("span", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u65F6\u95F4\u4FE1\u606F" })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "text-sm space-y-1", children: [
            /* @__PURE__ */ jsxs15("div", { children: [
              /* @__PURE__ */ jsx16("span", { className: `text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`, children: "\u521B\u5EFA\uFF1A" }),
              /* @__PURE__ */ jsx16("span", { className: `ml-1 ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: formatDate(league.created_at) })
            ] }),
            /* @__PURE__ */ jsxs15("div", { children: [
              /* @__PURE__ */ jsx16("span", { className: `text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`, children: "\u6BD4\u8D5B\uFF1A" }),
              /* @__PURE__ */ jsxs15("span", { className: `ml-1 ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
                formatDate(league.start_date),
                " - ",
                formatDate(league.end_date)
              ] })
            ] }),
            /* @__PURE__ */ jsxs15("p", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
              "\u6301\u7EED ",
              formatDuration(league.start_date, league.end_date)
            ] })
          ] })
        ] })
      ] })
    ] }, league.id)) })
  ] });
}, LeagueHistoryPage_default = LeagueHistoryPage;

// app/components/pages/ScheduleConfirmationPage.tsx
import { LucideCheck as LucideCheck2, LucideDice6, LucideCalendar as LucideCalendar3, LucideShield as LucideShield2, LucideBomb as LucideBomb3, LucideSwords as LucideSwords2, LucideTrophy as LucideTrophy5, LucideDices as LucideDices2, LucideAlertTriangle, LucideSettings as LucideSettings2 } from "lucide-react";
import { jsx as jsx17, jsxs as jsxs16 } from "react/jsx-runtime";
var ScheduleConfirmationPage = ({
  leagueState,
  players,
  onConfirmSchedule,
  onRerollSchedule
}) => {
  let { theme } = useTheme();
  return !leagueState || !leagueState.schedule || leagueState.schedule.length === 0 ? /* @__PURE__ */ jsx17("div", { className: "text-white", children: "\u52A0\u8F7D\u4E2D..." }) : /* @__PURE__ */ jsxs16("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx17("div", { className: "text-center", children: /* @__PURE__ */ jsxs16("div", { className: "inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6", children: [
      /* @__PURE__ */ jsx17("div", { className: "relative p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ jsx17(LucideCalendar3, { className: "text-orange-400", size: 32 }) }),
      /* @__PURE__ */ jsxs16("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ jsx17("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-orange-500 bg-clip-text text-transparent"}`, children: "\u786E\u8BA4\u8D5B\u7A0B\u5B89\u6392" }),
        /* @__PURE__ */ jsxs16("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
          leagueState.league_name,
          " - Season ",
          leagueState.season_number
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx17("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-yellow-500/10 border-yellow-500/30" : "bg-yellow-50 border-yellow-200"}`, children: /* @__PURE__ */ jsxs16("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx17(LucideAlertTriangle, { className: "text-yellow-500 flex-shrink-0", size: 20 }),
      /* @__PURE__ */ jsxs16("div", { children: [
        /* @__PURE__ */ jsx17("p", { className: `font-semibold ${theme === "dark" ? "text-yellow-400" : "text-yellow-800"}`, children: "\u8BF7\u4ED4\u7EC6\u68C0\u67E5\u8D5B\u7A0B\u5B89\u6392" }),
        /* @__PURE__ */ jsx17("p", { className: `text-sm mt-1 ${theme === "dark" ? "text-yellow-300/80" : "text-yellow-700"}`, children: "\u786E\u8BA4\u540E\u8054\u8D5B\u5C06\u6B63\u5F0F\u5F00\u59CB\u3002\u5982\u679C\u4E0D\u6EE1\u610F\u5F53\u524D\u5B89\u6392\uFF0C\u53EF\u4EE5\u91CD\u65B0\u751F\u6210\u8D5B\u7A0B\u3002" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs16("div", { className: `p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs16("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx17("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsx17(LucideTrophy5, { className: "text-orange-400", size: 20 }) }),
        /* @__PURE__ */ jsx17("div", { children: /* @__PURE__ */ jsx17("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "\u8054\u8D5B\u4FE1\u606F" }) })
      ] }),
      /* @__PURE__ */ jsxs16("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs16("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsx17("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u53C2\u8D5B\u4EBA\u6570" }),
          /* @__PURE__ */ jsxs16("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            players.length,
            " \u4EBA"
          ] })
        ] }),
        /* @__PURE__ */ jsxs16("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsx17("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u603B\u8F6E\u6570" }),
          /* @__PURE__ */ jsxs16("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            leagueState.schedule.length,
            " \u8F6E"
          ] })
        ] }),
        /* @__PURE__ */ jsxs16("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"} col-span-2 sm:col-span-1`, children: [
          /* @__PURE__ */ jsx17("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u521B\u5EFA\u65F6\u95F4" }),
          /* @__PURE__ */ jsx17("p", { className: `font-bold text-sm ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: leagueState.created_at && new Date(leagueState.created_at).toLocaleDateString("zh-CN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }) })
        ] })
      ] })
    ] }),
    leagueState.selected_special_rules && leagueState.selected_special_rules.length > 0 && /* @__PURE__ */ jsxs16("div", { className: `p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs16("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx17("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsx17(LucideSettings2, { className: "text-orange-400", size: 20 }) }),
        /* @__PURE__ */ jsxs16("div", { children: [
          /* @__PURE__ */ jsx17("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "\u7279\u6B8A\u89C4\u5219\u8BBE\u7F6E" }),
          /* @__PURE__ */ jsx17("p", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "\u7CFB\u7EDF\u5C06\u4ECE\u4EE5\u4E0B\u89C4\u5219\u4E2D\u968F\u673A\u9009\u62E9" })
        ] })
      ] }),
      /* @__PURE__ */ jsx17("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: leagueState.selected_special_rules.map((rule, index) => /* @__PURE__ */ jsx17(
        "div",
        {
          className: `p-3 rounded-lg border text-sm ${theme === "dark" ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-700"}`,
          children: /* @__PURE__ */ jsxs16("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx17(LucideCheck2, { size: 14, className: "text-orange-400 flex-shrink-0" }),
            /* @__PURE__ */ jsx17("span", { children: rule })
          ] })
        },
        index
      )) }),
      /* @__PURE__ */ jsxs16("div", { className: `mt-3 text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
        "\u5171 ",
        leagueState.selected_special_rules.length,
        " \u79CD\u53EF\u80FD\u7684\u7279\u6B8A\u89C4\u5219"
      ] })
    ] }),
    /* @__PURE__ */ jsxs16("div", { className: `p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs16("div", { className: "flex items-center justify-between mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsxs16("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx17("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsx17(LucideCalendar3, { className: "text-blue-400", size: 20 }) }),
          /* @__PURE__ */ jsx17("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "\u8D5B\u7A0B\u9884\u89C8" })
        ] }),
        /* @__PURE__ */ jsxs16(
          "button",
          {
            onClick: onRerollSchedule,
            className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all duration-200",
            children: [
              /* @__PURE__ */ jsx17(LucideDice6, { size: 16 }),
              /* @__PURE__ */ jsx17("span", { className: "text-sm font-medium", children: "\u91CD\u65B0\u751F\u6210" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx17("div", { className: "space-y-4", children: leagueState.schedule.map((round, index) => /* @__PURE__ */ jsxs16("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"}`, children: [
        /* @__PURE__ */ jsxs16("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs16("h4", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            "\u7B2C ",
            round.round,
            " \u8F6E"
          ] }),
          /* @__PURE__ */ jsx17("div", { className: `px-2 py-1 rounded text-xs font-medium ${theme === "dark" ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`, children: round.vpMode.name })
        ] }),
        /* @__PURE__ */ jsxs16("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm", children: [
          /* @__PURE__ */ jsx17(
            InfoCard_default,
            {
              icon: /* @__PURE__ */ jsx17(LucideShield2, { className: "text-blue-400" }),
              title: "\u5B89\u5168\u724C",
              value: round.safeCards
            }
          ),
          /* @__PURE__ */ jsx17(
            InfoCard_default,
            {
              icon: /* @__PURE__ */ jsx17(LucideBomb3, { className: "text-red-400" }),
              title: "\u70B8\u5F39\u724C",
              value: round.bombCards
            }
          ),
          /* @__PURE__ */ jsx17(
            InfoCard_default,
            {
              icon: /* @__PURE__ */ jsx17(LucideSwords2, { className: "text-yellow-400" }),
              title: "\u624B\u724C\u4E0A\u9650",
              value: round.handLimit === 1 / 0 ? "\u65E0\u9650\u5236" : round.handLimit
            }
          ),
          /* @__PURE__ */ jsx17("div", { className: "sm:col-span-1 col-span-2", children: /* @__PURE__ */ jsx17(
            InfoCard_default,
            {
              icon: /* @__PURE__ */ jsx17(LucideDices2, { className: "text-purple-400" }),
              title: "\u7279\u6B8A\u89C4\u5219",
              value: round.specialRule
            }
          ) })
        ] })
      ] }, round.round)) })
    ] }),
    /* @__PURE__ */ jsxs16("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
      /* @__PURE__ */ jsxs16(
        "button",
        {
          onClick: onRerollSchedule,
          className: "flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all duration-200 font-medium",
          children: [
            /* @__PURE__ */ jsx17(LucideDice6, { size: 20 }),
            "\u91CD\u65B0\u751F\u6210\u8D5B\u7A0B"
          ]
        }
      ),
      /* @__PURE__ */ jsxs16(
        "button",
        {
          onClick: onConfirmSchedule,
          className: "flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-200 shadow-lg",
          children: [
            /* @__PURE__ */ jsx17(LucideCheck2, { size: 20 }),
            "\u786E\u8BA4\u5E76\u5F00\u59CB\u8054\u8D5B"
          ]
        }
      )
    ] })
  ] });
}, ScheduleConfirmationPage_default = ScheduleConfirmationPage;

// app/routes/_index.tsx
import { Fragment as Fragment3, jsx as jsx18, jsxs as jsxs17 } from "react/jsx-runtime";
var supabase;
function Index() {
  let [leagueState, setLeagueState] = useState5(null), [players, setPlayers] = useState5([]), [session, setSession] = useState5(null), [isAuthReady, setIsAuthReady] = useState5(!1), [showPlayerModal, setShowPlayerModal] = useState5(!1), [showResultsModal, setShowResultsModal] = useState5(!1), [newPlayerName, setNewPlayerName] = useState5(""), [selectedAvatar, setSelectedAvatar] = useState5(GAME_RULES.AVATARS[0]), [showPlayerProfileModal, setShowPlayerProfileModal] = useState5(!1), [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState5(null), [winner, setWinner] = useState5(null), [showCardDrawReminder, setShowCardDrawReminder] = useState5(!1), [cardDrawRound, setCardDrawRound] = useState5(1), [appId, setAppId] = useState5("default"), [currentPage, setCurrentPage] = useState5("home"), [sidebarOpen, setSidebarOpen] = useState5(!1), [sidebarCollapsed, setSidebarCollapsed] = useState5(!1), [musicPlaying, setMusicPlaying] = useState5(!1), [musicMuted, setMusicMuted] = useState5(!0), [leagueHistory, setLeagueHistory] = useState5([]), [currentLeagueName, setCurrentLeagueName] = useState5(""), [nextSeasonNumber, setNextSeasonNumber] = useState5(1), updatePlayersWithRankings = (newPlayers) => {
    let playersWithRankings = calculatePlayerRankings(newPlayers);
    setPlayers(playersWithRankings);
  };
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
  let [theme, setTheme] = useState5("dark");
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
  }, []);
  let loadLeagueHistory = async () => {
    if (!(!supabase || !appId))
      try {
        let { data: historyData, error } = await supabase.from("league_history").select("*").eq("app_id", appId).order("season_number", { ascending: !1 });
        if (error) {
          console.error("Error loading league history:", error);
          return;
        }
        if (historyData) {
          let mappedHistory = leagueHistoryArrayFromSupabase(historyData);
          setLeagueHistory(mappedHistory);
          let latestSeason = mappedHistory.length > 0 ? mappedHistory[0].season_number : 0;
          setNextSeasonNumber(latestSeason + 1), setCurrentLeagueName(`Boom League S${latestSeason + 1}`);
        }
      } catch (error) {
        console.error("Error in loadLeagueHistory:", error);
      }
  };
  useEffect(() => {
    if (!isAuthReady || !supabase)
      return;
    (async () => {
      let { data: leagueData, error: leagueError } = await supabase.from("league_state").select("*").eq("app_id", appId).single();
      if (leagueData) {
        let mappedLeagueState = leagueStateFromSupabase(leagueData);
        setLeagueState(mappedLeagueState), mappedLeagueState.winner ? setWinner(mappedLeagueState.winner) : setWinner(null);
      } else
        setLeagueState(null);
      leagueError && leagueError.code !== "PGRST116" && console.error("Error fetching league state:", leagueError);
      let { data: playersData, error: playersError } = await supabase.from("players").select("*").eq("app_id", appId);
      if (playersError && console.error("Error fetching players:", playersError), playersData) {
        let mappedPlayers = playersData.map((playerData) => playerFromSupabase(playerData));
        mappedPlayers.sort((a, b) => b.score - a.score), updatePlayersWithRankings(mappedPlayers);
      }
    })();
    let leagueChannel = supabase.channel(`league-state:${appId}`).on("postgres_changes", { event: "*", schema: "public", table: "league_state", filter: `app_id=eq.${appId}` }, (payload) => {
      let updatedState = leagueStateFromSupabase(payload.new);
      setLeagueState(updatedState), updatedState.winner ? setWinner(updatedState.winner) : setWinner(null);
    }).subscribe(), playersChannel = supabase.channel(`players:${appId}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players", filter: `app_id=eq.${appId}` },
      (payload) => {
        if (payload.eventType === "INSERT") {
          let mappedPlayer = playerFromSupabase(payload.new);
          setPlayers((currentPlayers) => (currentPlayers.some((p) => p.id === mappedPlayer.id) ? currentPlayers : [...currentPlayers, mappedPlayer]).sort((a, b) => b.score - a.score));
        }
        if (payload.eventType === "UPDATE") {
          let mappedPlayer = playerFromSupabase(payload.new);
          setPlayers((currentPlayers) => currentPlayers.map((p) => p.id === mappedPlayer.id ? mappedPlayer : p).sort((a, b) => b.score - a.score));
        }
        payload.eventType === "DELETE" && setPlayers((currentPlayers) => currentPlayers.filter((p) => p.id !== payload.old.id));
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(leagueChannel), supabase.removeChannel(playersChannel);
    };
  }, [isAuthReady, appId]);
  let handleAddPlayer = async () => {
    if (console.log("handleAddPlayer called with:", { newPlayerName, selectedAvatar, playersLength: players.length }), newPlayerName.trim() === "") {
      console.log("handleAddPlayer early return:", { nameEmpty: newPlayerName.trim() === "" });
      return;
    }
    let tempPlayer = {
      id: `temp_${Date.now()}`,
      app_id: appId,
      name: newPlayerName.trim(),
      avatar: selectedAvatar,
      score: 0,
      history: [],
      // Database fields
      championships: 0,
      runner_up: 0,
      third_place: 0,
      total_vp: 0,
      total_games: 0,
      average_placement: 0,
      win_rate: 0,
      single_round_firsts: 0,
      single_round_seconds: 0,
      single_round_thirds: 0,
      // Compatibility fields
      leagueChampionships: 0,
      leagueRunnerUp: 0,
      leagueThirdPlace: 0,
      roundChampionships: 0,
      roundRunnerUp: 0,
      roundThirdPlace: 0,
      totalVP: 0,
      totalLeagues: 0,
      totalRounds: 0,
      roundAveragePlacement: 0,
      roundWinRate: 0,
      totalGames: 0,
      averagePlacement: 0,
      winRate: 0
    };
    console.log("Adding temp player:", tempPlayer), setPlayers((curr) => [...curr, tempPlayer].sort((a, b) => b.score - a.score)), console.log("Inserting into Supabase...");
    let playerData = {
      app_id: appId,
      name: tempPlayer.name,
      avatar: selectedAvatar,
      score: 0,
      history: [],
      championships: 0,
      runnerUp: 0,
      thirdPlace: 0,
      totalVP: 0
    }, { data, error } = await supabase.from("players").insert(playerToSupabase(playerData)).select().single();
    if (console.log("Supabase insert result:", { data, error }), error)
      setPlayers((curr) => curr.filter((p) => p.id !== tempPlayer.id)), console.error("Add player failed:", error);
    else if (data) {
      console.log("Successfully added player, updating temp player with real data:", data);
      let mappedPlayer = playerFromSupabase(data);
      setPlayers(
        (curr) => curr.map((p) => p.id === tempPlayer.id ? mappedPlayer : p).sort((a, b) => b.score - a.score)
      );
    }
    setNewPlayerName(""), setSelectedAvatar(GAME_RULES.AVATARS[0]), setShowPlayerModal(!1);
  }, handleDeletePlayer = async (playerId) => {
    let previous = players;
    setPlayers((curr) => curr.filter((p) => p.id !== playerId));
    let { error } = await supabase.from("players").delete().match({ id: playerId, app_id: appId });
    error && (console.error("Delete player failed:", error), setPlayers(previous));
  }, generateSchedule = (playerCount, selectedSpecialRules = GAME_RULES.SPECIAL_RULES) => {
    let schedule = [];
    for (let i = 0; i < GAME_RULES.MAX_ROUNDS; i++) {
      let safeCardMultipliers = [1, 2, 3, 4, 5], bombCardOptions = [playerCount, playerCount + 1], handLimits = [4, 5, 6, 1 / 0], roundSpecialRules = selectSpecialRules(selectedSpecialRules), specialRuleText = formatSpecialRules(roundSpecialRules);
      schedule.push({
        round: i + 1,
        safeCards: playerCount * UTILS.getRandomElement(safeCardMultipliers),
        bombCards: UTILS.getRandomElement(bombCardOptions),
        handLimit: UTILS.getRandomElement(handLimits),
        vpMode: UTILS.getRandomElement(GAME_RULES.VP_MODES),
        specialRule: specialRuleText,
        specialRules: roundSpecialRules
        // 保存原始规则数组
      });
    }
    return schedule;
  }, handleConfirmSchedule = async () => {
    if (!leagueState)
      return;
    let confirmedLeagueState = {
      ...leagueState,
      status: "in_progress",
      current_round: 1
    };
    setLeagueState(confirmedLeagueState);
    let { error } = await supabase.from("league_state").update({
      status: "in_progress",
      current_round: 1
    }).eq("app_id", appId);
    error && console.error("Confirm schedule failed:", error);
  }, handleRerollSchedule = async () => {
    if (!leagueState)
      return;
    let selectedRules = leagueState.selected_special_rules || GAME_RULES.SPECIAL_RULES, newSchedule = generateSchedule(players.length, selectedRules), rerolledLeagueState = {
      ...leagueState,
      schedule: newSchedule
    };
    setLeagueState(rerolledLeagueState);
    let { error } = await supabase.from("league_state").update({
      schedule: newSchedule
    }).eq("app_id", appId);
    error && console.error("Reroll schedule failed:", error);
  }, handleStartLeague = async (selectedSpecialRules) => {
    if (players.length < 2)
      return;
    let schedule = generateSchedule(players.length, selectedSpecialRules), currentDate = (/* @__PURE__ */ new Date()).toISOString(), leagueName = currentLeagueName || `Boom League S${nextSeasonNumber}`, newLeagueState = {
      app_id: appId,
      status: "pending_confirmation",
      current_round: 0,
      schedule,
      winner: null,
      league_name: leagueName,
      season_number: nextSeasonNumber,
      start_date: currentDate,
      created_at: currentDate,
      selected_special_rules: selectedSpecialRules
    };
    setLeagueState(newLeagueState);
    let { error } = await supabase.from("league_state").upsert(leagueStateToSupabase(newLeagueState), { onConflict: "app_id" });
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
  }, handleAbortLeague = async () => {
    if (!leagueState)
      return;
    if (leagueState.current_round > 1) {
      let abortedLeagueState = {
        ...leagueState,
        status: "finished",
        winner: {
          name: "\u8054\u8D5B\u4E2D\u6B62",
          avatar: "\u26A0\uFE0F",
          reason: `\u8054\u8D5B\u5728\u7B2C ${leagueState.current_round - 1} \u8F6E\u540E\u88AB\u4E2D\u6B62`
        },
        end_date: (/* @__PURE__ */ new Date()).toISOString()
      };
      await saveLeagueToHistory(abortedLeagueState, players);
    }
    setPlayers((curr) => curr.map((p) => ({ ...p, score: 0, history: [] }))), setLeagueState(null), setWinner(null), setCurrentPage("league");
    let [{ error: pErr }, { error: lErr }] = await Promise.all([
      supabase.from("players").update({ score: 0, history: [] }).eq("app_id", appId),
      supabase.from("league_state").delete().eq("app_id", appId)
    ]);
    pErr || lErr ? console.error("Abort league errors:", pErr, lErr) : await loadLeagueHistory();
  }, handleBackToLeagueManagement = () => {
    setCurrentPage("league");
  }, playHappySound = () => {
    if (!(musicPlaying && !musicMuted))
      try {
        let iframe = window.happySoundIframe;
        if (iframe) {
          let currentSrc = iframe.src;
          iframe.src = "", iframe.src = `https://www.youtube.com/embed/NSU2hJ5wT08?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&mute=0&volume=50&start=0&enablejsapi=1&origin=${window.location.origin}`;
          let handleLoad = () => {
            setTimeout(() => {
              try {
                iframe.contentWindow && iframe.contentWindow.postMessage(
                  JSON.stringify({
                    event: "command",
                    func: "setPlaybackRate",
                    args: [1]
                  }),
                  "https://www.youtube.com"
                );
              } catch (postMessageError) {
                console.log("Could not set playback rate for happy sound:", postMessageError);
              }
            }, 500);
          };
          iframe.onload = handleLoad;
        }
      } catch (error) {
        console.log("Happy sound failed:", error);
      }
  }, handlePlayerClick = (player) => {
    setSelectedPlayerForProfile(player), setShowPlayerProfileModal(!0);
  }, toggleTheme = () => {
    let newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme), typeof window < "u" && localStorage.setItem("boom-league-theme", newTheme);
  }, saveLeagueToHistory = async (finalLeagueState, finalPlayers) => {
    if (!finalLeagueState.winner || !finalLeagueState.league_name)
      return;
    let historyEntry = {
      app_id: appId,
      league_name: finalLeagueState.league_name,
      season_number: finalLeagueState.season_number || nextSeasonNumber,
      start_date: finalLeagueState.start_date || (/* @__PURE__ */ new Date()).toISOString(),
      end_date: (/* @__PURE__ */ new Date()).toISOString(),
      winner: finalLeagueState.winner,
      final_standings: [...finalPlayers].sort((a, b) => b.score - a.score),
      total_rounds: finalLeagueState.current_round,
      total_players: finalPlayers.length,
      created_at: finalLeagueState.created_at || finalLeagueState.start_date || (/* @__PURE__ */ new Date()).toISOString()
    }, { error } = await supabase.from("league_history").insert(leagueHistoryToSupabase(historyEntry));
    error ? console.error("Error saving league to history:", error) : await loadLeagueHistory();
  }, handleAdvanceRound = async (results) => {
    if (!leagueState)
      return;
    let currentRoundIndex = leagueState.current_round - 1, vpMode = leagueState.schedule[currentRoundIndex].vpMode, updatedPlayersData = [...players], playerUpdates = [];
    for (let [index, playerId] of results.entries()) {
      let player = updatedPlayersData.find((p) => p.id === playerId);
      if (!player)
        continue;
      let points = vpMode.scores[index] || 0, newScore = player.score + points, newTotalVP = (player.totalVP || 0) + points;
      player.score = newScore, player.totalVP = newTotalVP, player.history = [...player.history, { round: leagueState.current_round, placement: index + 1 }], playerUpdates.push(
        supabase.from("players").update({
          score: newScore,
          total_vp: newTotalVP,
          history: player.history
        }).match({ id: playerId, app_id: appId })
      );
    }
    let roundResults = results.map((playerId, index) => ({
      playerId,
      placement: index + 1
    })), playersWithRoundStats = UTILS.updateRoundStatistics(updatedPlayersData, roundResults), roundStatUpdates = playersWithRoundStats.map((player) => {
      let roundStatsData = playerToSupabase({
        roundChampionships: player.roundChampionships,
        roundRunnerUp: player.roundRunnerUp,
        roundThirdPlace: player.roundThirdPlace,
        totalRounds: player.totalRounds,
        roundAveragePlacement: player.roundAveragePlacement,
        roundWinRate: player.roundWinRate
      });
      return supabase.from("players").update(roundStatsData).match({ id: player.id, app_id: appId });
    });
    playerUpdates.push(...roundStatUpdates), updatePlayersWithRankings(playersWithRoundStats.sort((a, b) => b.score - a.score));
    let potentialWinners = playersWithRoundStats.filter((p) => p.score >= GAME_RULES.WIN_SCORE).sort((a, b) => b.score - a.score), potentialWinner = potentialWinners.length > 0 ? potentialWinners[0] : null, nextRound = leagueState.current_round + 1, newStatus = leagueState.status, finalWinner = null;
    if (potentialWinner)
      finalWinner = { name: potentialWinner.name, avatar: potentialWinner.avatar, reason: `\u5728\u7B2C ${leagueState.current_round} \u8F6E\u7387\u5148\u8FBE\u5230 ${potentialWinner.score} \u5206\uFF01` }, newStatus = "finished";
    else if (nextRound > GAME_RULES.MAX_ROUNDS) {
      newStatus = "finished";
      let sortedPlayers = playersWithRoundStats.sort((a, b) => b.score - a.score), topScore = sortedPlayers[0].score, winners = sortedPlayers.filter((p) => p.score === topScore);
      winners.length > 1 ? finalWinner = { name: winners.map((w) => w.name).join(" \u548C "), avatar: "\u2694\uFE0F", reason: `5\u8F6E\u540E\u5E73\u5206 (${topScore}\u5206)\uFF0C\u9700\u8981\u8FDB\u884C\u52A0\u8D5B\u5BF9\u51B3\uFF01` } : finalWinner = { name: sortedPlayers[0].name, avatar: sortedPlayers[0].avatar, reason: `5\u8F6E\u540E\u4EE5\u6700\u9AD8\u5206 (${topScore}\u5206) \u83B7\u80DC\uFF01` };
    }
    if (await Promise.all(playerUpdates), setLeagueState((curr) => ({
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
    }).eq("app_id", appId), newStatus === "finished" && finalWinner) {
      let leagueResults = playersWithRoundStats.sort((a, b) => b.score - a.score).map((player, index) => ({
        playerId: player.id,
        finalPlacement: index + 1
      })), playersWithUpdatedStats = UTILS.updateLeagueStatistics(playersWithRoundStats, leagueResults);
      updatePlayersWithRankings(playersWithUpdatedStats);
      let statisticsUpdates = playersWithUpdatedStats.map((player) => {
        let playerUpdateData = playerToSupabase({
          // League-level statistics
          leagueChampionships: player.leagueChampionships,
          leagueRunnerUp: player.leagueRunnerUp,
          leagueThirdPlace: player.leagueThirdPlace,
          // Round-level statistics
          roundChampionships: player.roundChampionships,
          roundRunnerUp: player.roundRunnerUp,
          roundThirdPlace: player.roundThirdPlace,
          // Game statistics
          totalLeagues: player.totalLeagues,
          totalRounds: player.totalRounds,
          // Average and win rate statistics
          roundAveragePlacement: player.roundAveragePlacement,
          roundWinRate: player.roundWinRate,
          // Compatibility fields
          championships: player.championships,
          runner_up: player.runner_up,
          third_place: player.third_place,
          total_games: player.total_games,
          average_placement: player.average_placement,
          win_rate: player.win_rate
        });
        return [
          // Update players table
          supabase.from("players").update(playerUpdateData).match({ id: player.id, app_id: appId })
        ];
      }).flat();
      await Promise.all(statisticsUpdates);
      let finalLeagueState = {
        ...leagueState,
        current_round: nextRound,
        status: newStatus,
        winner: finalWinner,
        end_date: (/* @__PURE__ */ new Date()).toISOString()
      };
      await saveLeagueToHistory(finalLeagueState, playersWithUpdatedStats);
    }
    setShowResultsModal(!1), setCardDrawRound(leagueState.current_round), setShowCardDrawReminder(!0);
  }, renderInProgress = () => {
    if (!leagueState)
      return /* @__PURE__ */ jsx18("div", { className: "text-white", children: "\u52A0\u8F7D\u4E2D..." });
    if (leagueState.status === "setup")
      return setCurrentPage("league"), /* @__PURE__ */ jsx18("div", { className: "text-white", children: "\u91CD\u5B9A\u5411\u5230\u8054\u8D5B\u7BA1\u7406..." });
    if (leagueState.status === "finished")
      return /* @__PURE__ */ jsx18("div", { className: "space-y-4 sm:space-y-6", children: /* @__PURE__ */ jsxs17("div", { className: `text-center p-6 sm:p-8 lg:p-10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg flex flex-col items-center gap-3 sm:gap-4 border-2 border-yellow-400 ${theme === "dark" ? "bg-gray-800/70" : "bg-white/80"}`, children: [
        /* @__PURE__ */ jsx18(LucideCrown5, { className: "text-yellow-400", size: 60 }),
        /* @__PURE__ */ jsxs17("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx18("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-300", children: leagueState.league_name || "\u8054\u8D5B\u7ED3\u675F\uFF01" }),
          leagueState.season_number && /* @__PURE__ */ jsxs17("p", { className: `text-lg sm:text-xl mt-2 ${theme === "dark" ? "text-yellow-400/80" : "text-yellow-600"}`, children: [
            "Season ",
            leagueState.season_number,
            " \u5B8C\u6210"
          ] })
        ] }),
        leagueState.winner && /* @__PURE__ */ jsxs17(Fragment3, { children: [
          /* @__PURE__ */ jsx18("div", { className: "text-4xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4", children: leagueState.winner.avatar }),
          /* @__PURE__ */ jsx18("p", { className: `text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.winner.name }),
          /* @__PURE__ */ jsx18("p", { className: `text-base sm:text-lg lg:text-xl mt-2 px-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: leagueState.winner.reason })
        ] }),
        /* @__PURE__ */ jsx18(
          "button",
          {
            onClick: handleResetLeague,
            className: "mt-6 sm:mt-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base",
            children: "\u5F00\u542F\u65B0\u8054\u8D5B"
          }
        )
      ] }) });
    if (!leagueState.schedule || leagueState.schedule.length === 0)
      return /* @__PURE__ */ jsx18("div", { className: "text-white", children: "\u52A0\u8F7D\u4E2D..." });
    let currentRoundConfig = leagueState.schedule[leagueState.current_round - 1];
    return currentRoundConfig ? /* @__PURE__ */ jsxs17("div", { className: "space-y-4 sm:space-y-6", children: [
      /* @__PURE__ */ jsxs17("div", { className: `backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
        /* @__PURE__ */ jsxs17("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6", children: [
          /* @__PURE__ */ jsxs17("div", { className: "flex items-center gap-3 sm:gap-4", children: [
            /* @__PURE__ */ jsx18("div", { className: `p-2.5 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsx18(LucideTrophy6, { className: "text-orange-400", size: 22 }) }),
            /* @__PURE__ */ jsxs17("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx18("h1", { className: `${TYPOGRAPHY.COMBINATIONS.pageTitle} ${theme === "dark" ? "text-white/95" : "text-gray-900"} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`, children: leagueState.league_name || "Boom League" }),
              /* @__PURE__ */ jsxs17("div", { className: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1", children: [
                leagueState.season_number && /* @__PURE__ */ jsxs17("p", { className: `${TYPOGRAPHY.COMBINATIONS.bodySmall} ${theme === "dark" ? "text-white/60" : "text-gray-600"} ${LINE_HEIGHTS.normal}`, children: [
                  "Season ",
                  leagueState.season_number
                ] }),
                leagueState.season_number && leagueState.created_at && /* @__PURE__ */ jsx18("span", { className: `hidden sm:inline ${TYPOGRAPHY.COMBINATIONS.bodySmall} ${theme === "dark" ? "text-white/40" : "text-gray-400"}`, children: "\u2022" }),
                leagueState.created_at && /* @__PURE__ */ jsxs17("p", { className: `${TYPOGRAPHY.COMBINATIONS.bodySmall} ${theme === "dark" ? "text-white/60" : "text-gray-600"} ${LINE_HEIGHTS.normal}`, children: [
                  "\u521B\u5EFA\u4E8E ",
                  new Date(leagueState.created_at).toLocaleDateString("zh-CN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs17("div", { className: "flex items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxs17(
              "button",
              {
                onClick: handleBackToLeagueManagement,
                className: `flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg ${TYPOGRAPHY.COMBINATIONS.button} transition-all duration-200 ${theme === "dark" ? "bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/50" : "bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 hover:text-gray-900 border border-gray-300/50"} ${LINE_HEIGHTS.tight}`,
                children: [
                  /* @__PURE__ */ jsx18(LucideChevronLeft2, { size: 16 }),
                  /* @__PURE__ */ jsx18("span", { className: "hidden xs:inline", children: "\u8FD4\u56DE\u7BA1\u7406" }),
                  /* @__PURE__ */ jsx18("span", { className: "xs:hidden", children: "\u8FD4\u56DE" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs17(
              "button",
              {
                onClick: () => {
                  window.confirm(`\u786E\u5B9A\u8981\u4E2D\u6B62\u5F53\u524D\u8054\u8D5B\u5417\uFF1F

\u2022 \u5F53\u524D\u8054\u8D5B\u5C06\u88AB\u5220\u9664
\u2022 \u5982\u679C\u5DF2\u8FDB\u884C\u591A\u8F6E\u6BD4\u8D5B\uFF0C\u8FDB\u5EA6\u5C06\u4FDD\u5B58\u5230\u5386\u53F2\u8BB0\u5F55
\u2022 \u73A9\u5BB6\u5206\u6570\u5C06\u88AB\u91CD\u7F6E
\u2022 \u60A8\u5C06\u8FD4\u56DE\u5230\u8054\u8D5B\u7BA1\u7406\u4E3B\u9875`) && handleAbortLeague();
                },
                className: `flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg ${TYPOGRAPHY.COMBINATIONS.button} transition-all duration-200 ${theme === "dark" ? "bg-red-900/30 hover:bg-red-800/40 text-red-400 hover:text-red-300 border border-red-800/50" : "bg-red-100/50 hover:bg-red-200/50 text-red-700 hover:text-red-800 border border-red-300/50"} ${LINE_HEIGHTS.tight}`,
                children: [
                  /* @__PURE__ */ jsx18(LucideX3, { size: 16 }),
                  /* @__PURE__ */ jsx18("span", { className: "hidden xs:inline", children: "\u4E2D\u6B62\u8054\u8D5B" }),
                  /* @__PURE__ */ jsx18("span", { className: "xs:hidden", children: "\u4E2D\u6B62" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs17("div", { className: `flex items-center justify-between p-3 sm:p-4 rounded-lg ${theme === "dark" ? "bg-white/5 border border-white/10" : "bg-gray-100/50 border border-gray-200"}`, children: [
          /* @__PURE__ */ jsxs17("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx18("div", { className: `p-1.5 rounded-lg ${theme === "dark" ? "bg-green-500/20 border-green-500/30" : "bg-green-100 border-green-200"} border`, children: /* @__PURE__ */ jsx18(LucideGamepad22, { className: "text-green-500", size: 18 }) }),
            /* @__PURE__ */ jsxs17("div", { children: [
              /* @__PURE__ */ jsx18("p", { className: `${TYPOGRAPHY.COMBINATIONS.emphasized} ${theme === "dark" ? "text-white/90" : "text-gray-900"} ${LINE_HEIGHTS.tight}`, children: "\u8054\u8D5B\u8FDB\u884C\u4E2D" }),
              /* @__PURE__ */ jsxs17("p", { className: `${TYPOGRAPHY.COMBINATIONS.caption} ${theme === "dark" ? "text-white/60" : "text-gray-600"} ${LINE_HEIGHTS.normal}`, children: [
                "\u7B2C ",
                leagueState.current_round,
                " \u8F6E / \u5171 ",
                GAME_RULES.MAX_ROUNDS,
                " \u8F6E"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs17("div", { className: `px-3 py-1.5 rounded-lg ${TYPOGRAPHY.COMBINATIONS.badge} ${theme === "dark" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-green-100 text-green-700 border border-green-200"} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.wide}`, children: [
            "ROUND ",
            leagueState.current_round
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx18(Leaderboard_default, { players, onPlayerClick: handlePlayerClick }),
      /* @__PURE__ */ jsxs17("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6", children: [
        /* @__PURE__ */ jsx18("div", { className: "flex flex-col gap-4 sm:gap-6", children: /* @__PURE__ */ jsxs17("div", { className: `backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
          /* @__PURE__ */ jsxs17("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6", children: [
            /* @__PURE__ */ jsxs17("h2", { className: `${TYPOGRAPHY.COMBINATIONS.sectionTitle} text-orange-400 ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`, children: [
              "\u7B2C ",
              leagueState.current_round,
              " / ",
              GAME_RULES.MAX_ROUNDS,
              " \u8F6E"
            ] }),
            /* @__PURE__ */ jsxs17(
              "button",
              {
                onClick: () => setShowResultsModal(!0),
                className: `bg-green-500 hover:bg-green-600 active:bg-green-700 text-white ${TYPOGRAPHY.COMBINATIONS.button} py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${LINE_HEIGHTS.tight}`,
                children: [
                  /* @__PURE__ */ jsx18(LucideClipboardList, { size: 18, className: "flex-shrink-0" }),
                  /* @__PURE__ */ jsx18("span", { className: "hidden xs:inline", children: "\u8F93\u5165\u672C\u8F6E\u7ED3\u679C" }),
                  /* @__PURE__ */ jsx18("span", { className: "xs:hidden", children: "\u7ED3\u679C" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs17("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base lg:text-lg", children: [
            /* @__PURE__ */ jsx18(InfoCard_default, { icon: /* @__PURE__ */ jsx18(LucideShield3, { className: "text-blue-400" }), title: "\u5B89\u5168\u724C\u6570\u91CF", value: currentRoundConfig.safeCards }),
            /* @__PURE__ */ jsx18(InfoCard_default, { icon: /* @__PURE__ */ jsx18(LucideBomb4, { className: "text-red-400" }), title: "\u70B8\u5F39\u724C\u6570\u91CF", value: currentRoundConfig.bombCards }),
            /* @__PURE__ */ jsx18(InfoCard_default, { icon: /* @__PURE__ */ jsx18(LucideSwords3, { className: "text-yellow-400" }), title: "\u51FA\u6218\u624B\u724C\u4E0A\u9650", value: currentRoundConfig.handLimit === 1 / 0 ? "\u65E0\u9650\u5236" : currentRoundConfig.handLimit }),
            /* @__PURE__ */ jsx18(InfoCard_default, { icon: /* @__PURE__ */ jsx18(LucideTrophy6, { className: "text-green-400" }), title: "VP \u5956\u52B1\u6A21\u5F0F", value: currentRoundConfig.vpMode.name }),
            /* @__PURE__ */ jsx18(InfoCard_default, { icon: /* @__PURE__ */ jsx18(LucideDices3, { className: "text-purple-400" }), title: "\u7279\u6B8A\u89C4\u5219", value: currentRoundConfig.specialRule })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx18("div", { className: "flex flex-col gap-4 sm:gap-6", children: /* @__PURE__ */ jsx18(ScheduleTimeline_default, { schedule: leagueState.schedule, currentRound: leagueState.current_round }) })
      ] })
    ] }) : /* @__PURE__ */ jsx18("div", { className: "text-white", children: "\u6BD4\u8D5B\u7ED3\u675F\uFF01" });
  }, renderCurrentPage = () => {
    if (!isAuthReady)
      return /* @__PURE__ */ jsx18("div", { className: "text-center text-2xl p-8", children: "\u6B63\u5728\u8FDE\u63A5\u670D\u52A1\u5668..." });
    if (leagueState && leagueState.status === "pending_confirmation")
      return /* @__PURE__ */ jsx18(
        ScheduleConfirmationPage_default,
        {
          leagueState,
          players,
          onConfirmSchedule: handleConfirmSchedule,
          onRerollSchedule: handleRerollSchedule
        }
      );
    switch (currentPage) {
      case "home":
        return /* @__PURE__ */ jsx18(
          HomePage_default,
          {
            leagueState,
            players,
            handleStartLeague,
            handleResetLeague,
            handlePlayerClick,
            setCurrentPage
          }
        );
      case "registration":
        return /* @__PURE__ */ jsx18(
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
        return /* @__PURE__ */ jsx18(
          LeagueManagementPage_default,
          {
            leagueState,
            players,
            handleStartLeague,
            handleResetLeague,
            currentLeagueName,
            setCurrentLeagueName,
            nextSeasonNumber,
            leagueHistory,
            setCurrentPage
          }
        );
      case "in_progress":
        return renderInProgress();
      case "rankings":
        return /* @__PURE__ */ jsx18(
          PlayerRankingsPage_default,
          {
            players,
            onPlayerClick: handlePlayerClick
          }
        );
      case "history":
        return /* @__PURE__ */ jsx18(
          LeagueHistoryPage_default,
          {
            leagueHistory
          }
        );
      default:
        return /* @__PURE__ */ jsx18(
          HomePage_default,
          {
            leagueState,
            players,
            handleStartLeague,
            handleResetLeague,
            handlePlayerClick,
            setCurrentPage
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
  return /* @__PURE__ */ jsx18(ThemeContext.Provider, { value: { theme, toggleTheme }, children: /* @__PURE__ */ jsxs17("div", { className: themeClasses.container, children: [
    /* @__PURE__ */ jsx18("div", { className: themeClasses.background }),
    /* @__PURE__ */ jsx18("div", { className: themeClasses.radialGlow1 }),
    /* @__PURE__ */ jsx18("div", { className: themeClasses.radialGlow2 }),
    /* @__PURE__ */ jsx18("div", { className: themeClasses.pattern }),
    /* @__PURE__ */ jsx18(
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
        setMusicMuted
      }
    ),
    /* @__PURE__ */ jsxs17("div", { className: `flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} relative`, children: [
      /* @__PURE__ */ jsxs17("header", { className: `lg:hidden flex items-center justify-between p-3 sm:p-4 border-b ${theme === "dark" ? "border-white/10 bg-black/40" : "border-gray-200/50 bg-white/80"} backdrop-blur-2xl sticky top-0 z-40`, children: [
        /* @__PURE__ */ jsx18(
          "button",
          {
            onClick: () => setSidebarOpen(!0),
            className: `p-2 sm:p-2.5 rounded-lg transition-all duration-200 border border-transparent active:scale-95 ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
            children: /* @__PURE__ */ jsx18(LucideMenu2, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxs17("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx18("div", { className: "p-1.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg", children: /* @__PURE__ */ jsx18(LucideCat3, { className: "text-orange-400", size: 16 }) }),
          /* @__PURE__ */ jsx18("h1", { className: `text-sm sm:text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} tracking-tight`, children: "Boom League" })
        ] }),
        /* @__PURE__ */ jsx18("div", { className: "w-8 sm:w-10" }),
        " "
      ] }),
      /* @__PURE__ */ jsx18("main", { className: "p-3 sm:p-4 md:p-6 lg:p-8 relative z-10 min-h-screen", children: renderCurrentPage() })
    ] }),
    showPlayerModal && /* @__PURE__ */ jsx18(Modal_default, { onClose: () => setShowPlayerModal(!1), title: "Add New Player", children: /* @__PURE__ */ jsxs17("div", { children: [
      /* @__PURE__ */ jsxs17("div", { className: "mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx18("label", { className: `font-medium mb-2 block text-sm ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "Player Name" }),
        /* @__PURE__ */ jsx18(
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
      /* @__PURE__ */ jsxs17("div", { className: "mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx18("label", { className: `font-medium mb-2 sm:mb-3 block text-sm ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "Choose Avatar" }),
        /* @__PURE__ */ jsx18("div", { className: `grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-40 sm:max-h-48 overflow-y-auto p-3 sm:p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50/80 border-gray-200"}`, children: GAME_RULES.AVATARS.map((avatar, index) => /* @__PURE__ */ jsx18(
          "button",
          {
            onClick: () => setSelectedAvatar(avatar),
            className: `text-lg sm:text-xl p-2 sm:p-2.5 rounded-lg transition-all duration-200 border active:scale-95 ${selectedAvatar === avatar ? "bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.3)] scale-110" : theme === "dark" ? "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105" : "bg-white/50 border-gray-200 hover:bg-gray-100/50 hover:scale-105"}`,
            children: avatar
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs17(
        "button",
        {
          onClick: handleAddPlayer,
          className: "relative group w-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 active:from-emerald-500/40 active:to-emerald-600/40 text-emerald-400 font-semibold py-3 sm:py-4 px-6 rounded-lg border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98]",
          children: [
            /* @__PURE__ */ jsxs17("span", { className: "relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base", children: [
              /* @__PURE__ */ jsx18(LucidePlus2, { size: 18 }),
              "Add Player"
            ] }),
            /* @__PURE__ */ jsx18("div", { className: "absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" })
          ]
        }
      )
    ] }) }),
    showResultsModal && leagueState && /* @__PURE__ */ jsx18(
      ResultsModal_default,
      {
        players,
        onClose: () => setShowResultsModal(!1),
        onSubmit: handleAdvanceRound,
        round: leagueState.current_round
      }
    ),
    showPlayerProfileModal && selectedPlayerForProfile && /* @__PURE__ */ jsx18(
      PlayerProfileModal_default,
      {
        player: selectedPlayerForProfile,
        onClose: () => {
          setShowPlayerProfileModal(!1), setSelectedPlayerForProfile(null);
        }
      }
    ),
    showCardDrawReminder && /* @__PURE__ */ jsx18(
      CardDrawReminder_default,
      {
        players,
        round: cardDrawRound,
        onClose: () => setShowCardDrawReminder(!1)
      }
    ),
    !musicMuted && /* @__PURE__ */ jsx18(
      "iframe",
      {
        width: "1",
        height: "1",
        src: `https://www.youtube.com/embed/FeJKBFWYB0o?autoplay=${musicPlaying ? "1" : "0"}&loop=1&playlist=FeJKBFWYB0o&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&volume=30`,
        title: "Background Music",
        frameBorder: "0",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        className: "fixed top-0 left-0 opacity-0 pointer-events-none",
        style: { width: "1px", height: "1px", position: "fixed", top: "-9999px", left: "-9999px" }
      }
    ),
    /* @__PURE__ */ jsx18(
      "iframe",
      {
        ref: (el) => {
          el && (window.happySoundIframe = el);
        },
        width: "0",
        height: "0",
        src: "https://www.youtube.com/embed/NSU2hJ5wT08?controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&mute=1&start=0&enablejsapi=1",
        title: "Happy Sound Effect",
        frameBorder: "0",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        style: { display: "none", position: "absolute", left: "-9999px", top: "-9999px" }
      }
    )
  ] }) });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-LTJR4HYY.js", imports: ["/build/_shared/chunk-WMJWS4EP.js", "/build/_shared/chunk-TANAHWHW.js", "/build/_shared/chunk-ADMCF34Z.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-PX5GHZ7G.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-OOOLSUUR.js", imports: ["/build/_shared/chunk-5EDNXG7T.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "0a4b990e", hmr: void 0, url: "/build/manifest-0A4B990E.js" };

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
