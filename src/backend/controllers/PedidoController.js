const yup = require("yup");

const AppError = require("../errors/AppError");
const PedidoService = require("../services/PedidoService");

const pedidoStatusEnum = ["PENDENTE", "PRODUCAO", "CONCLUIDO"];
const tipoPedidoEnum = ["PRESENCIAL", "TELEFONE"];

class PedidoController {
    async create(request, response) {
        const scheme = yup.object().shape({
            observacao: yup
                .string("'observacao' must be string")
                .min(1)
                .max(255),
            tipo: yup
                .mixed()
                .oneOf(tipoPedidoEnum)
                .required("'tipo' is a required field"),
            pizza_id: yup
                .number()
                .positive()
                .integer()
                .required("'pizza_id' is a required field"),
            usuario_id: yup
                .number()
                .positive()
                .integer()
                .required("'usuario_id' is a required field"),
            telefone:yup
                .string("'telefone' must be string")
                .min(9)
                .max(9),
            logradouro: yup
                .string("'logradouro' must be string")
                .min(1)
                .max(255),
        });

        try {
            await scheme.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error.name, 422, error.errors);
        }

        const { observacao, pizza_id, tipo, usuario_id,telefone,logradouro} = request.body;
        const status = "PENDENTE";

        const pedidoService = new PedidoService();
        const pedido = await pedidoService.create(
            status,
            observacao,
            tipo,
            pizza_id,
            usuario_id,
            telefone,
            logradouro
        );

        return response.status(201).json(pedido);
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
            tipo: yup.mixed().oneOf(tipoPedidoEnum),
            observacao: yup
                .string("'observacao' must be string")
                .min(1)
                .max(255),
        });

        try {
            await scheme.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error.name, 422, error.errors);
        }

        const { status, observacao, tipo,telefone,logradouro } = request.body;
        const id = request.params.id;

        const pedidoService = new PedidoService();

        await pedidoService.update(id, status, observacao, tipo,telefone,logradouro);

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
        const { data, count, total, pages, offset, valor_total } =
            await pedidoService.getAll(request.query);

        return response.status(200).json({
            data,
            count,
            total,
            pages,
            offset,
            valor_total,
        });
    }
}

module.exports = PedidoController;
