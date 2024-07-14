<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">Edit role</h5>
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <router-link to="/examples/roles/list" class="mb-0 btn bg-gradient-success btn-sm"
                    >&nbsp; Back to list</router-link
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="card-body">
            <div class="row mt-4">
              <soft-model-input
                id="name"
                v-model="role.name"
                type="text"
                placeholder="Edit Role"
              />
            </div>
            <validation-error :errors="apiValidationErrors.name" />

            <soft-button
              color="dark"
              variant="gradient"
              class="float-end mt-4 mb-0"
              size="sm"
              :is-disabled="loading ? true : false"
              @click="editRole"
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
  name: "EditRole",

  components: {
    SoftModelInput,
    SoftButton,
    ValidationError,
  },
  mixins: [formMixin],
  data() {
    return {
      loading: false,
      role: {},
    };
  },

  async created() {
    this.role = await this.$store.dispatch("roles/getRole", this.$route.params.id);
  },

  methods: {
    async editRole() {
      this.resetApiValidation();
      this.loading = true;
      try {
        await this.$store.dispatch("roles/editRole", this.role);
        showSwal.methods.showSwal({
          type: "success",
          message: "Role edited successfully!",
        });
        this.$router.push("/examples/roles/list");
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
