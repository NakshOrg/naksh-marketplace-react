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
import AboutNaksh from '../pages/about/AboutNaksh';
import OurArtists from '../pages/about/OurArtists';
import NearProtocol from '../pages/about/NearProtocol';

export default function Navigation() {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Routes>
            <Route path="/" element={<Home/>} exact />
            <Route path="/browse" element={<Browse navigate={navigate}/>} />
            <Route path="/nftdetails/:id" element={<NftDetails/>}/>
            <Route path="/searchresults/:keyword" element={<SearchResults/>} />
            <Route path="/userprofile" element={<UserProfile navigate={navigate}/>} />
            <Route path="/editprofile" element={<EditProfile navigate={navigate}/>} />
            <Route path="/blogs" element={<Blogs navigate={navigate}/>} />
            <Route path="/helpcenter" element={<HelpCenter navigate={navigate}/>} />
            <Route path="/aboutnaksh" element={<AboutNaksh/>} />
            <Route path="/ourartists" element={<OurArtists/>} />
            <Route path="/ourartists/:id" element={<ArtistDetails/>} />
            <Route path="/nearprotocol" element={<NearProtocol/>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

