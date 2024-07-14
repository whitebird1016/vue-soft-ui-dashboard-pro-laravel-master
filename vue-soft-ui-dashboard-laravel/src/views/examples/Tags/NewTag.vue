<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">Add a new tag</h5>
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <router-link to="/examples/tags/list" class="mb-0 btn bg-gradient-success btn-sm"
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
              v-model="tag.name"
              type="text"
              placeholder="Tag Name"
            />
            <validation-error :errors="apiValidationErrors.name" />

            <label class="form-label mt-2 row mt-4">Color</label>
            <Slider v-model="colorPicker" style="width: 100%"></Slider>
            <validation-error :errors="apiValidationErrors.color" />

            <soft-button
              color="dark"
              variant="gradient"
              class="float-end mt-4 mb-0"
              size="sm"
              :is-disabled="loading ? true : false"
              @click="addTag"
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
import { Slider } from "@ckpack/vue-color";
import formMixin from "/src/mixins/form-mixin.js";
import ValidationError from "@/components/ValidationError.vue";
export default {
  name: "NewTag",
  components: {
    SoftModelInput,
    SoftButton,
    Slider,
    ValidationError,
  },
  mixins: [formMixin],
  data() {
    return {
      loading: false,
      colorPicker: {hex: "#79B0D2"},
      tag: {},
    };
  },
  methods: {
    async addTag() {
      this.tag.color = this.colorPicker.hex;
      this.resetApiValidation();
      this.loading = true;
      try {
        await this.$store.dispatch("tags/addTag", this.tag);
        showSwal.methods.showSwal({
          type: "success",
          message: "Tag added successfully!",
        });
        this.$router.push("/examples/tags/list");
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
