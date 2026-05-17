import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("/", "./Pages/HomePage.tsx", { id: "home" }),
  route("/play/:date", "./Pages/HomePage.tsx", { id: "play" }),
  route("/scores", "./Pages/ScoreCardPage.tsx"),
] satisfies RouteConfig;