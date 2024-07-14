import categoriesService from "../services/categories.service";

const initialState = { categories: null };

export const categories = {
  namespaced: true,
  state: initialState,
  actions: {
    async getCategories({ commit }, params) {
      const response = await categoriesService.getCategories(params);
      commit("SET_CATEGORIES", response);
    },

    async getCategory(_, id) {
      return await categoriesService.getCategory(id);
    },

    async deleteCategory(_, id) {
      await categoriesService.deleteCategory(id);
    },

    async addCategory(_, name) {
      return await categoriesService.addCategory(name);
    },

    async editCategory(_, name) {
      return await categoriesService.editCategory(name);
    },
  },

  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
  },

  getters: {
    categories(state) {
      return state.categories;
    },
  },
};
