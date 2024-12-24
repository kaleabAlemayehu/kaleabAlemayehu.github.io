import { annotate } from "rough-notation";
// Or using unpkg
//import { annotate } from "https://unpkg.com/rough-notation?module";
//
//
const e = document.querySelector(".resume");
const annotation = annotate(e, {
  type: "box",
  color: "#5bb9f0",
});
setTimeout(() => {
  annotation.show();
}, 1000);
