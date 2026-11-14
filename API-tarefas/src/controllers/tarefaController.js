
//const dbTarefa = require("../../mook/BaseTarefas.js");
const {Responsavel, Tarefa} = require("../models")

const listarTarefas = async(req, res)=>{
    try{
        const tarefas = await Tarefa.findAll({
            include:[
                {
                    model: Responsavel,
                    as: 'responsavel',
                    attributes: {exclude:['senha']}
                }
            ]
        });

        if(tarefas.length > 0){
            return res.status(200).json(tarefas)
        }
        return res.status(404).json({
            "mensagem":"Nenhuma tarefa encontrada."
        })
    }catch(error){
        return res.status(500).json({
            mensagem: "Erro interno do servidor",
            erro: error.message
        });
    }
}

const buscarPorId = async (req, res)=>{
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({
                mensagem: "O campo id, precisa ser numérico."
            })
        }
        const tarefa = await Tarefa.findByPk(id, {
            include:[{
                model: Responsavel,
                as:'responsavel'
            }]
        });
        if(tarefa){
            return res.status(200).json({
                idBusca: id,
                tarefa
            })
        }else{
            return res.status(404).json({
                idBusca: id,
                mensagem: "Registrado não encontrado."
            })
        }
    }catch(error){
        return res.status(500).json({
            mensagem: "Erro interno do servidor",
            erro: error.message
        })
    }
}

const cadastrarTarefa = async(req, res)=>{

    try{
        const { titulo, descricao, preco, tempo_estimado, data_limite, prioridade, responsavelId, status} = req.body;
        const id_responsavel = responsavelId;
        
        if(!titulo || !descricao || !responsavelId){
            const id_responsavel = responsavelId;
            return res.status(400).json({
                mensagem: "Os campos [titulo, descrição e responsável] são obrigatórios",                
            })
        }

        if(responsavelId){
            const id_responsavel = responsavelId;
            const responsavelExiste = await Responsavel.findByPk(id_responsavel);
            
            if(!responsavelExiste){
                return res.status(404).json({
                    mensagem: "Responsável não cadastrado."
                })
            }
        }
        const novaTarefa = await Tarefa.create(req.body);

        const tarefaCriada = await Tarefa.findByPk(novaTarefa.id, {
            include: [
                {
                    model: Responsavel,
                    as: 'responsavel',
                    attributes: {exclude:['senha']}
                }
            ]
        });
        return res.status(201).json({
            mensagem: "Tarefa criada com sucesso!!!",
            tarefa: tarefaCriada
        })
        

        /*titulo,
                descricao,
                preco: preco ? Number(preco) : 0,
                tempo_estimado: tempoEstimado ? Number(tempoEstimado) : 0,
                data_limite: dataLimite || null,
                prioridade,
                responsavelId: responsavelId ? Number(responsavelId) : null,
                status
                */
    }catch(error){
        return res.status(500).json({
            mensagem:"Erro ao cria a tarefa",
            erro: error.message
        })
    }
}
module.exports = {
    listarTarefas, cadastrarTarefa, buscarPorId
}