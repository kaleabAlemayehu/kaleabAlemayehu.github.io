const colors = {
  Typescript: "#3178c6",
  Go: "#00ADD8",
  Docker: "#0092b7",
  Javascript: "#f0db4f",
  //vuejs: "#42b883",
  "Vue.js": "#3b8070",
  Tailwindcss: "#35bef8",
  "Nuxt.js": "#41b883",
};

const elements = document.querySelectorAll(".skill");
const getColors = (name) => {
  return colors[name];
};
elements.forEach((e) => {
  const content = e.textContent.replaceAll(" ", "").replaceAll("\n", "")
    .replaceAll("\t", "");
  console.log(content);
  console.log(colors[content]);
  e.style.backgroundColor = getColors(content);
});

export { colors };
