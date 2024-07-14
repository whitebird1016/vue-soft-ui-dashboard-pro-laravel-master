<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">Items List</h5>
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <router-link to="/examples/items/new" class="mb-0 btn bg-gradient-success btn-sm"
                    >+&nbsp; New Item</router-link
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="px-0 pb-0 card-body">
            <div class="table-responsive">
              <table id="items-list" ref="itemsList" class="table table-flush">
                <thead class="thead-light">
                  <tr>
                    <th title="name">Name</th>
                    <th title="category.name">Category</th>
                    <th data-sortable="false">Picture</th>
                    <th title="tags.name">Tags</th>
                    <th title="created_at">Created At</th>
                    <th data-sortable="false">Action</th>
                  </tr>
                </thead>
                <tbody class="text-sm">
                </tbody>
                <tfoot>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Picture</th>
                    <th>Tags</th>
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

const getItemsList = _.debounce(async function (params) {
  await store.dispatch("items/getItems", {
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
  name: "Items",
  components: {
    BasePagination,
  },
  mixins: [eventTable],
  data() {
    return {
      itemsAux: [],
      tagsAux: ``,
      pagination: {},
      tableItems: null,
    };
  },
  computed: {
    itemsList() {
      return this.$store.getters["items/items"]?.data;
    },
    metaPage() {
      return this.$store.getters["items/items"]?.meta;
    },
  },
  watch: {
    metaPage: {
      handler: "reactivePagination",
      immediate: false,
      deep: true,
    },
    itemsList: {
      handler: "reactiveTable",
      immediate: false,
      deep: true,
    },
  },

  async mounted() {
    if (this.$refs.itemsList) {
      this.tableItems = new DataTable(this.$refs.itemsList, {
        fixedHeight: false,
        perPage: 5,
      });

      document.querySelector(".dataTable-bottom").remove();
      this.tableItems.label = null;
      this.tableItems.setMessage(
        `<img src="${loading}" width="100" height="100" alt="loading" />`
      );

      await getItemsList({
        query: currentQuery,
        perpage: currentPerPage,
        nr: currentPage,
        sort: currentSort,
      });

      this.tableItems.on("datatable.perpage", async function (perpage) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        await getItemsList({
          query: currentQuery,
          perpage: (currentPerPage = perpage),
          nr: (currentPage = 1),
          sort: currentSort,
        });
      });

      this.tableItems.on("datatable.sort", async function (column, direction) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        direction = direction == "asc" ? "" : "-";
        column = this.headings[column].title;
        await getItemsList({
          query: currentQuery,
          perpage: currentPerPage,
          nr: currentPage,
          sort: (currentSort = direction + column),
        });
      });

      // eslint-disable-next-line no-unused-vars
      this.tableItems.on("datatable.search", async function (query, matched) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        await getItemsList({
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
      await getItemsList({
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
      this.itemsAux = [];
      if (this.itemsList?.length > 0) {
        this.itemsList.forEach((row) => {
          this.tagsAux = ``;
          row.tags.forEach((element) => {
            this.tagsAux += `<div class="my-auto text-sm" style="background-color:${element.color}; border-radius:5px; padding: 0px 5px; float:left; margin-right:5px; text-align:center; color:white;">${element.name}</div>`;
          });
          this.itemsAux.push([
            `<h6 class="my-auto">${row.name}</h6>`,
            row.category.name,
            `<img src="${
              row.image == null ? require("/src/assets/img/placeholder.jpg") : row.image
            }" alt="Profile" style="width:100px;"/>`,
            this.tagsAux,
            row.created_at,
            this.actionEditButton(row.id, "Edit Item") +
              this.actionDeleteButton(row.id, "Delete Item"),
          ]);
        });
        this.tableItems.data = [];
        this.tableItems.refresh();
        document.querySelector(".dataTable-input").value = currentQuery;
        this.tableItems.insert({ data: this.itemsAux });
        this.removeEvent();
        this.eventToCall({
          table: this.tableItems,
          redirectPath: "Edit Item",
          deletePath: "items/deleteItem",
          getPath: "items/getItems",
          textDelete: "Item deleted successfully!",
          textDefaultData: "items",
          params: {
            query: currentQuery,
            perpage: currentPerPage,
            nr: currentPage,
            sort: currentSort,
          },
        });
      } else {
        this.tableItems.setMessage("No results match your search query");
      }
    },
  },
};
</script>
