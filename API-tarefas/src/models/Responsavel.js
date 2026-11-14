const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("Responsavel",
        {
            nome: {
                type: DataTypes.STRING(150),
                allowNull: false
            },
            telefone: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            senha: {
                type: DataTypes.STRING(60), 
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: true,
                unique: true
            },
            foto: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            especialidade: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            cargo: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            departamento: {
                type: DataTypes.STRING(100),
                allowNull: true
            }
        },
        {
            tableName: "responsaveis",
            timestamps: true
        }
    );
};