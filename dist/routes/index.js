import { sessionRoutes } from 'modules/sections/routes.js';
export async function registerRoutes(app) {
    app.register(sessionRoutes, { prefix: '/sessions' });
}
