import tagsService from "../services/tags.service";

const initialState = { tags: null };

export const tags = {
  namespaced: true,
  state: initialState,
  actions: {
    async getTags({ commit }, params) {
      const response = await tagsService.getTags(params);
      commit("SET_TAGS", response);
    },

    async getTag(_, id) {
      return await tagsService.getTag(id);
    },

    async deleteTag(_, id) {
      await tagsService.deleteTag(id);
    },

    async addTag(_, name) {
      return await tagsService.addTag(name);
    },

    async editTag(_, tag) {
      return await tagsService.editTag(tag);
    },
  },

  mutations: {
    SET_TAGS(state, tags) {
      state.tags = tags;
    },
  },

  getters: {
    tags(state) {
      return state.tags;
    },
  },
};
