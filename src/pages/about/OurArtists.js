import React, { useEffect, useState } from 'react';
import { Col, Row, Container, Spinner } from 'react-bootstrap';

import ArtistCard from '../../components/explore/ArtistCard';
import Filters from '../../pages/browse/Filters';
import globalStyles from '../../globalStyles';
import classes from './about.module.css';
import { OutlineBtn } from '../../components/uiComponents/Buttons';
import { Link } from 'react-router-dom';
import { _getAllArtforms, _getAllArtists } from '../../services/axios/api';
import uuid from 'react-uuid';
import Dropdown from '../../components/uiComponents/Dropdown';

export default function OurArtists() {

    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState([]);
    const [artforms, setArtforms] = useState([]);
    const [filterParams, setFilterParams] = useState({
        sortBy: 'createdAt', 
        sort: -1
    });
    const [selectedArtform, setSelectedArtform] = useState("All Artforms");

    useEffect(() => {
      
        getAllArtforms();
        getAllArtists();
    
      return () => {
        
      };
    }, []);

    useEffect(() => {
        setLoading(true);
        getAllArtists();
    }, [filterParams]);
    

    const getAllArtists = () => {
        _getAllArtists(filterParams)
        .then(({ data }) => {
            setLoading(false);
            setArtists(data.artists);
        })
        .catch(err => {
            console.log(err.response);
            setLoading(false);
        })
    }

    const getAllArtforms = () => {
        _getAllArtforms()
        .then(({ data: { artforms } }) => {
            setArtforms([{name:"All Artforms"}, ...artforms]);
        })
    }
    
    function handleFilterChange(item) {
        setSelectedArtform(item.name);
        setFilterParams(prevState => ({
            ...prevState,
            artform: item._id
        }))
    }

    return (
        <Container style={{marginTop:140}}>
            <div className={classes.sectionCaption}>
                Explore our lineup of sensational artists from all across India
            </div>
            <div className={classes.sectionSubHeading}>
                Naksh has artists from different mediums, styles, age-groups and backgrounds - everybody is welcome.
            </div>
            <div style={{...globalStyles.flexRowSpace, marginTop:100}}>
                <div style={{margin:0}} className={classes.sectionTitle}>Our artists</div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:190}}>
                    <div style={{marginLeft:13}}/>
                    <Dropdown 
                        title={selectedArtform}
                        content={artforms}
                        onChange={handleFilterChange}
                    />
                </div>
            </div>

            <div style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:80, marginTop:5}}/>
            {/* overlay gradient  */}
            <div className={classes.detailsGradientOverlay}/>
            {/* overlay gradient  */}
            <div className={classes.detailsGradientOverlayPink}/>
            {loading ?
            <div style={{width:"100%", textAlign:"center", marginTop:50}}>
                <Spinner animation="border" color='#fff' size={20}/>
            </div> :
            <Row>
                {artists.map(artist => {
                return <Col style={{marginBottom:70}} key={uuid()} lg={3} md={3} sm={2} xs={1}>
                    <Link style={{color:"#fff"}} to={`/ourartists/${artist._id}`}>
                        <ArtistCard
                            image={artist.image}
                            name={artist.name}
                            artform={artist?.artform?.name}
                            place={artist.city}
                        />
                    </Link>
                </Col>})}
            </Row>}
            {/* <OutlineBtn
                text="VIEW MORE"
                style={{margin:"20px auto", fontFamily:"Athelas-Regular", borderRadius:2, fontSize:12, letterSpacing:"1px", textAlign:'center'}}
            /> */}
        </Container>
    )
}
