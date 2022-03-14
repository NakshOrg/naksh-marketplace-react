import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import uuid from 'react-uuid';
import { BottomSheet } from 'react-spring-bottom-sheet';
import crossBtn from "../../assets/svgs/header-cross.svg";
import 'react-spring-bottom-sheet/dist/style.css';
import { motion } from 'framer-motion';

import NftCard from '../../components/explore/NftCard';
import ArtistCard from '../../components/explore/ArtistCard';
import Spinner from '../../components/uiComponents/Spinner';
import classes from './browse.module.css';
import Dropdown from '../../components/uiComponents/Dropdown';
import { staticValues } from '../../constants';
import NearHelperFunctions from '../../services/nearHelperFunctions';
import globalStyles from '../../globalStyles';

class Browse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allNfts: [],
            totalNfts: [],
            page: 8,
            currentSort: staticValues.sortFilter[0].name,
            open: false
        }
    }

    componentDidMount() {

        if(this.props.walletInfo) {
            this.fetchNfts();
        }

    }

    componentDidUpdate(prevProps, prevState) {

        if(prevProps.walletInfo !== this.props.walletInfo) {
            this.fetchNfts();
        }

        if(prevState.currentSort !== this.state.currentSort) {
            this.applyFilters();
        }

    }

    fetchNfts = () => {

        const functions = new NearHelperFunctions(this.props.walletInfo); 
        
        functions.getAllNfts()
        .then(res => {
            const result = res.sort(function(a, b) {
                return new Date(b.metadata.issued_at) - new Date(a.metadata.issued_at);
            });
            const totalNfts = result;
            const firstSetOfData = totalNfts.slice(0, this.state.page);
            this.setState({
                totalNfts,
                allNfts:firstSetOfData, 
                loading:false
            });
        })
        .catch(err => {
            console.log(err);
            alert("something went wrong!");
            this.setState({loading:false});
        });

    }

    applyFilters = (isMobile) => {
        
        console.log(this.state.page, 'pae');
        const { totalNfts, currentSort } = this.state;
        const copiedFilterArr = [...totalNfts];
        let result, filteredNfts;

        if(currentSort === "Newest first") {
            copiedFilterArr.sort(function(a, b) {
                return new Date(b.metadata.issued_at) - new Date(a.metadata.issued_at);
            });
            filteredNfts = copiedFilterArr;
        } else if(currentSort === "Oldest first") {
            copiedFilterArr.sort(function(a, b) {
                return new Date(a.metadata.issued_at) - new Date(b.metadata.issued_at);
            });
            filteredNfts = copiedFilterArr;
        } else if(currentSort === "Price - High to low") {
            filteredNfts = copiedFilterArr.sort(function(a, b) {
                return b.price - a.price;
            });
        } else {
            filteredNfts = copiedFilterArr.sort(function(a, b) {
                return a.price - b.price;
            });
        }

        result = filteredNfts.slice(0, 8);

        if(isMobile) return this.setState({allNfts:result, open: false});

        this.setState({allNfts:result, totalNfts:filteredNfts});
    }

    resetFilters = () => {
        this.setState({
            currentSort: staticValues.sortFilter[0].name
        });
    }

    handleMoreData = () => {

        const { totalNfts } = this.state;

        this.setState(prevState => ({
            ...prevState,
            page: prevState.page + 8
        }), () => {
            const allNfts = [...this.state.allNfts];
            const nextSetOfData = totalNfts.slice(this.state.page - 8, this.state.page);
            nextSetOfData.map(item => allNfts.push(item));
            this.setState({
                allNfts: allNfts
            });
        });

    }

    renderNfts = () => {

        return this.state.allNfts.map(nft => {
            return <Col key={uuid()} style={{marginBottom:25}} lg={3} md={4} sm={6} xs={12}>
                <NftCard
                    onClick={() => this.props.history.push(`/nftdetails/${nft.token_id}`)}
                    image={nft.metadata.media}
                    title={nft.metadata.title}
                    nearFee={nft.price}
                    artistName={nft?.artist?.name} 
                    artistImage={nft?.artist?.image}
                />
            </Col>
        });

    }

    render() {

        if(this.state.loading) return <Spinner/>;

        return (
            <Container fluid className={classes.container}>
                {/* <div className={classes.exploreGradientBlue}/> */}
                <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                    <div className={classes.sectionTitle}>Explore NFTs</div>
                    <div className={classes.desktopHeaderSection} style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:190}}>
                        <div style={{marginLeft:13}}/>
                        <Dropdown 
                            title={this.state.currentSort}
                            content={staticValues.sortFilter}
                            onChange={(val) => this.setState({currentSort:val.name})}
                        />
                    </div>
                </div>
                <div className={classes.desktopHeaderSection} style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:10, marginTop:13}}/>
                <div className={classes.nftContainer}>
                    <Row>
                        {this.renderNfts()}
                    </Row>   
                    <div style={{marginBottom:50}}/>
                    {/* <div className={classes.exploreGradientPink}/> */}
                </div>
                <div className={classes.viewMore} onClick={this.handleMoreData}>
                    VIEW MORE
                </div>
                <div onClick={() => this.setState({open:true})} className={classes.mobileFixedBtn}>
                    FILTER
                </div>  
                <BottomSheet
                    open={this.state.open}
                    onDismiss={() => this.setState({open:false})}
                    header={false}
                    snapPoints={({ minHeight, maxHeight }) => [minHeight*1.8, maxHeight]}
                >
                    <img 
                        onClick={() => this.setState({open:false})}
                        style={{height:30, width:30, position: "absolute", right: "20px", top: "15px"}} 
                        src={crossBtn} 
                        alt="cross"
                    />
                    <div style={{marginTop:35}}>
                        <div style={{fontFamily:"Athelas-Bold", fontSize:18}}>Sort by</div>
                        <div style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:10, marginTop:8}}/>
                        <div className={classes.pillsContainer}>
                            {staticValues.sortFilter.map(item => {
                                return <div
                                    key={uuid()} 
                                    onClick={() => this.setState({currentSort:item.name})}
                                    className={`${classes.pill} ${this.state.currentSort === item.name ? classes.pillActive : ""}`}
                                >
                                    {item.name}
                                </div>})
                            }
                        </div>
                    </div>
                    <div style={{...globalStyles.flexRowSpace, position: "absolute", width: "87%", bottom: "20px"}}>
                        <div className={classes.clearBtn} onClick={this.resetFilters}>
                            CLEAR FILTER
                        </div>  
                        <div className={classes.applyBtn} onClick={() => this.applyFilters(true)}>
                            APPLY FILTER
                        </div> 
                    </div>
                </BottomSheet>              
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        walletInfo: state.nearReducer.walletInfo
    }
};

export default connect(mapStateToProps, null)(Browse);
