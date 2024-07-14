<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">Categories List</h5>
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <router-link to="/examples/categories/new" class="mb-0 btn bg-gradient-success btn-sm"
                    >+&nbsp; New Category</router-link
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="px-0 pb-0 card-body">
            <div class="table-responsive">
              <table id="categories-list" ref="categoriesList" class="table table-flush">
                <thead class="thead-light">
                  <tr>
                    <th title="name">Name</th>
                    <th title="description">Description</th>
                    <th title="created_at">Created At</th>
                    <th data-sortable="false">Action</th>
                  </tr>
                </thead>
                <tbody class="text-sm"></tbody>
                <tfoot>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Create at</th>
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

const getCategoriesList = _.debounce(async function (params) {
  await store.dispatch("categories/getCategories", {
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
  name: "Categories",
  components: {
    BasePagination,
  },
  mixins: [eventTable],
  data() {
    return {
      categoriesAux: [],
      pagination: {},
      tableCategories: null,
    };
  },
  computed: {
    categoriesList() {
      return this.$store.getters["categories/categories"]?.data;
    },
    metaPage() {
      return this.$store.getters["categories/categories"]?.meta;
    },
  },
  watch: {
    metaPage: {
      handler: "reactivePagination",
      immediate: false,
      deep: true,
    },
    categoriesList: {
      handler: "reactiveTable",
      immediate: false,
      deep: true,
    },
  },

  async mounted() {
    if (this.$refs.categoriesList) {
      this.tableCategories = new DataTable(this.$refs.categoriesList, {
        fixedHeight: false,
        perPage: 5,
      });

      document.querySelector(".dataTable-bottom").remove();
      this.tableCategories.label = null;
      this.tableCategories.setMessage(
        `<img src="${loading}" width="100" height="100" alt="loading" />`
      );

      await getCategoriesList({
        query: currentQuery,
        perpage: currentPerPage,
        nr: currentPage,
        sort: currentSort,
      });

      this.tableCategories.on("datatable.perpage", async function (perpage) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        await getCategoriesList({
          query: currentQuery,
          perpage: (currentPerPage = perpage),
          nr: (currentPage = 1),
          sort: currentSort,
        });
      });

      this.tableCategories.on("datatable.sort", async function (column, direction) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        direction = direction == "asc" ? "" : "-";
        column = this.headings[column].title;
        await getCategoriesList({
          query: currentQuery,
          perpage: currentPerPage,
          nr: currentPage,
          sort: (currentSort = direction + column),
        });
      });

      this.tableCategories.on(
        "datatable.search",
        // eslint-disable-next-line no-unused-vars
        async function (query, matched) {
          this.setMessage(
            `<img src="${loading}" width="100" height="100" alt="loading" />`
          );
          await getCategoriesList({
            query: (currentQuery = query),
            perpage: currentPerPage,
            nr: (currentPage = 1),
            sort: currentSort,
          });
        }
      );
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
      await getCategoriesList({
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
      this.categoriesAux = [];
      if (this.categoriesList?.length > 0) {
        this.categoriesList.forEach((row) => {
          this.categoriesAux.push([
            `<h6 class="my-auto">${row.name}</h6>`,
            row.description,
            row.created_at,
            this.actionEditButton(row.id, "Edit Category") +
              this.actionDeleteButton(row.id, "Delete Category"),
          ]);
        });
        this.tableCategories.data = [];
        this.tableCategories.refresh();
        document.querySelector(".dataTable-input").value = currentQuery;
        this.tableCategories.insert({ data: this.categoriesAux });
        this.removeEvent();
        this.eventToCall({
          table: this.tableCategories,
          redirectPath: "Edit Category",
          deletePath: "categories/deleteCategory",
          getPath: "categories/getCategories",
          textDelete: "Category deleted successfully!",
          textDefaultData: "categories",
          textDeleteError: "This category still has associated items.",
          params: {
            query: currentQuery,
            perpage: currentPerPage,
            nr: currentPage,
            sort: currentSort,
          },
        });
      } else {
        this.tableCategories.setMessage("No results match your search query");
      }
    },
  },
};
</script>
