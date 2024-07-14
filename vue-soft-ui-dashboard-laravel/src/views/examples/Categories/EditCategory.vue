<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">Edit category</h5>
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <router-link to="/examples/categories/list" class="mb-0 btn bg-gradient-success btn-sm"
                    >&nbsp; Back to list</router-link
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="card-body">
            <label class="form-label mt-2 row mt-4">Name</label>
            <soft-model-input
              id="name"
              v-model="category.name"
              type="text"
              placeholder="Edit Category"
            />
            <validation-error :errors="apiValidationErrors.name" />

            <label class="form-label mt-2 row mt-4">Description</label>
            <soft-model-input
              id="description"
              v-model="category.description"
              type="text"
              placeholder="Category Description"
            />
            <validation-error :errors="apiValidationErrors.description" />

            <soft-button
              color="dark"
              variant="gradient"
              class="float-end mt-4 mb-0"
              size="sm"
              :is-disabled="loading ? true : false"
              @click="editCategory"
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
import SoftModelInput from "/src/components/SoftModelInput.vue";
import SoftButton from "/src/components/SoftButton.vue";
import showSwal from "/src/mixins/showSwal.js";
import formMixin from "/src/mixins/form-mixin.js";
import ValidationError from "@/components/ValidationError.vue";
export default {
  name: "EditCategory",

  components: {
    SoftModelInput,
    SoftButton,
    ValidationError,
  },
  mixins: [formMixin],
  data() {
    return {
      loading: false,
      category: {},
    };
  },

  async created() {
    this.category = await this.$store.dispatch(
      "categories/getCategory",
      this.$route.params.id
    );
  },

  methods: {
    async editCategory() {
      this.resetApiValidation();
      this.loading = true;
      try {
        await this.$store.dispatch("categories/editCategory", this.category);
        showSwal.methods.showSwal({
          type: "success",
          message: "Category edited successfully!",
          width: 350,
        });
        this.$router.push("/examples/categories/list");
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
  },
};
</script>
