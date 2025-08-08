export async function sessionRoutes(app) {
    app.get('/', async () => {
        return { message: 'Listar sessões (mock)' };
    });
    app.post('/', async (request, reply) => {
        return { message: 'Criar nova sessão (mock)' };
    });
}
