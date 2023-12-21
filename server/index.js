const express = require("express");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors({
    credentials: true,
    origin: true,
}));
app.use(express.static(path.resolve(__dirname, "..", "src")));

app.listen(PORT, () => {
    console.log("Listening on port", PORT);
});