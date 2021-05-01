var { graphqlHTTP } = require('express-graphql');
var graphql = require('graphql');

exports.iidentity = new graphql.GraphQLObjectType({
  name: 'IIdentity',
  fields: {
    id: { type: graphql.GraphQLString },
    fullName: { type: graphql.GraphQLString },
    first: { type: graphql.GraphQLString },
    middle: { type: graphql.GraphQLString },
    last: { type: graphql.GraphQLString },
    suffix: { type: graphql.GraphQLString },
    additional: { type: graphql.GraphQLString }
  }
})