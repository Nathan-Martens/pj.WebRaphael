const express = require("express");
const router = express.Router();
const tarefaController = require("../controllers/tarefaController.js")

router.get("/",tarefaController.listarTarefas);
router.post("/",tarefaController.cadastrarTarefa);
router.get("/:id",tarefaController.buscarPorId);

/*router.put("/:id",tarefaController.atualizarTarefa);
router.delete("/:id",tarefaController.deletarTarefa);
*/
module.exports = router;