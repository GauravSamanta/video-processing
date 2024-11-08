import { hc } from "hono/client";
import { type apiRoutes } from "../../../server/server";
const client = hc<apiRoutes>("/");

export const api = client.api;

const getUser = async () => {
  const response = await api.user["me"].$get();
  console.log(response);

  if (!response.ok) {
    localStorage.removeItem("user");
    return null;
  }
  const data = await response.json();
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

export const isAuthenticated = async () => {
  await getUser();
  const user = localStorage.getItem("user");

  if (!user) {
    return false;
  } else {
    return true;
  }
};
