function SortPaginate(query, attributes, dataQuantity) {
    const limit =
        query.limite && Number.parseInt(query.limite) < 50
            ? Number.parseInt(query.limite)
            : 50;

    const page = query.pagina ? Number.parseInt(query.pagina) : 1;
    const pages = Math.ceil(dataQuantity / limit);

    const offset = limit * (page - 1);

    const attribute =
        query.atributo && attributes && attributes.includes(query.atributo)
            ? query.atributo
            : "id";

    const order = query.ordem === "DESC" ? "DESC" : "ASC";

    return {
        limit: limit,
        offset: offset,
        order: [[attribute, order]],
        paginas: pages,
    };
}

module.exports = {
    SortPaginate,
};
