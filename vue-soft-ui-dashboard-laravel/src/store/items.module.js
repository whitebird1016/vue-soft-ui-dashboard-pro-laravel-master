import itemsService from "../services/items.service";

const initialState = { items: null };

export const items = {
  namespaced: true,
  state: initialState,
  actions: {
    async getItems({ commit }, params) {
      const response = await itemsService.getItems(params);
      commit("SET_ITEMS", response);
    },

    async getItem(_, id) {
      return await itemsService.getItem(id);
    },

    async deleteItem(_, id) {
      await itemsService.deleteItem(id);
    },

    async addItem(_, item) {
      return await itemsService.addItem(item);
    },

    async editItem(_, item) {
      return await itemsService.editItem(item);
    },
    async uploadPic(_, object) {
      return await itemsService.uploadItemPic(object);
    },
  },

  mutations: {
    SET_ITEMS(state, items) {
      state.items = items;
    },
  },

  getters: {
    items(state) {
      return state.items;
    },
  },
};
