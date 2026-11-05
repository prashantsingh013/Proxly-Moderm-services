import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from './seedData.js';

const run = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('✨ Seed script completed successfully.');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Seed runner failed:', error);
    process.exit(1);
  }
};

run();
