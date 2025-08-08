# Vita API (Jump Rope Health)

This project is a backend developed in **Node.js** with **TypeScript** and **Fastify**, designed to serve as a portfolio case and also as the foundation for a desktop application. The goal is to track jump rope training sessions, with future integration to a physical device (a rope with motor and sensors using Arduino) to collect metrics such as jump count, duration, and calories burned.

The entire API will be documented and tested using Postman, including examples and environment variables for ease of use.

## Objectives

* Create a robust, modular, and scalable API demonstrating senior-level development practices.
* Enable registration and tracking of jump rope training sessions.
* Integrate with a physical device via desktop application.
* Provide training analysis and suggestions, initially mocked, and later powered by AI models.

## Architecture

* Modular domain structure (each module containing its routes, services, validations, and data models).
* Centralized route registration.
* TypeScript with ESM.

## Main Technologies

* Node.js 22+
* TypeScript
* Fastify
* Prisma ORM with PostgreSQL
* Zod for validation
* Vitest for testing
* Nodemon and TSX for development

## Initial Structure

```
src/
├── server.ts                  # Main entry point
├── routes/
│   └── index.ts               # Main router
└── modules/
    └── sessions/
        └── routes.ts          # Initial example module
```

## Planned Modules (Development Order)

1. **Auth & Users** – User registration, login, and profile management.
2. **Sessions** – Training session logging (duration, effort, jump count).
3. **Goals** – Weekly/monthly goal management.
4. **Device** – Receiving data from Arduino device.
5. **Analytics** – Training statistics and reports.
6. **AI** – Training suggestions based on history.
7. **Exports & Reports** – Exporting data to CSV/PDF.
8. **Admin** – Minimal monitoring and management endpoints.

## Documentation

All API documentation will be created and maintained in Postman, with examples and environment configurations for both development and production.

## Contributors

* João Miotti Dev
