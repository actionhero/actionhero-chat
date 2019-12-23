# Chat Sample Project

[![CircleCI](https://circleci.com/gh/actionhero/actionhero-chat.svg?style=svg)](https://circleci.com/gh/actionhero/actionhero-chat)

This project is a fully-fledged modern application based on `Actionhero`, `React`, and `Next.JS`. It uses Sequelzie as the ORM and connects to Redis and Postgres. This app is deployed automatically to Heroku from the master branch. This project is meant to serve as an example for a more complex Actionhero projects.

This application features:

- Clear Project layout
- Accounts (sign up, sign in, Sessions, CSRF validation)
- Client-side caching via the repository pattern
- Real time chat
- Persistent message storage
- Parallel Testing (unit, action, component, and integration)
- Deployment and Hosting

## Overview

This project runs Actionhero, which then in turn hands of processing of the front end to next.js - the project includes the code for both our backend (actionhero) and frontend (next.js).

### API

- Actionhero
- Sequelzie and Typescript-Sequelzie via ah-sequelize-plugin
  - Migrations

### Front End

- Next.js
- React + Hooks
- Repository Pattern
- React Bootstrap

## Running Locally (OSX)

```bash
# 1. ensure that postgres and redis are running
brew install postgresql
brew install redis
brew services start postgresql
brew services start redis

#2. create the postgres database
createdb chat_development

```

## Testing

```bash
#1. create the postgres databases (we will run up to 5 tests in parallel)
createdb chat_test_1
createdb chat_test_2
createdb chat_test_3
createdb chat_test_4
createdb chat_test_5

#2. Run the test suite
# we will built the app, run linters, and test the web and api
yarn test
```

## Deployment

- Static Compilation
