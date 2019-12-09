/* eslint-disable no-console */
const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jwt-simple');
const TodoFactory = require('../models/todo');

const API_USER = process.env.API_USER;
const API_PASSWORD = process.env.API_PASSWORD;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@localhost/${DB_USER}`);
sequelize
  .authenticate()
  .then(() => {
    const Todo = TodoFactory(sequelize, Sequelize);
    const app = express();
    app.use(bodyParser.json());
    app.use((req, res, next) => {
      res.setHeader('cache-control', 'private, max-age=0, no-cache, no-store, must-revalidate');
      res.setHeader('expires', '0');
      res.setHeader('pragma', 'no-cache');
      next();
    });
    passport.use(new LocalStrategy((username, password, done) => {
      if (username === API_USER && password === API_PASSWORD) {
        done(null, jwt.encode({ username }, CLIENT_SECRET));
        return;
      }
      done(null, false);
    }));
    passport.use(new BearerStrategy((token, done) => {
      try {
        const { username } = jwt.decode(token, SECRET);
        if (username === API_USER) {
          done(null, username);
          return;
        }
        done(null, false);
      } catch (error) {
        done(null, false);
      }
    }));
    app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
      res.send({
        token: req.user,
      });
    });
    app.get('/', (req, res) => res.send('Healthy!'));
    app.get(
      '/todos',
      passport.authenticate('bearer', { session: false }),
      (_, res) => {
        Todo.findAll().then((todos) => {
          res.send(todos);
        });
      },
    );
    app.post(
      '/todos',
      passport.authenticate('bearer', { session: false }),
      (req, res) => {
        Todo.create({ note: req.body.note })
          .then((todo) => {
            res.send(todo);
          });
      },
    );
    app.delete(
      '/todos/:id',
      passport.authenticate('bearer', { session: false }),
      (req, res) => {
        Todo.findById(req.params.id)
          .then((todo) => todo.destroy())
          .then(() => res.send());
      },
    );
    app.listen(3000, () => console.log('Example app listening on port 3000!'));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
