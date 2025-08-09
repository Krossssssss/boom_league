/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  server: process.env.NODE_ENV === "production" ? "./server.js" : undefined,
  serverBuildPath: "build/index.js",
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
};

