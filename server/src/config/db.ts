import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async () => {
  try {
    const dbConfig = {
      USER: process.env.DB_USER,
      PASSWORD: process.env.DB_PASSWORD,
      CLUSTER: process.env.DB_CLUSTER,
      TLD: process.env.DB_TLD,
      DB: process.env.DB_NAME,
    };

    const uri = `mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.CLUSTER}.${dbConfig.TLD}.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`;

    await mongoose.connect(uri, {
      dbName: dbConfig.DB,
    } as mongoose.ConnectOptions);

    const connectedDbName = mongoose.connection.name;
    const expectedDbName = dbConfig.DB;

    if (connectedDbName === expectedDbName) {
      logger.info(`Connected to the ${expectedDbName} database`);
    } else {
      logger.warn(`Connected to a different database: ${connectedDbName}`);
    }
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
