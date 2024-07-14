/* eslint-disable no-unused-vars */
import router from "@/router";
import setTooltip from "@/assets/js/tooltip.js";
import removeTooltip from "@/assets/js/tooltipRemove.js";
import Swal from "sweetalert2";
import showSwal from "./showSwal.js";
import store from "@/store";

var deleteState = false;

function showSwalDelete(id, deletePath, getPath, textDelete, params, deleteError) {
  showSwal.methods.showSwalConfirmationDelete().then(async (result) => {
    if (result.isConfirmed) {
      try {
        deleteState = true;
        await store.dispatch(deletePath, id);
        await store.dispatch(getPath, {
          ...(params.sort ? { sort: params.sort } : {}),
          filter: {
            ...(params.query ? { name: params.query } : {}),
          },
          page: {
            number: 1,
            size: params.perPage,
          },
        });
        showSwal.methods.showSwal({
          type: "success",
          message: textDelete,
          width: 400,
        });
      } catch (error) {
        showSwal.methods.showSwal({
          type: "error",
          message: deleteError ? deleteError : "Oops, something went wrong!",
          width: deleteError ? 500 : 350,
        });
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.dismiss;
    }
  });
}

export default {
  methods: {
    eventToCall(options) {
      if (deleteState) {
        removeTooltip();
        deleteState = false;
      }
      setTooltip(store.state.bootstrap);
      var buttons = document.querySelectorAll(".actionButton");
      buttons.forEach(function (button) {
        if (button.className == "actionButton deleteButton cursor-pointer") {
          button.addEventListener("click", function () {
            if (this.id <= 3 && (process.env.VUE_APP_IS_DEMO ?? 1) == 1) {
              showSwal.methods.showSwal({
                type: "error",
                message: `You are not allowed to change data of default ${options.textDefaultData}.`,
                width: 650,
              });
            } else {
              showSwalDelete(
                this.id,
                options.deletePath,
                options.getPath,
                options.textDelete,
                options.params,
                options.textDeleteError
              );
            }
          });
        } else {
          button.addEventListener("click", function () {
            if (this.id <= 3 && (process.env.VUE_APP_IS_DEMO ?? 1) == 1) {
              showSwal.methods.showSwal({
                type: "error",
                message: `You are not allowed to change data of default ${options.textDefaultData}.`,
                width: 650,
              });
            } else {
              removeTooltip();
              router.push({
                name: options.redirectPath,
                params: { id: this.id },
              });
            }
          });
        }
      });
    },

    actionEditButton(userId, text) {
      var actionEdit = `
              <a id="${userId}" class="actionButton cursor-pointer me-3" data-bs-toggle="tooltip" title="${text}">
                <i class="fas fa-user-edit text-secondary"></i>
              </a>`;
      return actionEdit;
    },

    actionDeleteButton(userId, text) {
      var actionDelete = `
              <a id="${userId}" class="actionButton deleteButton cursor-pointer" data-bs-toggle="tooltip" title="${text}">
                <i class="fas fa-trash text-secondary"></i>
              </a>`;
      return actionDelete;
    },

    removeEvent() {
      var buttons = this.$el.querySelectorAll(".actionButton");
      buttons.forEach(function (button) {
        button.replaceWith(button.cloneNode(true));
      });
    },
  },
};
