const { Model, DataTypes } = require("sequelize");

class Usuario extends Model {
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
                email: {
                    field: "email",
                    type: DataTypes.STRING(60),
                    unique: true,
                    allowNull: false,
                    notEmpty: true,
                    validate: {
                        isEmail: true,
                    },
                },
                senha: {
                    field: "senha",
                    type: DataTypes.STRING(50),
                    notEmpty: true,
                    allowNull: false,
                },
            },
            {
                tableName: "usuario",
                charset: "utf8mb4",
                collate: "utf8mb4_bin",
                sequelize,
            }
        );
    }
}

module.exports = Usuario;
