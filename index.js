const PORT = 5000
const express = require("express");
const app = express();
const mongooseConnect = require("./config/config")
const userRoutes = require('./routes/userRoute');
const categoryRoutes = require('./routes/categoryRoute');
const ProductRoute = require('./routes/ProductRoute');
const cors = require('cors');
const cookieparser = require("cookie-parser");

// Connect to MongoDB
mongooseConnect()

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

// Use cookie-parser middleware
app.use(cookieparser());

// Use routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', ProductRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });