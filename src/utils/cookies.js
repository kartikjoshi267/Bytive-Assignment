module.exports = {
    setCookie: (res, name, value) => {
        res.cookie(name, value);
    },
    getCookie: (req, name) => {
        if (!req.headers.cookie) {
            return null;
        }
    
        const nameEQ = name + "=";
        const ca = req.headers.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    eraseCookie: (res, name) => {
        res.clearCookie(name);
    }
}

