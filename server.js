const express = require('express');
const mongoose = require('mongoose');
const {ApolloServer} = require('apollo-server')
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLFloat,
    GraphQLID
} = require('graphql');
const UserType = require('./models/userType');
const EmployeeType = require('./models/employeeType');
const User = require('./models/user');
const Employee = require('./models/employee');
const app = express();


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        //Get User By Username
        getUserByUsername: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
            },
            resolve: async (parent, args) => {
                return await User.findOne({ username: args.username });
            },
        },
        //Get Employee by EID
        getEmployeeByID: {
            type: EmployeeType,
            args: {
                _id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: async (parent, args) => {
                return await Employee.findOne({ _id: args._id });
            },

        },
        //Get All Employees
        getAllEmployees: {
            type: GraphQLList(EmployeeType),
            resolve: async () => {
                return await Employee.find();
            },
        },
        //Get All Users
        getAllUsers: {
            type: GraphQLList(UserType),
            resolve: async () => {
                return await User.find();
            },
        },
        //Login Query
        login: {
            type: GraphQLString,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                const user = await User.findOne({ username: args.username });
                //Three Login states
                if(!user){
                    return 'No User exists';
                } else if(user.password === args.password){
                    return 'Login Success';
                } else{
                    return 'Incorrect Password'
                }
            }
        }
    }),
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        //Sign Up User
        createUser: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                const newUser = new User(args);
                return await newUser.save();
            },
        },
        //Add New Employee
        createEmployee: {
            type: EmployeeType,
            args: {
                first_name: { type: new GraphQLNonNull(GraphQLString) },
                last_name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                gender: { type: new GraphQLNonNull(GraphQLString) },
                salary: { type: new GraphQLNonNull(GraphQLFloat) },
            },
            resolve: async (parent, args) => {
                const newEmployee = new Employee(args);
                return await newEmployee.save();
            },
        },
        //Update Employee
        updateEmployee:{
            type: EmployeeType,
            args: {
                _id: {type: new GraphQLNonNull(GraphQLID)},
                first_name: { type: new GraphQLNonNull(GraphQLString) },
                last_name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                gender: { type: new GraphQLNonNull(GraphQLString) },
                salary: { type: new GraphQLNonNull(GraphQLFloat) },
            },
            resolve: async (parent, args) => {
                return await Employee.findByIdAndUpdate(args._id, args, { new: true });
            }
        },
        //Delete Employee by eid
        deleteEmployee:{
            type: EmployeeType,
            args: {
                _id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: async (parent, args) => {
                return await Employee.findByIdAndDelete(args._id)
            }
        },
        //Delete user by ID
        deleteUser:{
            type: UserType,
            args: {
                _id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: async (parent, args) => {
                return await User.findByIdAndDelete(args._id)
            }
        }
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});

const server = new ApolloServer({
    schema,
    graphiql: true,
    introspection: true, 
    playground: true,  
})

/*
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));
*/

mongoose.connect('mongodb://localhost:27017/fullstack2assignment', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//app.listen(3000, () => console.log('Server is running'));

server.listen(3000).then(({ url }) => {
    console.log(`Server is running at ${url}`);
});
