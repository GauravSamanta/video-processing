import { createRootRouteWithContext } from "@tanstack/react-router";
import { Link, Outlet } from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query";
import { Toaster } from "../components/ui/sonner";
interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});
const NavBar = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/upload" className="[&.active]:font-bold">
        upload
      </Link>
    </div>
    <hr />
  </>
);
function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <div className="p-2 max-w-2xl m-auto">
        <Outlet />
      </div>
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
