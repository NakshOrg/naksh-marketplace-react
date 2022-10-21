import React, { useEffect, useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { BottomSheet } from 'react-spring-bottom-sheet';
import crossBtn from "../../assets/svgs/header-cross.svg";
import 'react-spring-bottom-sheet/dist/style.css';
import { useHistory } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import ReactGA from 'react-ga4';

import { PriceDropdown } from '../../components/uiComponents/Dropdown';
import Footer from '../../components/uiComponents/Footer';
import NftCard from '../../components/explore/NftCard';
import Spinner from '../../components/uiComponents/Spinner';
import classes from './browse.module.css';
import Dropdown from '../../components/uiComponents/Dropdown';
import { staticValues } from '../../constants';
import NearHelperFunctions from '../../services/nearHelperFunctions';
import globalStyles from '../../globalStyles';
import SuggestionNfts from './SuggestionNfts';
import Tabs from '../../components/uiComponents/Tabs';
import { _getAllArtists, _getTrendingNft } from '../../services/axios/api';

import { useNFTs } from "../../hooks";
import { useAppContext } from "../../context/wallet";
import { ethers } from "ethers";
import { useTrendingNFTs } from '../../hooks/useTrendingNFTs';
import useCollection from '../../hooks/useCollection';

// ReactGA.send({ hitType: "pageview", page: "browse" });
// ReactGA.event({
//     category: "your category",
//     action: "your action",
//     label: "your label", // optional
//     value: 99, // optional, must be a number
//     nonInteraction: true, // optional, true/false
//     transport: "xhr", // optional, beacon/xhr/image
// });

export default function Browse() {

    const tabContents = [
        {tabName: "NFT", x:40, }, // x is a hard coded value for animating bottom bar
        // {tabName: "COLLECTIONS", x:140, },
    ];
    const walletInfo = useSelector(state => state.nearReducer.walletInfo);
    const history = useHistory();
    console.log(walletInfo, "wallet info");
    const { getNFTsOnSale } = useNFTs();
    const { getTrendingNFTs } = useTrendingNFTs()
	const { isEVMWalletSignedIn, evmWalletData } = useAppContext();
    const { getCollection } = useCollection()

	const [totalEVMNfts, setTotalEVMNfts] = useState([]);
	const [allEVMNfts, setAllEVMNfts] = useState([]);
    const [evmTrendingNfts, setEVMTrendingNfts] = useState([]);

    const isWalletSignedIn = useSelector(state => state.nearReducer.isWalletSignedIn);

    const [loading, setLoading] = useState(false); 
    const [allNfts, setAllNfts] = useState([]); 
    const [recently, setRecently] = useState([]); 
    const [totalNfts, setTotalNfts] = useState([]); 
    const [trendingNfts, setTrendingNfts] = useState([]);
    const [trendingArtists, setTrendingArtists] = useState([]);
    const [topCollections, setTopCollections] = useState([])

    const evmFilter = [
        {label:"Under 10 MATIC", value:"Under 10 MATIC", noOfNfts:0, checked:false, min:0, max:9},
        {label:"10 - 49 MATIC", value:"10 - 49 MATIC", noOfNfts:0, checked:false, min:10, max:49},
        {label:"50 - 100 MATIC", value:"50 - 100 MATIC", noOfNfts:0, checked:false, min:50, max:99},
        {label:"100 - 200 MATIC", value:"100 - 200 MATIC", noOfNfts:0, checked:false, min:100, max:199},
        {label:"200 - 300 MATIC", value:"200 - 300 MATIC", noOfNfts:0, checked:false, min:200, max:300}
    ]

    const nearFilter = [
        {label:"Under 10 NEAR", value:"Under 10 NEAR", noOfNfts:0, checked:false, min:0, max:9},
        {label:"10 - 49 NEAR", value:"10 - 49 NEAR", noOfNfts:0, checked:false, min:10, max:49},
        {label:"50 - 100 NEAR", value:"50 - 100 NEAR", noOfNfts:0, checked:false, min:50, max:99},
        {label:"100 - 200 NEAR", value:"100 - 200 NEAR", noOfNfts:0, checked:false, min:100, max:199},
        {label:"200 - 300 NEAR", value:"200 - 300 NEAR", noOfNfts:0, checked:false, min:200, max:300}
    ]

    const [filterParams, setFilterParams] = useState({
        sort: staticValues.sortFilter[0].name,
        priceRange: isEVMWalletSignedIn ? evmFilter  : (isWalletSignedIn ? nearFilter : evmFilter ),
        limit: 8
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getTrendingArtists();
    }, [])

    useEffect(() => {
        if(walletInfo) {
            getTrendingNfts();
            fetchNfts();
        }
    }, [walletInfo]);

    useEffect(() => {
		if(evmWalletData) {
            getEVMTrendingNfts()
			fetchEVMNft()
		}
	}, [evmWalletData]);

    useEffect(() => {
        if(evmTrendingNfts && evmTrendingNfts.length > 0) {
            getTopCollections()
        }
    }, [evmTrendingNfts])

    useEffect(() => {
        if(totalNfts.length !== 0 || totalEVMNfts.length > 0) {
            applyFilters();
        }
    }, [filterParams]);

    const getTrendingArtists = () => {
        // _getAllArtists({ sortBy:"trending", sort:1 })
        // .then(({ data: { artists } }) => {
        //     setTrendingArtists([...artists, ...artists, ...artists, ...artists, ...artists]);
        // });
    }

    const fetchEVMNft = async () => {
		try {
			console.log("Dsa")
			setLoading(true);
			const nfts = await getNFTsOnSale();
			console.log(nfts, "nfts")
			setAllEVMNfts(nfts.slice(0, filterParams.limit));
			setTotalEVMNfts(nfts);
			setLoading(false);
		} catch (e) {
			console.log(e);
			alert("something went wrong!");
			setLoading(false);
		}
	};

    const getTrendingNfts = () => {

        const functions = new NearHelperFunctions(walletInfo);

        functions.getAllNfts()
        .then (res => {
            _getTrendingNft({ blockchain: 0 })
            .then(({ data: { nfts }}) => {
                const trendingArr = [];
                nfts.map(n => {
                    const r = res.find(r => r.token_id === n.token);
                    if (r) trendingArr.push(r);
                });
                setTrendingNfts([...trendingArr, ...trendingArr]);
            });
        })

    }

    const getEVMTrendingNfts = async () => {
        try {
            const trendingNfts = await getTrendingNFTs()
            setEVMTrendingNfts([...trendingNfts, ...trendingNfts])
        } catch (e) {
            console.error(e, "error in getEVMTrendingNfts")
        }
    }

    const getTopCollections = async () => {
        if(evmTrendingNfts) {
            let alreadyMapped = {}
            let collections = []

            for(let i = 0; i < evmTrendingNfts.length; i++) {
                const nft = evmTrendingNfts[i]
                
                if(alreadyMapped[nft.nftAddress]) continue
                alreadyMapped[nft.nftAddress] = true
                
                const c = await getCollection(nft.nftAddress)
                
                collections.push({
                    ...c,
                    address: nft.nftAddress
                })
            }
            
            if(collections.length < 5) {
                const moreLength = [...collections, ...collections, ...collections, ...collections]

                setTopCollections(moreLength)
            } else {
                setTopCollections(collections)
            }

        }
    }

    const fetchNfts = () => {

        const functions = new NearHelperFunctions(walletInfo);
        
        functions.getAllNfts()
        .then(res => {
            const result = res.sort(function(a, b) {
                return new Date(b.metadata.issued_at) - new Date(a.metadata.issued_at);
            });
            const totalNfts = result;
            const firstSetOfData = totalNfts.slice(0, filterParams.limit);
            const copiedPriceRanges = [...filterParams.priceRange];
            // to add nft count in filter
            totalNfts.map(item => {
                const price = Number(item.price);
                if (price >= 1 && price < 10) {
                    copiedPriceRanges[0].noOfNfts = copiedPriceRanges[0].noOfNfts + 1;
                } else if (price >= 10 && price <= 49) {
                    copiedPriceRanges[1].noOfNfts = copiedPriceRanges[1].noOfNfts + 1;
                } else if (price >= 50 && price < 100) {
                    copiedPriceRanges[2].noOfNfts = copiedPriceRanges[2].noOfNfts + 1;
                } else if (price >= 100 && price < 200) {
                    copiedPriceRanges[3].noOfNfts = copiedPriceRanges[3].noOfNfts + 1;
                } else if (price >= 200 && price <= 300) {
                    copiedPriceRanges[4].noOfNfts = copiedPriceRanges[4].noOfNfts + 1;
                }
            });
            setFilterParams(state => ({
                ...state,
                priceRange: copiedPriceRanges
            }));
            setRecently(firstSetOfData);
            setAllNfts(firstSetOfData);
            setTotalNfts(totalNfts);
            setLoading(false);
        })
        .catch(err => {
            alert("something went wrong!");
            setLoading(false);
        });

    }

    const handleFilterChange = (value, type) => {

        if (type === "sort") {
            setFilterParams(state => ({
                ...state,
                sort: value.name
            }));
        } else { 
            const copiedArr = [...filterParams.priceRange];
            copiedArr.map((item, i) => {
                if(i === value) {
                    item.checked = !item.checked;
                }
            });
            setFilterParams(state => ({
                ...state,
                priceRange: copiedArr
            }));
        }

    }

    const applyFilters = (isMobile) => {
        let firstSetOfData, copiedFilterArr = [...totalNfts];
        let firstSetOfEVMData, copiedFilterEVMArr = [...totalEVMNfts]
        console.log(copiedFilterEVMArr, totalEVMNfts, "Das")
        const selectedPriceRanges = filterParams.priceRange.filter(item => item.checked);

        if (filterParams.sort === "Newest first") {
            copiedFilterArr = copiedFilterArr.sort(function(a, b) {
                return new Date(b.metadata.issued_at) - new Date(a.metadata.issued_at);
            });
            copiedFilterEVMArr = [...totalEVMNfts]
        } else if (filterParams.sort === "Oldest first") {
            copiedFilterArr = copiedFilterArr.sort(function(a, b) {
                return new Date(a.metadata.issued_at) - new Date(b.metadata.issued_at);
            });
            copiedFilterEVMArr = totalEVMNfts.slice().reverse()
        } else if (filterParams.sort === "Price - High to low") {
            copiedFilterArr = copiedFilterArr.sort(function(a, b) {
                return b.price - a.price;
            });
            copiedFilterEVMArr = copiedFilterEVMArr.sort((a, b) => Number(ethers.utils.formatEther(b.salePrice)) - Number(ethers.utils.formatEther(a.salePrice)))
        } else {
            copiedFilterArr = copiedFilterArr.sort(function(a, b) {
                return a.price - b.price;
            });
            copiedFilterEVMArr = copiedFilterEVMArr.sort((a, b) => Number(ethers.utils.formatEther(a.salePrice)) - Number(ethers.utils.formatEther(b.salePrice)))
        }

        if(selectedPriceRanges.length !== 0) {
            const resultArr = [];
            const resultEVMArr = [];
            selectedPriceRanges.map(selRange => {
                copiedFilterArr.filter(item => {
                    const price = Number(item.price);
                    if (price >= selRange.min && price <= selRange.max) {
                        resultArr.push(item);
                    }
                });

                copiedFilterEVMArr.filter(item => {
                    const price = Number(ethers.utils.formatEther(item.salePrice))
                    if (price >= selRange.min && price <= selRange.max) {
                        resultEVMArr.push(item);
                    }
                })
            });
            copiedFilterArr = resultArr;
            copiedFilterEVMArr = resultEVMArr;
        }

        firstSetOfData = copiedFilterArr.slice(0, filterParams.limit);
        firstSetOfEVMData = copiedFilterEVMArr.slice(0, filterParams.limit)

        setAllNfts(firstSetOfData);
        setAllEVMNfts(firstSetOfEVMData)
    }

    const resetFilters = () => {
        setFilterParams(state => ({
            ...state,
            sort: staticValues.sortFilter[0].name,
            priceRange:  [
                {label:"Under 10 NEAR", value:"Under 10 NEAR", noOfNfts:0, checked:false, min:0, max:9},
                {label:"10 - 49 NEAR", value:"10 - 49 NEAR", noOfNfts:0, checked:false, min:10, max:49},
                {label:"50 - 100 NEAR", value:"50 - 100 NEAR", noOfNfts:0, checked:false, min:50, max:99},
                {label:"100 - 200 NEAR", value:"100 - 200 NEAR", noOfNfts:0, checked:false, min:100, max:200},
                {label:"200 - 300 NEAR", value:"200 - 300 NEAR", noOfNfts:0, checked:false, min:200, max:300}
            ]
        }));
    }

    const handleMoreData = () => {
        setFilterParams(state => ({
            ...state,
            limit: state.limit + 8
        }));
    }

    const renderNfts = () => {
        return allNfts.length > 0 && allNfts.map(nft => {
            return <Col key={uuid()} style={{marginBottom:25}} lg={3} md={4} sm={6} xs={12}>
                <NftCard
                    onClick={() => history.push(`/nftdetails/${nft?.token_id}`)}
                    image={nft?.metadata?.extra?.nftThumbnailUrl ?? nft?.metadata?.media}
                    title={nft?.metadata?.title}
                    nearFee={nft?.price}
                    artistName={nft?.artist?.name} 
                    artistImage={nft?.artist?.image}
                />
            </Col>
        });
    }

    const renderEVMNfts = () => {
        console.log("122a")
		return allEVMNfts.length > 0 && allEVMNfts.map((nft) => {
			const url = `/polygon/nftdetails/${nft.nft.nftAddress}/${nft.nft.tokenId.toString()}`;
			return (
				<Col
					key={uuid()}
					style={{ marginBottom: 25 }}
					lg={3}
					md={4}
					sm={6}
					xs={12}
				>
					<NftCard
						onClick={() => history.push(url)}
						image={nft.nft.tokenUri.startsWith('ipfs') ? `https://${nft.nft.tokenUri.substring(7)}.ipfs.nftstorage.link` : nft.nft.tokenUri}
						title={nft.nft.title}
						nearFee={ethers.utils.formatEther(nft.salePrice)}
						artistName={nft?.nft.artistName}
						artistImage={nft?.nft.tokenUri}
					/>
				</Col>
			);
		});
	};

    useEffect(() => console.log(topCollections, "Dadwedwqe"), [topCollections])

    if(loading) return <Spinner/>;

    return (
        <Container fluid className={classes.container}>
            <div className={classes.exploreGradientBlue}/>
            <div className="w-full flex justify-center items-center">
                <div className={classes.sectionTitle}>Discover extraordinary NFTs</div>
                {/* <div className={classes.sectionTitle2}>
                    Your guide to the world of an open financial system. Get started with the easiest and most secure platform to buy and trade cryptocurrency
                </div> */}
            </div>
            <SuggestionNfts
                topCollections={topCollections}
                recentlyEVMAdded={totalEVMNfts}
                nearWallet={walletInfo}
                recentlyAdded={recently}
                trendingNfts={trendingNfts}
                trendingArtists={trendingArtists}
                evmTrendingNfts={evmTrendingNfts}
            />
            <div style={{marginTop:80}}>
                <Tabs 
                    tabContents={tabContents} 
                />
                <div style={{...globalStyles.flexCenter, marginTop:30}}>
                    <div className={classes.desktopHeaderSection}>
                        <PriceDropdown 
                            title={"Price range"}
                            content={staticValues.sortFilter}
                            priceRanges={filterParams.priceRange}
                            onChange={(val) => handleFilterChange(val, "price")}
                        />
                    </div>
                    <div className={classes.desktopHeaderSection} style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:190}}>
                        <div style={{marginLeft:13}}/>
                        <Dropdown 
                            title={filterParams.sort}
                            content={staticValues.sortFilter}
                            onChange={(val) => handleFilterChange(val, "sort")}
                        />
                    </div>
                </div>
                <div className={classes.desktopHeaderSection} style={{background:"rgba(255,255,255,0.27)", height:1, marginTop:25}}/>
            </div>
            {filterParams.priceRange.some(item => item.checked) ?
             <div className={classes.desktopHeaderSection} style={{flexDirection:"row-reverse", ...globalStyles.flexRow, margin:"6px 0"}}>
                {filterParams.priceRange.map((item, index) => {
                    if(item.checked) {
                        return <div key={uuid()} style={{marginRight:7, border:"1px solid rgba(255, 255, 255, 0.6)", fontSize:14, padding: "8px 16px", borderRadius:8, fontWeight:"400", ...globalStyles.flexRow, backgroundColor:"#12192B", flexWrap:"wrap"}}>
                        <div>
                            {item.label}
                        </div>
                        <div style={{marginLeft:5, cursor:"pointer"}} onClick={() => handleFilterChange(index)}>
                            <FiX color="#fff" size={20}/>
                        </div>
                    </div>
                    }
                })}
            </div> :
            <div style={{margin:"56px 0"}}></div>}
            <div className={classes.nftContainer}>
                <Row>
                    {allNfts.length === 0 && allEVMNfts.length === 0 ?
                    <div style={{margin:"125px 0", fontSize:32, display:"flex", justifyContent:"center"}}>No results found!</div> :
                    (
						<>
							{renderNfts()}
							{renderEVMNfts()}
						</>
					)
                    }
                </Row>   
                <div style={{marginBottom:50}}/>
                <div className={classes.exploreGradientPink}/>
            </div>
            {allNfts.length >= 8 && 
            <div className={classes.viewMore} onClick={handleMoreData}>
                VIEW MORE
            </div>}
            <div onClick={() => setOpen(true)} className={classes.mobileFixedBtn}>
                FILTER
            </div>  
            <BottomSheet
                open={open}
                onDismiss={() => setOpen(false)}
                header={false}
                style={{height:300}}
                snapPoints={({ minHeight, maxHeight }) => [minHeight*1.8, maxHeight]}
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
                        {staticValues.sortFilter.map(item => {
                            return <div
                                key={uuid()} 
                                onClick={() => handleFilterChange(item, "sort")}
                                className={`${classes.pill} ${filterParams.sort === item.name ? classes.pillActive : ""}`}
                            >
                                {item.name}
                            </div>})
                        }
                    </div>
                </div>
                <div style={{marginTop:35}}>
                    <div style={{fontFamily:"Athelas-Bold", fontSize:18}}>Price range</div>
                    <div style={{background:"rgba(255,255,255,0.27)", height:1, marginBottom:10, marginTop:8}}/>
                    <div className={classes.pillsContainer}>
                        {filterParams.priceRange.map((item, index) => {
                            return <div
                                key={uuid()} 
                                onClick={() => handleFilterChange(index)}
                                className={`${classes.pill} ${item.checked ? classes.pillActive : ""}`}
                            >
                                {item.label}
                            </div>})
                        }
                    </div>
                </div>
                <div style={{...globalStyles.flexRowSpace, position: "absolute", width: "87%", bottom: "20px"}}>
                    <div className={classes.clearBtn} onClick={resetFilters}>
                        CLEAR FILTER
                    </div>  
                    <div className={classes.applyBtn} onClick={() => setOpen(false)}>
                        APPLY FILTER
                    </div> 
                </div>
            </BottomSheet>   
            <Footer/>           
        </Container>
    )

}
