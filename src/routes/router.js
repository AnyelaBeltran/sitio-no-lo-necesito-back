const express = require('express');
const router = express.Router();

/**Controller */
const registerController = require('../controllers/register.controller');
const loginController = require('../controllers/login.controller');

const consolaController = require('../controllers/consola.controller');



const dashboardController = require('../controllers/dashboard.controller');
const categoryGameController = require('../controllers/category-game.controller');

const marcaController = require('../controllers/marca.controller');

const userController = require('../controllers/user.controller');
const consultController = require('../controllers/consult.controller');
const videojuegosController = require('../controllers/videojuegos.controller');

/**Middlewares */
const verifyToken = require('../middlewares/verify-token.middleware');



/**Routes */
router.post('/register', registerController);
router.post('/login', loginController);


router.get('/dashboard', verifyToken, dashboardController);
router.get('/user', verifyToken, userController.getUserData );


router.get('/get-last-in-stock', consultController.getLastInStock );
router.get('/get-marcas', consultController.getMarcas );

router.get('/get-categorias', consultController.getCategorias );
router.get('/get-consolas', consultController.getConsolas );


router.get('/dashboard-category-games', verifyToken, categoryGameController.index);
router.get('/dashboard-category-games/:id', verifyToken, categoryGameController.show);
router.post('/dashboard-category-games', verifyToken, categoryGameController.create);
router.patch('/dashboard-category-games/:id', verifyToken, categoryGameController.update);
router.delete('/dashboard-category-games/:id', verifyToken, categoryGameController.delete);





router.get('/dashboard/marcas', verifyToken, marcaController.index);
router.get('/dashboard/marcas/:id', verifyToken, marcaController.show);
router.post('/dashboard/marcas', verifyToken, marcaController.create);
router.patch('/dashboard/marcas/:id', verifyToken, marcaController.update);
router.delete('/dashboard/marcas/:id', verifyToken, marcaController.delete);


router.get('/dashboard-consolas', consolaController.index);
router.get('/dashboard-consolas/:id', consolaController.show);
router.post('/dashboard-consolas', verifyToken, consolaController.create);
router.patch('/dashboard-consolas/:id', verifyToken, consolaController.update);
router.delete('/dashboard-consolas/:id', verifyToken, consolaController.delete);

router.get('/dashboard-juegos', videojuegosController.index);
router.get('/dashboard-juegos/:id', videojuegosController.show);
router.post('/dashboard-juegos', verifyToken, videojuegosController.create);
router.patch('/dashboard-juegos/:id', verifyToken, videojuegosController.update);
router.delete('/dashboard-juegos/:id', verifyToken, videojuegosController.delete);

module.exports = router;
