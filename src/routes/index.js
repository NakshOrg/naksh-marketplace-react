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
import PolygonNftDetails from '../pages/detailsPage/polygon/NftDetails';
import CollectionDetails from '../pages/detailsPage/polygon/CollectionDetails';
import CreateNft from "../pages/nft/CreateNft"
import CreateCollection from "../pages/nft/CreateCollection"

export default function Navigation() {
    return (
        <Switch>
            <Route path="/" component={Home} exact/>
            <Route path="/browse" component={Browse}/>
            <Route path="/nftdetails/:id" component={NftDetails} exact/>
            <Route
				path="/polygon/nftdetails/:address/:id"
				component={PolygonNftDetails}
				exact
			/>
			<Route
				path="/collection/:address"
				component={CollectionDetails}
				exact
			/>
			<Route path="/create/nft" component={CreateNft} />
			<Route path="/create/collection" component={CreateCollection} />
            <Route path="/searchresults/:keyword" component={SearchResults}/>
            <Route path="/userprofile" component={UserProfile}/>
            <Route path="/editprofile" component={EditProfile}/>
            <Route path="/blogs" component={Blogs}/>
            <Route path="/helpcenter" component={HelpCenter}/>
            <Route path="/aboutnaksh" component={AboutNaksh}/>
            <Route path="/ourartists/:id" component={ArtistDetails}/>
            <Route path="/ourartists" component={OurArtists}/>
            <Route path="/nearprotocol" component={NearProtocol}/>
            <Route path="/404" component={NotFound}/>
            <Redirect from='*' to='/404' exact/>
        </Switch>
    )
}

