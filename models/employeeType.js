const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');

const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    description: 'Employee Type',
    fields: () => ({
        _id: { type: GraphQLID },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        salary: { type: GraphQLFloat },
    }),
});

module.exports = EmployeeType;
