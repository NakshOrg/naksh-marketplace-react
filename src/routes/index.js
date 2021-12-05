import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Home from '../pages/home/Home';
import NotFound from '../pages/notFound/NotFound';

export default function Navigation() {
    return (
        <Routes>
            <Route path="/" element={<Home/>} exact/>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

