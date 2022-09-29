const { Model, DataTypes } = require("sequelize");

class Pizza extends Model {
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
                descricao: {
                    field: "descricao",
                    type: DataTypes.STRING(45),
                    unique: true,
                    allowNull: false,
                    notEmpty: true,
                },
                tamanho: {
                    field: "tamanho",
                    type: DataTypes.ENUM("35CM", "45CM", "60CM"),
                    allowNull: false,
                    notEmpty: true,
                },
                image_url: {
                    field: "image_url",
                    type: DataTypes.STRING(200),
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
                tableName: "pizza",
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

module.exports = Pizza;
