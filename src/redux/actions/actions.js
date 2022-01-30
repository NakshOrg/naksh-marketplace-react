import * as nearAPI from "near-api-js";

import configs from "../../configs";
import * as actionTypes from './actionTypes';

const { connect, WalletConnection } = nearAPI;

export const establishWalletConnection = () => {
    return dispatch => {
      connect(configs.walletConfig)
      .then(res => {
  
        const wallet = new WalletConnection(res);
        console.log(wallet.isSignedIn());
        if(wallet.isSignedIn()) {
          dispatch({type: actionTypes.IS_WALLET_SIGNED_IN, payload: true});
        }

        dispatch({type: actionTypes.GET_WALLET_INFO, payload: wallet});
      })
      .catch(err => {
        console.log(err, "error from wallet establishment");
      });
    }
}
