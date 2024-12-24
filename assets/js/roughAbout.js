import { annotate } from "rough-notation";

const e = document.querySelector(".resume");
const annotation = annotate(e, {
  type: "box",
  color: "#5bb9f0",
});
setTimeout(() => {
  annotation.show();
}, 1000);

links.forEach((ln, index) => {
  console.log("it does work");
  console.log(ln);
  console.log(index);
  //const annotation = annotate(ln, {
  //  type: "highlight",
  //  color: "#5bb9f0",
  //});
  //setTimeout(() => {
  //  annotation.show();
  //}, (index + 1) * 1000);
});
