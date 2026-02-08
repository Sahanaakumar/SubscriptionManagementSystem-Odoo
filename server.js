const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { protect, authorize } = require('./middleware/authMiddleware');


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const planRoutes = require('./routes/planRoutes');
const customerRoutes = require('./routes/customerRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

connectDB();

const app = express();


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('API is running...');
});


app.use('/api/auth', authRoutes);


app.use('/api/products', protect, authorize('admin', 'internal'), productRoutes);
app.use('/api/plans', protect, authorize('admin', 'internal'), planRoutes);
app.use('/api/customers', protect, authorize('admin', 'internal'), customerRoutes);
app.use('/api/subscriptions', protect, authorize('admin', 'internal'), subscriptionRoutes); 
app.use('/api/invoices', protect, authorize('admin', 'internal'), invoiceRoutes);
app.use('/api/payments', protect, authorize('admin', 'internal'), paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Server restarted and ready for requests...');
});
