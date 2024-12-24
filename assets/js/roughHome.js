import { annotate } from "rough-notation";

const links = document.querySelectorAll(".links");
const colors = ["#5bb9f0", "#FF7F3E", "#ABD7F3", "#FF9369"];
links.forEach((ln, index) => {
  const annotation = annotate(ln, {
    type: "highlight",
    color: colors[index + 2],
    padding: 1,
  });
  setTimeout(() => {
    annotation.show();
  }, (index + 2) * 750);
});

const content = document.querySelector(".content");
const annotation = annotate(content, {
  type: "underline",
  //color: colors[index + 2],
});
setTimeout(() => {
  annotation.show();
}, 750);
