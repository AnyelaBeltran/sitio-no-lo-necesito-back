const express = require('express');
const router = express.Router();

/**Controller */
const registerController = require('../controllers/register.controller');
const loginController = require('../controllers/login.controller');
const dashboardController = require('../controllers/dashboard.controller');
const marcaController = require('../controllers/marca.controller');


/**Middlewares */
const verifyToken = require('../middlewares/verify-token.middleware');



/**Routes */
router.post('/register', registerController);
router.post('/login', loginController);


router.get('/dashboard', verifyToken, dashboardController);

router.get('/dashboard/marcas', verifyToken, marcaController.index);
router.get('/dashboard/marcas/:id', verifyToken, marcaController.show);
router.post('/dashboard/marcas', verifyToken, marcaController.create);
router.patch('/dashboard/marcas/:id', verifyToken, marcaController.update);
router.delete('/dashboard/marcas/:id', verifyToken, marcaController.delete);





module.exports = router;
