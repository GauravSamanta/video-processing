import { hc } from "hono/client";
import { type apiRoutes } from "../../../server/server";
const client = hc<apiRoutes>("/");


export const api = client.api;


