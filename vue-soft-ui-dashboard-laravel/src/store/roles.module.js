import rolesService from "../services/roles.service";

const initialState = { roles: null };

export const roles = {
  namespaced: true,
  state: initialState,
  actions: {
    async getRoles({ commit }, params) {
      const response = await rolesService.getRoles(params);
      commit("SET_ROLES", response);
    },

    async getRole(_, id) {
      return await rolesService.getRole(id);
    },

    async deleteRole(_, id) {
      await rolesService.deleteRole(id);
    },

    async addRole(_, name) {
      return await rolesService.addRole(name);
    },

    async editRole(_, role) {
      return await rolesService.editRole(role);
    },
  },

  mutations: {
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
  },

  getters: {
    roles(state) {
      return state.roles;
    },
  },
};
