import React, { useEffect } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import NearHelperFunctions from "../../services/nearHelperFunctions";
import * as actionTypes from "../../redux/actions/actionTypes";
import SwipingCarousel from "../../components/uiComponents/SwipingCarousel";
import DesktopCarousel from "../../components/uiComponents/DesktopCarousel";
import classes from "./home.module.css";
import Footer from "../../components/uiComponents/Footer";
import { OutlineBtn } from "../../components/uiComponents/Buttons";
import { useSigner } from "wagmi";
import { useAppContext } from "../../context/wallet";
import { _getAllArtists, _postArtist } from "../../services/axios/api";

export default function Home() {
  const { isEVMWalletSignedIn, setEVMProvider, setEVMWalletData } = useAppContext();

  const walletInfo = useSelector((state) => state.nearReducer.walletInfo);
  const isWalletSignedIn = useSelector(
    (state) => state.nearReducer.isWalletSignedIn
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  useEffect(() => {
    if (walletInfo) {
      getAllNfts();
    }
  }, [walletInfo]);

  const { data: signer, isError, isLoading } = useSigner();

  useEffect(() => {

    if (walletInfo) {
      isArtistCreated()
      .then(isUserFound => {
        if (!isUserFound) {
            const data = {
              wallet: walletInfo.getAccountId(),
              createdBy: 1
            };
            createArtist(data);
        }
      })
    }

  }, [walletInfo]);

  useEffect(() => {
    (async () => {
      if (signer) {
        setEVMWalletData({
          address: await signer.getAddress(),
          signer: signer,
        });

        setEVMProvider(signer.provider);
      }
    })();
  }, [signer]);

  const isArtistCreated = async () => {

    // const { data } = await _getAllArtists({
    //   wallet: walletInfo.getAccountId(),
    //   sortBy: "createdAt",
    //   sort: -1
    // });
    
    // if (data.artists.length !== 0) {
    //   return true;
    // } else {
    //   return false;
    // }

  };

  const createArtist = (data) => {
    _postArtist(data)
      .then((res) => {
        console.log(res, 'create artist');
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  function getAllNfts() {
    const functions = new NearHelperFunctions(walletInfo);

    functions
      .getAllNfts()
      .then((res) => {
        // // console.log(res, "res");
        dispatch({ type: actionTypes.ALL_NFTS, payload: res });
      })
      .catch((err) => {
        // // console.log(err);
      });
  }

  return (
    <Container fluid style={{ height: "100vh" }}>
      <Row>
        <Col style={{ display: "flex" }} lg={5} md={5} sm={12}>
          <div className={classes.artSectionContentContainer}>
            <div className={classes.artSectionTitle}>
              <h1 className={classes.artSectionContent}>
                An NFT marketplace fuelled by art communities from all over
                India
              </h1>
              <div className="w-full h-full flex flex-col md:flex-row justify-start items-end md:space-x-5">
                <div
                  id={classes.btnContainer}
                  onClick={() => history.push("/browse")}
                  className="glow-on-hover"
                  style={{ zIndex: 100 }}
                >
                  <div
                    className={classes.glowBtnText}
                    style={{ marginLeft: 1 }}
                  >
                    EXPLORE MARKETPLACE
                  </div>
                </div>
                {isEVMWalletSignedIn && <div
                  id={classes.btnContainer}
                  onClick={() => history.push("/create/nft")}
                  className="create-nft mt-3 "
                  style={{ zIndex: 100, textAlign: "center" }}
                >
                    <div
                      style={{
                        paddingHorizontal: "15px",
                        textAlign: "center",
                        marginLeft: 1,
                      }}
                      className="px-1 md:p-2"
                    >
                      CREATE NFT
                    </div>
                </div>}
              </div>
            </div>
            <div className={classes.artworkGradientOverlay} />
          </div>
        </Col>
        <Col style={{ padding: 0 }} lg={7} md={7} sm={12}>
          <div className={classes.artSectionCarouselDesktop}>
            <DesktopCarousel />
          </div>
          <div
            style={{ marginTop: 60 }}
            className={classes.artSectionCarouselMobile}
          >
            <SwipingCarousel />
          </div>
        </Col>
      </Row>
      <Row style={{ padding: "0 6%" }}>
        <Col>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}
