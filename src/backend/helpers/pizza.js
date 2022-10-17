const { Op, Sequelize } = require("sequelize");

const buildLikeFilter = (value, table, col) => {
    const filter = {
        [col]: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col(`${table}.${col}`)),
            "LIKE",
            "%" + value.toLowerCase() + "%"
        ),
    };
    return filter;
};

const buildValorFilter = (query, value) => {
    const filter = { valor: value };

    if (query === "valor_maior_que") filter.valor = { [Op.gte]: value };
    if (query === "valor_menor_que") filter.valor = { [Op.lte]: value };

    return filter;
};

const buildWhere = (query) => {
    const {
        created_at_start,
        created_at_end,
        updated_at_start,
        updated_at_end,
        ...others
    } = query;

    const where = Object.entries(others).reduce((query, [key, value]) => {
        const attribute = !isNaN(value)
            ? buildValorFilter(key, value)
            : buildLikeFilter(value, "Pizza", key);

        return { ...query, ...attribute };
    }, {});

    where.updated_at = {
        [Op.between]: [
            new Date(created_at_start ?? null),
            new Date(created_at_end ?? Date.now()),
        ],
    };

    where.created_at = {
        [Op.between]: [
            new Date(updated_at_start ?? null),
            new Date(updated_at_end ?? Date.now()),
        ],
    };

    return where;
};

module.exports = {
    buildWhere,
};
