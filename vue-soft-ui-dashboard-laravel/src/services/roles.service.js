import axios from "axios";
import authHeader from "./auth-header";
import Jsona from "jsona";
const dataFormatter = new Jsona();

const API_URL = process.env.VUE_APP_API_BASE_URL + '/';

export default {
  async getRoles(params) {
    const response = await axios.get(API_URL + "roles", {
      headers: authHeader(),
      params: {
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

  async getRole(id) {
    const response = await axios.get(API_URL + "roles/" + id, {
      headers: authHeader(),
    });
    return dataFormatter.deserialize(response.data);
  },

  async deleteRole(id) {
    await axios.delete(API_URL + "roles/" + id.toString(), {
      headers: authHeader(),
    });
  },

  async addRole(role) {
    role.type = "roles";
    return await axios.post(
      API_URL + "roles",
      dataFormatter.serialize({ stuff: role }),
      {
        headers: authHeader(),
      }
    );
  },

  async editRole(role) {
    const editedRole = {
      id: role.id,
      name: role.name,
      type: "roles",
    };
    return await axios.patch(
      API_URL + "roles/" + editedRole.id,
      dataFormatter.serialize({ stuff: editedRole }),
      {
        headers: authHeader(),
      }
    );
  },
};
