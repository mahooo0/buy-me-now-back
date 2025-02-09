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
import Category from './pages/Category';
import SubCategory from './pages/SubCategory';

const queryClient = new QueryClient();
import { RecoilRoot } from 'recoil';
import ExsampleData from './pages/Data';
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
                                path="/exmplCategory"
                                element={
                                    <Layout>
                                        <Category />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/subCategory"
                                element={
                                    <Layout>
                                        <SubCategory />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/data"
                                element={
                                    <Layout>
                                        <ExsampleData />
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
