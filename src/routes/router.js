const express = require('express');
const router = express.Router();

/**Controller */
const registerController = require('../controllers/register.controller');
const loginController = require('../controllers/login.controller');

const consolaController = require('../controllers/consola.controller');



const dashboardController = require('../controllers/dashboard.controller');
const marcaController = require('../controllers/marca.controller');

const userController = require('../controllers/user.controller');
const consultController = require('../controllers/consult.controller');


/**Middlewares */
const verifyToken = require('../middlewares/verify-token.middleware');



/**Routes */
router.post('/register', registerController);
router.post('/login', loginController);


router.get('/dashboard', verifyToken, dashboardController);
router.get('/user', verifyToken, userController.getUserData );


router.get('/get-last-in-stock', consultController.getLastInStock );


router.get('/dashboard/marcas', verifyToken, marcaController.index);
router.get('/dashboard/marcas/:id', verifyToken, marcaController.show);
router.post('/dashboard/marcas', verifyToken, marcaController.create);
router.patch('/dashboard/marcas/:id', verifyToken, marcaController.update);
router.delete('/dashboard/marcas/:id', verifyToken, marcaController.delete);


router.get('/dashboard/consolas', verifyToken, consolaController.index);
router.get('/dashboard/consolas/:id', verifyToken, consolaController.show);
router.post('/dashboard/consolas', verifyToken, consolaController.create);
router.patch('/dashboard/consolas/:id', verifyToken, consolaController.update);
router.delete('/dashboard/consolas/:id', verifyToken, consolaController.delete);



module.exports = router;
