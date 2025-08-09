import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, Scripts, LiveReload } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { LucideCat, LucideChevronRight, LucideChevronLeft, LucideX, LucideHome, LucideUserPlus, LucideGamepad2, LucideBarChart3, LucideSun, LucideMoon, LucideBook, LucideTrophy, LucideScrollText, LucideShield, LucideBomb, LucideSwords, LucideAlertTriangle, LucideUsers, LucideCrown, LucidePlus, LucideTrash2, LucideSettings, LucideCheck, LucidePlay, LucideCalendar, LucideHistory, LucideMedal, LucideAward, LucideTarget, LucideDices, LucideZap, LucideGem, LucidePercent, LucideDice6, LucideMenu, LucideClipboardList } from "lucide-react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
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
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
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
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
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
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const stylesheet = "/assets/tailwind-mxdHHp_Q.css";
const links = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bangers&family=Noto+Sans+SC:wght@400;700&display=swap" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(Scripts, {}),
      /* @__PURE__ */ jsx(LiveReload, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
const GAME_RULES = {
  WIN_SCORE: 12,
  MAX_ROUNDS: 5,
  VP_MODES: [
    { name: "5分局 (5/3/1)", scores: [5, 3, 1, 0, 0, 0] },
    { name: "5分局 (5/4/3)", scores: [5, 4, 3, 0, 0, 0] },
    { name: "4分局 (4/2/1)", scores: [4, 2, 1, 0, 0, 0] },
    { name: "4分局 (4/3/2)", scores: [4, 3, 2, 0, 0, 0] },
    { name: "3分局 (3/2/1)", scores: [3, 2, 1, 0, 0, 0] },
    { name: "3分局 (3/1/0)", scores: [3, 1, 0, 0, 0, 0] }
  ],
  SPECIAL_RULES: [
    "无特殊规则",
    "手牌明牌",
    "禁止携带 Skip",
    "所有猫牌视为 Skip",
    "至多携带1张skip",
    "至多携带1张defuse",
    "禁止携带attack",
    "至多携带1张attack",
    "1次免费see the future (x3)",
    "3-of-a-kind：打出三张同名牌，指定并索取目标玩家的该牌，若无则无效。",
    "任意2张相同的牌都可以打出steal一名玩家的手牌",
    "所有猫牌视为nope",
    "Tacocat=Reverse",
    "Ralphing Rainbow Cat= attack (2x)",
    "Beard Cat=Alter the future×3",
    "Zombie cat = defuse",
    "增强mark：若被标记的牌未在下回合打出，则自动归你。"
  ],
  // 互斥规则定义
  RULE_CONFLICTS: {
    "无特殊规则": ["手牌明牌", "禁止携带 Skip", "所有猫牌视为 Skip", "至多携带1张skip", "至多携带1张defuse", "禁止携带attack", "至多携带1张attack", "1次免费see the future (x3)", "3-of-a-kind：打出三张同名牌，指定并索取目标玩家的该牌，若无则无效。", "任意2张相同的牌都可以打出steal一名玩家的手牌", "所有猫牌视为nope", "Tacocat=Reverse", "Ralphing Rainbow Cat= attack (2x)", "Beard Cat=Alter the future×3", "Zombie cat = defuse", "增强mark：若被标记的牌未在下回合打出，则自动归你。"],
    "禁止携带 Skip": ["所有猫牌视为 Skip", "至多携带1张skip"],
    "所有猫牌视为 Skip": ["禁止携带 Skip", "至多携带1张skip"],
    "至多携带1张skip": ["禁止携带 Skip", "所有猫牌视为 Skip"],
    "禁止携带attack": ["至多携带1张attack", "Ralphing Rainbow Cat= attack (2x)"],
    "至多携带1张attack": ["禁止携带attack", "Ralphing Rainbow Cat= attack (2x)"],
    "Ralphing Rainbow Cat= attack (2x)": ["禁止携带attack", "至多携带1张attack"],
    "至多携带1张defuse": ["Zombie cat = defuse"],
    "Zombie cat = defuse": ["至多携带1张defuse"]
  },
  AVATARS: [
    "😼",
    "😻",
    "🙀",
    "😿",
    "😾",
    "😸",
    "😹",
    "😺",
    "😽",
    "🐱",
    "🐈",
    "🐈‍⬛",
    "🦁",
    "🐅",
    "🐆",
    "🐯",
    "🙈",
    "🙉",
    "🙊",
    "🐵",
    "🦊",
    "🐺",
    "🐶",
    "🐕",
    "🦝",
    "🐨",
    "🐼",
    "🐹",
    "🐭",
    "🐰",
    "🐻",
    "🐻‍❄️",
    "🐸",
    "🐲",
    "🦄",
    "🎭"
  ]
};
const SUPABASE_CONFIG = {
  url: "https://gatiuwpldvmxeeraldue.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdGl1d3BsZHZteGVlcmFsZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MDAwNjQsImV4cCI6MjA3MDI3NjA2NH0.Ncs_pWIXZJ5gVw9PasggTAGWgQX9OnUGTnpjHg1eZvE"
};
const UTILS = {
  getRandomElement: (arr) => arr[Math.floor(Math.random() * arr.length)],
  calculatePlayerStats: (player) => {
    const history = player.history || [];
    const totalGames = history.length;
    const placements = history.reduce((acc, game) => {
      acc[game.placement] = (acc[game.placement] || 0) + 1;
      return acc;
    }, {});
    const averagePlacement = totalGames > 0 ? (history.reduce((sum, game) => sum + game.placement, 0) / totalGames).toFixed(1) : "N/A";
    const winRate = totalGames > 0 ? ((placements[1] || 0) / totalGames * 100).toFixed(1) : "0";
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
  updatePlayerStatistics: (player) => {
    return {
      ...player,
      totalGames: player.totalGames || 0,
      averagePlacement: player.averagePlacement || 0,
      winRate: player.winRate || 0
    };
  },
  // Calculate and update league-level statistics when a league finishes
  updateLeagueStatistics: (players, leagueResults) => {
    const updatedPlayers = [...players];
    leagueResults.forEach((result) => {
      const player = updatedPlayers.find((p) => p.id === result.playerId);
      if (!player) return;
      player.total_games = (player.total_games || 0) + 1;
      if (result.finalPlacement === 1) {
        player.championships = (player.championships || 0) + 1;
      } else if (result.finalPlacement === 2) {
        player.runner_up = (player.runner_up || 0) + 1;
      } else if (result.finalPlacement === 3) {
        player.third_place = (player.third_place || 0) + 1;
      }
      player.leagueChampionships = player.championships;
      player.leagueRunnerUp = player.runner_up;
      player.leagueThirdPlace = player.third_place;
      player.totalLeagues = player.total_games;
      player.totalGames = player.total_games;
    });
    return updatedPlayers;
  },
  // Calculate and update round-level statistics when a round finishes
  updateRoundStatistics: (players, roundResults) => {
    const updatedPlayers = [...players];
    roundResults.forEach((result) => {
      const player = updatedPlayers.find((p) => p.id === result.playerId);
      if (!player) return;
      const totalRounds = (player.history || []).length;
      if (result.placement === 1) {
        player.single_round_firsts = (player.single_round_firsts || 0) + 1;
      } else if (result.placement === 2) {
        player.single_round_seconds = (player.single_round_seconds || 0) + 1;
      } else if (result.placement === 3) {
        player.single_round_thirds = (player.single_round_thirds || 0) + 1;
      }
      if (player.history && player.history.length > 0) {
        const totalPlacementSum = player.history.reduce((sum, h) => sum + h.placement, 0);
        player.average_placement = parseFloat((totalPlacementSum / player.history.length).toFixed(2));
      } else {
        player.average_placement = result.placement;
      }
      const roundWins = (player.single_round_firsts || 0) + (player.single_round_seconds || 0) + (player.single_round_thirds || 0);
      player.win_rate = totalRounds > 0 ? parseFloat((roundWins / totalRounds * 100).toFixed(1)) : 0;
      player.roundChampionships = player.single_round_firsts;
      player.roundRunnerUp = player.single_round_seconds;
      player.roundThirdPlace = player.single_round_thirds;
      player.totalRounds = totalRounds;
      player.roundAveragePlacement = player.average_placement;
      player.roundWinRate = player.win_rate;
      player.averagePlacement = player.average_placement;
      player.winRate = player.win_rate;
    });
    return updatedPlayers;
  }
};
const calculatePlayerRankings = (players) => {
  if (!players || players.length === 0) return [];
  const playersWithRankings = [...players];
  const calculateRanking = (statGetter, descending = true) => {
    const values = players.map(statGetter);
    const sortedUniqueValues = [...new Set(values)].sort(
      (a, b) => descending ? b - a : a - b
    );
    return values.map((value) => {
      const rank = sortedUniqueValues.indexOf(value) + 1;
      return rank;
    });
  };
  const championshipsRanks = calculateRanking((p) => p.championships || 0);
  const runnerUpRanks = calculateRanking((p) => p.runner_up || 0);
  const thirdPlaceRanks = calculateRanking((p) => p.third_place || 0);
  const singleRoundFirstsRanks = calculateRanking((p) => p.single_round_firsts || 0);
  const singleRoundSecondsRanks = calculateRanking((p) => p.single_round_seconds || 0);
  const singleRoundThirdsRanks = calculateRanking((p) => p.single_round_thirds || 0);
  const totalVPRanks = calculateRanking((p) => p.total_vp || 0);
  const totalGamesRanks = calculateRanking((p) => p.total_games || 0);
  const averagePlacementRanks = calculateRanking(
    (p) => p.average_placement || 999,
    // Use 999 as default for players with no games
    false
    // ascending order (lower average placement is better)
  );
  const winRateRanks = calculateRanking((p) => p.win_rate || 0);
  playersWithRankings.forEach((player, index) => {
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
  });
  return playersWithRankings;
};
const getRankingSuffix = (rank) => {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
};
const getRankingColorClass = (rank) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-300";
  if (rank === 3) return "text-orange-400";
  if (rank <= 5) return "text-blue-400";
  if (rank <= 10) return "text-green-400";
  return "text-gray-500";
};
const playerToSupabase = (player) => {
  const supabasePlayer = {};
  if (player.id !== void 0) supabasePlayer.id = player.id;
  if (player.app_id !== void 0) supabasePlayer.app_id = player.app_id;
  if (player.name !== void 0) supabasePlayer.name = player.name;
  if (player.avatar !== void 0) supabasePlayer.avatar = player.avatar;
  if (player.score !== void 0) supabasePlayer.score = player.score;
  if (player.history !== void 0) supabasePlayer.history = player.history;
  if (player.championships !== void 0) supabasePlayer.championships = player.championships;
  if (player.runner_up !== void 0) supabasePlayer.runner_up = player.runner_up;
  if (player.third_place !== void 0) supabasePlayer.third_place = player.third_place;
  if (player.total_vp !== void 0) supabasePlayer.total_vp = player.total_vp;
  if (player.total_games !== void 0) supabasePlayer.total_games = player.total_games;
  if (player.average_placement !== void 0) supabasePlayer.average_placement = player.average_placement;
  if (player.win_rate !== void 0) supabasePlayer.win_rate = player.win_rate;
  if (player.single_round_firsts !== void 0) supabasePlayer.single_round_firsts = player.single_round_firsts;
  if (player.single_round_seconds !== void 0) supabasePlayer.single_round_seconds = player.single_round_seconds;
  if (player.single_round_thirds !== void 0) supabasePlayer.single_round_thirds = player.single_round_thirds;
  if (player.created_at !== void 0) supabasePlayer.created_at = player.created_at;
  if (player.updated_at !== void 0) supabasePlayer.updated_at = player.updated_at;
  if (player.leagueChampionships !== void 0) supabasePlayer.championships = player.leagueChampionships;
  if (player.leagueRunnerUp !== void 0) supabasePlayer.runner_up = player.leagueRunnerUp;
  if (player.leagueThirdPlace !== void 0) supabasePlayer.third_place = player.leagueThirdPlace;
  if (player.roundChampionships !== void 0) supabasePlayer.single_round_firsts = player.roundChampionships;
  if (player.roundRunnerUp !== void 0) supabasePlayer.single_round_seconds = player.roundRunnerUp;
  if (player.roundThirdPlace !== void 0) supabasePlayer.single_round_thirds = player.roundThirdPlace;
  if (player.totalVP !== void 0) supabasePlayer.total_vp = player.totalVP;
  if (player.totalLeagues !== void 0) supabasePlayer.total_games = player.totalLeagues;
  if (player.roundAveragePlacement !== void 0) supabasePlayer.average_placement = player.roundAveragePlacement;
  if (player.roundWinRate !== void 0) supabasePlayer.win_rate = player.roundWinRate;
  if (player.totalGames !== void 0) supabasePlayer.total_games = player.totalGames;
  if (player.averagePlacement !== void 0) supabasePlayer.average_placement = player.averagePlacement;
  if (player.winRate !== void 0) supabasePlayer.win_rate = player.winRate;
  return supabasePlayer;
};
const playerFromSupabase = (supabasePlayer) => {
  const totalRounds = supabasePlayer.history ? supabasePlayer.history.length : 0;
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
};
const leagueStateToSupabase = (leagueState) => {
  const supabaseLeagueState = {};
  if (leagueState.app_id !== void 0) supabaseLeagueState.app_id = leagueState.app_id;
  if (leagueState.status !== void 0) supabaseLeagueState.status = leagueState.status;
  if (leagueState.current_round !== void 0) supabaseLeagueState.current_round = leagueState.current_round;
  if (leagueState.schedule !== void 0) supabaseLeagueState.schedule = leagueState.schedule;
  if (leagueState.winner !== void 0) supabaseLeagueState.winner = leagueState.winner;
  if (leagueState.league_name !== void 0) supabaseLeagueState.league_name = leagueState.league_name;
  if (leagueState.season_number !== void 0) supabaseLeagueState.season_number = leagueState.season_number;
  if (leagueState.start_date !== void 0) supabaseLeagueState.start_date = leagueState.start_date;
  if (leagueState.end_date !== void 0) supabaseLeagueState.end_date = leagueState.end_date;
  if (leagueState.created_at !== void 0) supabaseLeagueState.created_at = leagueState.created_at;
  if (leagueState.selected_special_rules !== void 0) supabaseLeagueState.selected_special_rules = leagueState.selected_special_rules;
  return supabaseLeagueState;
};
const leagueStateFromSupabase = (supabaseLeagueState) => {
  return {
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
  };
};
const leagueHistoryToSupabase = (leagueHistory) => {
  const supabaseLeagueHistory = {};
  if (leagueHistory.id !== void 0) supabaseLeagueHistory.id = leagueHistory.id;
  if (leagueHistory.app_id !== void 0) supabaseLeagueHistory.app_id = leagueHistory.app_id;
  if (leagueHistory.league_name !== void 0) supabaseLeagueHistory.league_name = leagueHistory.league_name;
  if (leagueHistory.season_number !== void 0) supabaseLeagueHistory.season_number = leagueHistory.season_number;
  if (leagueHistory.start_date !== void 0) supabaseLeagueHistory.start_date = leagueHistory.start_date;
  if (leagueHistory.end_date !== void 0) supabaseLeagueHistory.end_date = leagueHistory.end_date;
  if (leagueHistory.winner !== void 0) supabaseLeagueHistory.winner = leagueHistory.winner;
  if (leagueHistory.final_standings !== void 0) supabaseLeagueHistory.final_standings = leagueHistory.final_standings;
  if (leagueHistory.total_rounds !== void 0) supabaseLeagueHistory.total_rounds = leagueHistory.total_rounds;
  if (leagueHistory.total_players !== void 0) supabaseLeagueHistory.total_players = leagueHistory.total_players;
  if (leagueHistory.created_at !== void 0) supabaseLeagueHistory.created_at = leagueHistory.created_at;
  return supabaseLeagueHistory;
};
const leagueHistoryFromSupabase = (supabaseLeagueHistory) => {
  return {
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
  };
};
const leagueHistoryArrayFromSupabase = (supabaseLeagueHistory) => {
  return supabaseLeagueHistory.map(leagueHistoryFromSupabase);
};
const ThemeContext = createContext(void 0);
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
const TYPOGRAPHY = {
  // Responsive combinations for common use cases
  COMBINATIONS: {
    // Page titles
    pageTitle: "text-2xl sm:text-3xl font-bold",
    // Section headings
    sectionTitle: "text-xl sm:text-2xl font-semibold",
    // Card titles
    cardTitle: "text-lg sm:text-xl font-semibold",
    bodySmall: "text-xs sm:text-sm font-normal",
    // Emphasized text
    emphasized: "text-sm sm:text-base font-medium",
    caption: "text-xs font-normal",
    // Button text
    buttonLarge: "text-base font-semibold",
    button: "text-sm font-semibold",
    navTitle: "text-base font-semibold",
    // Status and badges
    badge: "text-xs font-semibold",
    // Numbers and stats
    statNumber: "text-lg sm:text-xl font-bold",
    statLabel: "text-xs sm:text-sm font-medium",
    // Modal and dialog
    modalTitle: "text-xl font-semibold",
    modalBody: "text-sm font-normal",
    sidebarItem: "text-sm font-medium",
    sidebarCaption: "text-xs font-normal"
  }
};
const LINE_HEIGHTS = {
  tight: "leading-tight",
  // 1.375 - For large text
  normal: "leading-normal"
};
const LETTER_SPACING = {
  // -0.05em
  tight: "tracking-tight",
  // 0em
  wide: "tracking-wide"
};
const Sidebar = ({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed
}) => {
  const { theme, toggleTheme } = useTheme();
  const handleRulebookClick = () => {
    window.open("https://docs.google.com/document/d/1zJaKW7T4Lz0537q-SPOSN5mYH0btt6K8Yvd6craN504/edit?usp=sharing", "_blank");
  };
  const menuItems = [
    { id: "home", name: "首页", icon: LucideHome },
    { id: "registration", name: "玩家注册", icon: LucideUserPlus },
    { id: "league", name: "联赛管理", icon: LucideGamepad2 },
    { id: "rankings", name: "排行榜", icon: LucideBarChart3 }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    sidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
        onClick: () => setSidebarOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `fixed left-0 top-0 h-screen ${theme === "dark" ? "bg-black/40" : "bg-white/80"} backdrop-blur-2xl border-r ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} z-50 transform transition-all duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${sidebarCollapsed ? "w-16 lg:w-16" : "w-72 sm:w-80 md:w-72 lg:w-64"} ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"}`, children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-white/5 to-transparent" : "bg-gradient-to-b from-gray-50/50 to-transparent"}` }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ jsx("div", { className: `relative p-4 sm:p-6 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200/50"}`, children: /* @__PURE__ */ jsxs("div", { className: `flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`, children: [
          !sidebarCollapsed && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "relative p-2 sm:p-2.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_20px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ jsx(LucideCat, { className: "text-orange-400", size: 18 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: `${TYPOGRAPHY.COMBINATIONS.navTitle} ${theme === "dark" ? "text-white/95" : "text-gray-900"} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`, children: "Boom League" }),
              /* @__PURE__ */ jsx("p", { className: `${TYPOGRAPHY.COMBINATIONS.sidebarCaption} ${theme === "dark" ? "text-white/60" : "text-gray-600"} hidden sm:block ${LINE_HEIGHTS.normal}`, children: "Tournament Tracker" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSidebarCollapsed(!sidebarCollapsed),
                className: `hidden lg:flex w-8 h-8 items-center justify-center rounded-md transition-all duration-200 ${theme === "dark" ? "text-white/60 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`,
                title: sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar",
                children: sidebarCollapsed ? /* @__PURE__ */ jsx(LucideChevronRight, { size: 16 }) : /* @__PURE__ */ jsx(LucideChevronLeft, { size: 16 })
              }
            ),
            !sidebarCollapsed && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSidebarOpen(false),
                className: `lg:hidden w-8 h-8 flex items-center justify-center rounded-md transition-colors ${theme === "dark" ? "text-white/60 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`,
                children: /* @__PURE__ */ jsx(LucideX, { size: 16 })
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("nav", { className: `flex-1 ${sidebarCollapsed ? "p-2" : "p-3 sm:p-4"} relative z-10`, children: /* @__PURE__ */ jsx("ul", { className: `space-y-1 sm:space-y-1.5 ${sidebarCollapsed ? "flex flex-col items-center" : ""}`, children: menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setCurrentPage(item.id);
                setSidebarOpen(false);
              },
              className: `group relative ${sidebarCollapsed ? "w-10 h-10" : "w-full"} flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"} px-3 sm:px-4 py-3 sm:py-3 rounded-lg transition-all duration-200 overflow-hidden ${isActive ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.2)]" : theme === "dark" ? "text-white/70 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10" : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent hover:border-gray-200"}`,
              title: sidebarCollapsed ? item.name : void 0,
              children: [
                isActive && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-sm" }),
                /* @__PURE__ */ jsx(Icon, { size: 18, className: "relative z-10 flex-shrink-0" }),
                !sidebarCollapsed && /* @__PURE__ */ jsx("span", { className: `${TYPOGRAPHY.COMBINATIONS.sidebarItem} relative z-10 truncate ${LINE_HEIGHTS.tight}`, children: item.name })
              ]
            }
          ) }, item.id);
        }) }) }),
        /* @__PURE__ */ jsx("div", { className: `relative p-3 sm:p-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} mt-auto`, children: sidebarCollapsed ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: toggleTheme,
              className: `w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
              title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
              children: theme === "dark" ? /* @__PURE__ */ jsx(LucideSun, { size: 14 }) : /* @__PURE__ */ jsx(LucideMoon, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleRulebookClick,
              className: `w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
              title: "Open rulebook (external link)",
              children: /* @__PURE__ */ jsx(LucideBook, { size: 14 })
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: toggleTheme,
                className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
                title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
                children: theme === "dark" ? /* @__PURE__ */ jsx(LucideSun, { size: 16 }) : /* @__PURE__ */ jsx(LucideMoon, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleRulebookClick,
                className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
                title: "Open rulebook (external link)",
                children: /* @__PURE__ */ jsx(LucideBook, { size: 16 })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: `${TYPOGRAPHY.COMBINATIONS.caption} ${theme === "dark" ? "text-white/40" : "text-gray-400"} ${LINE_HEIGHTS.normal} ${LETTER_SPACING.wide}`, children: "Controls" })
        ] }) })
      ] })
    ] })
  ] });
};
const Leaderboard = ({ players, onPlayerClick }) => {
  const { theme } = useTheme();
  return /* @__PURE__ */ jsxs("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-xl sm:rounded-2xl md:rounded-3xl ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-5 sm:p-6 md:p-7 lg:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-7", children: [
        /* @__PURE__ */ jsx("div", { className: "relative p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.2)]", children: /* @__PURE__ */ jsx(LucideTrophy, { size: 18, className: "text-yellow-400 sm:w-5 sm:h-5 md:w-6 md:h-6" }) }),
        /* @__PURE__ */ jsx("h3", { className: `${TYPOGRAPHY.COMBINATIONS.cardTitle} ${theme === "dark" ? "text-white/95" : "text-gray-900"} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight} text-xl sm:text-2xl md:text-3xl`, children: "Leaderboard" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2 sm:space-y-3", children: players.map((p, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `group relative flex items-center justify-between p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98] min-h-touch ${theme === "dark" ? "hover:bg-white/5 hover:border-white/10 active:bg-white/10" : "hover:bg-gray-100/50 hover:border-gray-200 active:bg-gray-200/50"}`,
          onClick: () => onPlayerClick && onPlayerClick(p),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: `relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${TYPOGRAPHY.COMBINATIONS.badge} border flex-shrink-0 ${LINE_HEIGHTS.tight} text-lg sm:text-xl md:text-2xl font-bold ${index === 0 ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : index === 1 ? `bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-gray-400/30 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}` : index === 2 ? "bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-orange-500/30 text-orange-400" : theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600"}`, children: index + 1 }),
              /* @__PURE__ */ jsx("span", { className: "text-2xl sm:text-3xl md:text-4xl flex-shrink-0", children: p.avatar }),
              /* @__PURE__ */ jsx("span", { className: `${TYPOGRAPHY.COMBINATIONS.emphasized} truncate ${theme === "dark" ? "text-white/90" : "text-gray-900"} ${LINE_HEIGHTS.tight} text-lg sm:text-xl md:text-2xl`, children: p.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right flex-shrink-0", children: [
              /* @__PURE__ */ jsx("div", { className: `${TYPOGRAPHY.COMBINATIONS.statNumber} text-emerald-400 ${LINE_HEIGHTS.tight} text-xl sm:text-2xl md:text-3xl font-bold`, children: p.score }),
              /* @__PURE__ */ jsx("div", { className: `${TYPOGRAPHY.COMBINATIONS.statLabel} ${theme === "dark" ? "text-white/60" : "text-gray-500"} ${LINE_HEIGHTS.normal} ${LETTER_SPACING.wide} text-sm sm:text-base`, children: "VP" })
            ] })
          ]
        },
        p.id
      )) })
    ] })
  ] });
};
const InfoCard = ({ icon, title, value }) => {
  const { theme } = useTheme();
  return /* @__PURE__ */ jsxs("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 transition-all duration-200 ${theme === "dark" ? "hover:bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.2)]" : "hover:bg-gray-100/50 shadow-[0_0_30px_rgba(0,0,0,0.1)]"} min-h-touch`, children: [
    /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-xl sm:rounded-2xl` }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-3 sm:gap-4 md:gap-5", children: [
      /* @__PURE__ */ jsx("div", { className: `p-3 sm:p-3.5 md:p-4 backdrop-blur-sm border rounded-xl flex-shrink-0 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"}`, children: /* @__PURE__ */ jsx("div", { className: "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex items-center justify-center", children: icon }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: `${TYPOGRAPHY.COMBINATIONS.statLabel} ${theme === "dark" ? "text-white/60" : "text-gray-500"} truncate ${LINE_HEIGHTS.normal} ${LETTER_SPACING.wide} text-sm sm:text-base md:text-lg`, children: title }),
        /* @__PURE__ */ jsx("p", { className: `${TYPOGRAPHY.COMBINATIONS.statNumber} ${theme === "dark" ? "text-white" : "text-gray-900"} truncate ${LINE_HEIGHTS.tight} text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold`, children: value })
      ] })
    ] })
  ] });
};
const ScheduleTimeline = ({ schedule, currentRound }) => {
  const { theme } = useTheme();
  return /* @__PURE__ */ jsxs("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "relative p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.2)]", children: /* @__PURE__ */ jsx(LucideScrollText, { size: 16, className: "text-indigo-400" }) }),
        /* @__PURE__ */ jsx("h3", { className: `text-lg font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Tournament Schedule" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: schedule.map((roundInfo) => {
        const isActive = roundInfo.round === currentRound;
        return /* @__PURE__ */ jsxs("div", { className: `relative p-4 rounded-lg transition-all duration-300 border ${isActive ? "bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.1)]" : theme === "dark" ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-100/50 border-gray-200 hover:bg-gray-200/50"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxs("p", { className: `font-semibold text-base ${isActive ? "text-orange-400" : theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
              "Round ",
              roundInfo.round
            ] }),
            isActive && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.5)]" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium ${theme === "dark" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" : "bg-blue-100/80 border border-blue-200 text-blue-600"}`, children: [
              /* @__PURE__ */ jsx(LucideShield, { size: 12 }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "安全牌" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: roundInfo.safeCards })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium ${theme === "dark" ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-red-100/80 border border-red-200 text-red-600"}`, children: [
              /* @__PURE__ */ jsx(LucideBomb, { size: 12 }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "炸弹牌" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: roundInfo.bombCards })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium ${theme === "dark" ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400" : "bg-yellow-100/80 border border-yellow-200 text-yellow-600"}`, children: [
              /* @__PURE__ */ jsx(LucideSwords, { size: 12 }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "手牌" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: roundInfo.handLimit === Infinity ? "∞" : roundInfo.handLimit })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/70" : "text-gray-700"}`, children: [
              "🏆 ",
              roundInfo.vpMode.name
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: roundInfo.specialRules && roundInfo.specialRules.length > 1 ? /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold", children: "🎯 特殊规则:" }),
              roundInfo.specialRules.map((rule, idx) => /* @__PURE__ */ jsxs("div", { className: "text-xs pl-3", children: [
                "• ",
                rule
              ] }, idx))
            ] }) : /* @__PURE__ */ jsxs("p", { children: [
              "🎯 ",
              roundInfo.specialRule
            ] }) })
          ] })
        ] }, roundInfo.round);
      }) })
    ] })
  ] });
};
const Modal = ({ children, onClose, title }) => {
  const { theme } = useTheme();
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: `relative ${theme === "dark" ? "bg-black/40" : "bg-white/90"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-xl sm:rounded-2xl md:rounded-3xl ${theme === "dark" ? "shadow-[0_0_80px_rgba(0,0,0,0.5)]" : "shadow-[0_0_80px_rgba(0,0,0,0.2)]"} p-5 sm:p-7 md:p-8 lg:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl animate-in fade-in zoom-in duration-200 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto`, children: [
    /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-4 sm:gap-5 mb-5 sm:mb-7 md:mb-8", children: [
        /* @__PURE__ */ jsx("h3", { className: `text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight flex-1 ${theme === "dark" ? "bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent" : "text-gray-900"}`, children: title }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: `min-h-touch min-w-touch p-3 sm:p-3.5 rounded-xl transition-all duration-200 border border-transparent flex-shrink-0 active:scale-95 ${theme === "dark" ? "text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
            children: /* @__PURE__ */ jsx(LucideX, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-5 sm:space-y-6 md:space-y-7", children })
    ] })
  ] }) });
};
const PlayerProfileModal = ({ player, onClose }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const { theme } = useTheme();
  if (!player) return null;
  const { totalRounds, placementCounts } = useMemo(() => {
    const history = Array.isArray(player.history) ? player.history : [];
    const counts = {};
    for (const h of history) {
      if (!h || typeof h.placement !== "number") continue;
      counts[h.placement] = (counts[h.placement] || 0) + 1;
    }
    return { totalRounds: history.length, placementCounts: counts };
  }, [player.history]);
  const StatWithRanking = ({ icon, label, value, ranking, className }) => /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${className || ""}`, children: [
    /* @__PURE__ */ jsx("span", { children: icon }),
    /* @__PURE__ */ jsxs("span", { className: "hidden sm:inline", children: [
      value,
      " ",
      label
    ] }),
    /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: value }),
    !!ranking && /* @__PURE__ */ jsxs("span", { className: `ml-1 font-bold ${getRankingColorClass(ranking)}`, children: [
      "#",
      getRankingSuffix(ranking)
    ] })
  ] });
  return /* @__PURE__ */ jsx(Modal, { onClose, title: `${player.avatar} ${player.name} 的档案`, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between p-4 rounded-lg border ${theme === "dark" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"}`, children: [
      /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-emerald-300" : "text-emerald-700"}`, children: "⭐ 当前分数" }),
      /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-emerald-400", children: player.score || 0 })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: `text-xs font-semibold ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "联赛统计" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
        /* @__PURE__ */ jsx(
          StatWithRanking,
          {
            icon: "🏆",
            label: "联赛冠军",
            value: player.championships || 0,
            ranking: (_a = player.rankings) == null ? void 0 : _a.championships,
            className: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
          }
        ),
        /* @__PURE__ */ jsx(
          StatWithRanking,
          {
            icon: "🥈",
            label: "联赛亚军",
            value: player.runner_up || 0,
            ranking: (_b = player.rankings) == null ? void 0 : _b.runner_up,
            className: `bg-gray-400/10 border-gray-400/20 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`
          }
        ),
        /* @__PURE__ */ jsx(
          StatWithRanking,
          {
            icon: "🥉",
            label: "联赛季军",
            value: player.third_place || 0,
            ranking: (_c = player.rankings) == null ? void 0 : _c.third_place,
            className: "bg-orange-500/10 border-orange-500/20 text-orange-400"
          }
        ),
        /* @__PURE__ */ jsx(
          StatWithRanking,
          {
            icon: "🎮",
            label: "总联赛数",
            value: player.total_games || 0,
            ranking: (_d = player.rankings) == null ? void 0 : _d.total_games,
            className: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: `text-xs font-semibold ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "单轮统计" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
        /* @__PURE__ */ jsx(
          StatWithRanking,
          {
            icon: "🎯",
            label: "单轮冠军",
            value: player.single_round_firsts || 0,
            ranking: (_e = player.rankings) == null ? void 0 : _e.single_round_firsts,
            className: "bg-blue-500/10 border-blue-500/20 text-blue-400"
          }
        ),
        /* @__PURE__ */ jsx(
          StatWithRanking,
          {
            icon: "🎲",
            label: "单轮亚军",
            value: player.single_round_seconds || 0,
            ranking: (_f = player.rankings) == null ? void 0 : _f.single_round_seconds,
            className: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
          }
        ),
        /* @__PURE__ */ jsx(
          StatWithRanking,
          {
            icon: "⚡",
            label: "单轮季军",
            value: player.single_round_thirds || 0,
            ranking: (_g = player.rankings) == null ? void 0 : _g.single_round_thirds,
            className: "bg-purple-500/10 border-purple-500/20 text-purple-400"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600"}`, children: [
          /* @__PURE__ */ jsx("span", { children: "🔄" }),
          /* @__PURE__ */ jsxs("span", { className: "hidden sm:inline", children: [
            "总轮次: ",
            totalRounds
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "sm:hidden", children: [
            totalRounds,
            "轮"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: `text-xs font-semibold ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "综合表现" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
        /* @__PURE__ */ jsx(
          StatWithRanking,
          {
            icon: "💎",
            label: "总VP",
            value: player.total_vp || 0,
            ranking: (_h = player.rankings) == null ? void 0 : _h.total_vp,
            className: "bg-green-500/10 border-green-500/20 text-green-400"
          }
        ),
        /* @__PURE__ */ jsx(
          StatWithRanking,
          {
            icon: "📊",
            label: "平均排名",
            value: Number((player.average_placement || 0).toFixed(1)),
            ranking: (_i = player.rankings) == null ? void 0 : _i.average_placement,
            className: "bg-teal-500/10 border-teal-500/20 text-teal-400"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border bg-rose-500/10 border-rose-500/20 text-rose-400`, children: [
          /* @__PURE__ */ jsx("span", { children: "🎪" }),
          /* @__PURE__ */ jsxs("span", { className: "hidden sm:inline", children: [
            (player.win_rate || 0).toFixed(0),
            "% 胜率"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "sm:hidden", children: [
            (player.win_rate || 0).toFixed(0),
            "%"
          ] }),
          !!((_j = player.rankings) == null ? void 0 : _j.win_rate) && /* @__PURE__ */ jsxs("span", { className: `ml-1 font-bold ${getRankingColorClass(player.rankings.win_rate)}`, children: [
            "#",
            getRankingSuffix(player.rankings.win_rate)
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`, children: "胜率" }),
        /* @__PURE__ */ jsxs("span", { className: "text-orange-400 font-bold", children: [
          (player.win_rate || 0).toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `w-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} rounded-full h-2`, children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "bg-orange-400 h-2 rounded-full transition-all duration-300",
          style: { width: `${Math.max(0, Math.min(100, Number((player.win_rate || 0).toFixed(0))))}%` }
        }
      ) })
    ] }),
    totalRounds > 0 && /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ jsx("h4", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold mb-3`, children: "排名分布" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [1, 2, 3, 4, 5, 6].map((place) => {
        const count = placementCounts[place] || 0;
        const percentage = totalRounds > 0 ? (count / totalRounds * 100).toFixed(1) : 0;
        return count > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("span", { className: `text-sm ${place === 1 ? "text-yellow-400" : place === 2 ? "text-gray-300" : place === 3 ? "text-orange-400" : "text-gray-500"}`, children: [
            "第",
            place,
            "名"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} text-sm`, children: [
              count,
              "次"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xs`, children: [
              "(",
              percentage,
              "%)"
            ] })
          ] })
        ] }, place) : null;
      }) })
    ] }),
    player.history && player.history.length > 0 && /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ jsx("h4", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold mb-3`, children: "最近比赛" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-32 overflow-y-auto", children: player.history.slice(-5).reverse().map((game, index) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
        /* @__PURE__ */ jsxs("span", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
          "第",
          game.round,
          "轮"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: `font-semibold ${game.placement === 1 ? "text-yellow-400" : game.placement === 2 ? "text-gray-300" : game.placement === 3 ? "text-orange-400" : "text-gray-500"}`, children: [
          "第",
          game.placement,
          "名"
        ] })
      ] }, index)) })
    ] })
  ] }) });
};
const ResultsModal = ({ players, onClose, onSubmit, round }) => {
  const { theme } = useTheme();
  const [rankedPlayers, setRankedPlayers] = useState(players.map((p) => p.id));
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index.toString());
    e.dataTransfer.effectAllowed = "move";
    setDraggedIndex(index);
    const dragElement = e.currentTarget;
    dragElement.style.opacity = "0.5";
    setTimeout(() => {
      dragElement.style.opacity = "1";
    }, 0);
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };
  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null);
    }
  };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const draggedIdx = parseInt(e.dataTransfer.getData("draggedIndex"));
    if (draggedIdx !== dropIndex) {
      const newRankedPlayers = [...rankedPlayers];
      const [draggedItem] = newRankedPlayers.splice(draggedIdx, 1);
      newRankedPlayers.splice(dropIndex, 0, draggedItem);
      setRankedPlayers(newRankedPlayers);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = (e) => {
    e.preventDefault();
    setDraggedIndex(null);
    setDragOverIndex(null);
    const dragElement = e.currentTarget;
    dragElement.style.opacity = "1";
  };
  const getPlayerById = (id) => players.find((p) => p.id === id);
  return /* @__PURE__ */ jsx(Modal, { onClose, title: `输入第 ${round} 轮比赛结果`, children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: `mb-4 p-3 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-100/50"}`, children: [
      /* @__PURE__ */ jsx("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"} text-sm sm:text-base font-medium`, children: "🏆 确定本轮名次排序" }),
      /* @__PURE__ */ jsxs("p", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm mt-1`, children: [
        "拖拽玩家卡片重新排序，从上到下为第 1 名到第 ",
        players.length,
        " 名"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2 sm:space-y-3", children: rankedPlayers.map((playerId, index) => {
      const player = getPlayerById(playerId);
      if (!player) return null;
      const isDragging = draggedIndex === index;
      const isDragOver = dragOverIndex === index;
      const isAboveDragOver = dragOverIndex !== null && index < dragOverIndex && draggedIndex !== null && draggedIndex > dragOverIndex;
      const isBelowDragOver = dragOverIndex !== null && index > dragOverIndex && draggedIndex !== null && draggedIndex < dragOverIndex;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          draggable: true,
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
            /* @__PURE__ */ jsx("span", { className: `font-bold text-base sm:text-lg text-orange-400 w-5 sm:w-6 flex-shrink-0 text-center transition-all duration-300 ${isDragging ? "scale-110 text-orange-300" : ""}`, children: index + 1 }),
            /* @__PURE__ */ jsx("span", { className: `text-xl sm:text-2xl flex-shrink-0 transition-all duration-300 ${isDragging ? "scale-110" : ""}`, children: player.avatar }),
            /* @__PURE__ */ jsx("span", { className: `font-semibold text-sm sm:text-base truncate transition-all duration-300 ${theme === "dark" ? "text-white" : "text-gray-900"} ${isDragging ? "text-orange-300" : ""}`, children: player.name }),
            /* @__PURE__ */ jsxs("div", { className: `ml-auto flex flex-col gap-1 opacity-40 transition-opacity duration-300 ${isDragging ? "opacity-70" : "group-hover:opacity-70"}`, children: [
              /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-current rounded-full" }),
              /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-current rounded-full" }),
              /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-current rounded-full" })
            ] })
          ]
        },
        playerId
      );
    }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onSubmit(rankedPlayers),
        className: "w-full mt-4 sm:mt-6 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3 sm:py-4 rounded-lg transition-all duration-200 active:scale-[0.98] text-sm sm:text-base",
        children: "确认并进入下一轮"
      }
    )
  ] }) });
};
const CardDrawReminder = ({ players, onClose, round }) => {
  const { theme } = useTheme();
  const getCardCount = (ranking) => {
    const cardCounts = [2, 3, 4, 5, 6];
    return cardCounts[ranking - 1] || 6;
  };
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsxs("div", { className: `relative w-full max-w-md mx-auto rounded-2xl shadow-2xl border backdrop-blur-xl ${theme === "dark" ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-gray-200"}`, children: [
    /* @__PURE__ */ jsx("div", { className: `p-6 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
      /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-orange-500/20 border border-orange-500/30" : "bg-orange-100 border border-orange-200"}`, children: /* @__PURE__ */ jsx("span", { className: "text-orange-500 text-lg", children: "🃏" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: `${TYPOGRAPHY.COMBINATIONS.modalTitle} ${theme === "dark" ? "text-white" : "text-gray-900"} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`, children: [
          "第 ",
          round,
          " 轮抽卡提醒"
        ] }),
        /* @__PURE__ */ jsx("p", { className: `${TYPOGRAPHY.COMBINATIONS.modalBody} ${theme === "dark" ? "text-gray-400" : "text-gray-600"} ${LINE_HEIGHTS.normal}`, children: "请根据本轮排名抽取相应数量的卡片" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: sortedPlayers.map((player, index) => {
        const ranking = index + 1;
        const cardCount = getCardCount(ranking);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${theme === "dark" ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: `flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${ranking === 1 ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" : ranking === 2 ? "bg-gray-400/20 text-gray-400 border border-gray-400/30" : ranking === 3 ? "bg-orange-600/20 text-orange-600 border border-orange-600/30" : theme === "dark" ? "bg-gray-600/20 text-gray-300 border border-gray-600/30" : "bg-gray-300/50 text-gray-600 border border-gray-300"}`, children: ranking }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xl", children: player.avatar }),
                  /* @__PURE__ */ jsx("span", { className: `font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: player.name })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "抽取" }),
                /* @__PURE__ */ jsxs("div", { className: `px-3 py-1.5 rounded-lg font-bold text-lg ${theme === "dark" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-blue-100 text-blue-600 border border-blue-200"}`, children: [
                  cardCount,
                  " 张"
                ] })
              ] })
            ]
          },
          player.id
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: `mt-6 p-4 rounded-lg ${theme === "dark" ? "bg-gray-800/30 border border-gray-700" : "bg-gray-100/50 border border-gray-200"}`, children: [
        /* @__PURE__ */ jsx("h3", { className: `text-sm font-semibold mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "📋 抽卡规则" }),
        /* @__PURE__ */ jsxs("div", { className: `text-xs space-y-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
          /* @__PURE__ */ jsx("p", { children: "• 第 1 名：2 张卡片" }),
          /* @__PURE__ */ jsx("p", { children: "• 第 2 名：3 张卡片" }),
          /* @__PURE__ */ jsx("p", { children: "• 第 3 名：4 张卡片" }),
          /* @__PURE__ */ jsx("p", { children: "• 第 4 名：5 张卡片" }),
          /* @__PURE__ */ jsx("p", { children: "• 第 5 名及以后：6 张卡片" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: `w-full mt-6 py-3 px-4 rounded-lg ${TYPOGRAPHY.COMBINATIONS.buttonLarge} transition-all duration-200 ${theme === "dark" ? "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white" : "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"} active:scale-[0.98] ${LINE_HEIGHTS.tight}`,
          children: "✅ 知道了，开始抽卡"
        }
      )
    ] })
  ] }) });
};
const PasswordModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  const { theme } = useTheme();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    if (password === "kross") {
      onConfirm();
      handleClose();
    } else {
      setError("Incorrect password. Access denied.");
      setPassword("");
    }
    setIsSubmitting(false);
  };
  const handleClose = () => {
    setPassword("");
    setError("");
    setIsSubmitting(false);
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: `relative w-full max-w-md rounded-2xl shadow-2xl border ${theme === "dark" ? "bg-gray-800/95 border-gray-700/50" : "bg-white/95 border-gray-200/50"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200/10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-red-500/20 border-red-500/30" : "bg-red-100 border-red-200"} border`, children: /* @__PURE__ */ jsx(LucideShield, { className: "text-red-500", size: 20 }) }),
        /* @__PURE__ */ jsx("h2", { className: `text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: title })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleClose,
          className: `p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`,
          children: /* @__PURE__ */ jsx(LucideX, { size: 20 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: `flex items-start gap-3 p-4 rounded-lg mb-6 ${theme === "dark" ? "bg-yellow-500/10 border-yellow-500/20" : "bg-yellow-50 border-yellow-200"} border`, children: [
        /* @__PURE__ */ jsx(LucideAlertTriangle, { className: "text-yellow-500 flex-shrink-0 mt-0.5", size: 18 }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: `font-medium mb-1 ${theme === "dark" ? "text-yellow-400" : "text-yellow-800"}`, children: "Destructive Action" }),
          /* @__PURE__ */ jsx("p", { className: `text-sm ${theme === "dark" ? "text-yellow-300/80" : "text-yellow-700"}`, children: message })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "Enter Admin Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "Enter password to confirm",
              className: `w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/30 transition-all duration-200 ${theme === "dark" ? "bg-gray-700/50 text-white border-gray-600 placeholder-gray-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"} ${error ? "border-red-500" : ""}`,
              disabled: isSubmitting,
              autoFocus: true
            }
          ),
          error && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(LucideX, { size: 14 }),
            error
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleClose,
              className: `flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900"}`,
              disabled: isSubmitting,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: `flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${isSubmitting ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 active:bg-red-700"} text-white`,
              disabled: isSubmitting || !password.trim(),
              children: isSubmitting ? "Verifying..." : "Confirm Delete"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
};
function selectSpecialRules(availableRules) {
  if (availableRules.length === 1 && availableRules[0] === "无特殊规则") {
    return ["无特殊规则"];
  }
  const nonNullRules = availableRules.filter((rule) => rule !== "无特殊规则");
  if (nonNullRules.length === 0) {
    return ["无特殊规则"];
  }
  const ruleCount = Math.random() < 0.6 ? 1 : 2;
  if (ruleCount === 1 || nonNullRules.length === 1) {
    const randomIndex = Math.floor(Math.random() * nonNullRules.length);
    return [nonNullRules[randomIndex]];
  } else {
    return selectTwoNonConflictingRules(nonNullRules);
  }
}
function selectTwoNonConflictingRules(availableRules) {
  const maxAttempts = 50;
  let attempts = 0;
  while (attempts < maxAttempts) {
    const firstRuleIndex = Math.floor(Math.random() * availableRules.length);
    const firstRule = availableRules[firstRuleIndex];
    const compatibleRules = availableRules.filter(
      (rule) => rule !== firstRule && !areRulesConflicting(firstRule, rule)
    );
    if (compatibleRules.length > 0) {
      const secondRuleIndex = Math.floor(Math.random() * compatibleRules.length);
      const secondRule = compatibleRules[secondRuleIndex];
      return [firstRule, secondRule];
    }
    attempts++;
  }
  const fallbackIndex = Math.floor(Math.random() * availableRules.length);
  return [availableRules[fallbackIndex]];
}
function areRulesConflicting(rule1, rule2) {
  var _a, _b;
  const conflicts = GAME_RULES.RULE_CONFLICTS;
  if ((_a = conflicts[rule1]) == null ? void 0 : _a.includes(rule2)) {
    return true;
  }
  if ((_b = conflicts[rule2]) == null ? void 0 : _b.includes(rule1)) {
    return true;
  }
  return false;
}
function formatSpecialRules(rules) {
  if (rules.length === 0) {
    return "无特殊规则";
  }
  if (rules.length === 1) {
    return rules[0];
  }
  return rules.join(" + ");
}
const PlayerProfiles = ({ players, onPlayerClick }) => {
  const { theme } = useTheme();
  const StatWithRanking = ({ icon, value, label, shortLabel, ranking, bgClass }) => /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${bgClass || (theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600")}`, children: [
    /* @__PURE__ */ jsx("span", { children: icon }),
    /* @__PURE__ */ jsxs("span", { className: "hidden xs:inline", children: [
      value,
      " ",
      label,
      ranking && /* @__PURE__ */ jsxs("span", { className: `ml-1 font-bold ${getRankingColorClass(ranking)}`, children: [
        "#",
        getRankingSuffix(ranking)
      ] })
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "xs:hidden", children: [
      value,
      ranking && /* @__PURE__ */ jsxs("span", { className: `ml-0.5 font-bold ${getRankingColorClass(ranking)}`, children: [
        "#",
        ranking
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-4 sm:p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "relative p-1.5 sm:p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)]", children: /* @__PURE__ */ jsx(LucideUsers, { size: 14, className: "text-blue-400 sm:w-4 sm:h-4" }) }),
        /* @__PURE__ */ jsx("h3", { className: `text-base sm:text-lg font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Player Profiles" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1.5 sm:space-y-2", children: players.map((p) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `group relative p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98] ${theme === "dark" ? "hover:bg-white/5 hover:border-white/10 active:bg-white/10" : "hover:bg-gray-100/50 hover:border-gray-200 active:bg-gray-200/50"}`,
            onClick: () => onPlayerClick && onPlayerClick(p),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg sm:text-xl flex-shrink-0", children: p.avatar }),
                /* @__PURE__ */ jsx("span", { className: `font-medium text-sm sm:text-base truncate ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: p.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-lg", children: "⭐" }),
                  /* @__PURE__ */ jsxs("span", { className: `font-semibold text-sm ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`, children: [
                    "当前分数: ",
                    p.score || 0
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: `text-xs font-semibold mb-1.5 ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "联赛统计" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 sm:gap-2", children: [
                    /* @__PURE__ */ jsx(
                      StatWithRanking,
                      {
                        icon: "🏆",
                        value: p.championships || 0,
                        label: "联赛冠军",
                        shortLabel: "冠军",
                        ranking: (_a = p.rankings) == null ? void 0 : _a.championships,
                        bgClass: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      StatWithRanking,
                      {
                        icon: "🥈",
                        value: p.runner_up || 0,
                        label: "联赛亚军",
                        shortLabel: "亚军",
                        ranking: (_b = p.rankings) == null ? void 0 : _b.runner_up,
                        bgClass: `bg-gray-400/10 border-gray-400/20 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      StatWithRanking,
                      {
                        icon: "🥉",
                        value: p.third_place || 0,
                        label: "联赛季军",
                        shortLabel: "季军",
                        ranking: (_c = p.rankings) == null ? void 0 : _c.third_place,
                        bgClass: "bg-orange-500/10 border-orange-500/20 text-orange-400"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      StatWithRanking,
                      {
                        icon: "🎮",
                        value: p.total_games || 0,
                        label: "总联赛数",
                        shortLabel: "联赛",
                        ranking: (_d = p.rankings) == null ? void 0 : _d.total_games,
                        bgClass: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: `text-xs font-semibold mb-1.5 ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "单轮统计" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 sm:gap-2", children: [
                    /* @__PURE__ */ jsx(
                      StatWithRanking,
                      {
                        icon: "🎯",
                        value: p.single_round_firsts || 0,
                        label: "单轮冠军",
                        shortLabel: "单冠",
                        ranking: (_e = p.rankings) == null ? void 0 : _e.single_round_firsts,
                        bgClass: "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      StatWithRanking,
                      {
                        icon: "🎲",
                        value: p.single_round_seconds || 0,
                        label: "单轮亚军",
                        shortLabel: "单亚",
                        ranking: (_f = p.rankings) == null ? void 0 : _f.single_round_seconds,
                        bgClass: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      StatWithRanking,
                      {
                        icon: "⚡",
                        value: p.single_round_thirds || 0,
                        label: "单轮季军",
                        shortLabel: "单季",
                        ranking: (_g = p.rankings) == null ? void 0 : _g.single_round_thirds,
                        bgClass: "bg-purple-500/10 border-purple-500/20 text-purple-400"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600"}`, children: [
                      /* @__PURE__ */ jsx("span", { children: "🔄" }),
                      /* @__PURE__ */ jsxs("span", { className: "hidden sm:inline", children: [
                        "总轮次: ",
                        (p.history || []).length
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "sm:hidden", children: [
                        (p.history || []).length,
                        "轮"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: `text-xs font-semibold mb-1.5 ${theme === "dark" ? "text-white/80" : "text-gray-700"}`, children: "综合表现" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 sm:gap-2", children: [
                    /* @__PURE__ */ jsx(
                      StatWithRanking,
                      {
                        icon: "💎",
                        value: p.total_vp || 0,
                        label: "总VP",
                        shortLabel: "VP",
                        ranking: (_h = p.rankings) == null ? void 0 : _h.total_vp,
                        bgClass: "bg-green-500/10 border-green-500/20 text-green-400"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      StatWithRanking,
                      {
                        icon: "📊",
                        value: parseFloat((p.average_placement || 0).toFixed(1)),
                        label: "平均排名",
                        shortLabel: "平均",
                        ranking: (_i = p.rankings) == null ? void 0 : _i.average_placement,
                        bgClass: "bg-teal-500/10 border-teal-500/20 text-teal-400"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border bg-rose-500/10 border-rose-500/20 text-rose-400`, children: [
                      /* @__PURE__ */ jsx("span", { children: "🎪" }),
                      /* @__PURE__ */ jsxs("span", { className: "hidden xs:inline", children: [
                        (p.win_rate || 0).toFixed(0),
                        "% 胜率",
                        ((_j = p.rankings) == null ? void 0 : _j.win_rate) && /* @__PURE__ */ jsxs("span", { className: `ml-1 font-bold ${getRankingColorClass(p.rankings.win_rate)}`, children: [
                          "#",
                          getRankingSuffix(p.rankings.win_rate)
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "xs:hidden", children: [
                        (p.win_rate || 0).toFixed(0),
                        "%",
                        ((_k = p.rankings) == null ? void 0 : _k.win_rate) && /* @__PURE__ */ jsxs("span", { className: `ml-0.5 font-bold ${getRankingColorClass(p.rankings.win_rate)}`, children: [
                          "#",
                          p.rankings.win_rate
                        ] })
                      ] })
                    ] })
                  ] })
                ] }),
                (p.created_at || p.updated_at) && /* @__PURE__ */ jsxs("div", { className: `text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"} pt-2 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`, children: [
                  p.created_at && /* @__PURE__ */ jsxs("div", { children: [
                    "注册时间: ",
                    new Date(p.created_at).toLocaleDateString("zh-CN")
                  ] }),
                  p.updated_at && /* @__PURE__ */ jsxs("div", { children: [
                    "最后更新: ",
                    new Date(p.updated_at).toLocaleDateString("zh-CN")
                  ] })
                ] })
              ] })
            ]
          },
          p.id
        );
      }) })
    ] })
  ] });
};
const HomePage = ({
  leagueState,
  players,
  handleStartLeague,
  handleResetLeague,
  handlePlayerClick,
  setCurrentPage
}) => {
  const { theme } = useTheme();
  if (!leagueState || leagueState.status === "setup") {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "relative p-4 sm:p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ jsx(LucideCat, { className: "text-orange-400", size: 32 }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-left", children: [
          /* @__PURE__ */ jsx("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-orange-500 bg-clip-text text-transparent"}`, children: "Boom League" }),
          /* @__PURE__ */ jsx("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "Professional Tournament Management" })
        ] })
      ] }) }),
      players.length > 0 && /* @__PURE__ */ jsxs("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"}`, children: [
        /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]" }),
            /* @__PURE__ */ jsx("h2", { className: `text-xl sm:text-2xl font-semibold tracking-tight ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "Quick Start" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: `text-base sm:text-lg mb-6 sm:mb-8 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: [
            /* @__PURE__ */ jsx("span", { className: "text-orange-400 font-semibold", children: players.length }),
            " players registered and ready to compete"
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setCurrentPage("league"),
              disabled: players.length < 2,
              className: `relative group bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 active:from-orange-500/40 active:to-orange-600/40 text-orange-400 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg border border-orange-500/30 shadow-[0_0_30px_rgba(251,146,60,0.2)] transition-all duration-200 hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] active:scale-[0.98] text-sm sm:text-base ${players.length < 2 ? "disabled:from-white/5 disabled:to-white/5 disabled:text-white/40 disabled:border-white/10 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100" : ""}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "relative z-10", children: "Start New Tournament" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" })
              ]
            }
          )
        ] })
      ] })
    ] });
  }
  if (leagueState.status === "in_progress") {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-2", children: leagueState.league_name || "联赛进行中" }),
        /* @__PURE__ */ jsxs("p", { className: `text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
          "第 ",
          leagueState.current_round,
          " / ",
          GAME_RULES.MAX_ROUNDS,
          " 轮",
          leagueState.season_number && /* @__PURE__ */ jsxs("span", { className: "ml-2", children: [
            "• Season ",
            leagueState.season_number
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: [
        /* @__PURE__ */ jsx(Leaderboard, { players, onPlayerClick: handlePlayerClick }),
        /* @__PURE__ */ jsx(PlayerProfiles, { players, onPlayerClick: handlePlayerClick })
      ] })
    ] });
  }
  if (leagueState.status === "finished") {
    return /* @__PURE__ */ jsx("div", { className: "space-y-4 sm:space-y-6", children: /* @__PURE__ */ jsxs("div", { className: `text-center p-6 sm:p-8 lg:p-10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg flex flex-col items-center gap-3 sm:gap-4 border-2 border-yellow-400 ${theme === "dark" ? "bg-gray-800/70" : "bg-white/80"}`, children: [
      /* @__PURE__ */ jsx(LucideCrown, { className: "text-yellow-400", size: 60 }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-300", children: leagueState.league_name || "联赛结束！" }),
        leagueState.season_number && /* @__PURE__ */ jsxs("p", { className: `text-lg sm:text-xl mt-2 ${theme === "dark" ? "text-yellow-400/80" : "text-yellow-600"}`, children: [
          "Season ",
          leagueState.season_number,
          " 完成"
        ] })
      ] }),
      leagueState.winner && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4", children: leagueState.winner.avatar }),
        /* @__PURE__ */ jsx("p", { className: `text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.winner.name }),
        /* @__PURE__ */ jsx("p", { className: `text-base sm:text-lg lg:text-xl mt-2 px-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: leagueState.winner.reason })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleResetLeague,
          className: "mt-6 sm:mt-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base",
          children: "开启新联赛"
        }
      )
    ] }) });
  }
  return null;
};
const PlayerRegistrationPage = ({
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
  const { theme } = useTheme();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: `text-4xl font-bold mb-3 ${theme === "dark" ? "bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent" : "bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"}`, children: "玩家注册" }),
      /* @__PURE__ */ jsx("p", { className: `text-lg ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`, children: "管理参与联赛的玩家" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${theme === "dark" ? "bg-slate-800/40 border-slate-700/30" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: `text-2xl font-bold flex items-center gap-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" }),
          "已注册玩家",
          /* @__PURE__ */ jsxs("span", { className: "text-orange-400", children: [
            "(",
            players.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowPlayerModal(true),
            className: "flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105",
            children: [
              /* @__PURE__ */ jsx(LucidePlus, { size: 18 }),
              " 添加玩家"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: players.map((p) => {
        const stats = UTILS.calculatePlayerStats(p);
        return /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-lg ${theme === "dark" ? "bg-slate-800/50 hover:bg-slate-700/60 border-slate-700/30" : "bg-white/50 hover:bg-gray-100/60 border-gray-200/30"}`, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-4 flex-1",
              onClick: () => handlePlayerClick(p),
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-4xl", children: p.avatar }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: `font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: p.name }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mt-1", children: [
                    stats.championships > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full", children: [
                      "🏆 ",
                      stats.championships,
                      "冠"
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-1 rounded-full ${theme === "dark" ? "bg-slate-700/50 text-slate-300" : "bg-gray-200/50 text-gray-600"}`, children: stats.totalGames > 0 ? `${stats.totalGames}场 • ${stats.winRate}%胜率` : "新玩家" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                handleDeletePlayer(p.id);
              },
              className: "p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200",
              children: /* @__PURE__ */ jsx(LucideTrash2, { size: 18 })
            }
          )
        ] }, p.id);
      }) })
    ] })
  ] });
};
const LeagueManagementPage = ({
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
  var _a, _b;
  const { theme } = useTheme();
  const [selectedSpecialRules, setSelectedSpecialRules] = useState(GAME_RULES.SPECIAL_RULES.slice());
  const [viewMode, setViewMode] = useState("ongoing");
  const toggleSpecialRule = (rule) => {
    setSelectedSpecialRules(
      (prev) => prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
    );
  };
  const handleStartLeagueWithRules = () => {
    if (selectedSpecialRules.length === 0) {
      alert("请至少选择一种特殊规则可能性！");
      return;
    }
    handleStartLeague(selectedSpecialRules);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    return `${diffDays} 天`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "联赛管理" }),
      /* @__PURE__ */ jsx("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: "创建和管理你的 Boom League" })
    ] }),
    (!leagueState || leagueState.status === "setup") && /* @__PURE__ */ jsxs("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"} backdrop-blur-sm shadow-xl`, children: [
      /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "创建新联赛" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "联赛名称" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: currentLeagueName,
            onChange: (e) => setCurrentLeagueName(e.target.value),
            placeholder: `Boom League S${nextSeasonNumber}`,
            className: `w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200 backdrop-blur-sm ${theme === "dark" ? "bg-white/5 text-white border-white/10" : "bg-white/80 text-gray-900 border-gray-200"}`
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: `text-xs mt-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
          "留空将使用默认名称: Boom League S",
          nextSeasonNumber
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsx(LucideSettings, { className: "text-orange-400", size: 20 }),
          /* @__PURE__ */ jsx("label", { className: `text-sm font-medium ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "特殊规则可能性选择" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: `text-xs mb-3 ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "选择联赛中可能出现的特殊规则。系统将从选中的规则中随机选择。" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: GAME_RULES.SPECIAL_RULES.map((rule) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => toggleSpecialRule(rule),
            className: `p-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left ${selectedSpecialRules.includes(rule) ? theme === "dark" ? "bg-orange-500/20 border-orange-500/50 text-orange-400" : "bg-orange-100 border-orange-300 text-orange-700" : theme === "dark" ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { children: rule }),
              selectedSpecialRules.includes(rule) && /* @__PURE__ */ jsx(LucideCheck, { size: 16, className: "text-orange-400" })
            ] })
          },
          rule
        )) }),
        /* @__PURE__ */ jsxs("div", { className: `mt-2 text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
          "已选择 ",
          selectedSpecialRules.length,
          " / ",
          GAME_RULES.SPECIAL_RULES.length,
          " 种可能性"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: `mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
        "当前有 ",
        players.length,
        " 名玩家注册。需要至少 2 名玩家才能开始联赛。"
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleStartLeagueWithRules,
          disabled: players.length < 2 || selectedSpecialRules.length === 0,
          className: "bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100",
          children: "开始联赛"
        }
      )
    ] }),
    leagueState && leagueState.status !== "setup" && /* @__PURE__ */ jsxs("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"} backdrop-blur-sm shadow-xl`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "当前联赛状态" }),
        leagueState.status === "in_progress" && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setCurrentPage("in_progress"),
            className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(LucidePlay, { size: 16 }),
              "进入联赛"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsx("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "联赛名称" }),
          /* @__PURE__ */ jsx("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: leagueState.league_name || "未命名联赛" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsx("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "状态" }),
          /* @__PURE__ */ jsx("p", { className: `font-bold text-lg ${leagueState.status === "in_progress" ? "text-green-400" : leagueState.status === "finished" ? "text-yellow-400" : leagueState.status === "pending_confirmation" ? "text-orange-400" : "text-gray-400"}`, children: leagueState.status === "in_progress" ? "进行中" : leagueState.status === "finished" ? "已结束" : leagueState.status === "pending_confirmation" ? "待确认" : "设置中" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsx("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "当前轮次" }),
          /* @__PURE__ */ jsxs("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            leagueState.current_round,
            " / ",
            ((_a = leagueState.schedule) == null ? void 0 : _a.length) || 5
          ] })
        ] })
      ] }),
      leagueState.status === "finished" && leagueState.winner && /* @__PURE__ */ jsxs("div", { className: `mt-4 p-4 rounded-lg border-2 border-yellow-400 ${theme === "dark" ? "bg-yellow-500/10" : "bg-yellow-50"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(LucideCrown, { className: "text-yellow-400", size: 24 }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: `font-bold ${theme === "dark" ? "text-yellow-400" : "text-yellow-700"}`, children: [
              "🏆 ",
              leagueState.winner.name
            ] }),
            /* @__PURE__ */ jsx("p", { className: `text-sm ${theme === "dark" ? "text-yellow-300/80" : "text-yellow-600"}`, children: leagueState.winner.reason })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleResetLeague,
            className: "mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105",
            children: "开启新联赛"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"} backdrop-blur-sm shadow-xl`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "联赛记录" }),
        /* @__PURE__ */ jsxs("div", { className: "flex rounded-lg overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setViewMode("ongoing"),
              className: `px-4 py-2 text-sm font-medium transition-colors ${viewMode === "ongoing" ? "bg-orange-500 text-white" : theme === "dark" ? "bg-white/10 text-white/70 hover:bg-white/20" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`,
              children: "正在进行"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setViewMode("history"),
              className: `px-4 py-2 text-sm font-medium transition-colors ${viewMode === "history" ? "bg-orange-500 text-white" : theme === "dark" ? "bg-white/10 text-white/70 hover:bg-white/20" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`,
              children: "历史记录"
            }
          )
        ] })
      ] }),
      viewMode === "ongoing" ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: leagueState && leagueState.status !== "setup" && leagueState.status !== "finished" ? /* @__PURE__ */ jsx("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: `font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.league_name || "当前联赛" }),
          /* @__PURE__ */ jsxs("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
            "第 ",
            leagueState.current_round,
            " 轮 / 共 ",
            ((_b = leagueState.schedule) == null ? void 0 : _b.length) || 5,
            " 轮"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: `px-2 py-1 text-xs rounded-full ${leagueState.status === "in_progress" ? "bg-green-500/20 text-green-400" : leagueState.status === "pending_confirmation" ? "bg-orange-500/20 text-orange-400" : "bg-gray-500/20 text-gray-400"}`, children: leagueState.status === "in_progress" ? "进行中" : leagueState.status === "pending_confirmation" ? "待确认" : "未知" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage("in_progress"),
              className: "bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition-colors",
              children: "查看"
            }
          )
        ] })
      ] }) }) : /* @__PURE__ */ jsxs("div", { className: `p-8 text-center ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
        /* @__PURE__ */ jsx(LucidePlay, { size: 48, className: "mx-auto mb-3 opacity-50" }),
        /* @__PURE__ */ jsx("p", { children: "暂无正在进行的联赛" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: "创建新联赛开始游戏吧！" })
      ] }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: leagueHistory.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: leagueHistory.map((league) => /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: `font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: league.league_name }),
            /* @__PURE__ */ jsxs("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
              "Season ",
              league.season_number
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("p", { className: `text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`, children: formatDate(league.end_date) }),
            /* @__PURE__ */ jsx("p", { className: `text-xs ${theme === "dark" ? "text-white/40" : "text-gray-400"}`, children: formatDuration(league.start_date, league.end_date) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl", children: league.winner.avatar }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: `font-medium ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`, children: [
            "🏆 ",
            league.winner.name
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: `p-2 rounded ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`, children: [
            /* @__PURE__ */ jsx(LucideUsers, { size: 14, className: `mx-auto mb-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}` }),
            /* @__PURE__ */ jsxs("p", { className: `text-xs ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
              league.total_players,
              "人"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `p-2 rounded ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`, children: [
            /* @__PURE__ */ jsx(LucideCalendar, { size: 14, className: `mx-auto mb-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}` }),
            /* @__PURE__ */ jsxs("p", { className: `text-xs ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
              league.total_rounds,
              "轮"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `p-2 rounded ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`, children: [
            /* @__PURE__ */ jsx(LucideTrophy, { size: 14, className: `mx-auto mb-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}` }),
            /* @__PURE__ */ jsx("p", { className: `text-xs ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: "完成" })
          ] })
        ] })
      ] }, league.id)) }) : /* @__PURE__ */ jsxs("div", { className: `p-8 text-center ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
        /* @__PURE__ */ jsx(LucideHistory, { size: 48, className: "mx-auto mb-3 opacity-50" }),
        /* @__PURE__ */ jsx("p", { children: "暂无历史联赛记录" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: "完成首场联赛后，记录将显示在这里" })
      ] }) })
    ] })
  ] });
};
const PlayerRankingsPage = ({ players, onPlayerClick }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("championships");
  const categories = [
    {
      key: "championships",
      name: "联赛冠军",
      icon: /* @__PURE__ */ jsx(LucideCrown, { className: "w-5 h-5" }),
      getValue: (p) => p.championships || 0,
      isDescending: true,
      unit: "次",
      bgColor: "bg-yellow-500/10 border-yellow-500/20",
      textColor: "text-yellow-400"
    },
    {
      key: "runner_up",
      name: "联赛亚军",
      icon: /* @__PURE__ */ jsx(LucideMedal, { className: "w-5 h-5" }),
      getValue: (p) => p.runner_up || 0,
      isDescending: true,
      unit: "次",
      bgColor: "bg-gray-400/10 border-gray-400/20",
      textColor: "text-gray-300"
    },
    {
      key: "third_place",
      name: "联赛季军",
      icon: /* @__PURE__ */ jsx(LucideAward, { className: "w-5 h-5" }),
      getValue: (p) => p.third_place || 0,
      isDescending: true,
      unit: "次",
      bgColor: "bg-orange-500/10 border-orange-500/20",
      textColor: "text-orange-400"
    },
    {
      key: "single_round_firsts",
      name: "单轮冠军",
      icon: /* @__PURE__ */ jsx(LucideTarget, { className: "w-5 h-5" }),
      getValue: (p) => p.single_round_firsts || 0,
      isDescending: true,
      unit: "次",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      textColor: "text-blue-400"
    },
    {
      key: "single_round_seconds",
      name: "单轮亚军",
      icon: /* @__PURE__ */ jsx(LucideDices, { className: "w-5 h-5" }),
      getValue: (p) => p.single_round_seconds || 0,
      isDescending: true,
      unit: "次",
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
      textColor: "text-cyan-400"
    },
    {
      key: "single_round_thirds",
      name: "单轮季军",
      icon: /* @__PURE__ */ jsx(LucideZap, { className: "w-5 h-5" }),
      getValue: (p) => p.single_round_thirds || 0,
      isDescending: true,
      unit: "次",
      bgColor: "bg-purple-500/10 border-purple-500/20",
      textColor: "text-purple-400"
    },
    {
      key: "total_vp",
      name: "总VP",
      icon: /* @__PURE__ */ jsx(LucideGem, { className: "w-5 h-5" }),
      getValue: (p) => p.total_vp || 0,
      isDescending: true,
      unit: "VP",
      bgColor: "bg-green-500/10 border-green-500/20",
      textColor: "text-green-400"
    },
    {
      key: "total_games",
      name: "总联赛数",
      icon: /* @__PURE__ */ jsx(LucideTrophy, { className: "w-5 h-5" }),
      getValue: (p) => p.total_games || 0,
      isDescending: true,
      unit: "场",
      bgColor: "bg-indigo-500/10 border-indigo-500/20",
      textColor: "text-indigo-400"
    },
    {
      key: "average_placement",
      name: "平均排名",
      icon: /* @__PURE__ */ jsx(LucideBarChart3, { className: "w-5 h-5" }),
      getValue: (p) => p.average_placement || 999,
      isDescending: false,
      // Lower is better for average placement
      unit: "",
      bgColor: "bg-teal-500/10 border-teal-500/20",
      textColor: "text-teal-400"
    },
    {
      key: "win_rate",
      name: "胜率",
      icon: /* @__PURE__ */ jsx(LucidePercent, { className: "w-5 h-5" }),
      getValue: (p) => p.win_rate || 0,
      isDescending: true,
      unit: "%",
      bgColor: "bg-rose-500/10 border-rose-500/20",
      textColor: "text-rose-400"
    }
  ];
  const currentCategory = categories.find((cat) => cat.key === selectedCategory) || categories[0];
  const sortedPlayers = [...players].filter((player) => currentCategory.getValue(player) > 0 || currentCategory.key === "roundAveragePlacement").sort((a, b) => {
    const valueA = currentCategory.getValue(a);
    const valueB = currentCategory.getValue(b);
    return currentCategory.isDescending ? valueB - valueA : valueA - valueB;
  });
  const getRankingForCategory = (player, categoryKey) => {
    if (!player.rankings) return 0;
    return player.rankings[categoryKey] || 0;
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "玩家排行榜" }),
      /* @__PURE__ */ jsx("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: "按不同统计项目查看玩家排名" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `rounded-2xl p-4 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsx("h3", { className: `text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "选择排名类别" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2", children: categories.map((category) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedCategory(category.key),
          className: `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${selectedCategory === category.key ? `${category.bgColor} ${category.textColor} border-current` : theme === "dark" ? "bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-600/50" : "bg-gray-100/50 text-gray-600 border-gray-200/50 hover:bg-gray-200/50"}`,
          children: [
            category.icon,
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: category.name })
          ]
        },
        category.key
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs("h3", { className: `text-2xl font-bold mb-6 flex items-center gap-3 ${currentCategory.textColor}`, children: [
        currentCategory.icon,
        currentCategory.name,
        "排行榜"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: sortedPlayers.map((player, index) => {
        const value = currentCategory.getValue(player);
        const ranking = getRankingForCategory(player, currentCategory.key);
        const displayValue = currentCategory.key === "average_placement" ? value === 999 ? "0.0" : value.toFixed(1) : currentCategory.key === "win_rate" ? value.toFixed(0) : value.toString();
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border ${index === 0 ? `${currentCategory.bgColor} border-current shadow-lg` : theme === "dark" ? "bg-gray-700/50 border-gray-600/30 hover:bg-gray-600/50" : "bg-white/70 border-gray-200/30 hover:bg-gray-100/70"}`,
            onClick: () => onPlayerClick(player),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
                  /* @__PURE__ */ jsx("span", { className: `font-bold text-xl w-8 text-center ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : theme === "dark" ? "text-gray-500" : "text-gray-400"}`, children: index + 1 }),
                  ranking > 0 && /* @__PURE__ */ jsxs("span", { className: `text-xs font-medium ${getRankingColorClass(ranking)}`, children: [
                    "#",
                    getRankingSuffix(ranking)
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-2xl", children: player.avatar }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: `font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: player.name }),
                  /* @__PURE__ */ jsxs("div", { className: `flex gap-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                    /* @__PURE__ */ jsxs("span", { children: [
                      "🏆 ",
                      player.championships || 0
                    ] }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "🎮 ",
                      player.total_games || 0,
                      "场"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "⚡ ",
                      player.single_round_firsts || 0,
                      "单冠"
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxs("div", { className: `text-2xl font-bold ${index === 0 ? currentCategory.textColor : theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
                  displayValue,
                  currentCategory.unit
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: currentCategory.name })
              ] })
            ]
          },
          player.id
        );
      }) }),
      sortedPlayers.length === 0 && /* @__PURE__ */ jsxs("div", { className: `text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
        /* @__PURE__ */ jsx(LucideUsers, { size: 48, className: "mx-auto mb-4 opacity-50" }),
        /* @__PURE__ */ jsx("p", { children: "该类别暂无数据" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "玩家需要参与游戏后才会有统计数据" })
      ] })
    ] }),
    players.length === 0 && /* @__PURE__ */ jsxs("div", { className: `text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
      /* @__PURE__ */ jsx(LucideUsers, { size: 48, className: "mx-auto mb-4 opacity-50" }),
      /* @__PURE__ */ jsx("p", { children: "还没有注册的玩家" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "前往玩家注册页面添加玩家" })
    ] })
  ] });
};
const LeagueHistoryPage = ({ leagueHistory }) => {
  const { theme } = useTheme();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    return diffDays === 1 ? "1 天" : `${diffDays} 天`;
  };
  if (leagueHistory.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "relative p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-[0_0_40px_rgba(147,51,234,0.3)]", children: /* @__PURE__ */ jsx(LucideHistory, { className: "text-purple-400", size: 32 }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
          /* @__PURE__ */ jsx("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-purple-500 bg-clip-text text-transparent"}`, children: "联赛历史" }),
          /* @__PURE__ */ jsx("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "League History" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: `text-center p-10 ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg shadow-lg`, children: [
        /* @__PURE__ */ jsx(LucideHistory, { className: `mx-auto mb-4 ${theme === "dark" ? "text-white/40" : "text-gray-400"}`, size: 64 }),
        /* @__PURE__ */ jsx("h3", { className: `text-xl font-semibold mb-2 ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: "暂无历史记录" }),
        /* @__PURE__ */ jsx("p", { className: `${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "完成第一个联赛后，历史记录将在这里显示" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "relative p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-[0_0_40px_rgba(147,51,234,0.3)]", children: /* @__PURE__ */ jsx(LucideHistory, { className: "text-purple-400", size: 32 }) }),
      /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ jsx("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-purple-500 bg-clip-text text-transparent"}`, children: "联赛历史" }),
        /* @__PURE__ */ jsxs("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
          leagueHistory.length,
          " 个已完成的联赛"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: leagueHistory.map((league, index) => /* @__PURE__ */ jsxs("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl shadow-lg overflow-hidden`, children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-4 sm:p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${index === 0 ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30" : theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsx(LucideTrophy, { className: index === 0 ? "text-yellow-400" : theme === "dark" ? "text-white/70" : "text-gray-600", size: 16 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.league_name }),
              /* @__PURE__ */ jsxs("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
                "Season ",
                league.season_number
              ] })
            ] })
          ] }),
          index === 0 && /* @__PURE__ */ jsx("div", { className: "px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded text-xs font-medium text-yellow-400", children: "最新" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `p-3 rounded-lg mb-4 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(LucideCrown, { className: "text-yellow-400", size: 20 }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "冠军" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-lg", children: league.winner.avatar }),
              /* @__PURE__ */ jsx("span", { className: `font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.winner.name })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx(LucideUsers, { size: 14, className: theme === "dark" ? "text-white/60" : "text-gray-500" }),
              /* @__PURE__ */ jsx("span", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "参赛人数" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.total_players })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx(LucideTarget, { size: 14, className: theme === "dark" ? "text-white/60" : "text-gray-500" }),
              /* @__PURE__ */ jsx("span", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "总轮数" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.total_rounds })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(LucideCalendar, { size: 14, className: theme === "dark" ? "text-white/60" : "text-gray-500" }),
            /* @__PURE__ */ jsx("span", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "时间信息" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: `text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`, children: "创建：" }),
              /* @__PURE__ */ jsx("span", { className: `ml-1 ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: formatDate(league.created_at) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: `text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`, children: "比赛：" }),
              /* @__PURE__ */ jsxs("span", { className: `ml-1 ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
                formatDate(league.start_date),
                " - ",
                formatDate(league.end_date)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
              "持续 ",
              formatDuration(league.start_date, league.end_date)
            ] })
          ] })
        ] })
      ] })
    ] }, league.id)) })
  ] });
};
const ScheduleConfirmationPage = ({
  leagueState,
  players,
  onConfirmSchedule,
  onRerollSchedule
}) => {
  const { theme } = useTheme();
  if (!leagueState || !leagueState.schedule || leagueState.schedule.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "text-white", children: "加载中..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "relative p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ jsx(LucideCalendar, { className: "text-orange-400", size: 32 }) }),
      /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ jsx("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-orange-500 bg-clip-text text-transparent"}`, children: "确认赛程安排" }),
        /* @__PURE__ */ jsxs("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
          leagueState.league_name,
          " - Season ",
          leagueState.season_number
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-yellow-500/10 border-yellow-500/30" : "bg-yellow-50 border-yellow-200"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(LucideAlertTriangle, { className: "text-yellow-500 flex-shrink-0", size: 20 }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: `font-semibold ${theme === "dark" ? "text-yellow-400" : "text-yellow-800"}`, children: "请仔细检查赛程安排" }),
        /* @__PURE__ */ jsx("p", { className: `text-sm mt-1 ${theme === "dark" ? "text-yellow-300/80" : "text-yellow-700"}`, children: "确认后联赛将正式开始。如果不满意当前安排，可以重新生成赛程。" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: `p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsx(LucideTrophy, { className: "text-orange-400", size: 20 }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "联赛信息" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsx("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "参赛人数" }),
          /* @__PURE__ */ jsxs("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            players.length,
            " 人"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ jsx("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "总轮数" }),
          /* @__PURE__ */ jsxs("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            leagueState.schedule.length,
            " 轮"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"} col-span-2 sm:col-span-1`, children: [
          /* @__PURE__ */ jsx("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "创建时间" }),
          /* @__PURE__ */ jsx("p", { className: `font-bold text-sm ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: leagueState.created_at && new Date(leagueState.created_at).toLocaleDateString("zh-CN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }) })
        ] })
      ] })
    ] }),
    leagueState.selected_special_rules && leagueState.selected_special_rules.length > 0 && /* @__PURE__ */ jsxs("div", { className: `p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsx(LucideSettings, { className: "text-orange-400", size: 20 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "特殊规则设置" }),
          /* @__PURE__ */ jsx("p", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "系统将从以下规则中随机选择" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: leagueState.selected_special_rules.map((rule, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `p-3 rounded-lg border text-sm ${theme === "dark" ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-700"}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(LucideCheck, { size: 14, className: "text-orange-400 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: rule })
          ] })
        },
        index
      )) }),
      /* @__PURE__ */ jsxs("div", { className: `mt-3 text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
        "共 ",
        leagueState.selected_special_rules.length,
        " 种可能的特殊规则"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsx(LucideCalendar, { className: "text-blue-400", size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "赛程预览" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onRerollSchedule,
            className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all duration-200",
            children: [
              /* @__PURE__ */ jsx(LucideDice6, { size: 16 }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "重新生成" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: leagueState.schedule.map((round, index) => /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("h4", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            "第 ",
            round.round,
            " 轮"
          ] }),
          /* @__PURE__ */ jsx("div", { className: `px-2 py-1 rounded text-xs font-medium ${theme === "dark" ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`, children: round.vpMode.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm", children: [
          /* @__PURE__ */ jsx(
            InfoCard,
            {
              icon: /* @__PURE__ */ jsx(LucideShield, { className: "text-blue-400" }),
              title: "安全牌",
              value: round.safeCards
            }
          ),
          /* @__PURE__ */ jsx(
            InfoCard,
            {
              icon: /* @__PURE__ */ jsx(LucideBomb, { className: "text-red-400" }),
              title: "炸弹牌",
              value: round.bombCards
            }
          ),
          /* @__PURE__ */ jsx(
            InfoCard,
            {
              icon: /* @__PURE__ */ jsx(LucideSwords, { className: "text-yellow-400" }),
              title: "手牌上限",
              value: round.handLimit === Infinity ? "无限制" : round.handLimit
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "sm:col-span-1 col-span-2", children: /* @__PURE__ */ jsx(
            InfoCard,
            {
              icon: /* @__PURE__ */ jsx(LucideDices, { className: "text-purple-400" }),
              title: "特殊规则",
              value: round.specialRule
            }
          ) })
        ] })
      ] }, round.round)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onRerollSchedule,
          className: "flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all duration-200 font-medium",
          children: [
            /* @__PURE__ */ jsx(LucideDice6, { size: 20 }),
            "重新生成赛程"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onConfirmSchedule,
          className: "flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-200 shadow-lg",
          children: [
            /* @__PURE__ */ jsx(LucideCheck, { size: 20 }),
            "确认并开始联赛"
          ]
        }
      )
    ] })
  ] });
};
let supabase;
function Index() {
  const [leagueState, setLeagueState] = useState(null);
  const [players, setPlayers] = useState([]);
  const [session, setSession] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(GAME_RULES.AVATARS[0]);
  const [showPlayerProfileModal, setShowPlayerProfileModal] = useState(false);
  const [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showCardDrawReminder, setShowCardDrawReminder] = useState(false);
  const [cardDrawRound, setCardDrawRound] = useState(1);
  const [appId, setAppId] = useState("default");
  const [currentPage, setCurrentPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leagueHistory, setLeagueHistory] = useState([]);
  const [currentLeagueName, setCurrentLeagueName] = useState("");
  const [nextSeasonNumber, setNextSeasonNumber] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingDeleteAction, setPendingDeleteAction] = useState(null);
  const [deleteModalTitle, setDeleteModalTitle] = useState("");
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const updatePlayersWithRankings = (newPlayers) => {
    const playersWithRankings = calculatePlayerRankings(newPlayers);
    setPlayers(playersWithRankings);
  };
  useEffect(() => {
    setIsHydrated(true);
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed !== null) {
      setSidebarCollapsed(JSON.parse(savedCollapsed));
    }
    const savedTheme = localStorage.getItem("boom-league-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const urlParams = new URLSearchParams(window.location.search);
    const canvasAppId = urlParams.get("app_id") || "default";
    setAppId(canvasAppId);
  }, []);
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed, isHydrated]);
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    if (!isHydrated) return;
    if (!supabase) {
      supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    }
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      if (!session2) {
        supabase.auth.signInAnonymously();
      }
      setIsAuthReady(true);
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session2) => {
      setSession(session2);
      setIsAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, [isHydrated]);
  const loadLeagueHistory = async () => {
    if (!supabase || !appId) return;
    try {
      const { data: historyData, error } = await supabase.from("league_history").select("*").eq("app_id", appId).order("season_number", { ascending: false });
      if (error) {
        console.error("Error loading league history:", error);
        return;
      }
      if (historyData) {
        const mappedHistory = leagueHistoryArrayFromSupabase(historyData);
        setLeagueHistory(mappedHistory);
        const latestSeason = mappedHistory.length > 0 ? mappedHistory[0].season_number : 0;
        setNextSeasonNumber(latestSeason + 1);
        setCurrentLeagueName(`Boom League S${latestSeason + 1}`);
      }
    } catch (error) {
      console.error("Error in loadLeagueHistory:", error);
    }
  };
  useEffect(() => {
    if (!isAuthReady || !supabase || !isHydrated) return;
    const fetchInitialData = async () => {
      const { data: leagueData, error: leagueError } = await supabase.from("league_state").select("*").eq("app_id", appId).single();
      if (leagueData) {
        const mappedLeagueState = leagueStateFromSupabase(leagueData);
        setLeagueState(mappedLeagueState);
        if (mappedLeagueState.winner) setWinner(mappedLeagueState.winner);
        else setWinner(null);
      } else {
        setLeagueState(null);
      }
      if (leagueError && leagueError.code !== "PGRST116") console.error("Error fetching league state:", leagueError);
      const { data: playersData, error: playersError } = await supabase.from("players").select("*").eq("app_id", appId);
      if (playersError) console.error("Error fetching players:", playersError);
      if (playersData) {
        const mappedPlayers = playersData.map((playerData) => {
          return playerFromSupabase(playerData);
        });
        mappedPlayers.sort((a, b) => b.score - a.score);
        updatePlayersWithRankings(mappedPlayers);
      }
    };
    fetchInitialData();
    const leagueChannel = supabase.channel(`league-state:${appId}`).on("postgres_changes", { event: "*", schema: "public", table: "league_state", filter: `app_id=eq.${appId}` }, (payload) => {
      const updatedState = leagueStateFromSupabase(payload.new);
      setLeagueState(updatedState);
      if (updatedState.winner) setWinner(updatedState.winner);
      else setWinner(null);
    }).subscribe();
    const playersChannel = supabase.channel(`players:${appId}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players", filter: `app_id=eq.${appId}` },
      (payload) => {
        if (payload.eventType === "INSERT") {
          const mappedPlayer = playerFromSupabase(payload.new);
          setPlayers((currentPlayers) => {
            const exists = currentPlayers.some((p) => p.id === mappedPlayer.id);
            const next = exists ? currentPlayers : [...currentPlayers, mappedPlayer];
            return next.sort((a, b) => b.score - a.score);
          });
        }
        if (payload.eventType === "UPDATE") {
          const mappedPlayer = playerFromSupabase(payload.new);
          setPlayers((currentPlayers) => currentPlayers.map((p) => p.id === mappedPlayer.id ? mappedPlayer : p).sort((a, b) => b.score - a.score));
        }
        if (payload.eventType === "DELETE") {
          setPlayers((currentPlayers) => currentPlayers.filter((p) => p.id !== payload.old.id));
        }
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(leagueChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [isAuthReady, appId, isHydrated]);
  const handleAddPlayer = async () => {
    console.log("handleAddPlayer called with:", { newPlayerName, selectedAvatar, playersLength: players.length });
    if (newPlayerName.trim() === "") {
      console.log("handleAddPlayer early return:", { nameEmpty: newPlayerName.trim() === "" });
      return;
    }
    const tempPlayer = {
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
    console.log("Adding temp player:", tempPlayer);
    setPlayers((curr) => [...curr, tempPlayer].sort((a, b) => b.score - a.score));
    console.log("Inserting into Supabase...");
    const playerData = {
      app_id: appId,
      name: tempPlayer.name,
      avatar: selectedAvatar,
      score: 0,
      history: [],
      championships: 0,
      totalVP: 0
    };
    const { data, error } = await supabase.from("players").insert(playerToSupabase(playerData)).select().single();
    console.log("Supabase insert result:", { data, error });
    if (error) {
      setPlayers((curr) => curr.filter((p) => p.id !== tempPlayer.id));
      console.error("Add player failed:", error);
    } else if (data) {
      console.log("Successfully added player, updating temp player with real data:", data);
      const mappedPlayer = playerFromSupabase(data);
      setPlayers(
        (curr) => curr.map((p) => p.id === tempPlayer.id ? mappedPlayer : p).sort((a, b) => b.score - a.score)
      );
    }
    setNewPlayerName("");
    setSelectedAvatar(GAME_RULES.AVATARS[0]);
    setShowPlayerModal(false);
  };
  const handleDeletePlayer = async (playerId) => {
    const playerToDelete = players.find((p) => p.id === playerId);
    const playerName = playerToDelete ? playerToDelete.name : "Unknown Player";
    const actualDeleteAction = async () => {
      const previous = players;
      setPlayers((curr) => curr.filter((p) => p.id !== playerId));
      const { error } = await supabase.from("players").delete().match({ id: playerId, app_id: appId });
      if (error) {
        console.error("Delete player failed:", error);
        setPlayers(previous);
      }
    };
    requestPasswordConfirmation(
      actualDeleteAction,
      "Delete Player",
      `This will permanently delete "${playerName}" and all their statistics. This action cannot be undone.`
    );
  };
  const generateSchedule = (playerCount, selectedSpecialRules = GAME_RULES.SPECIAL_RULES) => {
    let schedule = [];
    for (let i = 0; i < GAME_RULES.MAX_ROUNDS; i++) {
      const safeCardMultipliers = [1, 2, 3, 4, 5];
      const bombCardOptions = [playerCount, playerCount + 1];
      const handLimits = [4, 5, 6, Infinity];
      const roundSpecialRules = selectSpecialRules(selectedSpecialRules);
      const specialRuleText = formatSpecialRules(roundSpecialRules);
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
  };
  const handleConfirmSchedule = async () => {
    if (!leagueState) return;
    const confirmedLeagueState = {
      ...leagueState,
      status: "in_progress",
      current_round: 1
    };
    setLeagueState(confirmedLeagueState);
    const { error } = await supabase.from("league_state").update({
      status: "in_progress",
      current_round: 1
    }).eq("app_id", appId);
    if (error) {
      console.error("Confirm schedule failed:", error);
    }
  };
  const handleRerollSchedule = async () => {
    if (!leagueState) return;
    const selectedRules = leagueState.selected_special_rules || GAME_RULES.SPECIAL_RULES;
    const newSchedule = generateSchedule(players.length, selectedRules);
    const rerolledLeagueState = {
      ...leagueState,
      schedule: newSchedule
    };
    setLeagueState(rerolledLeagueState);
    const { error } = await supabase.from("league_state").update({
      schedule: newSchedule
    }).eq("app_id", appId);
    if (error) {
      console.error("Reroll schedule failed:", error);
    }
  };
  const handleStartLeague = async (selectedSpecialRules) => {
    if (players.length < 2) return;
    const schedule = generateSchedule(players.length, selectedSpecialRules);
    const currentDate = (/* @__PURE__ */ new Date()).toISOString();
    const leagueName = currentLeagueName || `Boom League S${nextSeasonNumber}`;
    const newLeagueState = {
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
    const { error } = await supabase.from("league_state").upsert(leagueStateToSupabase(newLeagueState), { onConflict: "app_id" });
    if (error) {
      console.error("Start league failed:", error);
    }
  };
  const handleResetLeague = async () => {
    const actualResetAction = async () => {
      setPlayers((curr) => curr.map((p) => ({ ...p, score: 0, history: [] })));
      setLeagueState({
        app_id: appId,
        status: "setup",
        current_round: 0,
        schedule: [],
        winner: null
      });
      setWinner(null);
      const [{ error: pErr }, { error: lErr }] = await Promise.all([
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
      if (pErr || lErr) {
        console.error("Reset league errors:", pErr, lErr);
      }
    };
    requestPasswordConfirmation(
      actualResetAction,
      "Reset League",
      "This will permanently reset the current league, clearing all scores and progress. All player statistics will be reset to zero."
    );
  };
  const handleAbortLeague = async () => {
    if (!leagueState) return;
    const actualAbortAction = async () => {
      if (leagueState.current_round > 1) {
        const abortedLeagueState = {
          ...leagueState,
          winner: {
            name: "联赛中止",
            avatar: "⚠️",
            reason: `联赛在第 ${leagueState.current_round - 1} 轮后被中止`
          },
          end_date: (/* @__PURE__ */ new Date()).toISOString()
        };
        await saveLeagueToHistory(abortedLeagueState, players);
      }
      setPlayers((curr) => curr.map((p) => ({ ...p, score: 0, history: [] })));
      setLeagueState(null);
      setWinner(null);
      setCurrentPage("league");
      const [{ error: pErr }, { error: lErr }] = await Promise.all([
        supabase.from("players").update({ score: 0, history: [] }).eq("app_id", appId),
        supabase.from("league_state").delete().eq("app_id", appId)
      ]);
      if (pErr || lErr) {
        console.error("Abort league errors:", pErr, lErr);
      } else {
        await loadLeagueHistory();
      }
    };
    const leagueName = leagueState.league_name || "Current League";
    requestPasswordConfirmation(
      actualAbortAction,
      "Abort League",
      `This will permanently abort "${leagueName}" and delete all current progress. If the league has progressed beyond round 1, it will be saved to history as aborted.`
    );
  };
  const handleBackToLeagueManagement = () => {
    setCurrentPage("league");
  };
  const handlePlayerClick = (player) => {
    setSelectedPlayerForProfile(player);
    setShowPlayerProfileModal(true);
  };
  const requestPasswordConfirmation = (action, title, message) => {
    setPendingDeleteAction(() => action);
    setDeleteModalTitle(title);
    setDeleteModalMessage(message);
    setShowPasswordModal(true);
  };
  const handlePasswordConfirm = () => {
    if (pendingDeleteAction) {
      pendingDeleteAction();
      setPendingDeleteAction(null);
    }
    setShowPasswordModal(false);
  };
  const handlePasswordCancel = () => {
    setPendingDeleteAction(null);
    setShowPasswordModal(false);
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (isHydrated) {
      localStorage.setItem("boom-league-theme", newTheme);
    }
  };
  const saveLeagueToHistory = async (finalLeagueState, finalPlayers) => {
    if (!finalLeagueState.winner || !finalLeagueState.league_name) return;
    const historyEntry = {
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
    };
    const { error } = await supabase.from("league_history").insert(leagueHistoryToSupabase(historyEntry));
    if (error) {
      console.error("Error saving league to history:", error);
    } else {
      await loadLeagueHistory();
    }
  };
  const handleAdvanceRound = async (results) => {
    if (!leagueState) return;
    const currentRoundIndex = leagueState.current_round - 1;
    const vpMode = leagueState.schedule[currentRoundIndex].vpMode;
    const updatedPlayersData = [...players];
    const playerUpdates = [];
    for (const [index, playerId] of results.entries()) {
      const player = updatedPlayersData.find((p) => p.id === playerId);
      if (!player) continue;
      const points = vpMode.scores[index] || 0;
      const newScore = player.score + points;
      const newTotalVP = (player.totalVP || 0) + points;
      player.score = newScore;
      player.totalVP = newTotalVP;
      player.history = [...player.history, { round: leagueState.current_round, placement: index + 1 }];
      playerUpdates.push(
        supabase.from("players").update({
          score: newScore,
          total_vp: newTotalVP,
          history: player.history
        }).match({ id: playerId, app_id: appId })
      );
    }
    const roundResults = results.map((playerId, index) => ({
      playerId,
      placement: index + 1
    }));
    const playersWithRoundStats = UTILS.updateRoundStatistics(updatedPlayersData, roundResults);
    const roundStatUpdates = playersWithRoundStats.map((player) => {
      const roundStatsData = playerToSupabase({
        roundChampionships: player.roundChampionships,
        roundRunnerUp: player.roundRunnerUp,
        roundThirdPlace: player.roundThirdPlace,
        totalRounds: player.totalRounds,
        roundAveragePlacement: player.roundAveragePlacement,
        roundWinRate: player.roundWinRate
      });
      return supabase.from("players").update(roundStatsData).match({ id: player.id, app_id: appId });
    });
    playerUpdates.push(...roundStatUpdates);
    updatePlayersWithRankings(playersWithRoundStats.sort((a, b) => b.score - a.score));
    const potentialWinners = playersWithRoundStats.filter((p) => p.score >= GAME_RULES.WIN_SCORE).sort((a, b) => b.score - a.score);
    let potentialWinner = potentialWinners.length > 0 ? potentialWinners[0] : null;
    let nextRound = leagueState.current_round + 1;
    let newStatus = leagueState.status;
    let finalWinner = null;
    if (potentialWinner) {
      finalWinner = { name: potentialWinner.name, avatar: potentialWinner.avatar, reason: `在第 ${leagueState.current_round} 轮率先达到 ${potentialWinner.score} 分！` };
      newStatus = "finished";
    } else if (nextRound > GAME_RULES.MAX_ROUNDS) {
      newStatus = "finished";
      const sortedPlayers = playersWithRoundStats.sort((a, b) => b.score - a.score);
      const topScore = sortedPlayers[0].score;
      const winners = sortedPlayers.filter((p) => p.score === topScore);
      if (winners.length > 1) {
        finalWinner = { name: winners.map((w) => w.name).join(" 和 "), avatar: "⚔️", reason: `5轮后平分 (${topScore}分)，需要进行加赛对决！` };
      } else {
        finalWinner = { name: sortedPlayers[0].name, avatar: sortedPlayers[0].avatar, reason: `5轮后以最高分 (${topScore}分) 获胜！` };
      }
    }
    await Promise.all(playerUpdates);
    setLeagueState((curr) => ({
      ...curr ?? {},
      app_id: appId,
      current_round: nextRound,
      status: newStatus,
      winner: finalWinner,
      schedule: (curr == null ? void 0 : curr.schedule) ?? leagueState.schedule
    }));
    await supabase.from("league_state").update({
      current_round: nextRound,
      status: newStatus,
      winner: finalWinner
    }).eq("app_id", appId);
    if (newStatus === "finished" && finalWinner) {
      const finalStandings = playersWithRoundStats.sort((a, b) => b.score - a.score);
      const leagueResults = finalStandings.map((player, index) => ({
        playerId: player.id,
        finalPlacement: index + 1
      }));
      const playersWithUpdatedStats = UTILS.updateLeagueStatistics(playersWithRoundStats, leagueResults);
      updatePlayersWithRankings(playersWithUpdatedStats);
      const statisticsUpdates = playersWithUpdatedStats.map((player) => {
        const playerUpdateData = playerToSupabase({
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
      const finalLeagueState = {
        ...leagueState,
        current_round: nextRound,
        winner: finalWinner,
        end_date: (/* @__PURE__ */ new Date()).toISOString()
      };
      await saveLeagueToHistory(finalLeagueState, playersWithUpdatedStats);
    }
    setShowResultsModal(false);
    setCardDrawRound(leagueState.current_round);
    setShowCardDrawReminder(true);
  };
  const renderInProgress = () => {
    if (!leagueState) return /* @__PURE__ */ jsx("div", { className: "text-white", children: "加载中..." });
    if (leagueState.status === "setup") {
      setCurrentPage("league");
      return /* @__PURE__ */ jsx("div", { className: "text-white", children: "重定向到联赛管理..." });
    }
    if (leagueState.status === "finished") {
      return /* @__PURE__ */ jsx("div", { className: "space-y-4 sm:space-y-6", children: /* @__PURE__ */ jsxs("div", { className: `text-center p-6 sm:p-8 lg:p-10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg flex flex-col items-center gap-3 sm:gap-4 border-2 border-yellow-400 ${theme === "dark" ? "bg-gray-800/70" : "bg-white/80"}`, children: [
        /* @__PURE__ */ jsx(LucideCrown, { className: "text-yellow-400", size: 60 }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-300", children: leagueState.league_name || "联赛结束！" }),
          leagueState.season_number && /* @__PURE__ */ jsxs("p", { className: `text-lg sm:text-xl mt-2 ${theme === "dark" ? "text-yellow-400/80" : "text-yellow-600"}`, children: [
            "Season ",
            leagueState.season_number,
            " 完成"
          ] })
        ] }),
        leagueState.winner && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4", children: leagueState.winner.avatar }),
          /* @__PURE__ */ jsx("p", { className: `text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.winner.name }),
          /* @__PURE__ */ jsx("p", { className: `text-base sm:text-lg lg:text-xl mt-2 px-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: leagueState.winner.reason })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleResetLeague,
            className: "mt-6 sm:mt-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base",
            children: "开启新联赛"
          }
        )
      ] }) });
    }
    if (!leagueState.schedule || leagueState.schedule.length === 0) return /* @__PURE__ */ jsx("div", { className: "text-white", children: "加载中..." });
    const currentRoundConfig = leagueState.schedule[leagueState.current_round - 1];
    if (!currentRoundConfig) return /* @__PURE__ */ jsx("div", { className: "text-white", children: "比赛结束！" });
    return /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: `backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: `p-2.5 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ jsx(LucideTrophy, { className: "text-orange-400", size: 22 }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h1", { className: `${TYPOGRAPHY.COMBINATIONS.pageTitle} ${theme === "dark" ? "text-white/95" : "text-gray-900"} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`, children: leagueState.league_name || "Boom League" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1", children: [
                leagueState.season_number && /* @__PURE__ */ jsxs("p", { className: `${TYPOGRAPHY.COMBINATIONS.bodySmall} ${theme === "dark" ? "text-white/60" : "text-gray-600"} ${LINE_HEIGHTS.normal}`, children: [
                  "Season ",
                  leagueState.season_number
                ] }),
                leagueState.season_number && leagueState.created_at && /* @__PURE__ */ jsx("span", { className: `hidden sm:inline ${TYPOGRAPHY.COMBINATIONS.bodySmall} ${theme === "dark" ? "text-white/40" : "text-gray-400"}`, children: "•" }),
                leagueState.created_at && /* @__PURE__ */ jsxs("p", { className: `${TYPOGRAPHY.COMBINATIONS.bodySmall} ${theme === "dark" ? "text-white/60" : "text-gray-600"} ${LINE_HEIGHTS.normal}`, children: [
                  "创建于 ",
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
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleBackToLeagueManagement,
                className: `flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg ${TYPOGRAPHY.COMBINATIONS.button} transition-all duration-200 ${theme === "dark" ? "bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/50" : "bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 hover:text-gray-900 border border-gray-300/50"} ${LINE_HEIGHTS.tight}`,
                children: [
                  /* @__PURE__ */ jsx(LucideChevronLeft, { size: 16 }),
                  /* @__PURE__ */ jsx("span", { className: "hidden xs:inline", children: "返回管理" }),
                  /* @__PURE__ */ jsx("span", { className: "xs:hidden", children: "返回" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleAbortLeague,
                className: `flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg ${TYPOGRAPHY.COMBINATIONS.button} transition-all duration-200 ${theme === "dark" ? "bg-red-900/30 hover:bg-red-800/40 text-red-400 hover:text-red-300 border border-red-800/50" : "bg-red-100/50 hover:bg-red-200/50 text-red-700 hover:text-red-800 border border-red-300/50"} ${LINE_HEIGHTS.tight}`,
                children: [
                  /* @__PURE__ */ jsx(LucideX, { size: 16 }),
                  /* @__PURE__ */ jsx("span", { className: "hidden xs:inline", children: "中止联赛" }),
                  /* @__PURE__ */ jsx("span", { className: "xs:hidden", children: "中止" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between p-3 sm:p-4 rounded-lg ${theme === "dark" ? "bg-white/5 border border-white/10" : "bg-gray-100/50 border border-gray-200"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `p-1.5 rounded-lg ${theme === "dark" ? "bg-green-500/20 border-green-500/30" : "bg-green-100 border-green-200"} border`, children: /* @__PURE__ */ jsx(LucideGamepad2, { className: "text-green-500", size: 18 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: `${TYPOGRAPHY.COMBINATIONS.emphasized} ${theme === "dark" ? "text-white/90" : "text-gray-900"} ${LINE_HEIGHTS.tight}`, children: "联赛进行中" }),
              /* @__PURE__ */ jsxs("p", { className: `${TYPOGRAPHY.COMBINATIONS.caption} ${theme === "dark" ? "text-white/60" : "text-gray-600"} ${LINE_HEIGHTS.normal}`, children: [
                "第 ",
                leagueState.current_round,
                " 轮 / 共 ",
                GAME_RULES.MAX_ROUNDS,
                " 轮"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `px-3 py-1.5 rounded-lg ${TYPOGRAPHY.COMBINATIONS.badge} ${theme === "dark" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-green-100 text-green-700 border border-green-200"} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.wide}`, children: [
            "ROUND ",
            leagueState.current_round
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Leaderboard, { players, onPlayerClick: handlePlayerClick }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2 gap-5 sm:gap-6 md:gap-8", children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-5 sm:gap-6 md:gap-8 xl:col-span-2 2xl:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: `backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6", children: [
            /* @__PURE__ */ jsxs("h2", { className: `${TYPOGRAPHY.COMBINATIONS.sectionTitle} text-orange-400 ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`, children: [
              "第 ",
              leagueState.current_round,
              " / ",
              GAME_RULES.MAX_ROUNDS,
              " 轮"
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setShowResultsModal(true),
                className: `bg-green-500 hover:bg-green-600 active:bg-green-700 text-white ${TYPOGRAPHY.COMBINATIONS.button} py-3 sm:py-4 md:py-5 px-5 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 ${LINE_HEIGHTS.tight} min-h-touch text-base sm:text-lg md:text-xl font-semibold`,
                children: [
                  /* @__PURE__ */ jsx(LucideClipboardList, { size: 20, className: "flex-shrink-0 sm:w-6 sm:h-6" }),
                  /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "输入本轮结果" }),
                  /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "结果" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6", children: [
            /* @__PURE__ */ jsx(InfoCard, { icon: /* @__PURE__ */ jsx(LucideShield, { className: "text-blue-400" }), title: "安全牌数量", value: currentRoundConfig.safeCards }),
            /* @__PURE__ */ jsx(InfoCard, { icon: /* @__PURE__ */ jsx(LucideBomb, { className: "text-red-400" }), title: "炸弹牌数量", value: currentRoundConfig.bombCards }),
            /* @__PURE__ */ jsx(InfoCard, { icon: /* @__PURE__ */ jsx(LucideSwords, { className: "text-yellow-400" }), title: "出战手牌上限", value: currentRoundConfig.handLimit === Infinity ? "无限制" : currentRoundConfig.handLimit }),
            /* @__PURE__ */ jsx(InfoCard, { icon: /* @__PURE__ */ jsx(LucideTrophy, { className: "text-green-400" }), title: "VP 奖励模式", value: currentRoundConfig.vpMode.name }),
            /* @__PURE__ */ jsx("div", { className: "md:col-span-2 xl:col-span-1", children: /* @__PURE__ */ jsx(InfoCard, { icon: /* @__PURE__ */ jsx(LucideDices, { className: "text-purple-400" }), title: "特殊规则", value: currentRoundConfig.specialRule }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-5 sm:gap-6 md:gap-8", children: /* @__PURE__ */ jsx(ScheduleTimeline, { schedule: leagueState.schedule, currentRound: leagueState.current_round }) })
      ] })
    ] });
  };
  const renderCurrentPage = () => {
    if (!isHydrated || !isAuthReady) {
      return /* @__PURE__ */ jsx("div", { className: "text-center text-2xl p-8", children: "正在加载..." });
    }
    if (leagueState && leagueState.status === "pending_confirmation") {
      return /* @__PURE__ */ jsx(
        ScheduleConfirmationPage,
        {
          leagueState,
          players,
          onConfirmSchedule: handleConfirmSchedule,
          onRerollSchedule: handleRerollSchedule
        }
      );
    }
    switch (currentPage) {
      case "home":
        return /* @__PURE__ */ jsx(
          HomePage,
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
        return /* @__PURE__ */ jsx(
          PlayerRegistrationPage,
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
        return /* @__PURE__ */ jsx(
          LeagueManagementPage,
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
        return /* @__PURE__ */ jsx(
          PlayerRankingsPage,
          {
            players,
            onPlayerClick: handlePlayerClick
          }
        );
      case "history":
        return /* @__PURE__ */ jsx(
          LeagueHistoryPage,
          {
            leagueHistory
          }
        );
      default:
        return /* @__PURE__ */ jsx(
          HomePage,
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
  };
  const themeClasses = {
    container: theme === "dark" ? "min-h-screen bg-[#0a0a0a] text-white font-sans flex relative overflow-hidden" : "min-h-screen bg-gray-50 text-gray-900 font-sans flex relative overflow-hidden",
    background: theme === "dark" ? "absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" : "absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100",
    radialGlow1: theme === "dark" ? "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.03)_0%,_transparent_50%)]" : "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(0,0,0,0.02)_0%,_transparent_50%)]",
    radialGlow2: theme === "dark" ? "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(251,146,60,0.08)_0%,_transparent_50%)]" : "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(251,146,60,0.06)_0%,_transparent_50%)]",
    pattern: theme === "dark" ? "absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(255,255,255,0.02)_49%,_rgba(255,255,255,0.02)_51%,_transparent_52%)] bg-[length:20px_20px]" : "absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(0,0,0,0.01)_49%,_rgba(0,0,0,0.01)_51%,_transparent_52%)] bg-[length:20px_20px]"
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: { theme, toggleTheme }, children: /* @__PURE__ */ jsxs("div", { className: themeClasses.container, children: [
    /* @__PURE__ */ jsx("div", { className: themeClasses.background }),
    /* @__PURE__ */ jsx("div", { className: themeClasses.radialGlow1 }),
    /* @__PURE__ */ jsx("div", { className: themeClasses.radialGlow2 }),
    /* @__PURE__ */ jsx("div", { className: themeClasses.pattern }),
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        currentPage,
        setCurrentPage,
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} relative`, children: [
      /* @__PURE__ */ jsxs("header", { className: `lg:hidden flex items-center justify-between p-4 sm:p-5 md:p-6 border-b ${theme === "dark" ? "border-white/10 bg-black/40" : "border-gray-200/50 bg-white/80"} backdrop-blur-2xl sticky top-0 z-40`, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSidebarOpen(true),
            className: `min-h-touch min-w-touch p-3 sm:p-3.5 rounded-xl transition-all duration-200 border border-transparent active:scale-95 ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
            children: /* @__PURE__ */ jsx(LucideMenu, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 sm:p-2.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-xl", children: /* @__PURE__ */ jsx(LucideCat, { className: "text-orange-400 w-[18px] h-[18px] sm:w-5 sm:h-5" }) }),
          /* @__PURE__ */ jsx("h1", { className: `text-base sm:text-lg md:text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} tracking-tight`, children: "Boom League" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-12 sm:w-14" }),
        " "
      ] }),
      /* @__PURE__ */ jsx("main", { className: "p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 relative z-10 min-h-screen", children: renderCurrentPage() })
    ] }),
    showPlayerModal && /* @__PURE__ */ jsx(Modal, { onClose: () => setShowPlayerModal(false), title: "Add New Player", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: `font-medium mb-2 block text-sm ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "Player Name" }),
        /* @__PURE__ */ jsx(
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
      /* @__PURE__ */ jsxs("div", { className: "mb-4 sm:mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: `font-medium mb-2 sm:mb-3 block text-sm ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "Choose Avatar" }),
        /* @__PURE__ */ jsx("div", { className: `grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-40 sm:max-h-48 overflow-y-auto p-3 sm:p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50/80 border-gray-200"}`, children: GAME_RULES.AVATARS.map((avatar, index) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedAvatar(avatar),
            className: `text-lg sm:text-xl p-2 sm:p-2.5 rounded-lg transition-all duration-200 border active:scale-95 ${selectedAvatar === avatar ? "bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.3)] scale-110" : theme === "dark" ? "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105" : "bg-white/50 border-gray-200 hover:bg-gray-100/50 hover:scale-105"}`,
            children: avatar
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleAddPlayer,
          className: "relative group w-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 active:from-emerald-500/40 active:to-emerald-600/40 text-emerald-400 font-semibold py-3 sm:py-4 px-6 rounded-lg border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98]",
          children: [
            /* @__PURE__ */ jsxs("span", { className: "relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base", children: [
              /* @__PURE__ */ jsx(LucidePlus, { size: 18 }),
              "Add Player"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" })
          ]
        }
      )
    ] }) }),
    showResultsModal && leagueState && /* @__PURE__ */ jsx(
      ResultsModal,
      {
        players,
        onClose: () => setShowResultsModal(false),
        onSubmit: handleAdvanceRound,
        round: leagueState.current_round
      }
    ),
    showPlayerProfileModal && selectedPlayerForProfile && /* @__PURE__ */ jsx(
      PlayerProfileModal,
      {
        player: selectedPlayerForProfile,
        onClose: () => {
          setShowPlayerProfileModal(false);
          setSelectedPlayerForProfile(null);
        }
      }
    ),
    showCardDrawReminder && /* @__PURE__ */ jsx(
      CardDrawReminder,
      {
        players,
        round: cardDrawRound,
        onClose: () => setShowCardDrawReminder(false)
      }
    ),
    showPasswordModal && /* @__PURE__ */ jsx(
      PasswordModal,
      {
        isOpen: showPasswordModal,
        onClose: handlePasswordCancel,
        onConfirm: handlePasswordConfirm,
        title: deleteModalTitle,
        message: deleteModalMessage
      }
    )
  ] }) });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DQPH_wVQ.js", "imports": ["/assets/jsx-runtime-DSTfpXA4.js", "/assets/components-C4KrZ7SF.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-DBjK-r50.js", "imports": ["/assets/jsx-runtime-DSTfpXA4.js", "/assets/components-C4KrZ7SF.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BXOVSrEq.js", "imports": ["/assets/jsx-runtime-DSTfpXA4.js"], "css": [] } }, "url": "/assets/manifest-936f858a.js", "version": "936f858a" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
