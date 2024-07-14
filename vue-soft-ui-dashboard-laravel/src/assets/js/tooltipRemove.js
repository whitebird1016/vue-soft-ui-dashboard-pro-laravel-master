/* eslint-disable */

// removal of Tooltips
export default function removeTooltip(bootstrap) {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll(".bs-tooltip-top")
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return tooltipTriggerEl.remove();
  });
}
