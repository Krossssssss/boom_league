import { createRequestHandler } from "@vercel/remix";

export default createRequestHandler({
  build: () => import("../build/index.js"),
});
