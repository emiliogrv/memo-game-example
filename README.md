# Memo test game

## Introduction

Welcome to **Memo test game**! This is a full-stack web application built with Laravel for the backend and Next.js for
the frontend. The application uses Docker Compose to simplify the development environment setup and utilizes a
PostgreSQL database.

## Prerequisites

Before you can run this application, please make sure you have the following software installed on your development
machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Composer](https://getcomposer.org/download/)
- [Node.js](https://nodejs.org/)

## Getting Started

To get started with **Memo test game**, follow these steps:

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/emiliogrv/memo-game-example.git
    ```

2. Navigate to the project directory:

    ```bash
    cd memo-game-example
    ```

3. Set up environment variables:

   Create a .env file in the backend directory for Laravel environment variables. You can use the .env.example file as a
   template.

    ```bash
    cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    ```

4. Install dependencies:

    ```bash
    cd backend && composer install && cd ..
    cd frontend && npm install && cd ..
    ```

5. Generate Laravel key:

    ```bash
    cd backend/ && php artisan key:generate && cd ..
    ```

6. Build and run the Docker containers:
   This command will start the Laravel backend, Next.js frontend, and PostgreSQL database containers.

    ```bash
    docker-compose up --build
    ```

7. Running the Application

   Once the Docker containers are running and the dependencies are installed, you can access the application:

    ```
    - Laravel Backend: http://localhost
    // NOTE: there is a GraphQL UI available to try in http://localhost/graphiql
   
    - Next.js Frontend: http://localhost:3000
    ```

8. Migrating database

    ```bash
    backend/vendor/bin/sail artisan migrate:fresh --seed
    // NOTE: you can use the sail alias if you configured it before. See point 5 below.
    ```

   or you can connect to the laravel container and run:

    ```bash
    php artisan migrate:fresh --seed
    ```

9. Testing

- Backend

    ```bash
    backend/vendor/bin/sail artisan test
    // NOTE: you can use the sail alias if you configured it before. See point 5 below.
    ```

  or you can connect to the laravel container and run:

    ```bash
    php artisan test
    ```

  Coverage can be done adding the flag `--coverage` at the end
    ```bash
    php artisan test --coverage
    ```

- Frontend

    ```bash
    cd frontend && npm run test && cd ..
    ```

  Coverage test can be done using
    ```bash
    cd frontend && npm run test:ci && cd ..
    ```

## Good to know

1. I used the latest stable Next.js version. I used the experimental
   feature [Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions) which [they'll start to
   recommend soon](https://nextjs.org/docs/pages/building-your-application/data-fetching/forms-and-mutations) (check the
   well to know section).
2. These `Server Actions` are good to keep the secrets keys away from the browser, but is still soon to get it to
   production and have some testing issues that was able to solved in my end. (more info
   in https://github.com/vercel/next.js/issues/47448
   and https://github.com/vercel/next.js/issues/54757)
3. Frontend tests where made [thinking as a user](https://testing-library.com/docs/guiding-principles) and with a
   positive approach in most scenarios.
4. Backend needs more testing.
5. You can use [Laravel Sail](https://laravel.com/docs/10.x/sail) to control the backend if you want to.
