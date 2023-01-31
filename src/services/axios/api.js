import axios from "axios";

import axiosNoAuth from "./axiosNoAuth";
import configs from "../../configs";

// GET

export const _getLandingPageData = () => fetch('https://api.naksh.org/client/landing/data');

export const _getAllArtists = (params) => axiosNoAuth.get('/artist/all', {params});

export const _getOneArtist = (id) => axiosNoAuth.get(`/artist/get?id=${id}`);

export const _getPresignedUrl = (data) => axiosNoAuth.post('/file/upload', data);

export const _getAllArtforms = () => axiosNoAuth.get('/artform/all');

export const _getTrendingNft = (params) => axiosNoAuth.get('/nft/trending', {params});

export const _getNftArtists = (params) => axiosNoAuth.get('/artist/nft', {params});

export const _getBlockedNfts = (params) => axiosNoAuth.get('/nft/block', {params});

export const _getCollections = (params) => axiosNoAuth.get('/collection/all', {params});

export const _getOneCollection = (id) => axiosNoAuth.get(`/collection/get?id=${id}`);


// POST

export const _postArtist = (data) => axiosNoAuth.post('/artist/add', data);

export const _postFeedback = (data) => axios.post(`${configs.clientBaseURL}/landing/feedback`, data);

export const _uploadNft = (data) => axiosNoAuth.post('/nft/upload', data);

export const _addCollection = (data) => axiosNoAuth.post('/collection/add', data);

// PUT

export const _uploadFileAws = (url, file, type) => (
    axiosNoAuth.put(url, file, {headers: {
        'Content-Type': type
    }})
);

// PATCH

export const _updateArtist = (id, data) => axiosNoAuth.patch(`/artist/update?id=${id}`, data);

export const _updateTrendingNftOrArtist = (body, params) => axiosNoAuth.patch(`/nft/trending`, body, {params});

export const _saveNft = (id, data) => axiosNoAuth.patch(`/artist/saveNft?id=${id}`, data);

export const _unSaveNft = (id, data) => axiosNoAuth.patch(`/artist/unsaveNft?id=${id}`, data);

export const _updateCollection = (id, data) => axiosNoAuth.patch(`/collection/update?id=${id}`, data);

export const _addNftToCollection = (id, data) => axiosNoAuth.patch(`/collection/nft?id=${id}`, data);

export const _addActivityToCollection = (id, data) => axiosNoAuth.patch(`/collection/activity?id=${id}`, data);
