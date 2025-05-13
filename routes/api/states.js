const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStateCode = require('../../middleware/verifyStateCode');

router.route('/')
    .get(statesController.getAllStates); // This will also handle if ?contig=true or ?contig=false

router.route('/:state/funfact')
    .get(verifyStateCode, statesController.getRandomFunfact)
    .post(verifyStateCode, statesController.createNewFunfacts)
    .patch(verifyStateCode, statesController.updateFunfact)
    .delete(verifyStateCode, statesController.deleteFunfact);

router.route('/:state/capital')
    .get(verifyStateCode, statesController.getStateCapital);

router.route('/:state/nickname')
    .get(verifyStateCode, statesController.getStateNickname);

router.route('/:state/population')
    .get(verifyStateCode, statesController.getStatePopulation);

router.route('/:state/admission')
    .get(verifyStateCode, statesController.getStateAdmission);

router.route('/:state')
    .get(verifyStateCode, statesController.getState);

module.exports = router;