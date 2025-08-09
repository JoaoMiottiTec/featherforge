export async function authenticate(req, reply) {
    try {
        await req.jwtVerify();
    }
    catch {
        return reply.status(401).send({ status: 'error', message: 'Unauthorized' });
    }
}
