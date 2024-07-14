<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="pb-0 card-header">
            <div class="d-lg-flex">
              <div>
                <h5 class="mb-0">Edit user</h5>
              </div>
              <div class="my-auto mt-4 ms-auto mt-lg-0">
                <div class="my-auto ms-auto">
                  <router-link to="/examples/users/list" class="mb-0 btn bg-gradient-success btn-sm"
                    >&nbsp; Back to list</router-link
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="card-body">
            <label class="form-label mt-2 row mt-4">Profile picture</label>
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
            <validation-error :errors="apiValidationErrors.profile_image" />

            <label class="form-label mt-2 row mt-4">Name</label>

            <soft-model-input
              id="name"
              v-model="user.name"
              type="text"
              placeholder="Your Name"
            />
            <validation-error :errors="apiValidationErrors.name" />

            <label class="form-label mt-2 row mt-4">Email</label>
            <soft-model-input
              id="email"
              v-model="user.email"
              type="text"
              placeholder="Email"
            />
            <validation-error :errors="apiValidationErrors.email" />

            <label class="form-label mt-2 row mt-4">Role</label>
            <select
              id="choices-roles"
              v-model="getRole"
              class="form-control"
              name="choices-roles"
            ></select>
            <validation-error :errors="apiValidationErrors.roles" />

            <label class="form-label mt-2 row mt-4">Password</label>
            <soft-model-input
              id="password"
              v-model="user.password"
              type="password"
              placeholder="Password"
            />
            <validation-error :errors="apiValidationErrors.password" />

            <label class="form-label mt-2 row mt-4">Confirm Password</label>
            <soft-model-input
              id="password_confirmation"
              v-model="user.password_confirmation"
              type="password"
              placeholder="Confirm Password"
            />

            <soft-button
              color="dark"
              variant="gradient"
              class="float-end mt-4 mb-0"
              size="sm"
              :is-disabled="loading ? true : false"
              @click="editUser"
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
import Choices from "choices.js";

export default {
  name: "EditUser",
  components: {
    SoftImageInput,
    SoftModelInput,
    SoftButton,
    ValidationError,
  },
  mixins: [formMixin],
  data() {
    return {
      file: null,
      user: {},
      loading: false,
      getRole: null,
      options: [],
    };
  },
  computed: {
    roles() {
      const roles = this.$store.getters["roles/roles"]?.data;
      var response = [];
      if (roles) {
        roles.forEach((element) => {
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
      else if (this.user.profile_image) return this.user.profile_image;
      else return require("/src/assets/img/placeholder.jpg");
    },
  },
  async mounted() {
    this.user = await this.$store.dispatch("users/getUser", this.$route.params.id);
    await this.$store.dispatch("roles/getRoles");

    if (document.getElementById("choices-roles")) {
      var element = document.getElementById("choices-roles");
      new Choices(element, {
        searchEnabled: false,
        choices: [
          {
            value: "",
            label: "",
            selected: true,
            disabled: true,
          },
        ].concat(this.roles),
      }).setChoiceByValue((this.getRole = this.user.roles[0].name));
    }
  },
  methods: {
    async editUser() {
      this.resetApiValidation();
      this.loading = true;

      const id = this.roles.filter((obj) => {
        return obj.value === this.getRole;
      })[0]?.id;

      if (id)
        this.user.roles = [
          {
            type: "roles",
            id: id,
          },
        ];

      try {
        if (this.file) {
          this.user.profile_image = await this.$store.dispatch("profile/uploadPic", {
            id: this.user.id,
            pic: this.file,
          });
        }
        await this.$store.dispatch("users/editUser", this.user);
        showSwal.methods.showSwal({
          type: "success",
          message: "User edited successfully!",
        });
        this.$router.push("/examples/users/list");
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
