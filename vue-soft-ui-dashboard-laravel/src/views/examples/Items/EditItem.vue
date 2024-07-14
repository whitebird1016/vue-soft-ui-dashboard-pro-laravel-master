<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">Edit item</h5>
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <router-link to="/examples/items/list" class="mb-0 btn bg-gradient-success btn-sm"
                    >&nbsp; Back to list</router-link
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="card-body">
            <label class="form-label mt-2 row mt-4">Image</label>
            <img
              :src="preview"
              alt="placeholder"
              width="200"
              height="200"
              style="border-radius: 10px; border: 1px solid black"
            />
            <soft-image-input id="pfp" ref="pfp" @added-image="addedImage" />
            <soft-button v-if="!file" size="sm" color="info" @click="$refs.pfp.click()"
              >Select</soft-button
            >
            <soft-button
              v-if="file"
              size="sm"
              style="margin-right: 10px"
              color="info"
              @click="$refs.pfp.click()"
              >Change</soft-button
            >
            <soft-button v-if="file" size="sm" color="danger" @click="file = null"
              >Remove</soft-button
            >
            <validation-error :errors="apiValidationErrors.image" />

            <label class="form-label mt-2 row mt-4">Name</label>
            <soft-model-input
              id="name"
              v-model="item.name"
              type="text"
              placeholder="Name"
            />
            <validation-error :errors="apiValidationErrors.name" />

            <label class="form-label mt-2 row mt-4">Description</label>
            <soft-model-textarea
              id="description"
              v-model="item.description"
              placeholder="Description"
            />
            <validation-error :errors="apiValidationErrors.description" />

            <label class="form-label mt-2 row mt-4">Category</label>
            <select
              id="choices-category"
              v-model="getCategory"
              class="form-control"
              name="choices-category"
            ></select>
            <validation-error :errors="apiValidationErrors.category" />

            <label class="form-label mt-2 row mt-4">Tags</label>
            <select
              id="choices-tags"
              v-model="getTags"
              multiple
              size="1"
              class="form-control"
              name="choices-tags"
            ></select>
            <validation-error :errors="apiValidationErrors.tags" />

            <label class="form-label mt-2 row mt-4">Status</label>
            <div class="form-check">
              <input
                id="published"
                v-model="item.status"
                value="published"
                type="radio"
                class="form-check-input"
              />
              <label for="published">Published</label>
            </div>

            <div class="form-check">
              <input
                id="draft"
                v-model="item.status"
                value="draft"
                type="radio"
                class="form-check-input"
              />
              <label for="draft">Draft</label>
            </div>

            <div class="form-check">
              <input
                id="archive"
                v-model="item.status"
                value="archive"
                type="radio"
                class="form-check-input"
              />
              <label for="archive">Archive</label>
            </div>

            <validation-error :errors="apiValidationErrors.status" />

            <label class="form-label mt-2 row mt-4">Show on homepage? </label>
            <soft-model-switch
              id="homepage"
              v-model="item.is_on_homepage"
              name="homepage"
            />

            <label class="form-label mt-2 row mt-4">Date</label>
            <Datepicker
              v-model="getDate"
              :enable-time-picker="false"
              :format="format"
              auto-apply
              placeholder="Select Date"
            ></Datepicker>
            <validation-error :errors="apiValidationErrors.date_at" />

            <soft-button
              color="dark"
              variant="gradient"
              class="float-end mt-4 mb-0"
              size="sm"
              :is-disabled="loading ? true : false"
              @click="editItem"
              ><span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Submit</span></soft-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SoftImageInput from "/src/components/SoftImageInput.vue";
import SoftModelInput from "/src/components/SoftModelInput.vue";
import SoftButton from "/src/components/SoftButton.vue";
import showSwal from "/src/mixins/showSwal.js";
import ValidationError from "@/components/ValidationError.vue";
import formMixin from "/src/mixins/form-mixin.js";
import SoftModelSwitch from "/src/components/SoftModelSwitch.vue";
import SoftModelTextarea from "/src/components/SoftModelTextarea.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Choices from "choices.js";

export default {
  name: "EditItem",
  components: {
    SoftImageInput,
    SoftModelInput,
    SoftButton,
    ValidationError,
    SoftModelSwitch,
    SoftModelTextarea,
    Datepicker,
  },
  mixins: [formMixin],
  data() {
    return {
      file: null,
      item: {},
      loading: false,
      getDate: null,
      getCategory: null,
      getTags: [],
    };
  },

  computed: {
    categories() {
      const categs = this.$store.getters["categories/categories"]?.data;

      var response = [];
      if (categs) {
        categs.forEach((element) => {
          response.push({
            value: element.name,
            label: element.name,
            id: element.id,
          });
        });
      }
      return response;
    },
    tags() {
      const tags = this.$store.getters["tags/tags"]?.data;
      var response = [];
      if (tags) {
        tags.forEach((element) => {
          response.push({
            value: element.name,
            label: element.name,
            id: element.id,
          });
        });
      }
      return response;
    },

    preview() {
      if (this.file) return URL.createObjectURL(this.file);
      else if (this.item.image) return this.item.image;
      else return require("/src/assets/img/placeholder.jpg");
    },
  },

  async mounted() {
    this.item = await this.$store.dispatch("items/getItem", this.$route.params.id);
    this.getDate = this.item.date_at;

    await this.$store.dispatch("categories/getCategories");
    await this.$store.dispatch("tags/getTags");

    if (document.getElementById("choices-category")) {
      var element = document.getElementById("choices-category");
      new Choices(element, {
        searchEnabled: false,
        choices: [
          {
            value: "",
            label: "",
            selected: true,
            disabled: true,
          },
        ].concat(this.categories),
      }).setChoiceByValue((this.getCategory = this.item.category.name));
    }
    if (document.getElementById("choices-tags")) {
      var element2 = document.getElementById("choices-tags");
      new Choices(element2, {
        searchEnabled: false,
        choices: this.tags,
        removeItemButton: true,
      }).setChoiceByValue((this.getTags = this.item.tags.map((tag) => tag.name)));
    }
  },
  methods: {
    format(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },

    async editItem() {
      this.resetApiValidation();
      this.loading = true;

      const id = this.categories.filter((obj) => {
        return obj.value === this.getCategory;
      })[0]?.id;

      if (id)
        this.item.category = {
          type: "categories",
          id: id,
        };

      if (this.getTags.length > 0) {
        this.item.tags = [];
        this.getTags.forEach((tag) => {
          const id = this.tags.filter((obj) => {
            return obj.value === tag;
          })[0]?.id;

          this.item.tags.push({
            type: "tags",
            id: id,
          });
        });
      }

      if (this.getDate && (this.getDate != this.item.date_at)) this.item.date_at = this.getDate.toISOString().split("T")[0];

      try {
        if (this.file) {
          this.item.image = await this.$store.dispatch("items/uploadPic", {
            id: this.item.id,
            pic: this.file,
          });
        }
        await this.$store.dispatch("items/editItem", this.item);
        showSwal.methods.showSwal({
          type: "success",
          message: "Item edited successfully!",
        });
        this.$router.push("/examples/items/list");
      } catch (error) {
        if (error.response.data.errors) this.setApiValidation(error.response.data.errors);
        else
          showSwal.methods.showSwal({
            type: "error",
            message: "Oops, something went wrong!",
            width: 350,
          });
        this.loading = false;
      }
    },
    addedImage(files) {
      this.file = files[0];
    },
  },
};
</script>
<style>
img {
  object-fit: cover;
}

.choices{
  margin-bottom: 0px !important;
}
</style>
