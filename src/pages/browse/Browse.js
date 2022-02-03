import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import uuid from 'react-uuid';

import NftCard from '../../components/explore/NftCard';
import ArtistCard from '../../components/explore/ArtistCard';
import Spinner from '../../components/uiComponents/Spinner';
import classes from './browse.module.css';
import Dropdown from '../../components/uiComponents/Dropdown';
import { staticValues } from '../../constants';
import NearHelperFunctions from '../../services/nearHelperFunctions';

class Browse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allNfts: [],
            filterData: [],
            currentSort: staticValues.sortFilter[0]
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
            const reversedAllNfts = [...res];
            const reversedFilterNfts = [...res];
            this.setState({
                allNfts:reversedAllNfts.reverse(), 
                filterData:reversedFilterNfts.reverse(), 
                loading:false
            });
        })
        .catch(err => {
            console.log(err);
            alert("something went wrong!");
            this.setState({loading:false});
        });

    }

    applyFilters = () => {
        
        const { filterData, currentSort } = this.state;
        const copiedFilterArr = [...filterData];
        let result;
        if(currentSort === "Newest first") {
            result = copiedFilterArr;
        } else if(currentSort === "Oldest first") {
            result = copiedFilterArr.reverse();
        } else if(currentSort === "Price - High to low") {
            result = copiedFilterArr.sort(function(a, b) {
                return b.price - a.price;
            });
        } else {
            result = copiedFilterArr.sort(function(a, b) {
                return a.price - b.price;
            });
        }

        this.setState({allNfts:result});
    }

    renderNfts = () => {

        return this.state.allNfts.map(nft => {
            return <Col key={uuid()} style={{marginBottom:25}} lg={3} md={3} sm={2} xs={1}>
                <NftCard
                    onClick={() => this.props.navigate(`/nftdetails/${nft.token_id}`)}
                    image={nft.metadata.media}
                    title={nft.metadata.title}
                    nearFee={nft.price}
                    price={"$121,000,000"}
                    artistName={nft?.artist?.name} 
                    artistImage={nft?.artist?.image}
                />
            </Col>
        });

    }

    render() {

        if(this.state.loading) return <Spinner/>;

        return (
            <Container style={{marginTop:95}}>
                <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                    <div className={classes.sectionTitle}>Explore NFTs </div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:190}}>
                        <div style={{marginLeft:13}}/>
                        <Dropdown 
                            title={this.state.currentSort}
                            content={staticValues.sortFilter}
                            onChange={(val) => this.setState({currentSort:val})}
                        />
                    </div>
                </div>
                <div style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:10, marginTop:13}}/>
                <div style={{marginTop:55}}>
                    <Row>
                        {this.renderNfts()}
                    </Row>            
                </div>
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
