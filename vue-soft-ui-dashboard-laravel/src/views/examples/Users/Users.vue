<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">Users List</h5>
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <router-link to="/examples/users/new" class="mb-0 btn bg-gradient-success btn-sm"
                    >+&nbsp; New User</router-link
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="px-0 pb-0 card-body">
            <div class="table-responsive">
              <table id="users-list" ref="usersList" class="table table-flush">
                <thead class="thead-light">
                  <tr>
                    <th data-sortable="false">Picture</th>
                    <th title="name">Name</th>
                    <th title="email">Email</th>
                    <th title="roles.name">Role</th>
                    <th title="created_at">Created At</th>
                    <th data-sortable="false">Action</th>
                  </tr>
                </thead>
                <tbody class="text-sm"></tbody>
                <tfoot>
                  <tr>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="d-flex justify-content-center justify-content-sm-between flex-wrap">
            <div class="ms-3">
              <p>
                Showing {{ pagination?.from }} to {{ pagination?.to }} of
                {{ pagination?.total }} entries
              </p>
            </div>
            <BasePagination
              class="pagination-success pagination-md me-3"
              :per-page="pagination?.perPage"
              :value="pagination?.currentPage"
              :total="pagination?.total"
              @click="getDataFromPage($event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataTable } from "simple-datatables";
import BasePagination from "/src/components/BasePagination.vue";
import eventTable from "/src/mixins/eventTable.js";
import store from "/src/store";
import _ from "lodash";

var currentQuery = "";
var currentPerPage = 5;
var currentPage = 1;
var currentSort = "created_at";
var loading = require("/src/assets/img/loading.gif");

const getUsersList = _.debounce(async function (params) {
  await store.dispatch("users/getUsers", {
    ...(params.sort ? { sort: params.sort } : {}),
    filter: {
      ...(params.query ? { name: params.query } : {}),
    },
    page: {
      number: params.nr,
      size: params.perpage,
    },
  });
}, 300);

export default {
  name: "Users",
  components: {
    BasePagination,
  },
  mixins: [eventTable],
  data() {
    return {
      usersAux: [],
      pagination: {},
      tableUsers: null,
    };
  },
  computed: {
    usersList() {
      return this.$store.getters["users/users"]?.data;
    },
    metaPage() {
      return this.$store.getters["users/users"]?.meta;
    },
  },
  watch: {
    metaPage: {
      handler: "reactivePagination",
      immediate: false,
      deep: true,
    },
    usersList: {
      handler: "reactiveTable",
      immediate: false,
      deep: true,
    },
  },

  async mounted() {
    if (this.$refs.usersList) {
      this.tableUsers = new DataTable(this.$refs.usersList, {
        fixedHeight: false,
        perPage: 5,
      });

      document.querySelector(".dataTable-bottom").remove();
      this.tableUsers.label = null;
      this.tableUsers.setMessage(
        `<img src="${loading}" width="100" height="100" alt="loading" />`
      );

      await getUsersList({
        query: currentQuery,
        perpage: currentPerPage,
        nr: currentPage,
        sort: currentSort,
      });

      this.tableUsers.on("datatable.perpage", async function (perpage) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        await getUsersList({
          query: currentQuery,
          perpage: (currentPerPage = perpage),
          nr: (currentPage = 1),
          sort: currentSort,
        });
      });

      this.tableUsers.on("datatable.sort", async function (column, direction) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        direction = direction == "asc" ? "" : "-";
        column = this.headings[column].title;
        await getUsersList({
          query: currentQuery,
          perpage: currentPerPage,
          nr: currentPage,
          sort: (currentSort = direction + column),
        });
      });

      // eslint-disable-next-line no-unused-vars
      this.tableUsers.on("datatable.search", async function (query, matched) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        await getUsersList({
          query: (currentQuery = query),
          perpage: currentPerPage,
          nr: (currentPage = 1),
          sort: currentSort,
        });
      });
    }
  },

  beforeUnmount() {
    currentQuery = "";
    currentPerPage = 5;
    currentPage = 1;
    currentSort = "created_at";
  },

  methods: {
    async getDataFromPage(page) {
      await getUsersList({
        query: currentQuery,
        perpage: currentPerPage,
        nr: (currentPage = page),
        sort: currentSort,
      });
    },

    async reactivePagination() {
      this.pagination = this.metaPage?.page;
    },

    async reactiveTable() {
      this.usersAux = [];
      if (this.usersList?.length > 0) {
        this.usersList.forEach((row) => {
          this.usersAux.push([
            `<img src="${
              row.profile_image == null
                ? require("/src/assets/img/placeholder.jpg")
                : row.profile_image
            }" alt="Profile" style="border-radius:50%; width:55px; height:55px"/>`,
            `<h6 class="my-auto">${row.name}</h6>`,
            row.email,
            row.roles[0].name,
            row.created_at,
            this.actionEditButton(row.id, "Edit User") +
              this.actionDeleteButton(row.id, "Delete User"),
          ]);
        });
        this.tableUsers.data = [];
        this.tableUsers.refresh();
        document.querySelector(".dataTable-input").value = currentQuery;
        this.tableUsers.insert({ data: this.usersAux });
        this.removeEvent();
        this.eventToCall({
          table: this.tableUsers,
          redirectPath: "Edit User",
          deletePath: "users/deleteUser",
          getPath: "users/getUsers",
          textDelete: "User deleted successfully!",
          textDefaultData: "users",
          params: {
            query: currentQuery,
            perpage: currentPerPage,
            nr: currentPage,
            sort: currentSort,
          },
        });
      } else {
        this.tableUsers.setMessage("No results match your search query");
      }
    },
  },
};
</script>
