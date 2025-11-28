require('dotenv').config();
const mongoose = require('mongoose');

const dbConfig = {
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  CLUSTER: process.env.DB_CLUSTER,
  TLD: process.env.DB_TLD,
  DB: process.env.DB_NAME,
};

const MONGO_URI = `mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.CLUSTER}.${dbConfig.TLD}.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  seekerRating: { type: Number },
  providerRating: { type: Number }
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function updateUserRating() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the test user (using the one from previous tests or a known one)
    // Let's find the most recently created user to be safe, or a specific email
    const user = await User.findOne().sort({ createdAt: -1 });

    if (user) {
      console.log(`Updating user: ${user.email}`);
      user.seekerRating = 4.3;
      user.providerRating = 3.7;
      await user.save();
      console.log('User ratings updated to 4.3 and 3.7');
    } else {
      console.log('No user found to update.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

updateUserRating();
