const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("Tarefa",
        {
            titulo: {
                type: DataTypes.STRING(150),
                allowNull: false
            },
            descricao: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            preco: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                defaultValue: 0.00
            },
            status: {
                type: DataTypes.ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO'),
                allowNull: false,
                defaultValue: 'PENDENTE'
            },
            data_limite: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            tempo_estimado: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            prioridade: {
                type: DataTypes.ENUM('BAIXA', 'MEDIA', 'ALTA'),
                allowNull: false,
                defaultValue: 'MEDIA'
            }
        },
        {
            tableName: "tarefas",
            timestamps: true
        }
    );
};