# Chat Sample Project

This project is a fully-fledged modern application based on `Actionhero`, `React`, and `Next.JS`. It uses Sequelzie as the ORM and connects to Redis and Postgres. This app is deployed automatically to Heroku from the master branch. This project is meant to serve as a template for your Actionhero projects.

This application features:

- Project layout
- Accounts (sign up, sign in, Sessions, CSRF validation)
- Real time chat
- Persistent message storage
- Parallel Testing (unit, action, component, and integration)
- Deployment and Hosting

## Overview

This project is a `Monorepo` - it includes the code for both our backend (actionhero) and frontend (next.js). They are meant to be deployed separately, but keeping them together in one git repository lets us simplify running in development and testing. We use `Yarn Workspaces` to simplify package installation and bootstrapping the project.

### API

- Actionhero
- Sequelzie and Typescript-Sequelzie via ah-sequelize-plugin
  - Migrations

### Front End

- Next.js
- React + Hooks
- Repository Pattern
- React Bootstrap

## Running Locally

## Testing

## Deployment

- Static Compilation
