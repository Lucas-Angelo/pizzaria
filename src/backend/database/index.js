require("dotenv").config();
const { Sequelize } = require("sequelize");

// Import models
const Usuario = require("../models/Usuario");
const Pizza = require("../models/Pizza");
const Pedido = require("../models/Pedido");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        dialectOptions: {
            decimalNumbers: true,
        },
        define: {
            timestamps: false,
        },
        logging: false,
    }
);

module.exports = {
    async connect() {
        try {
            await sequelize.authenticate();
            // Models init
            Usuario.init(sequelize);
            Pizza.init(sequelize);
            Pedido.init(sequelize);

            // Associations
            Pizza.hasOne(Pedido, {
                foreignKey: "pizza_id",
            });
            Pedido.belongsTo(Pizza, {
                foreignKey: "pizza_id",
                as: "pizza",
            });
            Pedido.belongsTo(Usuario, {
                foreignKey: "usuario_id",
                as: "usuario",
            });
            // eslint-disable-next-line no-empty
        } catch (error) {}
    },

    async close() {
        await sequelize.close();
    },
};
