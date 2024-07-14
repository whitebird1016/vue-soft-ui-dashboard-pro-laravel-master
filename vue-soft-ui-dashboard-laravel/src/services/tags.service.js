import axios from "axios";
import authHeader from "./auth-header";
import Jsona from "jsona";
const dataFormatter = new Jsona();

const API_URL = process.env.VUE_APP_API_BASE_URL + '/';

export default {
  async getTags(params) {
    const response = await axios.get(API_URL + "tags", {
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

  async getTag(id) {
    const response = await axios.get(API_URL + "tags/" + id, {
      headers: authHeader(),
    });
    return dataFormatter.deserialize(response.data);
  },

  async deleteTag(id) {
    await axios.delete(API_URL + "tags/" + id.toString(), {
      headers: authHeader(),
    });
  },

  async addTag(tag) {
    tag.type = "tags";
    return await axios.post(
      API_URL + "tags",
      dataFormatter.serialize({ stuff: tag }),
      {
        headers: authHeader(),
      }
    );
  },

  async editTag(tag) {
    const editedTag = {
      id: tag.id,
      name: tag.name,
      color: tag.color,
      type: "tags",
    };
    return await axios.patch(
      API_URL + "tags/" + editedTag.id,
      dataFormatter.serialize({ stuff: editedTag }),
      {
        headers: authHeader(),
      }
    );
  },
};
