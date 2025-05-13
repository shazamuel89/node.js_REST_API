const State = require('../model/State');
const statesArray = require('../model/statesData.json');

const getAllStates = async (req, res) => {
    let contigFlag = null;
    if ('contig' in req?.query) {
        if (req.query.contig === 'true') {
            contigFlag = true;
        } else if (req.query.contig === 'false') {
            contigFlag = false;
        }
    }
    const nonContigArray = ['AK', 'HI'];
    const statesArrayToReturn = [];
    try {
        for (const state of statesArray) {
            if ((contigFlag === true) && (nonContigArray.includes(state.code))) {
                continue;
            } else if ((contigFlag === false) && (!nonContigArray.includes(state.code))) {
                continue;
            }
            const stateToAppend = { ...state };
            const stateFunfacts = await State.findOne({ stateCode: stateToAppend.code });
            if (stateFunfacts?.funfacts?.length) {
                stateToAppend.funfacts = stateFunfacts.funfacts;
            }
            statesArrayToReturn.push(stateToAppend);
        }
        res.json(statesArrayToReturn);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: `Server error: ${err}` });
    }
}

const getState = async (req, res) => {
    const state = statesArray.find(stateElement => stateElement.code === req.stateCode);
    const stateWithFunfacts = { ...state };
    try {
        const stateFunfacts = await State.findOne({ stateCode: req.stateCode });
        if (stateFunfacts?.funfacts?.length) {
            stateWithFunfacts.funfacts = stateFunfacts.funfacts;
        }
        res.json(stateWithFunfacts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: `Server error: ${err}` });
    }
}

const getStateCapital = async (req, res) => {
    const state = statesArray.find(stateElement => stateElement.code === req.stateCode);
    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }
    const stateWithCapital = {
        state:      state.state,
        capital:    state.capital_city
    };
    res.json(stateWithCapital);
}

const getStateNickname = async (req, res) => {
    const state = statesArray.find(stateElement => stateElement.code === req.stateCode);
    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }
    const stateWithNickname = {
        state:      state.state,
        nickname:   state.nickname
    };
    res.json(stateWithNickname);
}

const getStatePopulation = async (req, res) => {
    const state = statesArray.find(stateElement => stateElement.code === req.stateCode);
    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }
    const stateWithPopulation = {
        state:      state.state,
        population: state.population.toLocaleString('en-US')
    };
    res.json(stateWithPopulation);
}

const getStateAdmission = async (req, res) => {
    const state = statesArray.find(stateElement => stateElement.code === req.stateCode);
    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }
    const stateWithAdmission = {
        state:      state.state,
        admitted:   state.admission_date
    };
    res.json(stateWithAdmission);
}

const getRandomFunfact = async (req, res) => {
    try {
        const state = statesArray.find(stateElement => stateElement.code === req.stateCode);
        const stateFunfacts = await State.findOne({ stateCode: req.stateCode });
        if (!stateFunfacts?.funfacts?.length) {
            return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
        }
        const randomFunfactIndex = Math.floor(Math.random() * stateFunfacts.funfacts.length);
        res.json({ funfact: stateFunfacts.funfacts[randomFunfactIndex]});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: `Server error: ${err}` });
    }
}

const createNewFunfacts = async (req, res) => {
    if (!req?.body?.funfacts) {
        return res.status(400).json({ message: "State fun facts value required" });
    }
    if (!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ message: "State fun facts value must be an array" });
    }
    try {
        const stateFunfacts = await State.findOne({ stateCode: req.stateCode });
        if (stateFunfacts) { // If fun facts exist for the state
            stateFunfacts.funfacts.push(...req.body.funfacts);
            const funfactsAppend = await stateFunfacts.save();
            return res.status(201).json(funfactsAppend);
        } else {
            const funfactsCreate = await State.create({
                stateCode:  req.stateCode,
                funfacts:   req.body.funfacts
            });
            return res.status(201).json(funfactsCreate);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Server error: ${err}` });
    }
}

const updateFunfact = async (req, res) => {
    if (!req?.body?.index) {
        return res.status(400).json({ message: "State fun fact index value required" });
    }
    if (!req?.body?.funfact || !typeof req.body.funfact == "string") {
        return res.status(400).json({ message: "State fun fact value required" });
    }
    const indexToUpdate = Number(req.body.index) - 1; // Since index from req is based on 1-starting-index array, change it to be based on a 0-starting-index array
    try {
        const state = statesArray.find(stateElement => stateElement.code === req.stateCode);
        const stateFunfacts = await State.findOne({ stateCode: req.stateCode });
        if (!stateFunfacts) {
            return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
        }
        if (!stateFunfacts?.funfacts?.[indexToUpdate]) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${state.state}` });
        }
        stateFunfacts.funfacts[indexToUpdate] = req.body.funfact;
        const funfactUpdate = await stateFunfacts.save();
        return res.status(200).json(funfactUpdate);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Server error: ${err}` });
    }
}

const deleteFunfact = async (req, res) => {
    if (!req?.body?.index) {
        return res.status(400).json({ message: "State fun fact index value required" });
    }
    const indexToDelete = Number(req.body.index) - 1; // Since index from req is based on 1-starting-index array, change it to be based on a 0-starting-index array
    try {
        const state = statesArray.find(stateElement => stateElement.code === req.stateCode);
        const stateFunfacts = await State.findOne({ stateCode: req.stateCode });
        if (!stateFunfacts) {
            return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
        }
        if (!stateFunfacts?.funfacts?.[indexToDelete]) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${state.state}` });
        }
        const filteredArray = stateFunfacts.funfacts.filter((_, index) => {
            return index != indexToDelete;
        });
        stateFunfacts.funfacts = filteredArray;
        const funfactDelete = await stateFunfacts.save();
        return res.status(200).json(funfactDelete);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: `Server error: ${err}` });
    }
}

module.exports = {
    getAllStates,
    getState,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission,
    getRandomFunfact,
    createNewFunfacts,
    updateFunfact,
    deleteFunfact
}