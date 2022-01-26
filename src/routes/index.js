import React from 'react';
import { Route, Routes, useNavigate, useLocation, useParams } from 'react-router-dom';

import Home from '../pages/home/Home';
import Browse from '../pages/browse/Browse';
import NotFound from '../pages/notFound/NotFound'; 
import NftDetails from '../pages/detailsPage/NftDetails';
import ArtistDetails from '../pages/detailsPage/ArtistDetails';
import SearchResults from '../pages/search/SearchResults';
import UserProfile from '../pages/profile/UserProfile';
import EditProfile from '../pages/profile/EditProfile';
import Blogs from '../pages/resources/Blogs';
import HelpCenter from '../pages/resources/HelpCenter';
import About from '../pages/about/About';

export default function Navigation() {

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    return (
        <Routes>
            <Route path="/" element={<Home/>} exact />
            <Route path="/browse" element={<Browse navigate={navigate}/>} />
            <Route path="/nftdetails/:id" element={<NftDetails/>} />
            <Route path="/artistDetails/:id" element={<ArtistDetails/>} />
            <Route path="/searchresults" element={<SearchResults/>} />
            <Route path="/userprofile" element={<UserProfile navigate={navigate}/>} />
            <Route path="/editprofile" element={<EditProfile navigate={navigate}/>} />
            <Route path="/blogs" element={<Blogs navigate={navigate}/>} />
            <Route path="/helpcenter" element={<HelpCenter navigate={navigate}/>} />
            <Route path="/about" element={<About navigate={navigate}/>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

