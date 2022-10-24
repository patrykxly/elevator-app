import { createSelectOptions, onSelectSubmitClick } from "./UIActions";

require("./style.scss");

window.onload = () => {
  createSelectOptions();
  document
    .getElementsByClassName("submit-btn")[0]
    ?.addEventListener("click", (e: Event) => {
      e.preventDefault();
      onSelectSubmitClick();
    });
};
