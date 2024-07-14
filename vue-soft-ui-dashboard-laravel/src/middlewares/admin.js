import store from "../store";

export default function admin({ router }) {
  const userRole = store.getters["profile/profile"]?.roles[0].name;
  if (userRole != "admin") {
    return router.push({ name: "Default" });
  }
}
