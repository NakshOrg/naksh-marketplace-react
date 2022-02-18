import * as nearAPI from "near-api-js";

import { _getAllArtists } from "../../services/axios/api";
import configs from "../../configs";
import * as actionTypes from './actionTypes';

const { connect, WalletConnection } = nearAPI;

export const establishWalletConnection = () => {
    return dispatch => {
      connect(configs.walletConfig)
      .then(res => {
  
        const wallet = new WalletConnection(res);
  
        if(wallet.isSignedIn()) {
          dispatch({type: actionTypes.IS_WALLET_SIGNED_IN, payload: true});
          _getAllArtists({wallet: wallet.getAccountId(), sortBy: 'createdAt', sort: -1})
          .then(({ data: { artists } }) => {
            artists.length !== 0 && dispatch({type: actionTypes.USER_DATA, payload: artists[0]});
          })
        }

        dispatch({type: actionTypes.GET_WALLET_INFO, payload: wallet});
      })
      .catch(err => {
        console.log(err, "error from wallet establishment");
      });
    }
}

