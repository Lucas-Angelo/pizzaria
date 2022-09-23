const yup = require("yup");

const AppError = require("../errors/AppError");
const UsuarioService = require("../services/UsuarioService");

class UsuarioController {
    async signin(request, response) {
        const scheme = yup.object().shape({
            email: yup.string().required("'email' is a required field!"),
            senha: yup.string().required("'senha' is a required field!"),
        });

        try {
            await scheme.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error.name, 422, error.errors);
        }

        const { email, senha } = request.body;

        const usuarioService = new UsuarioService();
        const usuario = await usuarioService.signin(email, senha);

        return response.status(200).send({
            usuario,
        });
    }

    async create(request, response) {
        const scheme = yup.object().shape({
            email: yup
                .string("'email' must be string")
                .email("'email' must be a email")
                .max(60)
                .required("'email' is a required field"),
            senha: yup
                .string("'senha' must be string")
                .min(8)
                .max(50)
                .required("'senha' is a required field"),
        });

        try {
            await scheme.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error.name, 422, error.errors);
        }

        const { email, senha } = request.body;

        const usuarioService = new UsuarioService();
        const usuario = await usuarioService.create(email, senha);

        return response.status(201).json({
            usuario,
        });
    }

    async delete(request, response) {
        const id = request.params.id;

        const usuarioService = new UsuarioService();
        await usuarioService.deleteById(id);

        return response.status(204).json({});
    }

    async update(request, response) {
        const scheme = yup.object().shape({
            senha: yup.string("'senha' must be string").min(8).max(50),
        });

        try {
            await scheme.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error.name, 422, error.errors);
        }

        const { senha } = request.body;
        const id = request.params.id;

        const usuarioService = new UsuarioService();

        await usuarioService.update(id, senha);

        return response.status(200).json({});
    }

    async get(request, response) {
        const id = request.params.id;

        const usuarioService = new UsuarioService();
        const usuario = await usuarioService.findById(id);

        if (!usuario)
            throw new AppError("Usuário não encontrado!", 404, [
                `Usuário de 'id' ${id} não encontrado!`,
            ]);

        return response.status(200).json(usuario);
    }

    async getAll(request, response) {
        const usuarioService = new UsuarioService();
        const { data, count, total, pages, offset } =
            await usuarioService.getAll(request.query);

        return response.status(200).json({
            data,
            count,
            total,
            pages,
            offset,
        });
    }
}

module.exports = UsuarioController;
