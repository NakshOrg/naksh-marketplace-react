import React, { Component, Fragment } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import uuid from 'react-uuid';

import NftCard from '../../components/explore/NftCard';
import ArtistCard from '../../components/explore/ArtistCard';
import Spinner from '../../components/uiComponents/Spinner';
import classes from './browse.module.css';
import Filters from './Filters';
import NearHelperFunctions from '../../services/nearHelperFunctions';

class Browse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allNfts: [],
            filterData: []
        }
    }

    componentDidMount() {

        if(this.props.walletInfo) {
            this.fetchNfts();
        }

    }

    componentDidUpdate(prevProps) {

        if(prevProps.walletInfo !== this.props.walletInfo) {
            this.fetchNfts();
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

    renderNfts = () => {

        return this.state.allNfts.map(nft => {
            return <Col key={uuid()} style={{marginBottom:25}} lg={3} md={3} sm={2} xs={1}>
                <NftCard
                    onClick={() => this.props.navigate(`/nftdetails/${nft.token_id}`)}
                    image={nft.metadata.media}
                    title={"Tanjore Painting"}
                    nearFee={"31000Ⓝ"}
                    price={"$121,000,000"}
                    artistName={"Sharmila S"}
                    artistImage={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"}
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
                    <Filters/>
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
