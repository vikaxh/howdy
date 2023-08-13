const express = require('express');
const {registerUser, authUser, allUsers } = require('../controller/userController')
const {protect} = require('../middleware/authMiddleware')

module.exports = router = express.Router()

router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login',authUser)