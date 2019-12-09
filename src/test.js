/* eslint-disable no-console */
const Sequelize = require('sequelize');
const TodoFactory = require('../models/todo');

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@localhost/${DB_USER}`);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    const Todo = TodoFactory(sequelize, Sequelize);
    Todo.findAll().then((todos) => console.log(todos));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
