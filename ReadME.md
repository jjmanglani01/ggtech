**Prerequisites**
  - Node
  - Docker

Versions:
  Docker version 20.10.23+dfsg1, build 7155243
  Node v16.14.0

- Move to service directory
- Run docker-compose up -d
- It will run postgres and hasura on localhost:8080
- In that Data tab connect database using url: postgres://postgres:postgrespassword@localhost:5432/postgres
- Now go to data tab add tables user and user-tracking with columns (We can write migration)
- Do npm i
- Run npm run build && npm start
- It will start server on localhost:4000/graphql, which you can query throught apollo studio
- Click on settings besides sandbox label in drawer turn on include cookies
- login-user mutation to login { user_id: 1, password: "admin" }
- After that you can use users query which is protected
- findusers query is not protected


**Assumptions**
  - in findusers radius is in km
  - Using Haversine formula

**Improvements**
- Implemented auth middleware but bypassing it through systemcontext in resolvers
- Pass jwt secret token using env variable
- Configure hasura to use remote schema
- Don't commit .env file
- Use HASURA_GRAPHQL_ADMIN_SECRET to secure hasura endpoint
- Add user_auth table with user_id and passwordHash
- We can write a resolver to not connect postgres and use hasura provided graphql using API or graphql to fetch data