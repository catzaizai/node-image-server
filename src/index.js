import express from "express";
import puppeteer from "puppeteer";
import EchartsImage from "./echarts-image/echarts-image";
import WebImage from "./web-image/web-image";

var app = express();
app.use(express.json({ limit: "50mb" }));

var webImage = new WebImage();

app.post("/generateEchartsImg", (req, res) => {
  const { width, height, options } = req.body;
  const echartsImage = new EchartsImage(width, height);
  const base64 = echartsImage.getBase64(options);
  res.send(base64);
  res.end();
});

app.post("/screenshotUrlImg", async (req, res) => {
  let { url, operations, selector, padding, bbox, delay } = req.body;
  const base64 = await webImage.getBase64(url, selector, padding, bbox, delay, operations);
  res.send(base64);
  res.end();
});

app.post("/login", async (req, res) => {
  const {
    username,
    password,
    url,
    uSelector,
    pSelector,
    submitBtnSelector
  } = req.body;
  const result = await webImage.login(url, username, password, uSelector, pSelector, submitBtnSelector);
  res.send(result);
  res.end();
});

app.get("/", (req, res) => {
  res.end("node image service is start <br/> version: 1.0.0");
});

var server = app.listen(8081, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log("app listening at http://%s%s", host, port);
});
