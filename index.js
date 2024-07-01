const PORT = 5000
const express = require("express");
const app = express();
const mongooseConnect = require("./config/config")
const userRoutes = require('./routes/userRoute');
const categoryRoutes = require('./routes/categoryRoute');
const ProductRoute = require('./routes/ProductRoute');
const checkoutRoute = require('./routes/checkoutRoute');
const cors = require('cors');
const cookieparser = require("cookie-parser");
// const redis = require("redis");
// let redisClient;

// // Redis connection
// (async () => {
//     redisClient = redis.createClient();
//     redisClient.on('error', (error)=> console.log('redis error'+error));
//     await redisClient.connect();
// })();


// Connect to MongoDB
mongooseConnect()

// Middleware Setup
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Increase payload size limit
app.use(express.json({ limit: '10mb' })); // Increase payload size limit
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
  exposedHeaders: ['set-cookie'], 
}));

// Use cookie-parser middleware
app.use(cookieparser()); 

// Use routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', ProductRoute);
app.use('/api/v1', checkoutRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });