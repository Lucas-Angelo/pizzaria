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
            },
            {
                tableName: "pedido",
                charset: "utf8mb4",
                collate: "utf8mb4_bin",
                sequelize,
            }
        );
    }
}

module.exports = Pedido;
