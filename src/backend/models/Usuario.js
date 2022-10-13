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
                nome: {
                    field: "nome",
                    type: DataTypes.STRING(100),
                    allowNull: false,
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
                tipo: {
                    field: "tipo",
                    type: DataTypes.ENUM("ADMIN", "CLIENTE"),
                    allowNull: false,
                    notEmpty: true,
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
                tableName: "usuario",
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

module.exports = Usuario;
