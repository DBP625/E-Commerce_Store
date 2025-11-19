import express from "express";

const SSLCommerzPayment = require("sslcommerz-lts");

import dotenv from "dotenv";

dotenv.config();

export const SSLCredentials = new SSLCommerzPayment({
  store_id: process.env.SSLCZ_STORE_ID,
  store_passwd: process.env.SSLCZ_STORE_PASSWORD,
  is_live: process.env.SSLCOMMERZ_IS_LIVE === "true",
});
