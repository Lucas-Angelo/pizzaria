const { Model, DataTypes } = require("sequelize");
const Pizza = require("./Pizza");
const Usuario = require("./Usuario");

class Pedido extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    field: "id",
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                    allowNull: false,
                    required: true,
                    notEmpty: true,
                },
                status: {
                    field: "status",
                    type: DataTypes.ENUM("PENDENTE", "PRODUCAO", "CONCLUIDO"),
                    allowNull: false,
                    notEmpty: true,
                },
                tipo: {
                    field: "tipo",
                    type: DataTypes.ENUM("PRESENCIAL", "TELEFONE"),
                    allowNull: false,
                    notEmpty: true,
                },
                observacao: {
                    field: "observacao",
                    type: DataTypes.STRING(255),
                    allowNull: true,
                    notEmpty: false,
                },
                pizza_id: {
                    field: "pizza_id",
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    required: true,
                    notEmpty: true,
                    references: {
                        model: Pizza,
                        key: "id",
                    },
                },
                usuario_id: {
                    field: "usuario_id",
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    required: true,
                    notEmpty: true,
                    references: {
                        model: Usuario,
                        key: "id",
                    },
                },
                telefone: {
                    field: "telefone",
                    type: DataTypes.STRING(9),
                    allowNull: true,
                    notEmpty: false,
                },
                logradouro: {
                    field: "logradouro",
                    type: DataTypes.STRING(255),
                    allowNull: true,
                    notEmpty: false,
                },
                created_at: {
                    type: DataTypes.DATE,
                    field: "created_at",
                },
                updated_at: {
                    type: DataTypes.DATE,
                    field: "updated_at",
                },
            },
            {
                tableName: "pedido",
                charset: "utf8mb4",
                collate: "utf8mb4_bin",
                createdAt: "created_at",
                updatedAt: "updated_at",
                timestamps: true,
                sequelize,
            }
        );
    }
}

module.exports = Pedido;
