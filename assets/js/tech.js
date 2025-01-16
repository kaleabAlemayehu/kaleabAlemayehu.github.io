import { getColors } from "./colors.js";
const elements = document.querySelectorAll(".tech");
elements.forEach((e) => {
  const content = e.textContent.replaceAll(" ", "").replaceAll("\n", "")
    .replaceAll("\t", "");
  console.log(content);
  e.style.backgroundColor = getColors(content);
});
