import store from "../store";

export default async function auth({ next }) {
  if (!store.getters["auth/loggedIn"]) {
    return next({ name: "Login" });
  }
  await store.dispatch("profile/getProfile");
  next();
}
