import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("/", "./Pages/HomePage.tsx"),
  route("/play/:date", "./Pages/HomePage.tsx"),
  route("/scores", "./Pages/ScoreCardPage.tsx"),
] satisfies RouteConfig;