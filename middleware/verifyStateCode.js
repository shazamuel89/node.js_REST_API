const statesArray = require('../model/statesData.json');

const verifyStateCode = (req, res, next) => {
    const stateCode = req?.params?.state?.toUpperCase();
    const stateCodes = statesArray.map(state => state.code);
    if (!stateCodes.includes(stateCode)) {
        return res.status(400).json({ message: "Invalid state abbreviation parameter" })
    }
    req.stateCode = stateCode;
    next();
}

module.exports = verifyStateCode;