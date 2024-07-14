import axios from "axios";
import authHeader from "./auth-header";
import Jsona from "jsona";
const dataFormatter = new Jsona();

const API_URL = process.env.VUE_APP_API_BASE_URL + '/';

export default {
  async getCategories(params) {
    const response = await axios.get(API_URL + "categories", {
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

  async getCategory(id) {
    const response = await axios.get(API_URL + "categories/" + id, {
      headers: authHeader(),
    });
    return dataFormatter.deserialize(response.data);
  },

  async deleteCategory(id) {
    await axios.delete(API_URL + "categories/" + id.toString(), {
      headers: authHeader(),
    });
  },

  async addCategory(category) {
    category.type = "categories";
    return await axios.post(
      API_URL + "categories",
      dataFormatter.serialize({ stuff: category }),
      {
        headers: authHeader(),
      }
    );
  },

  async editCategory(category) {
    const editedCategory = {
      id: category.id,
      name: category.name,
      description: category.description,
      type: "categories",
    };
    return await axios.patch(
      API_URL + "categories/" + editedCategory.id,
      dataFormatter.serialize({ stuff: editedCategory }),
      {
        headers: authHeader(),
      }
    );
  },
};
