const { Model, DataTypes } = require("sequelize");
const Pizza = require("./Pizza");

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
                valor: {
                    field: "valor",
                    type: DataTypes.DECIMAL(9).UNSIGNED,
                    allowNull: false,
                    notEmpty: true,
                },
                cliente_nome: {
                    field: "cliente_nome",
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    notEmpty: true,
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
