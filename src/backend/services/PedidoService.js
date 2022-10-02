const AppError = require("../errors/AppError");
const Pedido = require("../models/Pedido");
const { SortPaginate } = require("../helpers/SortPaginate");
const PizzaService = require("../services/PizzaService");
const Pizza = require("../models/Pizza");

class PedidoService {
    async findById(id, attributes) {
        const pedido = await Pedido.findOne({
            where: {
                id: id,
            },
            attributes: attributes,
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        return pedido;
    }

    async create(status, cliente_nome, pizza_id, tipo) {
        const pizzaService = new PizzaService();
        const pizza = await pizzaService.findById(pizza_id);
        if (!pizza)
            throw new AppError("Pizza não encontrada!", 422, [
                `Pizza de 'id' ${pizza_id} não encontrada!`,
            ]);

        const pedido = await Pedido.create({
            status,
            cliente_nome,
            pizza_id,
            tipo,
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        if (!pedido)
            throw new AppError("Não foi possível criar o pedido!", 500, [
                `Erro interno, pedido não criado!`,
            ]);

        return pedido;
    }

    async update(id, status, cliente_nome, tipo) {
        const pedido = await Pedido.findOne({
            where: {
                id: id,
            },
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        if (!pedido)
            throw new AppError("Pedido não encontrado!", 404, [
                `Pedido de 'id' ${id} não encontrado!`,
            ]);

        await pedido
            .update({
                status,
                cliente_nome,
                tipo,
            })
            .catch((error) => {
                throw new AppError("Erro interno do servidor!", 500, error);
            });

        if (!pedido)
            throw new AppError("Não foi possível atualizar o pedido!", 500, [
                `Erro interno, pedido de 'id' ${id} não atualizado!`,
            ]);

        return pedido;
    }

    async deleteById(id) {
        const pedido = await this.findById(id);

        if (!pedido)
            throw new AppError("Pedido não encontrado!", 404, [
                `Pedido de 'id' ${id} não encontrado!`,
            ]);

        await Pedido.destroy({
            where: {
                id: id,
            },
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });
    }

    async getAll(query) {
        const attributes = Object.keys(Pedido.getAttributes());

        const pedidoQuantity = await Pedido.count();
        const { paginas, ...SortPaginateOptions } = SortPaginate(
            query,
            attributes,
            pedidoQuantity
        );

        const pedidos = await Pedido.findAndCountAll({
            ...SortPaginateOptions,
            include: [{ model: Pizza, as: "pizza" }],
        }).catch(function (error) {
            console.log(error);
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        return {
            data: pedidos.rows,
            count: pedidos.rows.length,
            total: pedidos.count,
            pages: paginas,
            offset: SortPaginateOptions.offset,
        };
    }
}

module.exports = PedidoService;
