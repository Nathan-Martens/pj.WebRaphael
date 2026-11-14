
const express = require("express");
const router = express.Router();
const {listarResponsaveis, buscarPorId, criarResponsavel,
    atualizarResponsavel, deletarResponsavel,
    login} = require("../controllers/responsavelController.js")

router.get("/",listarResponsaveis);
//router.get("/:id",buscarPorId);
router.post("/",criarResponsavel);
//router.put("/:id",atualizarResponsavel);
//router.delete("/:id",deletarResponsavel);
router.post("/autenticar", login)
module.exports = router;