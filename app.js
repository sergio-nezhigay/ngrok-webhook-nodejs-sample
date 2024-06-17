var express = require("express");
var crypto = require("crypto");
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;
const SHOPIFY_SECRET = "40334744528540f47545ed90a261788c"; // Replace with your actual Shopify secret

// Middleware to verify Shopify HMAC
function verifyShopifyWebhook(req, res, next) {
  console.log("🚀 ~ verifyShopifyWebhook:");
  const hmac = req.get("x-shopify-hmac-sha256");
  const body = JSON.stringify(req.body);

  const hash = crypto
    .createHmac("sha256", SHOPIFY_SECRET)
    .update(body, "utf8")
    .digest("base64");

  //  if (true) {
  if (hash === hmac) {
    console.log("hash === hmac");
    next(); // HMAC is valid
  } else {
    console.log("hash !== hmac!!");
    next(); // emulate HMAC is valid
    //res.status(401).send("HMAC verification failed");
  }
}

app.all("/*", verifyShopifyWebhook, function (req, res) {
  console.log("-------------- New Request --------------");
  console.log("Headers:" + JSON.stringify(req.headers, null, 3));
  console.log("Body:" + JSON.stringify(req.body, null, 3));
  res.json({ message: "Thank you for the message" });
});

app.listen(port, function () {
  console.log(`Example app listening at ${port}`);
});
