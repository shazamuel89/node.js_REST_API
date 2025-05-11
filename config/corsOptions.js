// Cross Origin Resource Sharing
// REMOVE THE LAST 2 IN WHITELIST AND CHANGE YOURSITE TO MY WEBSITE URL BEFORE DEPLOYING
const whitelist = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500'
];

const corsOptions = {
    origin: (origin, callback) => {
        // REMOVE THE  || !origin BEFORE DEPLOYING
        if (whitelist.indexOf(origin) != -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;