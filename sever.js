const express = require("express");
require("dotenv").config(); //Config nhanh dotenv

const app = express();

PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${PORT}`));
