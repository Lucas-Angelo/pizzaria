const AppError = require("../errors/AppError");
const Pizza = require("../models/Pizza");
const { SortPaginate } = require("../helpers/SortPaginate");
const { buildWhere } = require("../helpers/pizza");
class PizzaService {
    async findById(id, attributes) {
        const pizza = await Pizza.findOne({
            where: {
                id: id,
            },
            attributes: attributes,
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        return pizza;
    }

    async findByDescricao(descricao) {
        const pizza = await Pizza.findOne({
            where: {
                descricao,
            },
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        return pizza;
    }

    async create(descricao, valor, tamanho, image_url) {
        if (await this.findByDescricao(descricao))
            throw new AppError("Descrição já utilizada!", 422, [
                `Pizza de 'descricao' ${descricao} já utilizada!`,
            ]);

        const pizza = await Pizza.create({
            descricao,
            valor,
            tamanho,
            image_url,
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        if (!pizza)
            throw new AppError("Não foi possível criar a pizza!", 500, [
                `Erro interno, pizza de 'descricao' '${descricao}' não criada!`,
            ]);

        return pizza;
    }

    async update(id, descricao, valor, tamanho, image_url) {
        const pizza = await Pizza.findOne({
            where: {
                id: id,
            },
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        if (!pizza)
            throw new AppError("Pizza não encontrada!", 404, [
                `Pizza de 'id' ${id} não encontrada!`,
            ]);

        await pizza
            .update({
                descricao,
                tamanho,
                valor,
                image_url,
            })
            .catch((error) => {
                throw new AppError("Erro interno do servidor!", 500, error);
            });

        if (!pizza)
            throw new AppError("Não foi possível atualizar a pizza!", 500, [
                `Erro interno, pizza de 'descricao' '${pizza.descricao}' não atualizada!`,
            ]);

        return pizza;
    }

    async deleteById(id) {
        const pizza = await this.findById(id);

        if (!pizza)
            throw new AppError("Pizza não encontrada!", 404, [
                `Pizza de 'id' ${id} não encontrada!`,
            ]);

        await Pizza.destroy({
            where: {
                id: id,
            },
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });
    }

    async getAll(query) {
        const attributes = Object.keys(Pizza.getAttributes());
        const { ordem, pagina, limite, atributo, ...whereFilter } = query;
        const pizzaQuantity = await Pizza.count();
        const { paginas, ...SortPaginateOptions } = SortPaginate(
            { ordem, pagina, limite, atributo },
            attributes,
            pizzaQuantity
        );
        const where = buildWhere(whereFilter);
        const pizzas = await Pizza.findAndCountAll({
            where,
            ...SortPaginateOptions,
        }).catch(function (error) {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        return {
            data: pizzas.rows,
            count: pizzas.rows.length,
            total: pizzas.count,
            pages: paginas,
            offset: SortPaginateOptions.offset,
        };
    }
}

module.exports = PizzaService;
