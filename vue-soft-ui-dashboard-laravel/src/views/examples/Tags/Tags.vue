<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">Tags List</h5>
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <router-link to="/examples/tags/new" class="mb-0 btn bg-gradient-success btn-sm"
                    >+&nbsp; New Tag</router-link
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="px-0 pb-0 card-body">
            <div class="table-responsive">
              <table id="tags-list" ref="tagsList" class="table table-flush">
                <thead class="thead-light">
                  <tr>
                    <th title="name">Name</th>
                    <th data-sortable="false">Color</th>
                    <th title="created_at">Created At</th>
                    <th data-sortable="false">Action</th>
                  </tr>
                </thead>
                <tbody class="text-sm"></tbody>
                <tfoot>
                  <tr>
                    <th>Name</th>
                    <th>Color</th>
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

const getTagsList = _.debounce(async function (params) {
  await store.dispatch("tags/getTags", {
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
  name: "Tags",
  components: {
    BasePagination,
  },
  mixins: [eventTable],
  data() {
    return {
      tagsAux: [],
      pagination: {},
      tableTags: null,
    };
  },
  computed: {
    tagsList() {
      return this.$store.getters["tags/tags"]?.data;
    },
    metaPage() {
      return this.$store.getters["tags/tags"]?.meta;
    },
  },
  watch: {
    metaPage: {
      handler: "reactivePagination",
      immediate: false,
      deep: true,
    },
    tagsList: {
      handler: "reactiveTable",
      immediate: false,
      deep: true,
    },
  },

  async mounted() {
    if (this.$refs.tagsList) {
      this.tableTags = new DataTable(this.$refs.tagsList, {
        fixedHeight: false,
        perPage: 5,
      });

      document.querySelector(".dataTable-bottom").remove();
      this.tableTags.label = null;
      this.tableTags.setMessage(
        `<img src="${loading}" width="100" height="100" alt="loading" />`
      );

      await getTagsList({
        query: currentQuery,
        perpage: currentPerPage,
        nr: currentPage,
        sort: currentSort,
      });

      this.tableTags.on("datatable.perpage", async function (perpage) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        await getTagsList({
          query: currentQuery,
          perpage: (currentPerPage = perpage),
          nr: (currentPage = 1),
          sort: currentSort,
        });
      });

      this.tableTags.on("datatable.sort", async function (column, direction) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        direction = direction == "asc" ? "" : "-";
        column = this.headings[column].title;
        await getTagsList({
          query: currentQuery,
          perpage: currentPerPage,
          nr: currentPage,
          sort: (currentSort = direction + column),
        });
      });

      // eslint-disable-next-line no-unused-vars
      this.tableTags.on("datatable.search", async function (query, matched) {
        this.setMessage(
          `<img src="${loading}" width="100" height="100" alt="loading" />`
        );
        await getTagsList({
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
      await getTagsList({
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
      this.tagsAux = [];
      if (this.tagsList?.length > 0) {
        this.tagsList.forEach((row) => {
          this.tagsAux.push([
            `<h6 class="my-auto">${row.name}</h6>`,
            `<div class="badge badge-default" style="background-color:${row.color};">${row.name}</div>`,
            row.created_at,
            this.actionEditButton(row.id, "Edit Tag") +
              this.actionDeleteButton(row.id, "Delete Tag"),
          ]);
        });
        this.tableTags.data = [];
        this.tableTags.refresh();
        document.querySelector(".dataTable-input").value = currentQuery;
        this.tableTags.insert({ data: this.tagsAux });
        this.removeEvent();
        this.eventToCall({
          table: this.tableTags,
          redirectPath: "Edit Tag",
          deletePath: "tags/deleteTag",
          getPath: "tags/getTags",
          textDelete: "Tag deleted successfully!",
          textDefaultData: "tags",
          textDeleteError: "This tag still has associated items.",
          params: {
            query: currentQuery,
            perpage: currentPerPage,
            nr: currentPage,
            sort: currentSort,
          },
        });
      } else {
        this.tableTags.setMessage("No results match your search query");
      }
    },
  },
};
</script>
