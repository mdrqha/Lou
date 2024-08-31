import React, { useState } from 'react';
import './i18n';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from './Components/Menu/Menu';
import  VisualTestingPage  from './Pages/Visual-testing/Visual-testing';
import  ProfilePage  from './Pages/Profile/Profile';
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";

const LouApp = () => {
const [url, setUrl] = useState('');
const [productUrl, setProductUrl] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const { t } = useTranslation();

  return (
     <Router>
      <div className="lou-w-screen lou-h-screen lou-bg-dark-30 lou-gap-md lou-grid lou-grid-cols-layout-main lou-p-sm" lou-component="page">
        <Menu />
        <Routes>
          <Route path="/visual-testing" element={<VisualTestingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default LouApp;
