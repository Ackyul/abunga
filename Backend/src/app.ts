import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Routes
import categoryRoutes from './routes/category.route';
import productRoutes from './routes/product.route';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import uploadRoutes from './routes/upload.route';
import stripeRoutes from './routes/stripe.route';
import cartRoutes from './routes/cart.route';
import orderRoutes from './routes/order.route';

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenido a la API del E-commerce' });
});


app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});

export default app;
