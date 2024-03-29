import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

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
import CreateNft from '../pages/createnft/CreateNft';
import UnlistedDetailPage from '../pages/detailsPage/UnlistedDetailPage';
import Collection from '../pages/collection/Collection';
import ViewCollection from '../pages/collection/ViewCollection';

export default function Navigation() {

    return (
        <Switch>
            <Route path="/" component={Home} exact/>
            <Route path="/browse" component={Browse}/>
            <Route path="/nftdetails/:id" component={NftDetails} exact/>
            <Route path="/searchresults/:keyword" component={SearchResults}/>
            <Route path="/userprofile" component={UserProfile}/>
            <Route path="/editprofile" component={EditProfile}/>
            <Route path="/blogs" component={Blogs}/>
            <Route path="/helpcenter" component={HelpCenter}/>
            <Route path="/aboutnaksh" component={AboutNaksh}/>
            <Route path="/ourartists/:id" component={ArtistDetails}/>
            <Route path="/ourartists" component={OurArtists}/>
            <Route path="/nearprotocol" component={NearProtocol}/>
            <Route path="/createnft" component={CreateNft}/>
            <Route path="/collection" component={Collection}/>
            <Route path="/viewcollection/:id" component={ViewCollection}/>
            <Route path="/unlisted/(id)?/:id?/(collID)?/:collID?" component={UnlistedDetailPage}/>
            <Route path="/404" component={NotFound}/>
            <Redirect from='*' to='/404' exact/>
        </Switch>
    )
}

