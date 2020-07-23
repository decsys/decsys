import { mount, redirect, map } from "navi";
import admin from "./admin.routes";
import participants from "./participant.routes";

// Note: Some routes here have a lot of data fetching logic,
// because Navi does a great job of delaying component loads while waiting on data.
// When React Suspense gets data fetching support, a lot of logic
// can and should be moved to appropriate components (screens probably)

const routes = mount({
  "/": map((_, context) =>
    context.user.roles.admin ? redirect("/admin") : redirect("/survey")
  ),
  "/survey": participants,
  "/admin": admin
});

export default routes;
