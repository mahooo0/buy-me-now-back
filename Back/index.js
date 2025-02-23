const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const path = require('path');

const app = express();
const AdminRouter = require('./Collection/Admins/AdminRouter.js');
const LogoRouter = require('./Collection/Logo/LogoRouter.js');
const SeoRouter = require('./Collection/Seo/seoRouter.js');
const TranslationRouter = require('./Collection/translation/translationRouter.js');
const homeHeroRouter = require('./Collection/HomeHero/HomeHeroRouter.js');
const homeProductBunnerRouter = require('./Collection/ProductBunner/ProducBunnerRouter.js');
const homeContactBunnerRouter = require('./Collection/ContactUsBunner/HomeCantactBunnerRouter.js');
const AboutDeveloperRouter = require('./Collection/AboutDeveloper/AboutDeveloperRouter.js');
const AboutHeroRouter = require('./Collection/AboutHero/ProducBunnerRouter.js');
const AboutInfoRouter = require('./Collection/AboutInfo/AboutInfoRouter.js');
const AboutBunner1Router = require('./Collection/AboutInfoBunner1/AboutBunner1Router.js');
const AboutBunner2Router = require('./Collection/AboutInfoBunner2/AboutBunner2Router.js');
const BlogsRouter = require('./Collection/Blogs/BlogRouter.js');
const ContactHero = require('./Collection/ContactHero/ContactHero.js');
const ContactInfos = require('./Collection/ContactInfos/ContactInfosRouter.js');
const ProductCategory = require('./Collection/ProductCategory/ProductCategoryRouter.js');
const ProductSubCategory = require('./Collection/ProductSubCategory/ProductSubCategoryRouter.js');
const ProductRouter = require('./Collection/Product/ProductRouter.js');
const ContactByUserRouter = require('./Collection/Contact-by-users/Contact-user-Router.js');
const ApiRouter = require('./ApiRouter.js');

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
app.use('/home-hero', homeHeroRouter);
app.use('/home-bunner', homeProductBunnerRouter);
app.use('/contact-bunner', homeContactBunnerRouter);
app.use('/about-developer', AboutDeveloperRouter);
app.use('/about-hero', AboutHeroRouter);
app.use('/abouts', AboutInfoRouter);
app.use('/about-bunner1', AboutBunner1Router);
app.use('/about-bunner2', AboutBunner2Router);
app.use('/blogs', BlogsRouter);
app.use('/contact-hero', ContactHero);
app.use('/contact-infos', ContactInfos);
app.use('/product-category', ProductCategory);
app.use('/product-subcategory', ProductSubCategory);
app.use('/product', ProductRouter);
app.use('/contact-user', ContactByUserRouter);

//api
app.use('/api', ApiRouter);
//Routes End

app.listen(3000);
