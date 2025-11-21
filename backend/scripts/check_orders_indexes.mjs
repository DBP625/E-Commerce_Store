import mongoose from "mongoose";

const uri =
  "mongodb+srv://denesh625_db_user:GVxTUHLXPb6qp8OA@cluster0.gluutzd.mongodb.net/ecommerce_db?appName=Cluster0";

async function main() {
  try {
    await mongoose.connect(uri, { dbName: "ecommerce_db" });
    const db = mongoose.connection.db;

    const indexes = await db.collection("orders").indexes();
    console.log("--- Indexes on orders ---");
    console.log(JSON.stringify(indexes, null, 2));

    const docsExists = await db
      .collection("orders")
      .find({ stripeSessionId: { $exists: true } })
      .limit(5)
      .toArray();
    console.log("--- Sample docs with stripeSessionId (limit 5) ---");
    console.log(JSON.stringify(docsExists, null, 2));

    const countExists = await db
      .collection("orders")
      .countDocuments({ stripeSessionId: { $exists: true } });
    console.log("countExists:", countExists);

    const countNull = await db
      .collection("orders")
      .countDocuments({ stripeSessionId: null });
    console.log("countNull:", countNull);

    if (countNull > 0) {
      const nullSamples = await db
        .collection("orders")
        .find({ stripeSessionId: null })
        .limit(5)
        .toArray();
      console.log("--- Sample docs with stripeSessionId:null (limit 5) ---");
      console.log(JSON.stringify(nullSamples, null, 2));
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error checking indexes/docs:", err);
    process.exit(1);
  }
}

main();
