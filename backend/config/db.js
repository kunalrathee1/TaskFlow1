import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');

        // Check if MONGO_URI is defined
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are no longer needed in Mongoose 6+ but good for older versions awareness
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error details:');
        console.error(`Message: ${error.message}`);
        console.error(`Name: ${error.name}`);
        if (error.name === 'MongoServerSelectionError') {
            console.error('👉 Hint: Check your IP Whitelist in MongoDB Atlas (allow 0.0.0.0/0)');
        } else if (error.message.includes('authentication failed')) {
            console.error('👉 Hint: Check your Username and Password in MONGO_URI');
            console.error('👉 Hint: Ensure special characters in password are URL encoded');
        }
        // Do NOT exit process.exit(1) on Render immediately, let it retry or stay up for logs
        // process.exit(1); 
    }
};

export default connectDB;
