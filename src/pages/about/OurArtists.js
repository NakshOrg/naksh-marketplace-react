import React, { useEffect, useState } from 'react';
import { Col, Row, Container, Spinner } from 'react-bootstrap';
import { BottomSheet } from 'react-spring-bottom-sheet';
import crossBtn from "../../assets/svgs/header-cross.svg";
import 'react-spring-bottom-sheet/dist/style.css';
import { useHistory, Link } from 'react-router-dom';
import uuid from 'react-uuid';

import ArtistCard from '../../components/explore/ArtistCard';
import Filters from '../../pages/browse/Filters';
import globalStyles from '../../globalStyles';
import classes from './about.module.css';
import { OutlineBtn } from '../../components/uiComponents/Buttons';
import { _getAllArtforms, _getAllArtists } from '../../services/axios/api';
import Dropdown from '../../components/uiComponents/Dropdown';
import { staticValues } from '../../constants';
import Footer from '../../components/uiComponents/Footer';
import jsonData from '../../constants/states.json';

const stateOptions = jsonData.states;

export default function OurArtists() {

    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState([]);
    const [artforms, setArtforms] = useState([]);
    const [open, setOpen] = useState(false);
    const [filterParams, setFilterParams] = useState({
        sortBy: 'createdAt', 
        sort: -1,
        createdBy: 0
    }); 
    const [selectedArtform, setSelectedArtform] = useState("All Artforms");
    const [selectedLocation, setSelectedLocation] = useState("Location");
    const history = useHistory();

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
    
    function handleFilterChange(item, type) {

        if (type === "artform") {
            setSelectedArtform(item.name);
            setFilterParams(prevState => ({
                ...prevState,
                artform: item._id
            }));
        } else {
            setSelectedLocation(item.value);
            setFilterParams(prevState => ({
                ...prevState,
                state: item.value
            }));
        }
    }

    function clearFilters() {
        setSelectedArtform("All Artforms");
        setSelectedLocation("Location");
    }

    return (
        <Container fluid className={classes.container}>
            <div className={classes.sectionCaption}>
                Explore our lineup of sensational artists from all across India
            </div>
            <div className={classes.sectionSubHeading}>
                Naksh has artists from different mediums, styles, age-groups and backgrounds - everybody is welcome.
            </div>
            <div style={{...globalStyles.flexRowSpace, marginTop:100}}>
                <div style={{margin:0}} className={classes.sectionTitle}>Our artists</div>
                <div className={classes.desktopFilter} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <Dropdown 
                        title={selectedArtform}
                        content={artforms}
                        onChange={(item) => handleFilterChange(item, "artform")}
                    />
                    <div style={{marginLeft:20}}/>
                    <Dropdown 
                        title={selectedLocation}
                        content={stateOptions}
                        onChange={(item) => handleFilterChange(item, "location")}
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
                return <Col style={{marginBottom:70}} key={uuid()} lg={3} md={4} sm={6} xs={12}>
                    <Link style={{color:"#fff"}}>
                        <ArtistCard
                            onClick={() => history.push(`/ourartists/${artist._id}`)}
                            image={artist.image}
                            name={artist.name}
                            artform={artist?.artform?.name ?? "-----"}
                            place={artist.state ?? "-----"}
                        />
                    </Link>
                </Col>})}
            </Row>}
            <div onClick={() => setOpen(true)} className={classes.mobileFixedBtn}>
                    FILTER
                </div>  
                <BottomSheet
                    open={open}
                    onDismiss={() => setOpen(false)}
                    header={false}
                    style={{height:300}}
                    snapPoints={({ minHeight, maxHeight }) => [minHeight*1.8, 600]}
                >
                    <img 
                        onClick={() => setOpen(false)}
                        style={{height:30, width:30, position: "absolute", right: "20px", top: "15px"}} 
                        src={crossBtn} 
                        alt="cross"
                    />
                    <div style={{marginTop:35}}>
                        <div style={{fontFamily:"Athelas-Bold", fontSize:18}}>Sort by</div>
                        <div style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:10, marginTop:8}}/>
                        <div className={classes.pillsContainer}>
                            {artforms.map(item => {
                                return <div
                                    key={uuid()} 
                                    onClick={() => handleFilterChange(item, "artform")}
                                    className={`${classes.pill} ${selectedArtform === item.name ? classes.pillActive : ""}`}
                                >
                                    {item.name}
                                </div>})
                            }
                        </div>
                    </div>
                    <div style={{marginTop:35}}>
                        <div style={{fontFamily:"Athelas-Bold", fontSize:18}}>Location</div>
                        <div style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:10, marginTop:8}}/>
                        <div style={{height:200, overflowY:"scroll"}} className={classes.pillsContainer}>
                            {stateOptions.map(item => {
                                return <div
                                        key={uuid()} 
                                        onClick={() => handleFilterChange(item, "state")}
                                        className={`${classes.pill} ${selectedLocation === item.value ? classes.pillActive : ""}`}
                                    >
                                    {item.label}
                                </div>})
                            }
                        </div>
                    </div>
                    <div style={{...globalStyles.flexRowSpace, position: "absolute", width: "87%", bottom: "20px"}}>
                        <div className={classes.clearBtn} onClick={clearFilters}>
                            CLEAR FILTER
                        </div>  
                        <div className={classes.applyBtn} onClick={() => setOpen(false)}>
                            APPLY FILTER
                        </div> 
                    </div>
                </BottomSheet>  
                <Footer/>
            {/* <OutlineBtn
                text="VIEW MORE"
                style={{margin:"20px auto", fontFamily:"Athelas-Regular", borderRadius:2, fontSize:12, letterSpacing:"1px", textAlign:'center'}}
            /> */}
        </Container>
    )
}
