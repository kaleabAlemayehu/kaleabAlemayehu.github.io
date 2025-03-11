const colors = {
  Typescript: "#3178c6",
  Go: "#00ADD8",
  Gin: "#00ADD8",
  Docker: "#0092b7",
  Javascript: "#f0db4f",
  //vuejs: "#42b883",
  "Vue.js": "#3b8070",
  Tailwindcss: "#35bef8",
  "Nuxt.js": "#41b883",
  Nats: "#375c93",
  GraphQL: "#f6009c",
  C: "#444444",
  Hasura: "#3970fd",
  PostgreSQL: "#31638c",
  MongoDB: "#199555",
  Redis: "#d93026",
  Apollo: "#000000",
  HTML: "#E34C26",
  CSS: "#2965f1",
  "Grammy.js": "#009dca",
  PostGIS: "#56799f",
};

const getColors = (name) => {
  console.log(`${name} ${colors[name]}`);
  return colors[name] || "#444444";
};

function generateColor() {
  return (
    "hsl(" +
    360 * Math.random() +
    "," +
    (45 + 50 * Math.random()) +
    "%," +
    (85 + 10 * Math.random()) +
    "%)"
  );
}
export { generateColor, getColors };
