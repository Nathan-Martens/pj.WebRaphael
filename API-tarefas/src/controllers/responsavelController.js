const bcrypt = require('bcrypt');


const { Responsavel, Tarefa } = require("../models");
const { where } = require('sequelize');

const listarResponsaveis = async (req, res) => {
    try {
        const responsaveis = await Responsavel.findAll({
            include: [
                {
                    model: Tarefa,
                    as: 'tarefas'
                }
            ],
            attributes: { exclude: ['senha'] }
        });

        if (responsaveis.length > 0) {
            return res.status(200).json(responsaveis)
        }
        return res.status(404).json({
            "mensagem": "Nenhum responsável encontrado."
        })
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor",
            erro: error.mensagem
        });
    }
}

const criarResponsavel = async (req, res) => {
    try {
        const { nome, email, telefone, senha, foto, especialidade, cargo, departamento } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: "Os campos 'nome', 'email' e 'senha' são obrigatórios"
            });
        }

        const salto = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salto);

        const novoResponsavel = await Responsavel.create({
            nome,
            email,
            telefone: telefone || null,
            senha: senhaHash,
            foto: foto || null,
            especialidade: especialidade || null,
            cargo: cargo || null,
            departamento: departamento || null
        });

        novoResponsavel.senha = undefined;

        return res.status(201).json({
            mensagem: "Responsável criado com sucesso",
            responsavel: novoResponsavel
        });
    } catch (error) {
        console.error('Erro ao criar reponsavel', error);
        return res.status(500).json({ mensagem: "Erro interno do servidor", erro: error.mensagem });
    }
};


const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Os campos email e senha são obrigatórios"
            });
        }

        // Busca o responsável pelo email
        const responsavel = await Responsavel.findOne({
            where: { email }
        });

        // Verifica se o responsável existe
        if (!responsavel) {
            return res.status(404).json({
                mensagem: "E-mail não cadastrado!"
            });
        }

        // Compara a senha informada com a senha criptografada
        const senhaValida = await bcrypt.compare(
            senha,
            responsavel.senha
        );

        // Verifica se a senha está correta
        if (!senhaValida) {
            return res.status(401).json({
                mensagem: "Senha incorreta!"
            });
        }

        // Remove a senha da resposta
        const responsavelSemSenha = responsavel.toJSON();
        delete responsavelSemSenha.senha;

        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            responsavel: responsavelSemSenha
        });

    } catch (error) {
        console.error('Erro ao realizar login:', error);

        return res.status(500).json({
            mensagem: "Erro interno do servidor",
            erro: error.message
        });
    }
};


module.exports = {
    listarResponsaveis, criarResponsavel, login
}