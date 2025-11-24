const app = require("../app.js");

const PORT = app.get("port") || 8085;

app.listen(PORT, () => {
  console.log(`Servidor ArTours corriendo en puerto ${PORT}`);
});
