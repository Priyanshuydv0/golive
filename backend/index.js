if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose")
const app = express();
const http = require("http");
const { connectionToSocket } = require("./socketManager");

const server = http.createServer(app);
const io = connectionToSocket(server);

const cookieParser = require('cookie-parser');
const port = 8000;
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
const SignupRouter = require("./routes/signup")
const LoginRouter = require("./routes/login");
const AuthRouter = require("./routes/auth")
const historyRouter= require("./routes/history");
const logoutRouter = require("./routes/logout");


const main = () => {
  mongoose.connect(process.env.DB_URL)
    .then(() => console.log('DB connected successfully'))
    .catch(err => console.log('DB connection failed:', err));
}
app.use(cors({
  origin: process.env.FRONTEND_URL, // exact frontend origin
  credentials: true                 // allow cookies
}));
main();
app.get("/api", (req, res) => {
  res.send("this is root ")
})
app.use("/api/signup", SignupRouter)
app.use("/api/login", LoginRouter)
app.use("/api/auth", AuthRouter)
app.use("/api/history", historyRouter);
app.use("/api/logout", logoutRouter);


server.listen(port, () => {
  console.log("server is running");
})