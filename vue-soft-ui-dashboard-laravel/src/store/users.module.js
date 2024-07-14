import usersService from "../services/users.service";

const initialState = { users: null };

export const users = {
  namespaced: true,
  state: initialState,
  actions: {
    async getUsers({ commit }, params) {
      const response = await usersService.getUsers(params);
      commit("SET_USERS", response);
    },

    async getUser(_, id) {
      return await usersService.getUser(id);
    },

    async deleteUser(_, id) {
      await usersService.deleteUser(id);
    },

    async addUser(_, user) {
      return await usersService.addUser(user);
    },

    async editUser(_, user) {
      return await usersService.editUser(user);
    },
  },

  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
  },

  getters: {
    users(state) {
      return state.users;
    },
  },
};
