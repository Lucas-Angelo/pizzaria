const yup = require("yup");

const AppError = require("../errors/AppError");
const PedidoService = require("../services/PedidoService");

const pedidoStatusEnum = ["PENDENTE", "PRODUCAO", "CONCLUIDO"];

class PedidoController {
    async create(request, response) {
        const scheme = yup.object().shape({
            valor: yup
                .number()
                .positive()
                .required("'valor' is a required field"),
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

        const { valor, cliente_nome, pizza_id } = request.body;
        const status = "PENDENTE";

        const pedidoService = new PedidoService();
        const pedido = await pedidoService.create(
            status,
            valor,
            cliente_nome,
            pizza_id
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
            valor: yup.number().positive(),
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

        const { status, valor, cliente_nome } = request.body;
        const id = request.params.id;

        const pedidoService = new PedidoService();

        await pedidoService.update(id, status, valor, cliente_nome);

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
