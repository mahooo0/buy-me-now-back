const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const path = require('path');

const app = express();
const AdminRouter = require('./Collection/Admins/AdminRouter.js');
const LogoRouter = require('./Collection/Logo/LogoRouter.js');
const SeoRouter = require('./Collection/Seo/seoRouter.js');
const TranslationRouter = require('./Collection/translation/translationRouter.js');

// Moongose Connection start
const MONGO_URI =
    'mongodb+srv://admin:admin@cluster0.nm1wd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => console.error('MongoDB connection error:', err));
// Moongose Connection end
app.use(express.json());
app.use(cors());
const uploadFolder = path.join(__dirname, 'uploads');

app.use('/uploads', express.static(uploadFolder));

//Routes Start
app.get('/', function (req, res) {
    res.send('Hello World');
});
app.use('/users', AdminRouter);
app.use('/translations', TranslationRouter);
app.use('/seo', SeoRouter);
app.use('/logo', LogoRouter);
//Routes End

app.listen(3000);
