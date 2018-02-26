# Express Games API

RESTful Express API for Games on top of MongoDB.

## Authentication

Create a User with the following attributes:

| Attribute | Type   | Description   |
|-----------|--------|---------------|
| name      | string | Full name     |
| email     | string | Email address |
| password  | string | Password      |

Use the following endpoints to deal with initial authentication and the user.

| HTTP Verb | Path        | Description |
|-----------|-------------|--------------|
| `POST`    | `/users`    | Create a user account |
| `POST`    | `/sessions` | Log in with email and password, and retrieve a JWT token |
| `GET`     | `/users/me` | Retrieve own user data |

To authorize further requests, use Bearer authentication with the provided JWT token:

```
Authorization: Bearer <token here>
```

_**Note**: See `db/seed.js` for an example._

## Games

**Note:** See `models/game.js` for the Game schema attributes.

| HTTP Verb | Path | Description |
|-----------|------|--------------|
| `GET` | `/games` | Retrieve all games |
| `POST` | `/games` | Create a game* |
| `GET` | `/games/:id` | Retrieve a single game by it's `id` |
| `PUT` | `/games/:id` | Update a game with a specific `id`* |
| `PATCH` | `/games/:id` | Patch (partial update) a game with a specific `id`* |
| `DELETE` | `/games/:id` | Destroy a single game by it's `id`* |
| | | _* Needs authentication_ |

_**Note**: Run `yarn run seed` to seed some initial games._
