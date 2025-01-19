import { annotate } from "rough-notation";
import { generateColor } from "./colors.js";

const links = document.querySelectorAll(".links");

links.forEach((ln, index) => {
  const annotation = annotate(ln, {
    type: "highlight",
    // color: colors[index + 2],
    color: generateColor(),
    padding: 1,
  });
  setTimeout(() => {
    annotation.show();
  }, (index + 2) * 750);
});

const content = document.querySelector(".content");
const annotation = annotate(content, {
  type: "underline",
});
setTimeout(() => {
  annotation.show();
}, 750);
