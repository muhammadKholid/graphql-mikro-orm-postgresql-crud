# graphql-mikro-orm-postgresql-crud
CRUD typescript server

## features :
* Register and login system with redis session
* CRUD


## to start the project
* open Terminal in the root project : 
``` 
$ yarn install
$ yarn watch
$ yarn dev
```
* open http://localhost:8080/graphql
* enjoy!

## Positive Case
### Register :
```
mutation{
  register(options: {username :"varo", password:"varo"}){
    errors{
      field
      message
    }
    user{
      username
    }
  }
}
```

### Resgister Response 
```
{
  "data": {
    "register": {
      "errors": null,
      "user": {
        "username": "varo"
      }
    }
  }
}
```

### Login 
```
mutation {
  login (options : {username:"varo", password:"varo"}){
    errors{
      field
      message
    }
    user{
      username
    }
  }
}
```
### Login Response
```
{
  "data": {
    "login": {
      "errors": null,
      "user": {
        "username": "varo"
      }
    }
  }
}
```

### Create Post 
```
mutation {
  createPost(title:"hello there"){
    errors {
      message
    }
    post{
      _id
    title
    createdAt
    }
  }
}
```

### Create Response
```
{
  "data": {
    "createPost": {
      "errors": null,
      "post": {
        "_id": 4,
        "title": "hello there",
        "createdAt": "1638677338508"
      }
    }
  }
}
```

### Update Post
```
mutation {
  updatePost(id :3, title: "hello here"){
    errors{
      message
    }
    post{
      _id
    title
    updatedAt
    }
  }
}
```
 
### Update Response
```
{
  "data": {
    "updatePost": {
      "errors": null,
      "post": {
        "_id": 3,
        "title": "hello here",
        "updatedAt": "1638674100000"
      }
    }
  }
}
```

### Delete Post
```
mutation{
  deletePost(id:3){
    errors{
      message
    }
    isDeleted
  }
}
```

### Delete Response
```
{
  "data": {
    "deletePost": {
      "errors": null,
      "isDeleted": true
    }
  }
}
```

### Get Post
```
query {
  post(id:1){
    errors {
      message
    }
    post {
      _id
    title
    createdAt
    updatedAt
    }
  }
}
```

### Get Post Response
```
{
  "data": {
    "post": {
      "errors": null,
      "post": {
        "_id": 1,
        "title": "hello you",
        "createdAt": "1638673013000",
        "updatedAt": "1638673266000"
      }
    }
  }
}
```

### Get Posts
```
query {
  posts{
		errors{
      message
    }
    Post{
      _id
      title
    }
  }
}
```

### Get Posts Response
```
{
  "data": {
    "posts": {
      "errors": null,
      "Post": [
        {
          "_id": 1,
          "title": "hello you"
        },
        {
          "_id": 3,
          "title": "hello baby"
        }
      ]
    }
  }
}
```

## Negative Case
### Register (username length must be greater than 2)
```
mutation{
  register(options: {username :"va", password:"varo"}){
    errors{
      field
      message
    }
    user{
      username
    }
  }
}
```

### Response
```
{
  "data": {
    "register": {
      "errors": [
        {
          "field": "username",
          "message": "length must be greater than 2"
        }
      ],
      "user": null
    }
  }
}
```

### Register (username already used)
```
mutation{
  register(options: {username :"varo", password:"varo"}){
    errors{
      field
      message
    }
    user{
      username
    }
  }
}
```

### Response
```
{
  "data": {
    "register": {
      "errors": [
        {
          "field": "username",
          "message": "username has already been taken."
        }
      ],
      "user": null
    }
  }
}
```

### Register (password length must be greater than 2)
```
mutation{
  register(options: {username :"varo", password:"va"}){
    errors{
      field
      message
    }
    user{
      username
    }
  }
}
```

### Response
```
{
  "data": {
    "register": {
      "errors": [
        {
          "field": "password",
          "message": "length must be greater than 2"
        }
      ],
      "user": null
    }
  }
}
```

### Login (username has not been registered)
```
mutation {
  login (options : {username:"daddy", password:"daddy"}){
    errors{
      field
      message
    }
    user{
      username
    }
  }
}
```

### Login Response
```
{
  "data": {
    "login": {
      "errors": [
        {
          "field": "username",
          "message": "That username doesn't exist"
        }
      ],
      "user": null
    }
  }
}
```

### Login (wrong password)
```
mutation {
  login (options : {username:"alvaro", password:"daddy"}){
    errors{
      field
      message
    }
    user{
      username
    }
  }
}
```

### Login Response
```
{
  "data": {
    "login": {
      "errors": [
        {
          "field": "Password",
          "message": "wrong password"
        }
      ],
      "user": null
    }
  }
}
```

### Post (has not been logged in)
```
query {
  posts{
		errors{
      message
    }
    Post{
      _id
      title
    }
  }
}
```

### Posts Response
```
{
  "data": {
    "posts": {
      "errors": [
        {
          "message": "you have not been logged in"
        }
      ],
      "post": null
    }
  }
}
```

### Get Post (not log in)
```
query {
  post(id:1){
    errors {
      message
    }
    post {
      _id
    title
    createdAt
    updatedAt
    }
  }
}
```

### Get Post Response 
```
{
  "data": {
    "post": {
      "errors": [
        {
          "message": "You have not been logged in"
        }
      ],
      "post": null
    }
  }
}
```

### Delete Post (not logged in)
```
{
  "data": {
    "deletePost": {
      "errors": [
        {
          "message": "you have not logged in"
        }
      ],
      "isDeleted": false
    }
  }
}
```

### Create Post (not logged in)
```
{
  "data": {
    "createPost": {
      "errors": [
        {
          "message": "You have not been logged in"
        }
      ],
      "post": null
    }
  }
}
```

### Update Post (not logged in)
```
{
  "data": {
    "createPost": {
      "errors": [
        {
          "message": "You have not been logged in"
        }
      ],
      "post": null
    }
  }
}
```

