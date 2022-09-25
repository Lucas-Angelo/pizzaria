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
            Pedido.belongsTo(Pizza, {
                as: "pizza",
                foreignKey: "pizza_id",
            });

            if (process.env.APP_DEBUG) {
                console.log(
                    `Conexão com o banco de dados '${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}' estabelecida`
                );
            }
        } catch (error) {
            console.log(
                `Não foi possível estabelecer a conexão com o banco de dados '${process.env.DB_HOST}/${process.env.DB_NAME}'`
            );
            console.log(error);
        }
    },

    async close() {
        await sequelize.close();
    },
};
