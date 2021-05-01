var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var graphql = require('graphql');
const IIdentity = require('./src/components/CaseFile/types/IIdentity').iidentity

const PORT = 8000;

var schema = new graphql.GraphQLSchema({
  IIdentity: IIdentity
})

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.get('/', function (req, res) {
  res.status(200)
  console.log('Status is: ', res.statusCode)
})

app.listen(PORT);
console.log("HTTP server listening on port %s", PORT);