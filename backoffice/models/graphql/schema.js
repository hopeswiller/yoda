const graphql = require('graphql')
const Author = require('../db/author')
const Book = require('../db/book')

//extract object type function for graphql
const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql


// Every Book has a Author (1-1)  && Every Author has more books (1-M)
const BookType = new GraphQLObjectType({
    name: "Book",
    description: "Querying for books",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.author_id)
            }
        }

    })
})

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "Querying for Authors of books",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({
                    author_id: parent.id
                })
            }
        }

    })
})
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Queries available",
    fields: {
        book: {
            type: BookType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                // code to get data from DB
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                // code to get data from DB
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            async resolve(parent, args) {
                author =  await Author.findOne({
                                name: args.name,
                                age: args.age
                            })

                if (author == null) {
                    return new Author({
                        name: args.name,
                        age: args.age,
                        // books_authored:
                    }).save().then(()=>console.log('Author added successfully')).catch(err => console.log(err))
                }
                else console.log(`Cannot add author ${args.name}. Already exists..`)
            }
        },
        removeAuthor: {
            type: AuthorType,
            args: {
                name: {
                    type: GraphQLString
                },
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                if (args.id) return Author.findByIdAndRemove(args.id)
                return Author.findOneAndRemove({
                    name: args.name
                })
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                genre: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                author_id: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            async resolve(parent, args) {
                try {
                    book = await Book.findOne({
                        name: args.name,
                        genre: args.genre,
                        author_id: args.author_id
                    })

                    if (book != null) console.log(`Book already exists...`)
                    else {
                        return await new Book({
                            name: args.name,
                            genre: args.genre,
                            author_id: args.author_id
                        }).save()
                    }
                } catch (err) {
                    return console.log(err)
                }
            }
        },
        removeBook: {
            type: BookType,
            args: {
                id: {
                    type: GraphQLID
                },
                name: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                if (args.id) return Book.findByIdAndRemove(args.id)
                return Book.findOneAndRemove({
                    name: args.name
                })
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})