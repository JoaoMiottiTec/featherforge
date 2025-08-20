export function sessionRoutes(app) {
    app.get('/', () => {
        return { message: 'Listar sessões (mock)' };
    });
    app.post('/', () => {
        return { message: 'Criar nova sessão (mock)' };
    });
}
