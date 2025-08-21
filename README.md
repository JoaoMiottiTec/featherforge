# FeatherForge

[![CI](https://github.com/JoaoMiottiTec/featherforge/actions/workflows/ci.yml/badge.svg)](https://github.com/JoaoMiottiTec/featherforge/actions/workflows/ci.yml) ![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=JoaoMiottiTec_featherforge&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=JoaoMiottiTec_featherforge) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=JoaoMiottiTec_featherforge&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=JoaoMiottiTec_featherforge) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=JoaoMiottiTec_featherforge&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=JoaoMiottiTec_featherforge) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=JoaoMiottiTec_featherforge&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=JoaoMiottiTec_featherforge) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=JoaoMiottiTec_featherforge&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=JoaoMiottiTec_featherforge) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=JoaoMiottiTec_featherforge&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=JoaoMiottiTec_featherforge) ![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript) ![Prisma](https://img.shields.io/badge/Prisma-ORM-black?logo=prisma) ![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)

This project is a backend developed in **Node.js** with **TypeScript** and **Fastify**, designed to serve as a portfolio case and also as the foundation for a desktop application. The goal is have a tiny CRUD core and a heavyweight AWS pipe

The entire API will be documented and tested using Postman, including examples and environment variables for ease of use.

## Objectives

- Create a robust, modular, and scalable tiny API.
- Containerized the API using Docker to scale the application
- Building a pipe using github actions and send to AWS

## Roadmap

- [x] **API create** : Make a tiny API using Node.js and typescript
- [x] **Docker config** containerized a application
- [x] **CI/CD** with Github actions -> build, test, coverage, image push

## Architecture

The system follows a **modular monolith** design with clear domain boundaries, packaged into a single deployable service on AWS.

- **Modular domain structure** — each module has its own routes, services, validations, and data models.
- **Centralized route registration** — all modules are registered in one place for maintainability.
- **TypeScript (ESM)** — modern syntax, strict typing.
- **AWS-hosted** — containerized on **ECS Fargate**, with **RDS** for persistence and **CloudWatch** for logging/monitoring.

## Quality & Security

- **Testing** using vitest to unit and integration tests
- **CI/CD** to automated pipe with build, test and deployment
- **Lint Code** linting code with ESLint and TS
- **Container** with image security scanning and variables builds

## Prerequesites

- Node.js 20 or later
- Docker and Docker Compose
- PostgreSQL

## Main Technologies

- Node.js 22+
- TypeScript
- Fastify
- Prisma ORM with PostgreSQL
- Zod for validation
- Vitest for testing
- Nodemon and TSX for development
- Docker

## Installation

### Option A: Docker Compose (Recommended)

1. Clone the repository:
   ```
   Git clone https://github.com/JoaoMiottiTec/featherforge.git
   cd featherforge
   ```
2. Configure environment variables:
   ```
   #Criar o arquivo .env
       touch .env
   ```
3. Give a valor to the variable keys in .env:

   ```
   DATABASE_URL=
    PORT=
    HOST=

    JWT_SECRET=
    JWT_EXPIRES=

    JWT_REFRESH_SECRET=
    JWT_REFRESH_EXPIRES=
   ```

4. Start the service:
   ```
   docker-compose up -d
   ```

## Planned Modules API (Development Order)

1. **Auth & Users** – User registration, login, and profile management. [x]
2. **Sessions** – Training session logging (duration, effort, jump count). []
3. **Goals** – Weekly/monthly goal management. []
4. **Device** – Receiving data from Arduino device. []
5. **Analytics** – Training statistics and reports. []
6. **AI** – Training suggestions based on history. []
7. **Exports & Reports** – Exporting data to CSV/PDF. []

## Contributors

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Submit a pull request

## Developing:

- João Vitor Miotti
