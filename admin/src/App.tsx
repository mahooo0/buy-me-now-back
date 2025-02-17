import { useState } from 'react';

import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import Exsample from './pages/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layot';
import Users from './pages/UserMAnegment/Users';
import DashboardPage from './pages/dashboard';
import Translations from './pages/translations';
import Seo from './pages/Seo';
import Icons from './pages/Icons';
import SubCategory from './pages/SubCategory';

const queryClient = new QueryClient();
import { RecoilRoot } from 'recoil';
import ExsampleData from './pages/Data';
import Home_hero from './pages/Home_hero';
import Home_Product_bunner from './pages/Home_Product_bunner';
import ContactBunner from './pages/ContactBunner';
import AboutDeveloper from './pages/AboutDeveloper';
import AboutHero from './pages/AboutHero';
import AboutInfos from './pages/AboutInfos';
import AboutBunner1 from './pages/AboutBunner1';
import AboutBunner2 from './pages/AboutBunner2';
import Blogs from './pages/Blogs';
import ContactHero from './pages/ContactHero';
import ContactInfos from './pages/ContactInfos';
import ProductCategory from './pages/ProductCategory';
function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RecoilRoot>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/exsample" element={<Exsample />} />
                            Dasboard
                            <Route
                                path="/users"
                                element={
                                    <Layout>
                                        <Users />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/Dasboard"
                                element={
                                    <Layout>
                                        <DashboardPage />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/translations"
                                element={
                                    <Layout>
                                        <Translations />
                                    </Layout>
                                }
                            />
                            icons
                            <Route
                                path="/seo"
                                element={
                                    <Layout>
                                        <Seo />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/icons"
                                element={
                                    <Layout>
                                        <Icons />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/home-hero"
                                element={
                                    <Layout>
                                        <Home_hero />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/Home-Product-bunner"
                                element={
                                    <Layout>
                                        <Home_Product_bunner />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/contact-bunner"
                                element={
                                    <Layout>
                                        <ContactBunner />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/about-developer"
                                element={
                                    <Layout>
                                        <AboutDeveloper />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/about-hero"
                                element={
                                    <Layout>
                                        <AboutHero />
                                    </Layout>
                                }
                            />{' '}
                            <Route
                                path="/about-infos"
                                element={
                                    <Layout>
                                        <AboutInfos />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/about-bunner-first"
                                element={
                                    <Layout>
                                        <AboutBunner1 />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/about-bunner-second"
                                element={
                                    <Layout>
                                        <AboutBunner2 />
                                    </Layout>
                                }
                            />{' '}
                            <Route
                                path="/blogs"
                                element={
                                    <Layout>
                                        <Blogs />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/contact-hero"
                                element={
                                    <Layout>
                                        <ContactHero />
                                    </Layout>
                                }
                            />{' '}
                            <Route
                                path="/contact-infos"
                                element={
                                    <Layout>
                                        <ContactInfos />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/product-category"
                                element={
                                    <Layout>
                                        <ProductCategory />
                                    </Layout>
                                }
                            />
                        </Routes>
                    </BrowserRouter>
                </RecoilRoot>

                <Toaster />
            </QueryClientProvider>
        </>
    );
}

export default App;
