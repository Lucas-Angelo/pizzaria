const AppError = require("../errors/AppError");
const Pizza = require("../models/Pizza");
const { SortPaginate } = require("../helpers/SortPaginate");

class PizzaService {
    async findById(id, attributes) {
        const pizza = await Pizza.findOne({
            where: {
                id: id,
            },
            attributes: attributes,
        }).catch((error) => {
            console.log(error);
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

    async create(descricao, tamanho, image_url) {
        if (await this.findByDescricao(descricao))
            throw new AppError("Descrição já utilizada!", 422, [
                `Pizza de 'descricao' ${descricao} já utilizada!`,
            ]);

        const pizza = await Pizza.create({
            descricao,
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

    async update(id, tamanho, image_url) {
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
                tamanho,
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

        const pizzaQuantity = await Pizza.count();
        const { paginas, ...SortPaginateOptions } = SortPaginate(
            query,
            attributes,
            pizzaQuantity
        );

        const pizzas = await Pizza.findAndCountAll({
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
