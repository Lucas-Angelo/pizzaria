const { Router } = require("express");
const router = Router();

// Import controllers
const UsuarioController = require("../controllers/UsuarioController.js");

// Init controllers
const usuarioController = new UsuarioController();

// Usuario
router.post("/signin", usuarioController.signin);
router.post("/usuario", usuarioController.create);
router.get("/usuario/:id", usuarioController.get);
router.get("/usuario", usuarioController.getAll);
router.delete("/usuario/:id", usuarioController.delete);
router.put("/usuario/:id", usuarioController.update);

module.exports = router;
