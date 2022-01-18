const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controllers/sauces')

router.post('/',auth, multer, saucesCtrl.addNewSauce);
router.get('/', saucesCtrl.displaySauces);
router.get('/:id', saucesCtrl.displayOne);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', saucesCtrl.likedSauce);

module.exports = router;