const { Router } = require("express");
const router = Router();

// Import controllers
const UsuarioController = require("../controllers/UsuarioController.js");
const PizzaController = require("../controllers/PizzaController.js");
const PedidoController = require("../controllers/PedidoController.js");

// Init controllers
const usuarioController = new UsuarioController();
const pizzaController = new PizzaController();
const pedidoController = new PedidoController();

// Usuario
router.post("/signin", usuarioController.signin);
router.post("/usuario", usuarioController.create);
router.get("/usuario/:id", usuarioController.get);
router.get("/usuario", usuarioController.getAll);
router.delete("/usuario/:id", usuarioController.delete);
router.put("/usuario/:id", usuarioController.update);

// Pizza
router.post("/pizza", pizzaController.create);
router.get("/pizza/:id", pizzaController.get);
router.get("/pizza", pizzaController.getAll);
router.delete("/pizza/:id", pizzaController.delete);
router.put("/pizza/:id", pizzaController.update);

// Pedido
router.post("/pedido", pedidoController.create);
router.get("/pedido/:id", pedidoController.get);
router.get("/pedido", pedidoController.getAll);
router.delete("/pedido/:id", pedidoController.delete);
router.put("/pedido/:id", pedidoController.update);

module.exports = router;
