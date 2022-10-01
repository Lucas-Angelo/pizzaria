const yup = require("yup");

const AppError = require("../errors/AppError");
const PedidoService = require("../services/PedidoService");

const pedidoStatusEnum = ["PENDENTE", "PRODUCAO", "CONCLUIDO"];

class PedidoController {
    async create(request, response) {
        const scheme = yup.object().shape({
            cliente_nome: yup
                .string("'cliente_nome' must be string")
                .min(1)
                .max(50)
                .required("'cliente_nome' is a required field"),
            pizza_id: yup
                .number()
                .positive()
                .integer()
                .required("'pizza_id' is a required field"),
        });

        try {
            await scheme.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error.name, 422, error.errors);
        }

        const { cliente_nome, pizza_id, tipo } = request.body;
        const status = "PENDENTE";

        const pedidoService = new PedidoService();
        const pedido = await pedidoService.create(
            status,
            cliente_nome,
            pizza_id,
            tipo
        );

        return response.status(201).json({
            pedido,
        });
    }

    async delete(request, response) {
        const id = request.params.id;

        const pedidoService = new PedidoService();
        await pedidoService.deleteById(id);

        return response.status(204).json({});
    }

    async update(request, response) {
        const scheme = yup.object().shape({
            status: yup.mixed().oneOf(pedidoStatusEnum),
            cliente_nome: yup
                .string("'cliente_nome' must be string")
                .min(1)
                .max(50),
        });

        try {
            await scheme.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error.name, 422, error.errors);
        }

        const { status, cliente_nome, tipo } = request.body;
        const id = request.params.id;

        const pedidoService = new PedidoService();

        await pedidoService.update(id, status, cliente_nome, tipo);

        return response.status(200).json({});
    }

    async get(request, response) {
        const id = request.params.id;

        const pedidoService = new PedidoService();
        const pedido = await pedidoService.findById(id);

        if (!pedido)
            throw new AppError("Pedido não encontrado!", 404, [
                `Pedido de 'id' ${id} não encontrado!`,
            ]);

        return response.status(200).json(pedido);
    }

    async getAll(request, response) {
        const pedidoService = new PedidoService();
        const { data, count, total, pages, offset } =
            await pedidoService.getAll(request.query);

        return response.status(200).json({
            data,
            count,
            total,
            pages,
            offset,
        });
    }
}

module.exports = PedidoController;
