import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("/", "./Pages/HomePage.tsx"),
] satisfies RouteConfig;