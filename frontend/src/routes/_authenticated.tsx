import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../lib/api";

// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const isAuth = await isAuthenticated();

    if (!isAuth) {
      throw redirect({
        to: "/login",
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
});
