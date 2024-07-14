import axios from "axios";
import authHeader from "./auth-header";
import Jsona from "jsona";
const dataFormatter = new Jsona();

const API_URL = process.env.VUE_APP_API_BASE_URL + '/';

export default {
  async getItems(params) {
    const response = await axios.get(API_URL + "items", {
      headers: authHeader(),
      params: {
        include: "category,tags",
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

  async getItem(id) {
    const response = await axios.get(API_URL + "items/" + id, {
      headers: authHeader(),
      params: {
        include: "category,tags",
      },
    });
    return dataFormatter.deserialize(response.data);
  },

  async deleteItem(id) {
    await axios.delete(API_URL + "items/" + id.toString(), {
      headers: authHeader(),
    });
  },

  async addItem(item) {
    item.type = "items";
    item.relationshipNames = ["category", "tags"];
    const editedItem = dataFormatter.serialize({
      stuff: item,
      includeNames: ["category", "tags"],
    });
    return await axios.post(API_URL + "items", editedItem, {
      headers: authHeader(),
    });
  },

  async editItem(item) {
    item.type = "items";
    item.relationshipNames = ["category", "tags"];
    const editedItem = dataFormatter.serialize({
      stuff: item,
      includeNames: ["category", "tags"],
    });
    delete editedItem.data.attributes.links;
    return await axios.patch(
      API_URL + "items/" + editedItem.data.id,
      editedItem,
      {
        headers: authHeader(),
      }
    );
  },

  async uploadItemPic(object) {
    let formData = new FormData();
    formData.append("attachment", object.pic);
    return (
      await axios.post(
        API_URL + "uploads/items/" + object.id + "/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
    ).data.url;
  },
};
