const AppError = require("../errors/AppError");
const Usuario = require("../models/Usuario");
const { SortPaginate } = require("../helpers/SortPaginate");

class UsuarioService {
    async findById(id, attributes) {
        const usuario = await Usuario.findOne({
            where: {
                id: id,
            },
            attributes: attributes,
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        return usuario;
    }

    async findByEmail(email, attributes) {
        const usuario = await Usuario.findOne({
            where: {
                email: email,
            },
            attributes: attributes,
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        return usuario;
    }

    async signin(email, senha) {
        let usuario = await this.findByEmail(email, ["id", "email", "senha"]);

        if (!usuario)
            throw new AppError("Usuário não encontrado!", 404, [
                `Usuário de email ${email} não encontrado!`,
            ]);

        const passwordIsCorrect = senha == usuario.senha;
        if (!passwordIsCorrect) {
            throw new AppError("Senha incorreta!", 401, [
                `'senha' incorreta para o usuário com 'email' ${email}!`,
            ]);
        }

        return usuario;
    }

    async create(email, senha) {
        if (await this.findByEmail(email))
            throw new AppError("Email já utilizado!", 422, [
                `Usuário de 'email' ${email} já utilizado!`,
            ]);

        const usuario = await Usuario.create({
            email,
            senha,
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        if (!usuario)
            throw new AppError("Não foi possível criar o usuário!", 500, [
                `Erro interno, usuário de 'email' '${email}' não criado!`,
            ]);

        return usuario;
    }

    async update(id, senha) {
        const usuario = await Usuario.findOne({
            where: {
                id: id,
            },
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        if (!usuario)
            throw new AppError("Usuário não encontrado!", 404, [
                `Usuário de 'id' ${id} não encontrado!`,
            ]);

        await usuario
            .update({
                senha,
            })
            .catch((error) => {
                throw new AppError("Erro interno do servidor!", 500, error);
            });

        if (!usuario)
            throw new AppError("Não foi possível atualizar o usuário!", 500, [
                `Erro interno, usuário de 'email' '${usuario.email}' não atualizado!`,
            ]);

        return usuario;
    }

    async deleteById(id) {
        const usuario = await this.findById(id);

        if (!usuario)
            throw new AppError("Usuário não encontrado!", 404, [
                `Usuário de 'id' ${id} não encontrado!`,
            ]);

        await Usuario.destroy({
            where: {
                id: id,
            },
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });
    }

    async getAll(query) {
        const attributes = Object.keys(Usuario.getAttributes());

        const usuarioQuantity = await Usuario.count();
        const { paginas, ...SortPaginateOptions } = SortPaginate(
            query,
            attributes,
            usuarioQuantity
        );

        const usuarios = await Usuario.findAndCountAll({
            ...SortPaginateOptions,
        }).catch(function (error) {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        return {
            data: usuarios.rows,
            count: usuarios.rows.length,
            total: usuarios.count,
            pages: paginas,
            offset: SortPaginateOptions.offset,
        };
    }
}

module.exports = UsuarioService;
