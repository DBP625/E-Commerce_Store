import mongoose from "mongoose";

const uri =
  "mongodb+srv://denesh625_db_user:GVxTUHLXPb6qp8OA@cluster0.gluutzd.mongodb.net/ecommerce_db?appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(uri, { dbName: "ecommerce_db" });
    const db = mongoose.connection.db;
    const coll = db.collection("orders");

    console.log("Dropping index stripeSessionId_1 if it exists...");
    try {
      const res = await coll.dropIndex("stripeSessionId_1");
      console.log("dropIndex result:", res);
    } catch (err) {
      console.log("dropIndex error (might not exist):", err.message || err);
    }

    const indexes = await coll.indexes();
    console.log("Remaining indexes:", JSON.stringify(indexes, null, 2));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error dropping index:", err);
    process.exit(1);
  }
}

run();
