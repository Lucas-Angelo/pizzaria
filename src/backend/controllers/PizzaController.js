const yup = require("yup");

const AppError = require("../errors/AppError");
const PizzaService = require("../services/PizzaService");

const pizzaTamanhoEnum = ["35CM", "45CM", "60CM"];

class PizzaController {
    async create(request, response) {
        const scheme = yup.object().shape({
            descricao: yup
                .string("'descricao' must be string")
                .min(1)
                .max(45)
                .required("'descricao' is a required field"),
            tamanho: yup
                .mixed()
                .oneOf(pizzaTamanhoEnum)
                .required("'tamanho' is a required field"),
            image_url: yup
                .string("'image_url' must be string")
                .url()
                .min(1)
                .max(200)
                .required("'image_url' is a required field"),
        });

        try {
            await scheme.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error.name, 422, error.errors);
        }

        const { descricao, tamanho, image_url } = request.body;

        const pizzaService = new PizzaService();
        const pizza = await pizzaService.create(descricao, tamanho, image_url);

        return response.status(201).json({
            pizza,
        });
    }

    async delete(request, response) {
        const id = request.params.id;

        const pizzaService = new PizzaService();
        await pizzaService.deleteById(id);

        return response.status(204).json({});
    }

    async update(request, response) {
        const scheme = yup.object().shape({
            tamanho: yup.mixed().oneOf(pizzaTamanhoEnum),
            image_url: yup
                .string("'image_url' must be string")
                .url()
                .min(1)
                .max(200),
        });

        try {
            await scheme.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error.name, 422, error.errors);
        }

        const { tamanho, image_url } = request.body;
        const id = request.params.id;

        const pizzaService = new PizzaService();

        await pizzaService.update(id, tamanho, image_url);

        return response.status(200).json({});
    }

    async get(request, response) {
        const id = request.params.id;

        const pizzaService = new PizzaService();
        const pizza = await pizzaService.findById(id);

        if (!pizza)
            throw new AppError("Pizza não encontrada!", 404, [
                `Pizza de 'id' ${id} não encontrada!`,
            ]);

        return response.status(200).json(pizza);
    }

    async getAll(request, response) {
        const pizzaService = new PizzaService();
        const { data, count, total, pages, offset } = await pizzaService.getAll(
            request.query
        );

        return response.status(200).json({
            data,
            count,
            total,
            pages,
            offset,
        });
    }
}

module.exports = PizzaController;
