import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || '';
const databaseURI = process.env.DB_URI

const client = new MongoClient(connectionString);

let conn;
try {
  console.log("Connecting to MongoDB Atlas...");
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db(databaseURI);

export default db;