import store from "../store";

export default function adminCreator({ router }) {
  const userRole = store.getters["profile/profile"]?.roles[0].name;
  if (userRole != "admin" && userRole != "creator") {
    return router.push({ name: "Default" });
  }
}
