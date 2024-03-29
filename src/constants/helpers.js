const openInNewTab = (url) => {
    var prefix = 'http://';
    var prefix2 = 'https://';
    let link = url;

    if(url.includes(prefix) || url.includes(prefix2)) {
        const newWindow = window.open(link, '_blank', 'noopener, noreferrer');
        if (newWindow) newWindow.opener = null;
        return;
    }
    if (url.substr(0, prefix.length) !== prefix) {
        link = prefix + url;
    }
    const newWindow = window.open(link, '_blank', 'noopener, noreferrer')
    if (newWindow) newWindow.opener = null
}

const readImage = (e) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        return Promise.all(files.map(file => {
            return (new Promise((resolve,reject) => {
                const reader = new FileReader();
                reader.addEventListener('load', (ev) => {
                    resolve(ev.target.result);
                });
                reader.addEventListener('error', reject);
                reader.readAsDataURL(file);
            }));
        }))
    }
}

const setIsNftPurchased = () => {
    localStorage.setItem("isNftPurchased", true);
}

const clearIsNftPurchased = () => {
    localStorage.removeItem("isNftPurchased")
}

const isNftPurchased = () => {
    if (localStorage.getItem("isNftPurchased")) {
        return true;
    }
    return false;
}

const isNftListed = () => {
    if (localStorage.getItem("isNftListed")) {
        return true;
    }
    return false;
}

const setIsNftListed = () => {
    localStorage.setItem("isNftListed", true);
}

const clearIsNftListed = () => {
    localStorage.removeItem("isNftListed")
}

export default {
    openInNewTab,
    readImage,
    isNftPurchased,
    clearIsNftListed,
    setIsNftListed,
    isNftListed,
    clearIsNftPurchased,
    setIsNftPurchased
}