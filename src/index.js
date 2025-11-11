import serverless from "serverless-http";
import app from "./server.js";
import { connectToDatabase } from "./config/db.js";

let handlerPromise = null;

async function ensure() {
  if (!handlerPromise) {
    try {
      if (typeof connectToDatabase === "function") {
        await connectToDatabase().catch((e) => console.error("DB connect error (wrapper):", e));
      }
    } catch (e) {
      console.error("DB wrapper init error:", e);
    }
    handlerPromise = Promise.resolve(serverless(app));
  }
  return handlerPromise;
}

export default async function (req, res) {
  const handler = await ensure();
  return handler(req, res);
}

TPF_FS_BE