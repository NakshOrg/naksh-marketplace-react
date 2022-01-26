import axiosNoAuth from "./axiosNoAuth";


// GET

export const _getAllBlogs = () => axiosNoAuth.get('/client/landing/data');

