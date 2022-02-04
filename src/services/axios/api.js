import axiosNoAuth from "./axiosNoAuth";


// GET

export const _getAllBlogs = () => fetch('https://api.naksh.org/client/landing/data');

export const _getAllArtists = (params) => axiosNoAuth.get('/artist/all', {params});

export const _getOneArtist = (id) => axiosNoAuth.get(`/artist/get?id=${id}`);

export const _getPresignedUrl = (data) => axiosNoAuth.post('/file/upload', data);

export const _getAllArtforms = () => axiosNoAuth.get('/artform/all');


// POST

export const _postArtist = (data) => axiosNoAuth.post('/artist/add', data);

// PUT

export const _uploadFileAws = (url, file, type) => (
    axiosNoAuth.put(url, file, {headers: {
        'Content-Type': type
    }})
) 

// PATCH

export const _updateArtist = (id, data) => axiosNoAuth.patch(`/artist/update?id=${id}`, data);