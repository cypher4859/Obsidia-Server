var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var graphql = require('graphql');

const mongodbService = require('./src/services/impl/MongodbService').object
const root = require('./src/components/CaseFile/GQLTypes/schemaTypes').root
const types = require('./src/components/CaseFile/GQLTypes/schemaTypes').schemaTypes

const PORT = 8000;

var schema = graphql.buildSchema(types)
console.log(types)

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.get('/', function (req, res) {
  res.status(200)
  console.log('Status is: ', res.statusCode)
  mongodbService.pingCheckDiagnostic()
})

app.listen(PORT);
console.log("HTTP server listening on port %s", PORT);