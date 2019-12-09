# Simple Todo List API

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)


Simple Todo list API written in Node.js. Based on this [example](https://codeburst.io/node-js-by-example-part-1-668376cd4f96).



## Setup

### Requirements

* [Docker](https://docker.com)
* [Node.js](https://nodejs.org/en/)

### Credentials

Set the following environment variables in your shell:

```
export DB_USER=postgres
export DB_PASSWORD=mysecretpassword 
export API_USER=admin 
export API_PASSWORD=password 
export CLIENT_SECRET=SECRET
```

### Database

```
docker run --name some-postgres -p 5432:5432 -v <absolute-path-to-directory>/data:/var/lib/postgresql/data -e POSTGRES_PASSWORD="${DB_PASSWORD}" -d postgres
```

### Node Server

```
node src/index.js
```



## How to use

### Login

```
curl --header "Content-Type: application/json" --request POST --data '{"username":"${API_USER}","password":"{API_PASSWORD}"}' http://localhost:3000/login
```

### Get Todos

```
curl -H 'Accept: application/json' -H "Authorization: Bearer <TOKEN>" http://localhost:3000/todos
```

### Create Todo

```
curl --header "Content-Type: application/json" --header "Authorization: Bearer <TOKEN>" --request POST --data '{"note":"Todo"}' http://localhost:3000/todos
```

### Delete Todo

```
curl --header "Content-Type: application/json" --header "Authorization: Bearer <TOKEN>" --request DELETE http://localhost:3000/todos/<id>
```

