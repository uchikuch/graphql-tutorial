const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

// dummy data
const books = [
  {
    id: "1",
    name: "Leeds United",
    genre: "action",
    authorId: "3",
  },
  {
    id: "2",
    name: "Spurs",
    genre: "comedy",
    authorId: "1",
  },
  {
    id: "3",
    name: "Man United",
    genre: "thriller",
    authorId: "2",
  },
  {
    id: "4",
    name: "Chelsea",
    genre: "London",
    authorId: "2",
  },
  {
    id: "5",
    name: "City",
    genre: "Pep",
    authorId: "1",
  },
  {
    id: "6",
    name: "Wolves",
    genre: "orange",
    authorId: "3",
  },
];

const authors = [
  {
    name: "Patrick Bamford",
    age: 23,
    id: "1",
  },
  {
    name: "Harry Kane",
    age: 27,
    id: "2",
  },
  {
    name: "Marcus Rashford",
    age: 22,
    id: "3",
  },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        return _.find(authors, { id: args.id });
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
