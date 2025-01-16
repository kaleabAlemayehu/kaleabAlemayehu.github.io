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

const getColors = (name) => {
  return colors[name];
};

function generateColor() {
  return "hsl(" + 360 * Math.random() + "," +
    (45 + 50 * Math.random()) + "%," +
    (85 + 10 * Math.random()) + "%)";
}
export { colors, generateColor, getColors };
