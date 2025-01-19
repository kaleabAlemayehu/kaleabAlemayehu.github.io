import { annotate } from "rough-notation";

const e = document.querySelector(".resume");
const annotation = annotate(e, {
  type: "box",
  color: "#5bb9f0",
});
setTimeout(() => {
  annotation.show();
}, 1000);
