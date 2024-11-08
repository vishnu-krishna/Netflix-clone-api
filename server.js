import express from 'express';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movie.js';
import searchRoutes from './routes/search.js';
import tvRoutes from './routes/tv.js';
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import { protectRoute } from './middleware/protectRoute.js';
import cookieParser from 'cookie-parser';
import * as functions from 'firebase-functions';
import path from 'path';

const app = express();
const port = 5001;

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movie', protectRoute, movieRoutes);
app.use('/api/v1/tv', protectRoute, tvRoutes);
app.use('/api/v1/search', protectRoute, searchRoutes);

if (ENV_VARS.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
}

app.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
    connectDB();
});

export const api = functions.https.onRequest(app);