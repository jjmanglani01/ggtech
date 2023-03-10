**Prerequisites**
  - Node
  - Docker

Versions:
  Docker version 20.10.23+dfsg1, build 7155243
  Node v16.14.0

- Move to service directory
- Run docker-compose -d
- It will run postgres and hasura on localhost:8080
- Run npm run build && npm start
- It will start server on localhost:4000/graphql, which you can query throught apollo studio


**Assumptions**
  - in findusers radius is in km
  - Using Haversine formula

**Improvements**
- Implemented auth middleware but bypassing it through systemcontext in resolvers
- Pass jwt secret token using env variable
- Configure hasura to use remote schema
- Don't commit .env file