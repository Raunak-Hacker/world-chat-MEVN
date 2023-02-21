const fetch = require("node-fetch");
const url = "https://world-chat-mevn-production.up.railway.app/";
function read(continent) {
  // Read from database
  return fetch(url + "chat/" + continent)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}
module.exports = { read };

function addMsg(msg) {
  // Add msg to database
  // console.log(JSON.stringify(msg));
  fetch(url + "chat-add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg),
  })
    // .then((response) => response.text())
    // .then((data) => console.log(data))
    .catch((error) => console.error(error));
}
module.exports = { read, addMsg };
