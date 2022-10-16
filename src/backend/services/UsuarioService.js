const AppError = require("../errors/AppError");
const Usuario = require("../models/Usuario");
const { SortPaginate } = require("../helpers/SortPaginate");
const { Op, Sequelize } = require("sequelize");

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
        let usuario = await this.findByEmail(email, [
            "id",
            "email",
            "senha",
            "tipo",
        ]);

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

    async create(nome, email, senha, tipo) {
        if (await this.findByEmail(email))
            throw new AppError("Email já utilizado!", 422, [
                `Usuário de 'email' ${email} já utilizado!`,
            ]);

        const usuario = await Usuario.create({
            nome,
            email,
            senha,
            tipo,
        }).catch((error) => {
            throw new AppError("Erro interno do servidor!", 500, error);
        });

        if (!usuario)
            throw new AppError("Não foi possível criar o usuário!", 500, [
                `Erro interno, usuário de 'email' '${email}' não criado!`,
            ]);

        return usuario;
    }

    async update(id, nome, senha) {
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
                nome,
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
        const where = {};
        const attributes = Object.keys(Usuario.getAttributes());

        if (query.tipo) where.tipo = query.tipo;
        if (query.nome){
            where.nome = Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("`Usuario`.`nome`")),
                "LIKE",
                "%" + query.nome.toLowerCase() + "%"
            );
        }
        if (query.email){
            where.email = Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("`Usuario`.`email`")),
                "LIKE",
                "%" + query.email.toLowerCase() + "%"
            );
        }
        if (query.created_at_start || query.created_at_end) {
            const startDate = query.created_at_start
                ? new Date(query.created_at_start)
                : new Date(null); // * new Date(null) == 1970
            const endDate = query.created_at_end
                ? new Date(query.created_at_end)
                : new Date("2999/01/01");
            where.created_at = { [Op.between]: [startDate, endDate] };
        }
        if (query.updated_at_start || query.updated_at_end) {
            const startDate = query.updated_at_start
                ? new Date(query.updated_at_start)
                : new Date(null); // * new Date(null) == 1970
            const endDate = query.updated_at_end
                ? new Date(query.updated_at_end)
                : new Date("2999/01/01");
            where.updated_at = { [Op.between]: [startDate, endDate] };
        }

        const usuarioQuantity = await Usuario.count();
        const { paginas, ...SortPaginateOptions } = SortPaginate(
            query,
            attributes,
            usuarioQuantity
        );

        const usuarios = await Usuario.findAndCountAll({
            ...SortPaginateOptions,
            attributes: {exclude: ['senha']},
            where
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
