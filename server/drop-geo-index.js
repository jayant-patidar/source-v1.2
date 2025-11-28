// Script to drop geospatial index from jobs collection
const mongoose = require('mongoose');
require('dotenv').config();

const dbConfig = {
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  CLUSTER: process.env.DB_CLUSTER,
  TLD: process.env.DB_TLD,
  DB: process.env.DB_NAME,
};

const MONGO_URI = `mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.CLUSTER}.${dbConfig.TLD}.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`;

async function dropGeoIndex() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('jobs');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\nCurrent indexes on jobs collection:');
    console.log(JSON.stringify(indexes, null, 2));

    // Drop geospatial indexes
    for (const index of indexes) {
      const indexName = index.name;
      // Skip the default _id index
      if (indexName === '_id_') continue;
      
      // Check if it's a geospatial index
      const is2dsphere = Object.values(index.key).includes('2dsphere');
      
      if (is2dsphere) {
        console.log(`\nDropping geospatial index: ${indexName}`);
        await collection.dropIndex(indexName);
        console.log(`✓ Dropped index: ${indexName}`);
      }
    }

    console.log('\n✓ All geospatial indexes removed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

dropGeoIndex();
