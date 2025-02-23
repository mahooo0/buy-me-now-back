const express = require('express');
const { Read_Translation } = require('./Collection/translation/Controllers');
const { Contact } = require('./Collection/Contact-by-users/Controllers');
const { ReadContactHero } = require('./Collection/ContactHero/Controllers');
const { ReadSEo } = require('./Collection/Seo/Controllers');
const { ReadLogo } = require('./Collection/Logo/Controllers');
const { ReadHomeHero } = require('./Collection/HomeHero/Controllers');
const {
    ReadHomeProductBunner,
} = require('./Collection/ProductBunner/Controllers');
const { ReadCategoryes } = require('./Collection/ProductCategory/Controllers');
const {
    ReadBlogs,
    GetBlogs,
    GetBlogDetail,
} = require('./Collection/Blogs/Controllers');
const {
    ReadContactHomeBunner,
} = require('./Collection/ContactUsBunner/Controllers');
const { GetFooterData, GetCarsData } = require('./apiControllers');
const {
    GetAbautDeveloper,
} = require('./Collection/AboutDeveloper/Controllers');
const { GetAboutDeveloper } = require('./Collection/AboutHero/Controllers');
const { GetAboutInfos } = require('./Collection/AboutInfo/Controllers');
const {
    GetAboutBunner1,
} = require('./Collection/AboutInfoBunner1/Controllers');
const {
    GetAboutBunner2,
} = require('./Collection/AboutInfoBunner2/Controllers');
const { GetProductDetail } = require('./Collection/Product/Controllers');
const { GetContactInfos } = require('./Collection/ContactInfos/Controllers');
const router = express.Router();
// Register new admin

// Get all users
router.get('/translates', Read_Translation);
router.post('/cotact-by-user', Contact);
router.get('/cotact-hero', ReadContactHero);
router.get('/seo', ReadSEo);
router.get('/logo', ReadLogo);
router.get('/home-hero', ReadHomeHero);
router.get('/home-producy-bunner', ReadHomeProductBunner);
router.get('/categoryes', ReadCategoryes);
router.get('/blogs-home', ReadBlogs);
router.get('/contact-bunner', ReadContactHomeBunner);
router.get('/about-developer', GetAbautDeveloper);
router.get('/about-hero', GetAboutDeveloper);
router.get('/about-infos', GetAboutInfos);
router.get('/about-bunner1', GetAboutBunner1);
router.get('/about-bunner2', GetAboutBunner2);
router.get('/about-bunner2', GetAboutBunner2);
router.get('/cars', GetCarsData);
router.get('/blogs', GetBlogs);
router.get('/blogs/:slug', GetBlogDetail);
router.get('/cars/:slug', GetProductDetail);
router.get('/contact-infos', GetContactInfos);

//EDIT
router.get('/footer', GetFooterData);

module.exports = router;
