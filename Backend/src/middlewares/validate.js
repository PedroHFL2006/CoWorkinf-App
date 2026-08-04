export const validate = (schema) => async (req, res, next) => {
    try {
        req.body = await schema.parseAsync(req.body);
        return next();
    } catch (error) {
        return res.status(400).json({
            message: "Erro de Validação",
            errors: error.errors.map(err => ({ campo: err.path.join('.'), mensagem: err.message }))
        });
    }
};