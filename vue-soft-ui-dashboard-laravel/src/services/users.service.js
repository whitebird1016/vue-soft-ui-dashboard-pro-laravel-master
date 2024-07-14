import axios from "axios";
import authHeader from "./auth-header";
import Jsona from "jsona";
const dataFormatter = new Jsona();

const API_URL = process.env.VUE_APP_API_BASE_URL + '/';

export default {
  async getUsers(params) {
    const response = await axios.get(API_URL + "users", {
      headers: authHeader(),
      params: {
        include: "roles",
        ...(params?.filter.name ? { "filter[name]": params.filter.name } : {}),
        ...(params?.page.size ? { "page[size]": params.page.size } : {}),
        ...(params?.page.number ? { "page[number]": params.page.number } : {}),
        ...(params?.sort ? { sort: params.sort } : {}),
      },
    });
    return {
      data: dataFormatter.deserialize(response.data),
      meta: response.data.meta,
    };
  },

  async getUser(id) {
    const response = await axios.get(API_URL + "users/" + id, {
      headers: authHeader(),
      params: {
        include: "roles",
      },
    });
    return dataFormatter.deserialize(response.data);
  },

  async deleteUser(id) {
    await axios.delete(API_URL + "users/" + id.toString(), {
      headers: authHeader(),
    });
  },

  async addUser(user) {
    user.type = "users";
    user.relationshipNames = ["roles"];
    const editedUser = dataFormatter.serialize({
      stuff: user,
      includeNames: ["roles"],
    });
    return await axios.post(API_URL + "users", editedUser, {
      headers: authHeader(),
    });
  },

  async editUser(user) {
    user.type = "users";
    user.relationshipNames = ["roles"];
    const editedUser = dataFormatter.serialize({
      stuff: user,
      includeNames: ["roles"],
    });
    delete editedUser.data.attributes.links;
    return await axios.patch(
      API_URL + "users/" + editedUser.data.id,
      editedUser,
      {
        headers: authHeader(),
      }
    );
  },
};
