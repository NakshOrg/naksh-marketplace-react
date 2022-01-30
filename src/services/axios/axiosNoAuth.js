import axios from "axios";

import configs from "../../configs";

const axiosNoAuth = axios.create({
    baseURL: configs.baseURL
});

export default axiosNoAuth;