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
import { jsxDEV } from "react/jsx-dev-runtime";
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
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "node_modules/@remix-run/dev/dist/config/defaults/entry.server.node.tsx",
          lineNumber: 66,
          columnNumber: 7
        },
        this
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
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "node_modules/@remix-run/dev/dist/config/defaults/entry.server.node.tsx",
          lineNumber: 116,
          columnNumber: 7
        },
        this
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
var tailwind_default = "/build/_assets/tailwind-FR6D7W5T.css?url";

// app/root.tsx
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
var links = () => [
  { rel: "stylesheet", href: tailwind_default },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bangers&family=Noto+Sans+SC:wght@400;700&display=swap" }
];
function App() {
  return /* @__PURE__ */ jsxDEV2("html", { lang: "en", children: [
    /* @__PURE__ */ jsxDEV2("head", { children: [
      /* @__PURE__ */ jsxDEV2("meta", { charSet: "utf-8" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 20,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 21,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 22,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 23,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 19,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV2("body", { children: [
      /* @__PURE__ */ jsxDEV2(Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 26,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 27,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 28,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 25,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 18,
    columnNumber: 5
  }, this);
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index
});
import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import { LucideCat, LucideSwords, LucideCrown, LucideShield, LucideBomb, LucideScrollText, LucideUsers, LucidePlus, LucideTrash2, LucideTrophy, LucideDices, LucideClipboardList, LucideHome, LucideUserPlus, LucideGamepad2, LucideBarChart3, LucideMenu, LucideX, LucideSun, LucideMoon } from "lucide-react";
import { Fragment, jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
var ThemeContext = createContext(void 0), useTheme = () => {
  let context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}, supabaseUrl = "https://gatiuwpldvmxeeraldue.supabase.co", supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdGl1d3BsZHZteGVlcmFsZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MDAwNjQsImV4cCI6MjA3MDI3NjA2NH0.Ncs_pWIXZJ5gVw9PasggTAGWgQX9OnUGTnpjHg1eZvE", supabase, UTILS = {
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
}, GAME_RULES = {
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
function Index() {
  let [leagueState, setLeagueState] = useState(null), [players, setPlayers] = useState([]), [session, setSession] = useState(null), [isAuthReady, setIsAuthReady] = useState(!1), [showPlayerModal, setShowPlayerModal] = useState(!1), [showResultsModal, setShowResultsModal] = useState(!1), [newPlayerName, setNewPlayerName] = useState(""), [selectedAvatar, setSelectedAvatar] = useState(GAME_RULES.AVATARS[0]), [showPlayerProfileModal, setShowPlayerProfileModal] = useState(!1), [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState(null), [winner, setWinner] = useState(null), [appId, setAppId] = useState("default"), [currentPage, setCurrentPage] = useState("home"), [sidebarOpen, setSidebarOpen] = useState(!1), [theme, setTheme] = useState("dark");
  useEffect(() => {
    if (typeof window < "u") {
      let canvasAppId = new URLSearchParams(window.location.search).get("app_id") || "default";
      setAppId(canvasAppId);
      let savedTheme = localStorage.getItem("boom-league-theme");
      savedTheme && setTheme(savedTheme), supabase = createClient(supabaseUrl, supabaseAnonKey), supabase.auth.getSession().then(({ data: { session: session2 } }) => {
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
      // 亚军次数
      thirdPlace: 0
      // 季军次数
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
      // 亚军次数
      thirdPlace: 0
      // 季军次数
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
      return /* @__PURE__ */ jsxDEV3("div", { className: "text-white", children: "\u52A0\u8F7D\u4E2D..." }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 627,
        columnNumber: 96
      }, this);
    let currentRoundConfig = leagueState.schedule[leagueState.current_round - 1];
    return currentRoundConfig ? /* @__PURE__ */ jsxDEV3("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "lg:col-span-1 flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxDEV3(Leaderboard, { players, onPlayerClick: handlePlayerClick }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 634,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3(PlayerProfiles, { players, onPlayerClick: handlePlayerClick }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 635,
          columnNumber: 21
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 633,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "lg:col-span-2 flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxDEV3("div", { className: "bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700", children: [
          /* @__PURE__ */ jsxDEV3("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsxDEV3("h2", { className: "text-3xl font-bold text-orange-400", children: [
              "\u7B2C ",
              leagueState.current_round,
              " / ",
              GAME_RULES.MAX_ROUNDS,
              " \u8F6E"
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 640,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3("button", { onClick: () => setShowResultsModal(!0), className: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDEV3(LucideClipboardList, { size: 20 }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 642,
                columnNumber: 33
              }, this),
              " \u8F93\u5165\u672C\u8F6E\u7ED3\u679C"
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 641,
              columnNumber: 29
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 639,
            columnNumber: 26
          }, this),
          /* @__PURE__ */ jsxDEV3("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-lg", children: [
            /* @__PURE__ */ jsxDEV3(InfoCard, { icon: /* @__PURE__ */ jsxDEV3(LucideShield, { className: "text-blue-400" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 646,
              columnNumber: 45
            }, this), title: "\u5B89\u5168\u724C\u6570\u91CF", value: currentRoundConfig.safeCards }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 646,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3(InfoCard, { icon: /* @__PURE__ */ jsxDEV3(LucideBomb, { className: "text-red-400" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 647,
              columnNumber: 45
            }, this), title: "\u70B8\u5F39\u724C\u6570\u91CF", value: currentRoundConfig.bombCards }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 647,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3(InfoCard, { icon: /* @__PURE__ */ jsxDEV3(LucideSwords, { className: "text-yellow-400" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 648,
              columnNumber: 45
            }, this), title: "\u51FA\u6218\u624B\u724C\u4E0A\u9650", value: currentRoundConfig.handLimit === 1 / 0 ? "\u65E0\u9650\u5236" : currentRoundConfig.handLimit }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 648,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3(InfoCard, { icon: /* @__PURE__ */ jsxDEV3(LucideTrophy, { className: "text-green-400" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 649,
              columnNumber: 45
            }, this), title: "VP \u5956\u52B1\u6A21\u5F0F", value: currentRoundConfig.vpMode.name }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 649,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3(InfoCard, { icon: /* @__PURE__ */ jsxDEV3(LucideDices, { className: "text-purple-400" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 650,
              columnNumber: 45
            }, this), title: "\u7279\u6B8A\u89C4\u5219", value: currentRoundConfig.specialRule }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 650,
              columnNumber: 29
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 645,
            columnNumber: 25
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 638,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3(ScheduleTimeline, { schedule: leagueState.schedule, currentRound: leagueState.current_round }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 653,
          columnNumber: 22
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 637,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 632,
      columnNumber: 13
    }, this) : /* @__PURE__ */ jsxDEV3("div", { className: "text-white", children: "\u6BD4\u8D5B\u7ED3\u675F\uFF01" }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 629,
      columnNumber: 41
    }, this);
  }, renderCurrentPage = () => {
    if (!isAuthReady)
      return /* @__PURE__ */ jsxDEV3("div", { className: "text-center text-2xl p-8", children: "\u6B63\u5728\u8FDE\u63A5\u670D\u52A1\u5668..." }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 661,
        columnNumber: 20
      }, this);
    switch (currentPage) {
      case "home":
        return /* @__PURE__ */ jsxDEV3(
          HomePage,
          {
            leagueState,
            players,
            handleStartLeague,
            handleResetLeague,
            handlePlayerClick
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 666,
            columnNumber: 24
          },
          this
        );
      case "registration":
        return /* @__PURE__ */ jsxDEV3(
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
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 674,
            columnNumber: 24
          },
          this
        );
      case "league":
        return /* @__PURE__ */ jsxDEV3(
          LeagueManagementPage,
          {
            leagueState,
            players,
            handleStartLeague,
            handleResetLeague,
            renderInProgress,
            setShowResultsModal
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 687,
            columnNumber: 24
          },
          this
        );
      case "rankings":
        return /* @__PURE__ */ jsxDEV3(
          PlayerRankingsPage,
          {
            players,
            onPlayerClick: handlePlayerClick
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 696,
            columnNumber: 24
          },
          this
        );
      default:
        return /* @__PURE__ */ jsxDEV3(
          HomePage,
          {
            leagueState,
            players,
            handleStartLeague,
            handleResetLeague,
            handlePlayerClick
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 701,
            columnNumber: 24
          },
          this
        );
    }
  }, themeClasses = {
    container: theme === "dark" ? "min-h-screen bg-[#0a0a0a] text-white font-sans flex relative overflow-hidden" : "min-h-screen bg-gray-50 text-gray-900 font-sans flex relative overflow-hidden",
    background: theme === "dark" ? "absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" : "absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100",
    radialGlow1: theme === "dark" ? "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.03)_0%,_transparent_50%)]" : "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(0,0,0,0.02)_0%,_transparent_50%)]",
    radialGlow2: theme === "dark" ? "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(251,146,60,0.08)_0%,_transparent_50%)]" : "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(251,146,60,0.06)_0%,_transparent_50%)]",
    pattern: theme === "dark" ? "absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(255,255,255,0.02)_49%,_rgba(255,255,255,0.02)_51%,_transparent_52%)] bg-[length:20px_20px]" : "absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(0,0,0,0.01)_49%,_rgba(0,0,0,0.01)_51%,_transparent_52%)] bg-[length:20px_20px]"
  };
  return /* @__PURE__ */ jsxDEV3(ThemeContext.Provider, { value: { theme, toggleTheme }, children: /* @__PURE__ */ jsxDEV3("div", { className: themeClasses.container, children: [
    /* @__PURE__ */ jsxDEV3("div", { className: themeClasses.background }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 733,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: themeClasses.radialGlow1 }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 734,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: themeClasses.radialGlow2 }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 735,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: themeClasses.pattern }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 736,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV3(
      Sidebar,
      {
        currentPage,
        setCurrentPage,
        sidebarOpen,
        setSidebarOpen,
        players,
        onPlayerClick: handlePlayerClick
      },
      void 0,
      !1,
      {
        fileName: "app/routes/_index.tsx",
        lineNumber: 739,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV3("div", { className: "flex-1 lg:ml-0 relative", children: [
      /* @__PURE__ */ jsxDEV3("header", { className: `lg:hidden flex items-center justify-between p-4 border-b ${theme === "dark" ? "border-white/10 bg-black/40" : "border-gray-200/50 bg-white/80"} backdrop-blur-2xl`, children: [
        /* @__PURE__ */ jsxDEV3(
          "button",
          {
            onClick: () => setSidebarOpen(!0),
            className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
            children: /* @__PURE__ */ jsxDEV3(LucideMenu, { size: 18 }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 756,
              columnNumber: 25
            }, this)
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 752,
            columnNumber: 21
          },
          this
        ),
        /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV3("div", { className: "p-1.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg", children: /* @__PURE__ */ jsxDEV3(LucideCat, { className: "text-orange-400", size: 18 }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 760,
            columnNumber: 29
          }, this) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 759,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV3("h1", { className: `text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} tracking-tight`, children: "Boom League" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 762,
            columnNumber: 25
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 758,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "w-8" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 764,
          columnNumber: 21
        }, this),
        " "
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 751,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("main", { className: "p-6 lg:p-8 relative z-10", children: renderCurrentPage() }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 768,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 749,
      columnNumber: 13
    }, this),
    showPlayerModal && /* @__PURE__ */ jsxDEV3(Modal, { onClose: () => setShowPlayerModal(!1), title: "Add New Player", children: /* @__PURE__ */ jsxDEV3("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxDEV3("div", { children: [
        /* @__PURE__ */ jsxDEV3("label", { className: "text-white/90 font-medium mb-2 block text-sm", children: "Player Name" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 777,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDEV3(
          "input",
          {
            type: "text",
            value: newPlayerName,
            onChange: (e) => setNewPlayerName(e.target.value),
            placeholder: "Enter player name",
            className: "w-full bg-white/5 text-white p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200 backdrop-blur-sm"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 778,
            columnNumber: 33
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 776,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { children: [
        /* @__PURE__ */ jsxDEV3("label", { className: "text-white/90 font-medium mb-3 block text-sm", children: "Choose Avatar" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 788,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "grid grid-cols-6 gap-2 max-h-32 overflow-y-auto bg-white/5 p-4 rounded-lg border border-white/10", children: GAME_RULES.AVATARS.map((avatar, index) => /* @__PURE__ */ jsxDEV3(
          "button",
          {
            onClick: () => setSelectedAvatar(avatar),
            className: `text-xl p-2.5 rounded-lg transition-all duration-200 border ${selectedAvatar === avatar ? "bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.3)] scale-110" : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105"}`,
            children: avatar
          },
          index,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 791,
            columnNumber: 41
          },
          this
        )) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 789,
          columnNumber: 33
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 787,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDEV3(
        "button",
        {
          onClick: handleAddPlayer,
          className: "relative group bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 text-emerald-400 font-semibold py-3 px-6 rounded-lg border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
          children: [
            /* @__PURE__ */ jsxDEV3("span", { className: "relative z-10", children: "Add Player" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 810,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV3("div", { className: "absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 811,
              columnNumber: 33
            }, this)
          ]
        },
        void 0,
        !0,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 806,
          columnNumber: 29
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 775,
      columnNumber: 25
    }, this) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 774,
      columnNumber: 21
    }, this),
    showResultsModal && leagueState && /* @__PURE__ */ jsxDEV3(
      ResultsModal,
      {
        players,
        onClose: () => setShowResultsModal(!1),
        onSubmit: handleAdvanceRound,
        round: leagueState.current_round
      },
      void 0,
      !1,
      {
        fileName: "app/routes/_index.tsx",
        lineNumber: 818,
        columnNumber: 21
      },
      this
    ),
    showPlayerProfileModal && selectedPlayerForProfile && /* @__PURE__ */ jsxDEV3(
      PlayerProfileModal,
      {
        player: selectedPlayerForProfile,
        onClose: () => {
          setShowPlayerProfileModal(!1), setSelectedPlayerForProfile(null);
        }
      },
      void 0,
      !1,
      {
        fileName: "app/routes/_index.tsx",
        lineNumber: 827,
        columnNumber: 21
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 731,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 730,
    columnNumber: 9
  }, this);
}
var Sidebar = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, players, onPlayerClick }) => {
  let { theme, toggleTheme } = useTheme();
  return /* @__PURE__ */ jsxDEV3(Fragment, { children: [
    sidebarOpen && /* @__PURE__ */ jsxDEV3(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
        onClick: () => setSidebarOpen(!1)
      },
      void 0,
      !1,
      {
        fileName: "app/routes/_index.tsx",
        lineNumber: 856,
        columnNumber: 17
      },
      this
    ),
    /* @__PURE__ */ jsxDEV3("div", { className: `fixed left-0 top-0 h-full ${theme === "dark" ? "bg-black/40" : "bg-white/80"} backdrop-blur-2xl border-r ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} z-50 transform transition-all duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto w-64 ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"}`, children: [
      /* @__PURE__ */ jsxDEV3("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-white/5 to-transparent" : "bg-gradient-to-b from-gray-50/50 to-transparent"}` }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 864,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ jsxDEV3("div", { className: `relative p-6 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200/50"}`, children: /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center justify-between relative z-10", children: [
          /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxDEV3("div", { className: "relative p-2.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_20px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ jsxDEV3(LucideCat, { className: "text-orange-400", size: 20 }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 871,
              columnNumber: 37
            }, this) }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 870,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV3("div", { children: [
              /* @__PURE__ */ jsxDEV3("h2", { className: `text-base font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Boom League" }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 874,
                columnNumber: 37
              }, this),
              /* @__PURE__ */ jsxDEV3("p", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-600"} font-medium`, children: "Tournament Tracker" }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 875,
                columnNumber: 37
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 873,
              columnNumber: 33
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 869,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV3(
              "button",
              {
                onClick: toggleTheme,
                className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`,
                title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
                children: theme === "dark" ? /* @__PURE__ */ jsxDEV3(LucideSun, { size: 18 }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 884,
                  columnNumber: 57
                }, this) : /* @__PURE__ */ jsxDEV3(LucideMoon, { size: 18 }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 884,
                  columnNumber: 83
                }, this)
              },
              void 0,
              !1,
              {
                fileName: "app/routes/_index.tsx",
                lineNumber: 879,
                columnNumber: 33
              },
              this
            ),
            /* @__PURE__ */ jsxDEV3(
              "button",
              {
                onClick: () => setSidebarOpen(!1),
                className: `lg:hidden ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`,
                children: /* @__PURE__ */ jsxDEV3(LucideX, { size: 20 }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 890,
                  columnNumber: 37
                }, this)
              },
              void 0,
              !1,
              {
                fileName: "app/routes/_index.tsx",
                lineNumber: 886,
                columnNumber: 33
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 878,
            columnNumber: 29
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 868,
          columnNumber: 25
        }, this) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 867,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3("nav", { className: "flex-1 p-4 relative z-10", children: /* @__PURE__ */ jsxDEV3("ul", { className: "space-y-1", children: [
          { id: "home", name: "\u9996\u9875", icon: LucideHome },
          { id: "registration", name: "\u73A9\u5BB6\u6CE8\u518C", icon: LucideUserPlus },
          { id: "league", name: "\u8054\u8D5B\u7BA1\u7406", icon: LucideGamepad2 },
          { id: "rankings", name: "\u6392\u884C\u699C", icon: LucideBarChart3 }
        ].map((item) => {
          let Icon = item.icon, isActive = currentPage === item.id;
          return /* @__PURE__ */ jsxDEV3("li", { children: /* @__PURE__ */ jsxDEV3(
            "button",
            {
              onClick: () => {
                setCurrentPage(item.id), setSidebarOpen(!1);
              },
              className: `group relative w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 overflow-hidden ${isActive ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.2)]" : theme === "dark" ? "text-white/70 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10" : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent hover:border-gray-200"}`,
              children: [
                isActive && /* @__PURE__ */ jsxDEV3("div", { className: "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-sm" }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 918,
                  columnNumber: 49
                }, this),
                /* @__PURE__ */ jsxDEV3(Icon, { size: 16, className: "relative z-10" }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 920,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV3("span", { className: "font-medium text-sm relative z-10", children: item.name }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 921,
                  columnNumber: 45
                }, this)
              ]
            },
            void 0,
            !0,
            {
              fileName: "app/routes/_index.tsx",
              lineNumber: 904,
              columnNumber: 41
            },
            this
          ) }, item.id, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 903,
            columnNumber: 37
          }, this);
        }) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 898,
          columnNumber: 25
        }, this) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 897,
          columnNumber: 21
        }, this),
        currentPage !== "rankings" && players.length > 0 && /* @__PURE__ */ jsxDEV3("div", { className: `relative p-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200/50"}`, children: [
          /* @__PURE__ */ jsxDEV3("h3", { className: `text-xs font-semibold ${theme === "dark" ? "text-white/60" : "text-gray-500"} mb-3 uppercase tracking-wider`, children: "Quick Access" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 932,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV3("div", { className: "space-y-1 max-h-32 overflow-y-auto", children: players.slice(0, 4).map((player) => /* @__PURE__ */ jsxDEV3(
            "button",
            {
              onClick: () => onPlayerClick(player),
              className: `relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:bg-white/5 hover:text-white hover:border-white/10" : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 hover:border-gray-200"}`,
              children: [
                /* @__PURE__ */ jsxDEV3("span", { className: "text-base", children: player.avatar }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 944,
                  columnNumber: 41
                }, this),
                /* @__PURE__ */ jsxDEV3("span", { className: "truncate font-medium", children: player.name }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 945,
                  columnNumber: 41
                }, this)
              ]
            },
            player.id,
            !0,
            {
              fileName: "app/routes/_index.tsx",
              lineNumber: 935,
              columnNumber: 37
            },
            this
          )) }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 933,
            columnNumber: 29
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 931,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 865,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 863,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 853,
    columnNumber: 9
  }, this);
}, Leaderboard = ({ players, onPlayerClick }) => /* @__PURE__ */ jsxDEV3("div", { className: "relative bg-black/20 backdrop-blur-2xl border border-white/10 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden", children: [
  /* @__PURE__ */ jsxDEV3("div", { className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 959,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV3("div", { className: "relative z-10 p-6", children: [
    /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "relative p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg shadow-[0_0_20px_rgba(251,191,36,0.2)]", children: /* @__PURE__ */ jsxDEV3(LucideTrophy, { size: 16, className: "text-yellow-400" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 963,
        columnNumber: 21
      }, this) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 962,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("h3", { className: "text-lg font-semibold text-white/95 tracking-tight", children: "Leaderboard" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 965,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 961,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: "space-y-2", children: players.map((p, index) => /* @__PURE__ */ jsxDEV3(
      "div",
      {
        className: "group relative flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/5 border border-transparent hover:border-white/10",
        onClick: () => onPlayerClick && onPlayerClick(p),
        children: [
          /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxDEV3("div", { className: `relative w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm border ${index === 0 ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : index === 1 ? "bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-gray-400/30 text-gray-300" : index === 2 ? "bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-orange-500/30 text-orange-400" : "bg-white/5 border-white/10 text-white/70"}`, children: index + 1 }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 975,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { className: "text-xl", children: p.avatar }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 983,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { className: "font-medium text-white/90", children: p.name }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 984,
              columnNumber: 29
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 974,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV3("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxDEV3("div", { className: "font-semibold text-lg text-emerald-400", children: p.score }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 987,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3("div", { className: "text-xs text-white/60 font-medium", children: "VP" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 988,
              columnNumber: 29
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 986,
            columnNumber: 25
          }, this)
        ]
      },
      p.id,
      !0,
      {
        fileName: "app/routes/_index.tsx",
        lineNumber: 969,
        columnNumber: 21
      },
      this
    )) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 967,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 960,
    columnNumber: 9
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/_index.tsx",
  lineNumber: 958,
  columnNumber: 5
}, this), PlayerProfiles = ({ players, onPlayerClick }) => /* @__PURE__ */ jsxDEV3("div", { className: "relative bg-black/20 backdrop-blur-2xl border border-white/10 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden", children: [
  /* @__PURE__ */ jsxDEV3("div", { className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 999,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV3("div", { className: "relative z-10 p-6", children: [
    /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "relative p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)]", children: /* @__PURE__ */ jsxDEV3(LucideUsers, { size: 16, className: "text-blue-400" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1003,
        columnNumber: 21
      }, this) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1002,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("h3", { className: "text-lg font-semibold text-white/95 tracking-tight", children: "Player Profiles" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1005,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1001,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: "space-y-2", children: players.map((p) => /* @__PURE__ */ jsxDEV3(
      "div",
      {
        className: "group relative p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/5 border border-transparent hover:border-white/10",
        onClick: () => onPlayerClick && onPlayerClick(p),
        children: [
          /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxDEV3("span", { className: "text-xl", children: p.avatar }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1015,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { className: "font-medium text-white/90", children: p.name }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1016,
              columnNumber: 29
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1014,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV3("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxDEV3("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-xs font-medium text-yellow-400", children: [
              /* @__PURE__ */ jsxDEV3("span", { children: "\u{1F3C6}" }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 1020,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV3("span", { children: [
                p.championships || 0,
                " \u51A0\u519B"
              ] }, void 0, !0, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 1021,
                columnNumber: 33
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1019,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-400/10 border border-gray-400/20 rounded-md text-xs font-medium text-gray-300", children: [
              /* @__PURE__ */ jsxDEV3("span", { children: "\u{1F948}" }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 1024,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV3("span", { children: [
                p.runnerUp || 0,
                " \u4E9A\u519B"
              ] }, void 0, !0, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 1025,
                columnNumber: 33
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1023,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md text-xs font-medium text-orange-400", children: [
              /* @__PURE__ */ jsxDEV3("span", { children: "\u{1F949}" }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 1028,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV3("span", { children: [
                p.thirdPlace || 0,
                " \u5B63\u519B"
              ] }, void 0, !0, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 1029,
                columnNumber: 33
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1027,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-white/70", children: p.history.length > 0 ? `${p.history.length} Games` : "New Player" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1031,
              columnNumber: 29
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1018,
            columnNumber: 25
          }, this)
        ]
      },
      p.id,
      !0,
      {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1009,
        columnNumber: 21
      },
      this
    )) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1007,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1e3,
    columnNumber: 9
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/_index.tsx",
  lineNumber: 998,
  columnNumber: 5
}, this), InfoCard = ({ icon, title, value }) => /* @__PURE__ */ jsxDEV3("div", { className: "relative bg-black/20 backdrop-blur-2xl border border-white/10 rounded-lg p-5 hover:bg-white/5 transition-all duration-200 shadow-[0_0_30px_rgba(0,0,0,0.2)]", children: [
  /* @__PURE__ */ jsxDEV3("div", { className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg" }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1045,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV3("div", { className: "relative z-10 flex items-center gap-4", children: [
    /* @__PURE__ */ jsxDEV3("div", { className: "p-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg", children: icon }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1047,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { children: [
      /* @__PURE__ */ jsxDEV3("p", { className: "text-white/60 text-sm font-medium", children: title }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1051,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("p", { className: "text-white font-semibold text-xl", children: value }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1052,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1050,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1046,
    columnNumber: 9
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/_index.tsx",
  lineNumber: 1044,
  columnNumber: 5
}, this), ScheduleTimeline = ({ schedule, currentRound }) => /* @__PURE__ */ jsxDEV3("div", { className: "relative bg-black/20 backdrop-blur-2xl border border-white/10 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden", children: [
  /* @__PURE__ */ jsxDEV3("div", { className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1060,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV3("div", { className: "relative z-10 p-6", children: [
    /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "relative p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.2)]", children: /* @__PURE__ */ jsxDEV3(LucideScrollText, { size: 16, className: "text-indigo-400" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1064,
        columnNumber: 21
      }, this) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1063,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("h3", { className: "text-lg font-semibold text-white/95 tracking-tight", children: "Tournament Schedule" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1066,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1062,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: "space-y-2", children: schedule.map((roundInfo) => {
      let isActive = roundInfo.round === currentRound;
      return /* @__PURE__ */ jsxDEV3("div", { className: `relative p-4 rounded-lg transition-all duration-300 border ${isActive ? "bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.1)]" : "bg-white/5 border-white/10 hover:bg-white/10"}`, children: [
        /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV3("p", { className: `font-semibold text-base ${isActive ? "text-orange-400" : "text-white/90"}`, children: [
            "Round ",
            roundInfo.round
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1078,
            columnNumber: 33
          }, this),
          isActive && /* @__PURE__ */ jsxDEV3("div", { className: "w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.5)]" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1082,
            columnNumber: 37
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1077,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-sm text-white/60 mt-1 font-medium", children: [
          roundInfo.vpMode.name,
          " \u2022 ",
          roundInfo.specialRule
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1085,
          columnNumber: 29
        }, this)
      ] }, roundInfo.round, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1072,
        columnNumber: 25
      }, this);
    }) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1068,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1061,
    columnNumber: 9
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/_index.tsx",
  lineNumber: 1059,
  columnNumber: 5
}, this), HomePage = ({ leagueState, players, handleStartLeague, handleResetLeague, handlePlayerClick }) => {
  if (!leagueState || leagueState.status === "setup")
    return /* @__PURE__ */ jsxDEV3("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "text-center", children: /* @__PURE__ */ jsxDEV3("div", { className: "inline-flex items-center gap-6 mb-8", children: [
        /* @__PURE__ */ jsxDEV3("div", { className: "relative p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ jsxDEV3(LucideCat, { className: "text-orange-400", size: 40 }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1102,
          columnNumber: 29
        }, this) }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1101,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxDEV3("h1", { className: "text-5xl font-bold bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent tracking-tight", children: "Boom League" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1105,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV3("p", { className: "text-white/60 text-lg font-medium mt-2", children: "Professional Tournament Management" }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1108,
            columnNumber: 29
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1104,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1100,
        columnNumber: 21
      }, this) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1099,
        columnNumber: 17
      }, this),
      players.length > 0 && /* @__PURE__ */ jsxDEV3("div", { className: "relative bg-black/20 backdrop-blur-2xl border border-white/10 rounded-lg p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)]", children: [
        /* @__PURE__ */ jsxDEV3("div", { className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1115,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-4 mb-6", children: [
            /* @__PURE__ */ jsxDEV3("div", { className: "w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1118,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV3("h2", { className: "text-2xl font-semibold text-white/95 tracking-tight", children: "Quick Start" }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1119,
              columnNumber: 33
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1117,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV3("p", { className: "text-white/70 mb-8 text-lg", children: [
            /* @__PURE__ */ jsxDEV3("span", { className: "text-orange-400 font-semibold", children: players.length }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1122,
              columnNumber: 33
            }, this),
            " players registered and ready to compete"
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1121,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV3(
            "button",
            {
              onClick: handleStartLeague,
              disabled: players.length < 2,
              className: "relative group bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 text-orange-400 font-semibold py-4 px-8 rounded-lg border border-orange-500/30 shadow-[0_0_30px_rgba(251,146,60,0.2)] transition-all duration-200 hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] disabled:from-white/5 disabled:to-white/5 disabled:text-white/40 disabled:border-white/10 disabled:cursor-not-allowed disabled:shadow-none",
              children: [
                /* @__PURE__ */ jsxDEV3("span", { className: "relative z-10", children: "Start New Tournament" }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 1129,
                  columnNumber: 33
                }, this),
                /* @__PURE__ */ jsxDEV3("div", { className: "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 1130,
                  columnNumber: 33
                }, this)
              ]
            },
            void 0,
            !0,
            {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1124,
              columnNumber: 29
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1116,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1114,
        columnNumber: 21
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1098,
      columnNumber: 13
    }, this);
  if (leagueState.status === "in_progress")
    return /* @__PURE__ */ jsxDEV3("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxDEV3("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u8054\u8D5B\u8FDB\u884C\u4E2D" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1143,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-gray-300", children: [
          "\u7B2C ",
          leagueState.current_round,
          " / ",
          GAME_RULES.MAX_ROUNDS,
          " \u8F6E"
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1144,
          columnNumber: 21
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1142,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxDEV3(Leaderboard, { players, onPlayerClick: handlePlayerClick }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1147,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3(PlayerProfiles, { players, onPlayerClick: handlePlayerClick }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1148,
          columnNumber: 21
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1146,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1141,
      columnNumber: 13
    }, this);
  if (leagueState.status === "finished")
    return /* @__PURE__ */ jsxDEV3("div", { className: "space-y-6", children: /* @__PURE__ */ jsxDEV3("div", { className: "text-center p-10 bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg flex flex-col items-center gap-4 border-2 border-yellow-400", children: [
      /* @__PURE__ */ jsxDEV3(LucideCrown, { className: "text-yellow-400", size: 80 }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1158,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV3("h2", { className: "text-5xl font-bold text-yellow-300", children: "\u8054\u8D5B\u7ED3\u675F\uFF01" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1159,
        columnNumber: 21
      }, this),
      leagueState.winner && /* @__PURE__ */ jsxDEV3(Fragment, { children: [
        /* @__PURE__ */ jsxDEV3("div", { className: "text-6xl mt-4", children: leagueState.winner.avatar }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1162,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-4xl font-bold text-white mt-2", children: leagueState.winner.name }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1163,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-xl text-gray-300 mt-2", children: leagueState.winner.reason }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1164,
          columnNumber: 29
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1161,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV3(
        "button",
        {
          onClick: handleResetLeague,
          className: "mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105",
          children: "\u5F00\u542F\u65B0\u8054\u8D5B"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1167,
          columnNumber: 21
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1157,
      columnNumber: 17
    }, this) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1156,
      columnNumber: 13
    }, this);
}, PlayerRegistrationPage = ({ players, handleAddPlayer, handleDeletePlayer, handlePlayerClick, newPlayerName, setNewPlayerName, selectedAvatar, setSelectedAvatar, showPlayerModal, setShowPlayerModal }) => /* @__PURE__ */ jsxDEV3("div", { className: "space-y-8", children: [
  /* @__PURE__ */ jsxDEV3("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxDEV3("h2", { className: "text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-3", children: "\u73A9\u5BB6\u6CE8\u518C" }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1183,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV3("p", { className: "text-slate-400 text-lg", children: "\u7BA1\u7406\u53C2\u4E0E\u8054\u8D5B\u7684\u73A9\u5BB6" }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1186,
      columnNumber: 17
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1182,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ jsxDEV3("div", { className: "bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30 shadow-2xl", children: [
    /* @__PURE__ */ jsxDEV3("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxDEV3("h3", { className: "text-2xl font-bold text-white flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV3("div", { className: "w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1192,
          columnNumber: 25
        }, this),
        "\u5DF2\u6CE8\u518C\u73A9\u5BB6",
        /* @__PURE__ */ jsxDEV3("span", { className: "text-orange-400", children: [
          "(",
          players.length,
          "/6)"
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1194,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1191,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV3(
        "button",
        {
          onClick: () => setShowPlayerModal(!0),
          disabled: players.length >= 6,
          className: "flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none",
          children: [
            /* @__PURE__ */ jsxDEV3(LucidePlus, { size: 18 }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1201,
              columnNumber: 25
            }, this),
            " \u6DFB\u52A0\u73A9\u5BB6"
          ]
        },
        void 0,
        !0,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1196,
          columnNumber: 21
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1190,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: players.map((p) => {
      let stats = UTILS.calculatePlayerStats(p);
      return /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/60 p-5 rounded-2xl border border-slate-700/30 cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-lg", children: [
        /* @__PURE__ */ jsxDEV3(
          "div",
          {
            className: "flex items-center gap-4 flex-1",
            onClick: () => handlePlayerClick(p),
            children: [
              /* @__PURE__ */ jsxDEV3("div", { className: "text-4xl", children: p.avatar }, void 0, !1, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 1214,
                columnNumber: 37
              }, this),
              /* @__PURE__ */ jsxDEV3("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxDEV3("span", { className: "font-bold text-white text-lg", children: p.name }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 1216,
                  columnNumber: 41
                }, this),
                /* @__PURE__ */ jsxDEV3("div", { className: "flex flex-wrap gap-2 mt-1", children: [
                  stats.championships > 0 && /* @__PURE__ */ jsxDEV3("span", { className: "text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full", children: [
                    "\u{1F3C6} ",
                    stats.championships,
                    "\u51A0"
                  ] }, void 0, !0, {
                    fileName: "app/routes/_index.tsx",
                    lineNumber: 1219,
                    columnNumber: 49
                  }, this),
                  /* @__PURE__ */ jsxDEV3("span", { className: "text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full", children: stats.totalGames > 0 ? `${stats.totalGames}\u573A \u2022 ${stats.winRate}%\u80DC\u7387` : "\u65B0\u73A9\u5BB6" }, void 0, !1, {
                    fileName: "app/routes/_index.tsx",
                    lineNumber: 1223,
                    columnNumber: 45
                  }, this)
                ] }, void 0, !0, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 1217,
                  columnNumber: 41
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 1215,
                columnNumber: 37
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1210,
            columnNumber: 33
          },
          this
        ),
        /* @__PURE__ */ jsxDEV3(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation(), handleDeletePlayer(p.id);
            },
            className: "p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200",
            children: /* @__PURE__ */ jsxDEV3(LucideTrash2, { size: 18 }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1236,
              columnNumber: 37
            }, this)
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1229,
            columnNumber: 33
          },
          this
        )
      ] }, p.id, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1209,
        columnNumber: 29
      }, this);
    }) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1205,
      columnNumber: 17
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1189,
    columnNumber: 13
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/_index.tsx",
  lineNumber: 1181,
  columnNumber: 9
}, this), LeagueManagementPage = ({ leagueState, players, handleStartLeague, handleResetLeague, renderInProgress, setShowResultsModal }) => {
  if (!leagueState || leagueState.status === "setup")
    return /* @__PURE__ */ jsxDEV3("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxDEV3("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u8054\u8D5B\u7BA1\u7406" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1252,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-gray-300", children: "\u521B\u5EFA\u548C\u7BA1\u7406\u4F60\u7684 Boom League" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1253,
          columnNumber: 21
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1251,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "bg-gray-800/50 rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxDEV3("h3", { className: "text-2xl font-bold text-white mb-4", children: "\u521B\u5EFA\u65B0\u8054\u8D5B" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1257,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-gray-300 mb-4", children: [
          "\u5F53\u524D\u6709 ",
          players.length,
          " \u540D\u73A9\u5BB6\u6CE8\u518C\u3002\u9700\u8981\u81F3\u5C11 2 \u540D\u73A9\u5BB6\u624D\u80FD\u5F00\u59CB\u8054\u8D5B\u3002"
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1258,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3(
          "button",
          {
            onClick: handleStartLeague,
            disabled: players.length < 2,
            className: "bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100",
            children: "\u5F00\u59CB\u8054\u8D5B"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1261,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1256,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1250,
      columnNumber: 13
    }, this);
  if (leagueState.status === "in_progress")
    return /* @__PURE__ */ jsxDEV3("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxDEV3("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u8054\u8D5B\u7BA1\u7406" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1277,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-gray-300", children: "\u5F53\u524D\u8054\u8D5B\u8FDB\u884C\u4E2D" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1278,
          columnNumber: 21
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1276,
        columnNumber: 17
      }, this),
      renderInProgress()
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1275,
      columnNumber: 13
    }, this);
  if (leagueState.status === "finished")
    return /* @__PURE__ */ jsxDEV3("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxDEV3("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u8054\u8D5B\u7BA1\u7406" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1289,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-gray-300", children: "\u8054\u8D5B\u5DF2\u7ED3\u675F" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1290,
          columnNumber: 21
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1288,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "text-center p-10 bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg flex flex-col items-center gap-4 border-2 border-yellow-400", children: [
        /* @__PURE__ */ jsxDEV3(LucideCrown, { className: "text-yellow-400", size: 80 }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1294,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3("h2", { className: "text-3xl font-bold text-yellow-300", children: "\u8054\u8D5B\u7ED3\u675F\uFF01" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1295,
          columnNumber: 21
        }, this),
        leagueState.winner && /* @__PURE__ */ jsxDEV3(Fragment, { children: [
          /* @__PURE__ */ jsxDEV3("div", { className: "text-4xl mt-4", children: leagueState.winner.avatar }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1298,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV3("p", { className: "text-2xl font-bold text-white mt-2", children: leagueState.winner.name }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1299,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV3("p", { className: "text-lg text-gray-300 mt-2", children: leagueState.winner.reason }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1300,
            columnNumber: 29
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1297,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3(
          "button",
          {
            onClick: handleResetLeague,
            className: "mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105",
            children: "\u5F00\u542F\u65B0\u8054\u8D5B"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1303,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1293,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1287,
      columnNumber: 13
    }, this);
}, PlayerRankingsPage = ({ players, onPlayerClick }) => {
  let sortedPlayers = [...players].sort((a, b) => b.championships !== a.championships ? (b.championships || 0) - (a.championships || 0) : b.score - a.score);
  return /* @__PURE__ */ jsxDEV3("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV3("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV3("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u73A9\u5BB6\u6392\u884C\u699C" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1327,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("p", { className: "text-gray-300", children: "\u67E5\u770B\u6240\u6709\u73A9\u5BB6\u7684\u8BE6\u7EC6\u7EDF\u8BA1\u548C\u6392\u540D" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1328,
        columnNumber: 17
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1326,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: "bg-gray-800/50 rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxDEV3("h3", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV3(LucideTrophy, { className: "text-yellow-400" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1333,
          columnNumber: 21
        }, this),
        "\u603B\u6392\u884C\u699C"
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1332,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "space-y-4", children: sortedPlayers.map((player, index) => {
        let stats = UTILS.calculatePlayerStats(player);
        return /* @__PURE__ */ jsxDEV3(
          "div",
          {
            className: "flex items-center justify-between bg-gray-700/70 p-4 rounded-lg shadow-md hover:bg-gray-600/70 cursor-pointer transition-colors",
            onClick: () => onPlayerClick(player),
            children: [
              /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxDEV3("span", { className: `font-bold text-2xl w-8 text-center ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : index === 2 ? "text-orange-400" : "text-gray-500"}`, children: index + 1 }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 1347,
                  columnNumber: 37
                }, this),
                /* @__PURE__ */ jsxDEV3("span", { className: "text-3xl", children: player.avatar }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 1350,
                  columnNumber: 37
                }, this),
                /* @__PURE__ */ jsxDEV3("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxDEV3("span", { className: "font-semibold text-white text-xl", children: player.name }, void 0, !1, {
                    fileName: "app/routes/_index.tsx",
                    lineNumber: 1352,
                    columnNumber: 41
                  }, this),
                  /* @__PURE__ */ jsxDEV3("div", { className: "flex gap-4 text-sm text-gray-400", children: [
                    /* @__PURE__ */ jsxDEV3("span", { children: [
                      "\u{1F3C6} ",
                      stats.championships,
                      "\u51A0"
                    ] }, void 0, !0, {
                      fileName: "app/routes/_index.tsx",
                      lineNumber: 1354,
                      columnNumber: 45
                    }, this),
                    /* @__PURE__ */ jsxDEV3("span", { children: [
                      "\u{1F3AE} ",
                      stats.totalGames,
                      "\u573A"
                    ] }, void 0, !0, {
                      fileName: "app/routes/_index.tsx",
                      lineNumber: 1355,
                      columnNumber: 45
                    }, this),
                    /* @__PURE__ */ jsxDEV3("span", { children: [
                      "\u{1F4CA} \u80DC\u7387",
                      stats.winRate,
                      "%"
                    ] }, void 0, !0, {
                      fileName: "app/routes/_index.tsx",
                      lineNumber: 1356,
                      columnNumber: 45
                    }, this),
                    /* @__PURE__ */ jsxDEV3("span", { children: [
                      "\u{1F4C8} \u5E73\u5747\u6392\u540D",
                      stats.averagePlacement
                    ] }, void 0, !0, {
                      fileName: "app/routes/_index.tsx",
                      lineNumber: 1357,
                      columnNumber: 45
                    }, this)
                  ] }, void 0, !0, {
                    fileName: "app/routes/_index.tsx",
                    lineNumber: 1353,
                    columnNumber: 41
                  }, this)
                ] }, void 0, !0, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 1351,
                  columnNumber: 37
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 1346,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV3("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxDEV3("div", { className: "text-2xl font-bold text-green-400", children: player.score }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 1362,
                  columnNumber: 37
                }, this),
                /* @__PURE__ */ jsxDEV3("div", { className: "text-sm text-gray-400", children: "\u5F53\u524D\u5206\u6570" }, void 0, !1, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 1363,
                  columnNumber: 37
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 1361,
                columnNumber: 33
              }, this)
            ]
          },
          player.id,
          !0,
          {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1341,
            columnNumber: 29
          },
          this
        );
      }) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1337,
        columnNumber: 17
      }, this),
      players.length === 0 && /* @__PURE__ */ jsxDEV3("div", { className: "text-center py-8 text-gray-400", children: [
        /* @__PURE__ */ jsxDEV3(LucideUsers, { size: 48, className: "mx-auto mb-4 opacity-50" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1372,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { children: "\u8FD8\u6CA1\u6709\u6CE8\u518C\u7684\u73A9\u5BB6" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1373,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-sm", children: "\u524D\u5F80\u73A9\u5BB6\u6CE8\u518C\u9875\u9762\u6DFB\u52A0\u73A9\u5BB6" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1374,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1371,
        columnNumber: 21
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1331,
      columnNumber: 13
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1325,
    columnNumber: 9
  }, this);
}, PlayerProfileModal = ({ player, onClose }) => {
  if (!player)
    return null;
  let stats = UTILS.calculatePlayerStats(player);
  return /* @__PURE__ */ jsxDEV3(Modal, { onClose, title: `${player.avatar} ${player.name} \u7684\u6863\u6848`, children: /* @__PURE__ */ jsxDEV3("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxDEV3("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "bg-white/5 border border-white/10 p-4 rounded-lg text-center", children: [
        /* @__PURE__ */ jsxDEV3("p", { className: "text-2xl font-bold text-yellow-400", children: player.championships || 0 }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1393,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-sm text-white/70", children: "\u{1F3C6} \u51A0\u519B\u6B21\u6570" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1394,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1392,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "bg-white/5 border border-white/10 p-4 rounded-lg text-center", children: [
        /* @__PURE__ */ jsxDEV3("p", { className: "text-2xl font-bold text-gray-300", children: player.runnerUp || 0 }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1397,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-sm text-white/70", children: "\u{1F948} \u4E9A\u519B\u6B21\u6570" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1398,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1396,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "bg-white/5 border border-white/10 p-4 rounded-lg text-center", children: [
        /* @__PURE__ */ jsxDEV3("p", { className: "text-2xl font-bold text-orange-400", children: player.thirdPlace || 0 }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1401,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-sm text-white/70", children: "\u{1F949} \u5B63\u519B\u6B21\u6570" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1402,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1400,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "bg-white/5 border border-white/10 p-4 rounded-lg text-center", children: [
        /* @__PURE__ */ jsxDEV3("p", { className: "text-2xl font-bold text-emerald-400", children: player.score }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1405,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-sm text-white/70", children: "\u5F53\u524D\u5206\u6570" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1406,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1404,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "bg-white/5 border border-white/10 p-4 rounded-lg text-center", children: [
        /* @__PURE__ */ jsxDEV3("p", { className: "text-2xl font-bold text-blue-400", children: stats.totalGames }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1409,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-sm text-white/70", children: "\u603B\u6E38\u620F\u6570" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1410,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1408,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "bg-white/5 border border-white/10 p-4 rounded-lg text-center", children: [
        /* @__PURE__ */ jsxDEV3("p", { className: "text-2xl font-bold text-purple-400", children: stats.averagePlacement }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1413,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-sm text-white/70", children: "\u5E73\u5747\u6392\u540D" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1414,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1412,
        columnNumber: 21
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1391,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: "bg-gray-700/50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV3("div", { className: "flex justify-between items-center mb-2", children: [
        /* @__PURE__ */ jsxDEV3("span", { className: "text-white font-semibold", children: "\u80DC\u7387" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1421,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV3("span", { className: "text-orange-400 font-bold", children: [
          stats.winRate,
          "%"
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1422,
          columnNumber: 25
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1420,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "w-full bg-gray-600 rounded-full h-2", children: /* @__PURE__ */ jsxDEV3(
        "div",
        {
          className: "bg-orange-400 h-2 rounded-full transition-all duration-300",
          style: { width: `${stats.winRate}%` }
        },
        void 0,
        !1,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1425,
          columnNumber: 25
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1424,
        columnNumber: 21
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1419,
      columnNumber: 17
    }, this),
    stats.totalGames > 0 && /* @__PURE__ */ jsxDEV3("div", { className: "bg-gray-700/50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV3("h4", { className: "text-white font-semibold mb-3", children: "\u6392\u540D\u5206\u5E03" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1435,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "space-y-2", children: [1, 2, 3, 4, 5, 6].map((place) => {
        let count = stats.placements[place] || 0, percentage = stats.totalGames > 0 ? (count / stats.totalGames * 100).toFixed(1) : 0;
        return count > 0 ? /* @__PURE__ */ jsxDEV3("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxDEV3("span", { className: `text-sm ${place === 1 ? "text-yellow-400" : place === 2 ? "text-gray-300" : place === 3 ? "text-orange-400" : "text-gray-500"}`, children: [
            "\u7B2C",
            place,
            "\u540D"
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1442,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV3("span", { className: "text-white text-sm", children: [
              count,
              "\u6B21"
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1446,
              columnNumber: 45
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { className: "text-gray-400 text-xs", children: [
              "(",
              percentage,
              "%)"
            ] }, void 0, !0, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1447,
              columnNumber: 45
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1445,
            columnNumber: 41
          }, this)
        ] }, place, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1441,
          columnNumber: 37
        }, this) : null;
      }) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1436,
        columnNumber: 25
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1434,
      columnNumber: 21
    }, this),
    player.history && player.history.length > 0 && /* @__PURE__ */ jsxDEV3("div", { className: "bg-gray-700/50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxDEV3("h4", { className: "text-white font-semibold mb-3", children: "\u6700\u8FD1\u6BD4\u8D5B" }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1459,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "space-y-2 max-h-32 overflow-y-auto", children: player.history.slice(-5).reverse().map((game, index) => /* @__PURE__ */ jsxDEV3("div", { className: "flex justify-between items-center text-sm", children: [
        /* @__PURE__ */ jsxDEV3("span", { className: "text-gray-300", children: [
          "\u7B2C",
          game.round,
          "\u8F6E"
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1463,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ jsxDEV3("span", { className: `font-semibold ${game.placement === 1 ? "text-yellow-400" : game.placement === 2 ? "text-gray-300" : game.placement === 3 ? "text-orange-400" : "text-gray-500"}`, children: [
          "\u7B2C",
          game.placement,
          "\u540D"
        ] }, void 0, !0, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1464,
          columnNumber: 37
        }, this)
      ] }, index, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1462,
        columnNumber: 33
      }, this)) }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1460,
        columnNumber: 25
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1458,
      columnNumber: 21
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1389,
    columnNumber: 13
  }, this) }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1388,
    columnNumber: 9
  }, this);
}, Modal = ({ children, onClose, title }) => /* @__PURE__ */ jsxDEV3("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxDEV3("div", { className: "relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-lg shadow-[0_0_80px_rgba(0,0,0,0.5)] p-8 w-full max-w-md animate-in fade-in zoom-in duration-200", children: [
  /* @__PURE__ */ jsxDEV3("div", { className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg" }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1480,
    columnNumber: 13
  }, this),
  /* @__PURE__ */ jsxDEV3("div", { className: "relative z-10", children: [
    /* @__PURE__ */ jsxDEV3("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxDEV3("h3", { className: "text-xl font-semibold bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent tracking-tight", children: title }, void 0, !1, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1483,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV3(
        "button",
        {
          onClick: onClose,
          className: "p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 border border-transparent hover:border-white/20",
          children: /* @__PURE__ */ jsxDEV3(LucideX, { size: 18 }, void 0, !1, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 1490,
            columnNumber: 25
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1486,
          columnNumber: 21
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1482,
      columnNumber: 17
    }, this),
    children
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1481,
    columnNumber: 13
  }, this)
] }, void 0, !0, {
  fileName: "app/routes/_index.tsx",
  lineNumber: 1479,
  columnNumber: 9
}, this) }, void 0, !1, {
  fileName: "app/routes/_index.tsx",
  lineNumber: 1478,
  columnNumber: 5
}, this), ResultsModal = ({ players, onClose, onSubmit, round }) => {
  let [rankedPlayers, setRankedPlayers] = useState(players.map((p) => p.id)), handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index.toString());
  }, handleDrop = (e, dropIndex) => {
    let draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex")), newRankedPlayers = [...rankedPlayers], [draggedItem] = newRankedPlayers.splice(draggedIndex, 1);
    newRankedPlayers.splice(dropIndex, 0, draggedItem), setRankedPlayers(newRankedPlayers);
  }, getPlayerById = (id) => players.find((p) => p.id === id);
  return /* @__PURE__ */ jsxDEV3(Modal, { onClose, title: `\u8F93\u5165\u7B2C ${round} \u8F6E\u6BD4\u8D5B\u7ED3\u679C`, children: [
    /* @__PURE__ */ jsxDEV3("p", { className: "text-gray-400 mb-4", children: "\u8BF7\u62D6\u52A8\u73A9\u5BB6\u5361\u7247\u4EE5\u786E\u5B9A\u672C\u8F6E\u540D\u6B21\uFF08\u4ECE\u4E0A\u5230\u4E0B\u4E3A 1-N \u540D\uFF09\u3002" }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1518,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: "space-y-2", children: rankedPlayers.map((playerId, index) => {
      let player = getPlayerById(playerId);
      return player ? /* @__PURE__ */ jsxDEV3(
        "div",
        {
          draggable: !0,
          onDragStart: (e) => handleDragStart(e, index),
          onDragOver: (e) => e.preventDefault(),
          onDrop: (e) => handleDrop(e, index),
          className: "flex items-center gap-4 p-3 bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing",
          children: [
            /* @__PURE__ */ jsxDEV3("span", { className: "font-bold text-lg text-orange-400 w-6", children: index + 1 }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1532,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { className: "text-2xl", children: player.avatar }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1533,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { className: "text-white font-semibold", children: player.name }, void 0, !1, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 1534,
              columnNumber: 29
            }, this)
          ]
        },
        playerId,
        !0,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 1524,
          columnNumber: 25
        },
        this
      ) : null;
    }) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 1519,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV3(
      "button",
      {
        onClick: () => onSubmit(rankedPlayers),
        className: "w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors",
        children: "\u786E\u8BA4\u5E76\u8FDB\u5165\u4E0B\u4E00\u8F6E"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/_index.tsx",
        lineNumber: 1539,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 1517,
    columnNumber: 9
  }, this);
};

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-PFM6IQRZ.js", imports: ["/build/_shared/chunk-X3PXDGUE.js", "/build/_shared/chunk-VWXHOGIJ.js", "/build/_shared/chunk-F4KNNEUR.js", "/build/_shared/chunk-PLT55Z5M.js", "/build/_shared/chunk-2Z2JGDFU.js", "/build/_shared/chunk-E7FOCUHM.js", "/build/_shared/chunk-JR22VO6P.js", "/build/_shared/chunk-PZDJHGND.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-LUYQHC4M.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-76CNCFHX.js", imports: ["/build/_shared/chunk-LFAKDRIB.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "386de87b", hmr: { runtime: "/build/_shared\\chunk-E7FOCUHM.js", timestamp: 1754704880882 }, url: "/build/manifest-386DE87B.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "development", assetsBuildDirectory = "public\\build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_node_exports }, routes = {
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
//# sourceMappingURL=index.js.map
