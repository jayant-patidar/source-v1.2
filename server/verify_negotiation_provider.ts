
import mongoose from 'mongoose';
import NegotiationDAL from './src/components/negotiation/negotiation.dal';
import Negotiation from './src/components/negotiation/negotiation.model';
import User from './src/components/user/user.model';
import Job from './src/components/job/job.model';
import dotenv from 'dotenv';

dotenv.config();

const verifyProvider = async () => {
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
    console.log('Connected to DB');
    console.log('Registered Models:', mongoose.modelNames());

    // Find a negotiation to test with
    const negotiation = await Negotiation.findOne();
    if (!negotiation) {
        console.log('No negotiations found to test.');
        return;
    }

    const negotiationDAL = new NegotiationDAL();
    const results = await negotiationDAL.getNegotiationsByJobId((negotiation.job as any).toString());

    if (results.length > 0) {
        console.log('--- Verification Result ---');
        console.log('Negotiation ID:', results[0]._id);
        console.log('Provider Field:', results[0].provider);
        if (results[0].provider && (results[0].provider as any).name) {
            console.log('SUCCESS: Provider name is populated:', (results[0].provider as any).name);
        } else {
            console.log('FAILURE: Provider name is MISSING.');
        }
    } else {
        console.log('No negotiations found for the tested job.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

verifyProvider();
