// Cross Origin Resource Sharing
const whitelist = [
    'https://bead-shine-celestite.glitch.me'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) != -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;