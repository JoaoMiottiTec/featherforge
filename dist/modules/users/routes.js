import { authenticate } from '../../middleware/authenticate.js';
import { userController } from './controller.js';
export async function authRoutes(app) {
    app.post('/signup', userController.signup);
    app.post('/login', userController.login);
    app.register(async (priv) => {
        priv.addHook('onRequest', authenticate);
        priv.get('/me', userController.me);
        priv.put('/me', userController.updateMe);
        priv.delete('/me', userController.deleteMe);
    });
}
