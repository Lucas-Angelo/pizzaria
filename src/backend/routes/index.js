const { Router } = require("express");
const router = Router();

// Import controllers
//const UsuarioController = require("../controllers/UsuarioController.js");

// Init controllers
//const usuarioController = new UsuarioController();

// Usuario
/*
router.post('/signin', usuarioController.signin)
router.get('/me', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], usuarioController.me)
router.post('/usuario', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.create)
router.get('/usuario/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], usuarioController.get)
router.get('/usuario', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], usuarioController.getAll)
router.delete("/usuario/:id", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.delete);
router.put("/usuario/:id", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.update);
*/

module.exports = router;
