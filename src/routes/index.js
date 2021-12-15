import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Home from '../pages/home/Home';
import Browse from '../pages/browse/Browse';
import NotFound from '../pages/notFound/NotFound';

export default function Navigation() {
    return (
        <Routes>
            <Route path="/" element={<Home/>} exact />
            <Route path="browse" element={<Browse/>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

