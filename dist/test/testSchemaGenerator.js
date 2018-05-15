"use strict";
// TODO: reduce code repetition in this file.
// see https://github.com/apollostack/graphql-tools/issues/26
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var graphql_1 = require("graphql");
// import { printSchema } from 'graphql';
var GraphQLJSON = require('graphql-type-json');
var Logger_1 = require("../Logger");
var circularSchemaA_1 = require("./circularSchemaA");
var schemaGenerator_1 = require("../schemaGenerator");
require("mocha");
function expectWarning(fn, warnMatcher) {
    var originalWarn = console.warn;
    var warning = null;
    try {
        console.warn = function warn(message) {
            warning = message;
        };
        fn();
        if (undefined === warnMatcher) {
            chai_1.expect(warning).to.be.equal(null);
        }
        else {
            chai_1.expect(warning).to.contain(warnMatcher);
        }
    }
    finally {
        console.warn = originalWarn;
    }
}
var testSchema = "\n      type RootQuery {\n        usecontext: String\n        useTestConnector: String\n        useContextConnector: String\n        species(name: String): String\n        stuff: String\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
var testResolvers = {
    __schema: function () { return ({ stuff: 'stuff', species: 'ROOT' }); },
    RootQuery: {
        usecontext: function (r, a, ctx) { return ctx.usecontext; },
        useTestConnector: function (r, a, ctx) {
            return ctx.connectors.TestConnector.get();
        },
        useContextConnector: function (r, a, ctx) {
            return ctx.connectors.ContextConnector.get();
        },
        species: function (root, _a) {
            var name = _a.name;
            return root.species + name;
        },
    },
};
var TestConnector = /** @class */ (function () {
    function TestConnector() {
    }
    TestConnector.prototype.get = function () {
        return 'works';
    };
    return TestConnector;
}());
var ContextConnector = /** @class */ (function () {
    function ContextConnector(ctx) {
        this.str = ctx.str;
    }
    ContextConnector.prototype.get = function () {
        return this.str;
    };
    return ContextConnector;
}());
var testConnectors = {
    TestConnector: TestConnector,
    ContextConnector: ContextConnector,
};
describe('generating schema from shorthand', function () {
    it('throws an error if no schema is provided', function () {
        chai_1.expect(function () { return schemaGenerator_1.makeExecutableSchema(); }).to.throw('undefined');
    });
    it('throws an error if typeDefinitionNodes are not provided', function () {
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({ typeDefs: undefined, resolvers: {} });
        }).to.throw('Must provide typeDefs');
    });
    it('throws an error if no resolveFunctions are provided', function () {
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({ typeDefs: 'blah', resolvers: {} });
        }).to.throw(graphql_1.GraphQLError);
    });
    it('throws an error if typeDefinitionNodes is neither string nor array nor schema AST', function () {
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({ typeDefs: {}, resolvers: {} });
        }).to.throw('typeDefs must be a string, array or schema AST, got object');
    });
    it('throws an error if typeDefinitionNode array contains not only functions and strings', function () {
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({ typeDefs: [17], resolvers: {} });
        }).to.throw('typeDef array must contain only strings and functions, got number');
    });
    it('throws an error if resolverValidationOptions is not an object', function () {
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({
                typeDefs: 'blah',
                resolvers: {},
                resolverValidationOptions: 'string',
            });
        }).to.throw('Expected `resolverValidationOptions` to be an object');
    });
    it('can generate a schema', function () {
        var shorthand = "\n      \"\"\"\n      A bird species\n      \"\"\"\n      type BirdSpecies {\n        name: String!,\n        wingspan: Int\n      }\n      type RootQuery {\n        species(name: String!): [BirdSpecies]\n      }\n\n      schema {\n        query: RootQuery\n      }\n    ";
        if (process.env.GRAPHQL_VERSION === '^0.11') {
            shorthand = "\n        # A bird species\n        type BirdSpecies {\n          name: String!,\n          wingspan: Int\n        }\n        type RootQuery {\n          species(name: String!): [BirdSpecies]\n        }\n\n        schema {\n          query: RootQuery\n        }\n      ";
        }
        var resolve = {
            RootQuery: {
                species: function () {
                    return;
                },
            },
        };
        var introspectionQuery = "{\n      species: __type(name: \"BirdSpecies\"){\n        name,\n        description,\n        fields{\n          name\n          type{\n            name\n            kind\n            ofType{\n              name\n            }\n          }\n        }\n      }\n      query: __type(name: \"RootQuery\"){\n        name,\n        description,\n        fields{\n          name\n          type {\n            name\n            kind\n            ofType {\n              name\n            }\n          }\n          args {\n            name\n            type {\n              name\n              kind\n              ofType {\n                name\n              }\n            }\n          }\n        }\n      }\n    }";
        var solution = {
            data: {
                species: {
                    name: 'BirdSpecies',
                    description: 'A bird species',
                    fields: [
                        {
                            name: 'name',
                            type: {
                                kind: 'NON_NULL',
                                name: null,
                                ofType: {
                                    name: 'String',
                                },
                            },
                        },
                        {
                            name: 'wingspan',
                            type: {
                                kind: 'SCALAR',
                                name: 'Int',
                                ofType: null,
                            },
                        },
                    ],
                },
                query: {
                    name: 'RootQuery',
                    description: '',
                    fields: [
                        {
                            name: 'species',
                            type: {
                                kind: 'LIST',
                                name: null,
                                ofType: {
                                    name: 'BirdSpecies',
                                },
                            },
                            args: [
                                {
                                    name: 'name',
                                    type: {
                                        name: null,
                                        kind: 'NON_NULL',
                                        ofType: {
                                            name: 'String',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
        };
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolve,
        });
        var resultPromise = graphql_1.graphql(jsSchema, introspectionQuery);
        return resultPromise.then(function (result) {
            return chai_1.assert.deepEqual(result, solution);
        });
    });
    it('can generate a schema from an array of types', function () {
        var typeDefAry = [
            "\n      type Query {\n        foo: String\n      }\n      ",
            "\n      schema {\n        query: Query\n      }\n    ",
        ];
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: typeDefAry,
            resolvers: {},
        });
        chai_1.expect(jsSchema.getQueryType().name).to.equal('Query');
    });
    it('can generate a schema from a parsed type definition', function () {
        var typeDefSchema = graphql_1.parse("\n      type Query {\n        foo: String\n      }\n      schema {\n        query: Query\n      }\n    ");
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: typeDefSchema,
            resolvers: {},
        });
        chai_1.expect(jsSchema.getQueryType().name).to.equal('Query');
    });
    it('can generate a schema from an array of parsed and none parsed type definitions', function () {
        var typeDefSchema = [
            graphql_1.parse("\n        type Query {\n          foo: String\n        }"),
            "\n      schema {\n        query: Query\n      }\n    ",
        ];
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: typeDefSchema,
            resolvers: {},
        });
        chai_1.expect(jsSchema.getQueryType().name).to.equal('Query');
    });
    it('can generate a schema from an array of types with extensions', function () {
        var typeDefAry = [
            "\n      type Query {\n        foo: String\n      }\n      ",
            "\n      schema {\n        query: Query\n      }\n      ",
            "\n      extend type Query {\n        bar: String\n      }\n    ",
        ];
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: typeDefAry,
            resolvers: {},
        });
        chai_1.expect(jsSchema.getQueryType().name).to.equal('Query');
        chai_1.expect(jsSchema.getQueryType().getFields()).to.have.all.keys('foo', 'bar');
    });
    it('can concatenateTypeDefs created by a function inside a closure', function () {
        var typeA = { typeDefs: function () { return ['type TypeA { foo: String }']; } };
        var typeB = { typeDefs: function () { return ['type TypeB { bar: String }']; } };
        var typeC = { typeDefs: function () { return ['type TypeC { foo: String }']; } };
        var typeD = { typeDefs: function () { return ['type TypeD { bar: String }']; } };
        function combineTypeDefs() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return { typeDefs: function () { return args.map(function (o) { return o.typeDefs; }); } };
        }
        var combinedAandB = combineTypeDefs(typeA, typeB);
        var combinedCandD = combineTypeDefs(typeC, typeD);
        var result = schemaGenerator_1.concatenateTypeDefs([
            combinedAandB.typeDefs,
            combinedCandD.typeDefs,
        ]);
        chai_1.expect(result).to.contain('type TypeA');
        chai_1.expect(result).to.contain('type TypeB');
        chai_1.expect(result).to.contain('type TypeC');
        chai_1.expect(result).to.contain('type TypeD');
    });
    it('properly deduplicates the array of type DefinitionNodes', function () {
        var typeDefAry = [
            "\n      type Query {\n        foo: String\n      }\n      ",
            "\n      schema {\n        query: Query\n      }\n      ",
            "\n      schema {\n        query: Query\n      }\n    ",
        ];
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: typeDefAry,
            resolvers: {},
        });
        chai_1.expect(jsSchema.getQueryType().name).to.equal('Query');
    });
    it('works with imports, even circular ones', function () {
        var typeDefAry = [
            "\n      type Query {\n        foo: TypeA\n      }\n      ",
            "\n      schema {\n        query: Query\n      }\n    ",
            circularSchemaA_1.default,
        ];
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: typeDefAry,
            resolvers: {
                Query: { foo: function () { return null; } },
                TypeA: { b: function () { return null; } },
                TypeB: { a: function () { return null; } },
            },
        });
        chai_1.expect(jsSchema.getQueryType().name).to.equal('Query');
    });
    it('can generate a schema with resolve functions', function () {
        var shorthand = "\n      type BirdSpecies {\n        name: String!,\n        wingspan: Int\n      }\n      type RootQuery {\n        species(name: String!): [BirdSpecies]\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolveFunctions = {
            RootQuery: {
                species: function (root, _a) {
                    var name = _a.name;
                    return [
                        {
                            name: "Hello " + name + "!",
                            wingspan: 200,
                        },
                    ];
                },
            },
        };
        var testQuery = "{\n      species(name: \"BigBird\"){\n        name\n        wingspan\n      }\n    }";
        var solution = {
            data: {
                species: [
                    {
                        name: 'Hello BigBird!',
                        wingspan: 200,
                    },
                ],
            },
        };
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolveFunctions,
        });
        var resultPromise = graphql_1.graphql(jsSchema, testQuery);
        return resultPromise.then(function (result) {
            return chai_1.assert.deepEqual(result, solution);
        });
    });
    it('can generate a schema with extensions that can use resolvers', function () {
        var shorthand = "\n      type BirdSpecies {\n        name: String!,\n        wingspan: Int\n      }\n      type RootQuery {\n        species(name: String!): [BirdSpecies]\n      }\n      schema {\n        query: RootQuery\n      }\n      extend type BirdSpecies {\n        height: Float\n      }\n    ";
        var resolveFunctions = {
            RootQuery: {
                species: function (root, _a) {
                    var name = _a.name;
                    return [
                        {
                            name: "Hello " + name + "!",
                            wingspan: 200,
                            height: 30.2,
                        },
                    ];
                },
            },
            BirdSpecies: {
                name: function (bird) { return bird.name; },
                wingspan: function (bird) { return bird.wingspan; },
                height: function (bird) { return bird.height; },
            },
        };
        var testQuery = "{\n      species(name: \"BigBird\"){\n        name\n        wingspan\n        height\n      }\n    }";
        var solution = {
            data: {
                species: [
                    {
                        name: 'Hello BigBird!',
                        wingspan: 200,
                        height: 30.2,
                    },
                ],
            },
        };
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolveFunctions,
        });
        var resultPromise = graphql_1.graphql(jsSchema, testQuery);
        return resultPromise.then(function (result) {
            return chai_1.assert.deepEqual(result, solution);
        });
    });
    it('supports resolveType for unions', function () {
        var shorthand = "\n      union Searchable = Person | Location\n      type Person {\n        name: String\n        age: Int\n      }\n      type Location {\n        name: String\n        coordinates: String\n      }\n      type RootQuery {\n        search(name: String): [Searchable]\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolveFunctions = {
            RootQuery: {
                search: {
                    resolve: function (root, _a) {
                        var name = _a.name;
                        return [
                            {
                                name: "Tom " + name,
                                age: 100,
                            },
                            {
                                name: 'North Pole',
                                coordinates: '90, 0',
                            },
                        ];
                    },
                },
            },
            Searchable: {
                __resolveType: function (data, context, info) {
                    if (data.age) {
                        return info.schema.getType('Person');
                    }
                    if (data.coordinates) {
                        return info.schema.getType('Location');
                    }
                    console.error('no type!');
                    return null;
                },
            },
        };
        var testQuery = "{\n      search(name: \"a\"){\n        ... on Person {\n          name\n          age\n        }\n        ... on Location {\n          name\n          coordinates\n        }\n      }\n    }";
        var solution = {
            data: {
                search: [
                    {
                        name: 'Tom a',
                        age: 100,
                    },
                    {
                        name: 'North Pole',
                        coordinates: '90, 0',
                    },
                ],
            },
        };
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolveFunctions,
        });
        var resultPromise = graphql_1.graphql(jsSchema, testQuery);
        return resultPromise.then(function (result) {
            return chai_1.assert.deepEqual(result, solution);
        });
    });
    it('can generate a schema with an array of resolvers', function () {
        var shorthand = "\n      type BirdSpecies {\n        name: String!,\n        wingspan: Int\n      }\n      type RootQuery {\n        numberOfSpecies: Int\n        species(name: String!): [BirdSpecies]\n      }\n      schema {\n        query: RootQuery\n      }\n      extend type BirdSpecies {\n        height: Float\n      }\n    ";
        var resolveFunctions = {
            RootQuery: {
                species: function (root, _a) {
                    var name = _a.name;
                    return [
                        {
                            name: "Hello " + name + "!",
                            wingspan: 200,
                            height: 30.2,
                        },
                    ];
                },
            },
        };
        var otherResolveFunctions = {
            BirdSpecies: {
                name: function (bird) { return bird.name; },
                wingspan: function (bird) { return bird.wingspan; },
                height: function (bird) { return bird.height; },
            },
            RootQuery: {
                numberOfSpecies: function () {
                    return 1;
                },
            },
        };
        var testQuery = "{\n      numberOfSpecies\n      species(name: \"BigBird\"){\n        name\n        wingspan\n        height\n      }\n    }";
        var solution = {
            data: {
                numberOfSpecies: 1,
                species: [
                    {
                        name: 'Hello BigBird!',
                        wingspan: 200,
                        height: 30.2,
                    },
                ],
            },
        };
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: [resolveFunctions, otherResolveFunctions],
        });
        var resultPromise = graphql_1.graphql(jsSchema, testQuery);
        return resultPromise.then(function (result) {
            return chai_1.assert.deepEqual(result, solution);
        });
    });
    describe('scalar types', function () {
        it('supports passing a GraphQLScalarType in resolveFunctions', function () {
            // Here GraphQLJSON is used as an example of non-default GraphQLScalarType
            var shorthand = "\n        scalar JSON\n\n        type Foo {\n          aField: JSON\n        }\n\n        type Query {\n          foo: Foo\n        }\n      ";
            var resolveFunctions = {
                JSON: GraphQLJSON,
            };
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: shorthand,
                resolvers: resolveFunctions,
            });
            chai_1.expect(jsSchema.getQueryType().name).to.equal('Query');
            chai_1.expect(jsSchema.getType('JSON')).to.be.an.instanceof(graphql_1.GraphQLScalarType);
            chai_1.expect(jsSchema.getType('JSON'))
                .to.have.property('description')
                .that.is.a('string');
            chai_1.expect(jsSchema.getType('JSON')['description']).to.have.length.above(0);
        });
        it('should support custom scalar usage on client-side query execution', function () {
            var shorthand = "\n        scalar CustomScalar\n\n        type TestType {\n          testField: String\n        }\n\n        type RootQuery {\n          myQuery(t: CustomScalar): TestType\n        }\n\n        schema {\n          query: RootQuery\n        }\n      ";
            var resolveFunctions = {
                CustomScalar: new graphql_1.GraphQLScalarType({
                    name: 'CustomScalar',
                    serialize: function (value) {
                        return value;
                    },
                    parseValue: function (value) {
                        return value;
                    },
                    parseLiteral: function (ast) {
                        switch (ast.kind) {
                            case graphql_1.Kind.STRING:
                                return ast.value;
                            default:
                                return null;
                        }
                    },
                }),
            };
            var testQuery = "\n        query myQuery($t: CustomScalar) {\n          myQuery(t: $t) {\n            testField\n          }\n        }";
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: shorthand,
                resolvers: resolveFunctions,
            });
            var resultPromise = graphql_1.graphql(jsSchema, testQuery);
            return resultPromise.then(function (result) { return chai_1.expect(result.errors).to.not.exist; });
        });
        it('should work with an Odd custom scalar type', function () {
            var oddValue = function (value) {
                return value % 2 === 1 ? value : null;
            };
            var OddType = new graphql_1.GraphQLScalarType({
                name: 'Odd',
                description: 'Odd custom scalar type',
                parseValue: oddValue,
                serialize: oddValue,
                parseLiteral: function (ast) {
                    if (ast.kind === graphql_1.Kind.INT) {
                        var intValue = ast;
                        return oddValue(parseInt(intValue.value, 10));
                    }
                    return null;
                },
            });
            var typeDefs = "\n        scalar Odd\n\n        type Post {\n          id: Int!\n          title: String\n          something: Odd\n        }\n\n        type Query {\n          post: Post\n        }\n\n        schema {\n          query: Query\n        }\n      ";
            var testValue = 3;
            var resolvers = {
                Odd: OddType,
                Query: {
                    post: function () {
                        return {
                            id: 1,
                            title: 'My first post',
                            something: testValue,
                        };
                    },
                },
            };
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: typeDefs,
                resolvers: resolvers,
            });
            var testQuery = "\n        {\n          post {\n            something\n          }\n        }\n  ";
            var resultPromise = graphql_1.graphql(jsSchema, testQuery);
            return resultPromise.then(function (result) {
                chai_1.assert.equal(result.data['post'].something, testValue);
                chai_1.assert.equal(result.errors, undefined);
            });
        });
        it('should work with a Date custom scalar type', function () {
            var DateType = new graphql_1.GraphQLScalarType({
                name: 'Date',
                description: 'Date custom scalar type',
                parseValue: function (value) {
                    return new Date(value);
                },
                serialize: function (value) {
                    return value.getTime();
                },
                parseLiteral: function (ast) {
                    if (ast.kind === graphql_1.Kind.INT) {
                        var intValue = ast;
                        return parseInt(intValue.value, 10);
                    }
                    return null;
                },
            });
            var typeDefs = "\n        scalar Date\n\n        type Post {\n          id: Int!\n          title: String\n          something: Date\n        }\n\n        type Query {\n          post: Post\n        }\n\n        schema {\n          query: Query\n        }\n      ";
            var testDate = new Date(2016, 0, 1);
            var resolvers = {
                Date: DateType,
                Query: {
                    post: function () {
                        return {
                            id: 1,
                            title: 'My first post',
                            something: testDate,
                        };
                    },
                },
            };
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: typeDefs,
                resolvers: resolvers,
            });
            var testQuery = "\n        {\n          post {\n            something\n          }\n        }\n  ";
            var resultPromise = graphql_1.graphql(jsSchema, testQuery);
            return resultPromise.then(function (result) {
                chai_1.assert.equal(result.data['post'].something, testDate.getTime());
                chai_1.assert.equal(result.errors, undefined);
            });
        });
    });
    describe('enum support', function () {
        it('supports passing a GraphQLEnumType in resolveFunctions', function () {
            var shorthand = "\n        enum Color {\n          RED\n        }\n\n        enum NumericEnum {\n          TEST\n        }\n\n        schema {\n          query: Query\n        }\n\n        type Query {\n          color: Color\n          numericEnum: NumericEnum\n        }\n      ";
            var resolveFunctions = {
                Color: {
                    RED: '#EA3232',
                },
                NumericEnum: {
                    TEST: 1,
                },
            };
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: shorthand,
                resolvers: resolveFunctions,
            });
            chai_1.expect(jsSchema.getQueryType().name).to.equal('Query');
            chai_1.expect(jsSchema.getType('Color')).to.be.an.instanceof(graphql_1.GraphQLEnumType);
            chai_1.expect(jsSchema.getType('NumericEnum')).to.be.an.instanceof(graphql_1.GraphQLEnumType);
        });
        it('supports passing the value for a GraphQLEnumType in resolveFunctions', function () {
            var shorthand = "\n        enum Color {\n          RED\n        }\n\n        enum NumericEnum {\n          TEST\n        }\n\n        schema {\n          query: Query\n        }\n\n        type Query {\n          color: Color\n          numericEnum: NumericEnum\n        }\n      ";
            var testQuery = "{\n        color\n        numericEnum\n       }";
            var resolveFunctions = {
                Color: {
                    RED: '#EA3232',
                },
                NumericEnum: {
                    TEST: 1,
                },
                Query: {
                    color: function () {
                        return '#EA3232';
                    },
                    numericEnum: function () {
                        return 1;
                    },
                },
            };
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: shorthand,
                resolvers: resolveFunctions,
            });
            var resultPromise = graphql_1.graphql(jsSchema, testQuery);
            return resultPromise.then(function (result) {
                chai_1.assert.equal(result.data['color'], 'RED');
                chai_1.assert.equal(result.data['numericEnum'], 'TEST');
                chai_1.assert.equal(result.errors, undefined);
            });
        });
    });
    it('can set description and deprecation reason', function () {
        var shorthand = "\n      type BirdSpecies {\n        name: String!,\n        wingspan: Int\n      }\n      type RootQuery {\n        species(name: String!): [BirdSpecies]\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolveFunctions = {
            RootQuery: {
                species: {
                    description: 'A species',
                    deprecationReason: 'Just because',
                    resolve: function (root, _a) {
                        var name = _a.name;
                        return [
                            {
                                name: "Hello " + name + "!",
                                wingspan: 200,
                            },
                        ];
                    },
                },
            },
        };
        var testQuery = "{\n      __type(name: \"RootQuery\"){\n        name\n        fields(includeDeprecated: true){\n          name\n          description\n          deprecationReason\n        }\n      }\n    }";
        var solution = {
            data: {
                __type: {
                    name: 'RootQuery',
                    fields: [
                        {
                            name: 'species',
                            description: 'A species',
                            deprecationReason: 'Just because',
                        },
                    ],
                },
            },
        };
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolveFunctions,
        });
        var resultPromise = graphql_1.graphql(jsSchema, testQuery);
        return resultPromise.then(function (result) {
            return chai_1.assert.deepEqual(result, solution);
        });
    });
    it('shows a warning if a field has arguments but no resolve func', function () {
        var short = "\n    type Query{\n      bird(id: ID): String\n    }\n    schema {\n      query: Query\n    }";
        var rf = { Query: {} };
        expectWarning(function () {
            schemaGenerator_1.makeExecutableSchema({
                typeDefs: short,
                resolvers: rf,
                resolverValidationOptions: {
                    requireResolversForArgs: true,
                },
            });
        }, 'Resolve function missing for "Query.bird"');
    });
    // tslint:disable-next-line: max-line-length
    it('does not throw an error if `resolverValidationOptions.requireResolversForArgs` is false', function () {
        var short = "\n    type Query{\n      bird(id: ID): String\n    }\n    schema {\n      query: Query\n    }";
        var rf = { Query: {} };
        // tslint:disable-next-line: max-line-length
        chai_1.assert.doesNotThrow(schemaGenerator_1.makeExecutableSchema.bind(null, { typeDefs: short, resolvers: rf }), schemaGenerator_1.SchemaError);
    });
    it('throws an error if a resolver is not a function', function () {
        var short = "\n    type Query{\n      bird(id: ID): String\n    }\n    schema {\n      query: Query\n    }";
        var rf = { Query: { bird: 'NOT A FUNCTION' } };
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({
                typeDefs: short,
                resolvers: rf,
            });
        }).to.throw('Resolver Query.bird must be object or function');
    });
    it('shows a warning if a field is not scalar, but has no resolve func', function () {
        var short = "\n    type Bird{\n      id: ID\n    }\n    type Query{\n      bird: Bird\n    }\n    schema {\n      query: Query\n    }";
        var rf = {};
        var resolverValidationOptions = {
            requireResolversForNonScalar: true,
        };
        expectWarning(function () {
            schemaGenerator_1.makeExecutableSchema({
                typeDefs: short,
                resolvers: rf,
                resolverValidationOptions: resolverValidationOptions,
            });
        }, 'Resolve function missing for "Query.bird"');
    });
    // tslint:disable-next-line: max-line-length
    it('allows non-scalar field to use default resolve func if `resolverValidationOptions.requireResolversForNonScalar` = false', function () {
        var short = "\n    type Bird{\n      id: ID\n    }\n    type Query{\n      bird: Bird\n    }\n    schema {\n      query: Query\n    }";
        var rf = {};
        // tslint:disable-next-line: max-line-length
        chai_1.assert.doesNotThrow(schemaGenerator_1.makeExecutableSchema.bind(null, {
            typeDefs: short,
            resolvers: rf,
            resolverValidationOptions: { requireResolversForNonScalar: false },
        }), schemaGenerator_1.SchemaError);
    });
    it('throws if resolver defined for non-object/interface type', function () {
        var short = "\n      union Searchable = Person | Location\n      type Person {\n        name: String\n        age: Int\n      }\n      type Location {\n        name: String\n        coordinates: String\n      }\n      type RootQuery {\n        search(name: String): [Searchable]\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var rf = {
            Searchable: {
                name: function () { return 'Something'; },
            },
        };
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({ typeDefs: short, resolvers: rf });
        }).to.throw("Searchable was defined in resolvers, but it's not an object");
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({
                typeDefs: short,
                resolvers: rf,
                resolverValidationOptions: {
                    allowResolversNotInSchema: true,
                },
            });
        }).to.not.throw();
    });
    it('throws if resolver defined for non existent type', function () {
        var short = "\n      type Person {\n        name: String\n        age: Int\n      }\n      type RootQuery {\n        search(name: String): [Person]\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var rf = {
            Searchable: {
                name: function () { return 'Something'; },
            },
        };
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({ typeDefs: short, resolvers: rf });
        }).to.throw("\"Searchable\" defined in resolvers, but not in schema");
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({
                typeDefs: short,
                resolvers: rf,
                resolverValidationOptions: {
                    allowResolversNotInSchema: true,
                },
            });
        }).to.not.throw();
    });
    it('doesnt let you define resolver field not present in schema', function () {
        var short = "\n      type Person {\n        name: String\n        age: Int\n      }\n      type RootQuery {\n        search(name: String): [Person]\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var rf = {
            RootQuery: {
                name: function () { return 'Something'; },
            },
        };
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({ typeDefs: short, resolvers: rf });
        }).to.throw("RootQuery.name defined in resolvers, but not in schema");
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({
                typeDefs: short,
                resolvers: rf,
                resolverValidationOptions: {
                    allowResolversNotInSchema: true,
                },
            });
        }).to.not.throw();
    });
    it('throws if conflicting validation options are passed', function () {
        var typeDefs = "\n    type Bird {\n      id: ID\n    }\n    type Query {\n      bird: Bird\n    }\n    schema {\n      query: Query\n    }";
        var resolvers = {};
        function assertOptionsError(resolverValidationOptions) {
            // tslint:disable-next-line: max-line-length
            chai_1.assert.throws(function () {
                return schemaGenerator_1.makeExecutableSchema({
                    typeDefs: typeDefs,
                    resolvers: resolvers,
                    resolverValidationOptions: resolverValidationOptions,
                });
            }, TypeError);
        }
        assertOptionsError({
            requireResolversForAllFields: true,
            requireResolversForNonScalar: true,
            requireResolversForArgs: true,
        });
        assertOptionsError({
            requireResolversForAllFields: true,
            requireResolversForNonScalar: true,
        });
        assertOptionsError({
            requireResolversForAllFields: true,
            requireResolversForArgs: true,
        });
    });
    // tslint:disable-next-line: max-line-length
    it('throws for any missing field if `resolverValidationOptions.requireResolversForAllFields` = true', function () {
        var typeDefs = "\n    type Bird {\n      id: ID\n    }\n    type Query {\n      bird: Bird\n    }\n    schema {\n      query: Query\n    }";
        function assertFieldError(errorMatcher, resolvers) {
            expectWarning(function () {
                schemaGenerator_1.makeExecutableSchema({
                    typeDefs: typeDefs,
                    resolvers: resolvers,
                    resolverValidationOptions: {
                        requireResolversForAllFields: true,
                    },
                });
            }, errorMatcher);
        }
        assertFieldError('Bird.id', {});
        assertFieldError('Query.bird', {
            Bird: {
                id: function (bird) { return bird.id; },
            },
        });
        assertFieldError('Bird.id', {
            Query: {
                bird: function () { return ({ id: '123' }); },
            },
        });
    });
    // tslint:disable-next-line: max-line-length
    it('does not throw if all fields are satisfied when `resolverValidationOptions.requireResolversForAllFields` = true', function () {
        var typeDefs = "\n    type Bird {\n      id: ID\n    }\n    type Query {\n      bird: Bird\n    }\n    schema {\n      query: Query\n    }";
        var resolvers = {
            Bird: {
                id: function (bird) { return bird.id; },
            },
            Query: {
                bird: function () { return ({ id: '123' }); },
            },
        };
        // tslint:disable-next-line: max-line-length
        chai_1.assert.doesNotThrow(function () {
            return schemaGenerator_1.makeExecutableSchema({
                typeDefs: typeDefs,
                resolvers: resolvers,
                resolverValidationOptions: { requireResolversForAllFields: true },
            });
        });
    });
    it('throws an error if a resolve field cannot be used', function (done) {
        var shorthand = "\n      type BirdSpecies {\n        name: String!,\n        wingspan: Int\n      }\n      type RootQuery {\n        species(name: String!): [BirdSpecies]\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolveFunctions = {
            RootQuery: {
                speciez: function (root, _a) {
                    var name = _a.name;
                    return [
                        {
                            name: "Hello " + name + "!",
                            wingspan: 200,
                        },
                    ];
                },
            },
        };
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({
                typeDefs: shorthand,
                resolvers: resolveFunctions,
            });
        }).to.throw('RootQuery.speciez defined in resolvers, but not in schema');
        done();
    });
    it('throws an error if a resolve type is not in schema', function (done) {
        var shorthand = "\n      type BirdSpecies {\n        name: String!,\n        wingspan: Int\n      }\n      type RootQuery {\n        species(name: String!): [BirdSpecies]\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolveFunctions = {
            BootQuery: {
                species: function (root, _a) {
                    var name = _a.name;
                    return [
                        {
                            name: "Hello " + name + "!",
                            wingspan: 200,
                        },
                    ];
                },
            },
        };
        chai_1.expect(function () {
            return schemaGenerator_1.makeExecutableSchema({
                typeDefs: shorthand,
                resolvers: resolveFunctions,
            });
        }).to.throw('"BootQuery" defined in resolvers, but not in schema');
        done();
    });
});
describe('providing useful errors from resolve functions', function () {
    it('logs an error if a resolve function fails', function () {
        var shorthand = "\n      type RootQuery {\n        species(name: String): String\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolve = {
            RootQuery: {
                species: function () {
                    throw new Error('oops!');
                },
            },
        };
        // TODO: Should use a spy here instead of logger class
        // to make sure we don't duplicate tests from Logger.
        var logger = new Logger_1.Logger();
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolve,
            logger: logger,
        });
        var testQuery = '{ species }';
        var expected = 'Error in resolver RootQuery.species\noops!';
        return graphql_1.graphql(jsSchema, testQuery).then(function (res) {
            chai_1.assert.equal(logger.errors.length, 1);
            chai_1.assert.equal(logger.errors[0].message, expected);
        });
    });
    it('will throw errors on undefined if you tell it to', function () {
        var shorthand = "\n      type RootQuery {\n        species(name: String): String\n        stuff: String\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolve = {
            RootQuery: {
                species: function () { return undefined; },
                stuff: function () { return 'stuff'; },
            },
        };
        var logger = new Logger_1.Logger();
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolve,
            logger: logger,
            allowUndefinedInResolve: false,
        });
        var testQuery = '{ species, stuff }';
        var expectedErr = /Resolve function for "RootQuery.species" returned undefined/;
        var expectedResData = { species: null, stuff: 'stuff' };
        return graphql_1.graphql(jsSchema, testQuery).then(function (res) {
            chai_1.assert.equal(logger.errors.length, 1);
            chai_1.assert.match(logger.errors[0].message, expectedErr);
            chai_1.assert.deepEqual(res.data, expectedResData);
        });
    });
    it('decorateToCatchUndefined preserves default resolvers', function () {
        var shorthand = "\n      type Thread {\n        name: String\n      }\n      type RootQuery {\n        thread(name: String): Thread\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolve = {
            RootQuery: {
                thread: function (root, args) {
                    return args;
                },
            },
        };
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolve,
            allowUndefinedInResolve: false,
        });
        var testQuery = "{\n        thread(name: \"SomeThread\") {\n            name\n        }\n    }";
        var expectedResData = {
            thread: {
                name: 'SomeThread',
            },
        };
        return graphql_1.graphql(jsSchema, testQuery).then(function (res) {
            chai_1.assert.deepEqual(res.data, expectedResData);
        });
    });
    it('decorateToCatchUndefined throws even if default resolvers are preserved', function () {
        var shorthand = "\n      type Thread {\n        name: String\n      }\n      type RootQuery {\n        thread(name: String): Thread\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolve = {
            RootQuery: {
                thread: function (root, args) {
                    return { name: function () { return undefined; } };
                },
            },
        };
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolve,
            allowUndefinedInResolve: false,
        });
        var testQuery = "{\n        thread {\n            name\n        }\n    }";
        return graphql_1.graphql(jsSchema, testQuery).then(function (res) {
            chai_1.expect(res.errors[0].originalError.message).to.equal('Resolve function for "Thread.name" returned undefined');
        });
    });
    it('will use default resolver when returning function properties ', function () {
        var shorthand = "\n      type Thread {\n        name: String\n      }\n      type RootQuery {\n        thread(name: String): Thread\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolve = {
            RootQuery: {
                thread: function (root, args) {
                    return { name: function () { return args['name']; } };
                },
            },
        };
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolve,
            allowUndefinedInResolve: false,
        });
        var testQuery = "{\n        thread(name: \"SomeThread\") {\n            name\n        }\n    }";
        var expectedResData = {
            thread: {
                name: 'SomeThread',
            },
        };
        return graphql_1.graphql(jsSchema, testQuery).then(function (res) {
            chai_1.assert.deepEqual(res.data, expectedResData);
        });
    });
    it('will not throw errors on undefined by default', function (done) {
        var shorthand = "\n      type RootQuery {\n        species(name: String): String\n        stuff: String\n      }\n      schema {\n        query: RootQuery\n      }\n    ";
        var resolve = {
            RootQuery: {
                species: function () { return undefined; },
                stuff: function () { return 'stuff'; },
            },
        };
        var logger = new Logger_1.Logger();
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: shorthand,
            resolvers: resolve,
            logger: logger,
        });
        var testQuery = '{ species, stuff }';
        var expectedResData = { species: null, stuff: 'stuff' };
        graphql_1.graphql(jsSchema, testQuery).then(function (res) {
            chai_1.assert.equal(logger.errors.length, 0);
            chai_1.assert.deepEqual(res.data, expectedResData);
            done();
        });
    });
});
describe('Add error logging to schema', function () {
    it('throws an error if no logger is provided', function () {
        chai_1.assert.throw(function () { return schemaGenerator_1.addErrorLoggingToSchema({}); }, 'Must provide a logger');
    });
    it('throws an error if logger.log is not a function', function () {
        chai_1.assert.throw(function () { return schemaGenerator_1.addErrorLoggingToSchema({}, { log: '1' }); }, 'Logger.log must be a function');
    });
});
describe('Attaching connectors to schema', function () {
    describe('Schema level resolve function', function () {
        it('actually runs', function () {
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: testSchema,
                resolvers: testResolvers,
            });
            var rootResolver = function () { return ({ species: 'ROOT' }); };
            schemaGenerator_1.addSchemaLevelResolveFunction(jsSchema, rootResolver);
            var query = "{\n        species(name: \"strix\")\n      }";
            return graphql_1.graphql(jsSchema, query).then(function (res) {
                chai_1.expect(res.data['species']).to.equal('ROOTstrix');
            });
        });
        it('can wrap fields that do not have a resolver defined', function () {
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: testSchema,
                resolvers: testResolvers,
            });
            var rootResolver = function () { return ({ stuff: 'stuff' }); };
            schemaGenerator_1.addSchemaLevelResolveFunction(jsSchema, rootResolver);
            var query = "{\n        stuff\n      }";
            return graphql_1.graphql(jsSchema, query).then(function (res) {
                chai_1.expect(res.data['stuff']).to.equal('stuff');
            });
        });
        it('runs only once per query', function () {
            var simpleResolvers = {
                RootQuery: {
                    usecontext: function (r, a, ctx) {
                        return ctx.usecontext;
                    },
                    useTestConnector: function (r, a, ctx) {
                        return ctx.connectors.TestConnector.get();
                    },
                    useContextConnector: function (r, a, ctx) {
                        return ctx.connectors.ContextConnector.get();
                    },
                    species: function (root, _a) {
                        var name = _a.name;
                        return root.species + name;
                    },
                },
            };
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: testSchema,
                resolvers: simpleResolvers,
            });
            var count = 0;
            var rootResolver = function () {
                if (count === 0) {
                    count += 1;
                    return { stuff: 'stuff', species: 'some ' };
                }
                return { stuff: 'EEE', species: 'EEE' };
            };
            schemaGenerator_1.addSchemaLevelResolveFunction(jsSchema, rootResolver);
            var query = "{\n        species(name: \"strix\")\n        stuff\n      }";
            var expected = {
                species: 'some strix',
                stuff: 'stuff',
            };
            return graphql_1.graphql(jsSchema, query).then(function (res) {
                chai_1.expect(res.data).to.deep.equal(expected);
            });
        });
        it('runs twice for two queries', function () {
            var simpleResolvers = {
                RootQuery: {
                    usecontext: function (r, a, ctx) {
                        return ctx.usecontext;
                    },
                    useTestConnector: function (r, a, ctx) {
                        return ctx.connectors.TestConnector.get();
                    },
                    useContextConnector: function (r, a, ctx) {
                        return ctx.connectors.ContextConnector.get();
                    },
                    species: function (root, _a) {
                        var name = _a.name;
                        return root.species + name;
                    },
                },
            };
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: testSchema,
                resolvers: simpleResolvers,
            });
            var count = 0;
            var rootResolver = function () {
                if (count === 0) {
                    count += 1;
                    return { stuff: 'stuff', species: 'some ' };
                }
                if (count === 1) {
                    count += 1;
                    return { stuff: 'stuff2', species: 'species2 ' };
                }
                return { stuff: 'EEE', species: 'EEE' };
            };
            schemaGenerator_1.addSchemaLevelResolveFunction(jsSchema, rootResolver);
            var query = "{\n        species(name: \"strix\")\n        stuff\n      }";
            var expected = {
                species: 'some strix',
                stuff: 'stuff',
            };
            var expected2 = {
                species: 'species2 strix',
                stuff: 'stuff2',
            };
            return graphql_1.graphql(jsSchema, query).then(function (res) {
                chai_1.expect(res.data).to.deep.equal(expected);
                return graphql_1.graphql(jsSchema, query).then(function (res2) {
                    return chai_1.expect(res2.data).to.deep.equal(expected2);
                });
            });
        });
        it('can attach things to context', function () {
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: testSchema,
                resolvers: testResolvers,
            });
            var rootResolver = function (o, a, ctx) {
                ctx['usecontext'] = 'ABC';
            };
            schemaGenerator_1.addSchemaLevelResolveFunction(jsSchema, rootResolver);
            var query = "{\n        usecontext\n      }";
            var expected = {
                usecontext: 'ABC',
            };
            return graphql_1.graphql(jsSchema, query, {}, {}).then(function (res) {
                chai_1.expect(res.data).to.deep.equal(expected);
            });
        });
        it('can attach with existing static connectors', function () {
            var resolvers = {
                RootQuery: {
                    testString: function (root, args, ctx) {
                        return ctx.connectors.staticString;
                    },
                },
            };
            var typeDef = "\n          type RootQuery {\n            testString: String\n          }\n\n          schema {\n            query: RootQuery\n          }\n      ";
            var jsSchema = schemaGenerator_1.makeExecutableSchema({
                typeDefs: typeDef,
                resolvers: resolvers,
                connectors: testConnectors,
            });
            var query = "{\n        testString\n      }";
            var expected = {
                testString: 'Hi You!',
            };
            return graphql_1.graphql(jsSchema, query, {}, {
                connectors: {
                    staticString: 'Hi You!',
                },
            }).then(function (res) {
                chai_1.expect(res.data).to.deep.equal(expected);
            });
        });
    });
    it('actually attaches the connectors', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        schemaGenerator_1.attachConnectorsToContext(jsSchema, testConnectors);
        var query = "{\n      useTestConnector\n    }";
        var expected = {
            useTestConnector: 'works',
        };
        return graphql_1.graphql(jsSchema, query, {}, {}).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
    });
    it('actually passes the context to the connector constructor', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        schemaGenerator_1.attachConnectorsToContext(jsSchema, testConnectors);
        var query = "{\n      useContextConnector\n    }";
        var expected = {
            useContextConnector: 'YOYO',
        };
        return graphql_1.graphql(jsSchema, query, {}, { str: 'YOYO' }).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
    });
    it('throws error if trying to attach connectors twice', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        schemaGenerator_1.attachConnectorsToContext(jsSchema, testConnectors);
        return chai_1.expect(function () {
            return schemaGenerator_1.attachConnectorsToContext(jsSchema, testConnectors);
        }).to.throw('Connectors already attached to context, cannot attach more than once');
    });
    it('throws error during execution if context is not an object', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        schemaGenerator_1.attachConnectorsToContext(jsSchema, { someConnector: {} });
        var query = "{\n      useTestConnector\n    }";
        return graphql_1.graphql(jsSchema, query, {}, 'notObject').then(function (res) {
            chai_1.expect(res.errors[0].originalError.message).to.equal('Cannot attach connector because context is not an object: string');
        });
    });
    it('throws error if trying to attach non-functional connectors', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        schemaGenerator_1.attachConnectorsToContext(jsSchema, { testString: 'a' });
        var query = "{\n      species(name: \"strix\")\n      stuff\n      useTestConnector\n    }";
        return graphql_1.graphql(jsSchema, query, undefined, {}).then(function (res) {
            chai_1.expect(res.errors[0].originalError.message).to.equal('Connector must be a function or an class');
        });
    });
    it('does not interfere with schema level resolve function', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        var rootResolver = function () { return ({ stuff: 'stuff', species: 'ROOT' }); };
        schemaGenerator_1.addSchemaLevelResolveFunction(jsSchema, rootResolver);
        schemaGenerator_1.attachConnectorsToContext(jsSchema, testConnectors);
        var query = "{\n      species(name: \"strix\")\n      stuff\n      useTestConnector\n    }";
        var expected = {
            species: 'ROOTstrix',
            stuff: 'stuff',
            useTestConnector: 'works',
        };
        return graphql_1.graphql(jsSchema, query, {}, {}).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
        // TODO test schemaLevelResolve function with wrong arguments
    });
    // TODO test attachConnectors with wrong arguments
    it('throws error if no schema is passed', function () {
        chai_1.expect(function () { return schemaGenerator_1.attachConnectorsToContext(); }).to.throw('schema must be an instance of GraphQLSchema. ' +
            'This error could be caused by installing more than one version of GraphQL-JS');
    });
    it('throws error if schema is not an instance of GraphQLSchema', function () {
        chai_1.expect(function () { return schemaGenerator_1.attachConnectorsToContext({}); }).to.throw('schema must be an instance of GraphQLSchema. ' +
            'This error could be caused by installing more than one version of GraphQL-JS');
    });
    it('throws error if connectors argument is an array', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        chai_1.expect(function () { return schemaGenerator_1.attachConnectorsToContext(jsSchema, [1]); }).to.throw('Expected connectors to be of type object, got Array');
    });
    it('throws error if connectors argument is an empty object', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        return chai_1.expect(function () { return schemaGenerator_1.attachConnectorsToContext(jsSchema, {}); }).to.throw('Expected connectors to not be an empty object');
    });
    it('throws error if connectors argument is not an object', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        return chai_1.expect(function () {
            return schemaGenerator_1.attachConnectorsToContext(jsSchema, 'a');
        }).to.throw('Expected connectors to be of type object, got string');
    });
});
describe('Generating a full graphQL schema with resolvers and connectors', function () {
    it('outputs a working GraphQL schema', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
            connectors: testConnectors,
        });
        var query = "{\n      species(name: \"uhu\")\n      stuff\n      usecontext\n      useTestConnector\n    }";
        var expected = {
            species: 'ROOTuhu',
            stuff: 'stuff',
            useTestConnector: 'works',
            usecontext: 'ABC',
        };
        return graphql_1.graphql(schema, query, {}, { usecontext: 'ABC' }).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
    });
});
describe('chainResolvers', function () {
    it('can chain two resolvers', function () {
        var r1 = function (root) { return root + 1; };
        var r2 = function (root, _a) {
            var addend = _a.addend;
            return root + addend;
        };
        var rChained = schemaGenerator_1.chainResolvers([r1, r2]);
        chai_1.expect(rChained(0, { addend: 2 }, null, null)).to.equals(3);
    });
    it('uses default resolver when a resolver is undefined', function () {
        var r1 = function (root, _a) {
            var name = _a.name;
            return ({
                person: { name: name },
            });
        };
        var r3 = function (root) { return root['name']; };
        var rChained = schemaGenerator_1.chainResolvers([r1, undefined, r3]);
        // faking the resolve info here.
        chai_1.expect(rChained(0, { name: 'tony' }, null, {
            fieldName: 'person',
        })).to.equals('tony');
    });
});
describe('attachDirectiveResolvers on field', function () {
    var testSchemaWithDirectives = "\n    directive @upper on FIELD_DEFINITION\n    directive @lower on FIELD_DEFINITION\n    directive @default(value: String!) on FIELD_DEFINITION\n    directive @catchError on FIELD_DEFINITION\n\n    type TestObject {\n      hello: String @upper\n    }\n    type RootQuery {\n      hello: String @upper\n      withDefault: String @default(value: \"some default_value\")\n      object: TestObject\n      asyncResolver: String @upper\n      multiDirectives: String @upper @lower\n      throwError: String @catchError\n    }\n    schema {\n      query: RootQuery\n    }\n  ";
    var testObject = {
        hello: 'giau. tran minh',
    };
    var testResolversDirectives = {
        RootQuery: {
            hello: function () { return 'giau. tran minh'; },
            object: function () { return testObject; },
            asyncResolver: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, 'giau. tran minh'];
            }); }); },
            multiDirectives: function () { return 'Giau. Tran Minh'; },
            throwError: function () {
                throw new Error('This error for testing');
            },
        },
    };
    var directiveResolvers = {
        lower: function (next, src, args, context) {
            return next().then(function (str) {
                if (typeof str === 'string') {
                    return str.toLowerCase();
                }
                return str;
            });
        },
        upper: function (next, src, args, context) {
            return next().then(function (str) {
                if (typeof str === 'string') {
                    return str.toUpperCase();
                }
                return str;
            });
        },
        default: function (next, src, args, context) {
            return next().then(function (res) {
                if (undefined === res) {
                    return args.value;
                }
                return res;
            });
        },
        catchError: function (next, src, args, context) {
            return next().catch(function (error) {
                return error.message;
            });
        },
    };
    it('throws error if directiveResolvers argument is an array', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        chai_1.expect(function () { return schemaGenerator_1.attachDirectiveResolvers(jsSchema, [1]); }).to.throw('Expected directiveResolvers to be of type object, got Array');
    });
    it('throws error if directiveResolvers argument is not an object', function () {
        var jsSchema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchema,
            resolvers: testResolvers,
        });
        return chai_1.expect(function () {
            return schemaGenerator_1.attachDirectiveResolvers(jsSchema, 'a');
        }).to.throw('Expected directiveResolvers to be of type object, got string');
    });
    it('upper String from resolvers', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchemaWithDirectives,
            resolvers: testResolversDirectives,
            directiveResolvers: directiveResolvers,
        });
        var query = "{\n      hello\n    }";
        var expected = {
            hello: 'GIAU. TRAN MINH',
        };
        return graphql_1.graphql(schema, query, {}, {}).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
    });
    it('using default resolver for object property', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchemaWithDirectives,
            resolvers: testResolversDirectives,
            directiveResolvers: directiveResolvers,
        });
        var query = "{\n      object {\n        hello\n      }\n    }";
        var expected = {
            object: {
                hello: 'GIAU. TRAN MINH',
            },
        };
        return graphql_1.graphql(schema, query, {}, {}).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
    });
    it('passes in directive arguments to the directive resolver', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchemaWithDirectives,
            resolvers: testResolversDirectives,
            directiveResolvers: directiveResolvers,
        });
        var query = "{\n      withDefault\n    }";
        var expected = {
            withDefault: 'some default_value',
        };
        return graphql_1.graphql(schema, query, {}, {}).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
    });
    it('No effect if missing directive resolvers', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchemaWithDirectives,
            resolvers: testResolversDirectives,
            directiveResolvers: {},
        });
        var query = "{\n      hello\n    }";
        var expected = {
            hello: 'giau. tran minh',
        };
        return graphql_1.graphql(schema, query, {}, {}).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
    });
    it('If resolver return Promise, keep using it', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchemaWithDirectives,
            resolvers: testResolversDirectives,
            directiveResolvers: directiveResolvers,
        });
        var query = "{\n      asyncResolver\n    }";
        var expected = {
            asyncResolver: 'GIAU. TRAN MINH',
        };
        return graphql_1.graphql(schema, query, {}, {}).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
    });
    it('Multi directives apply with LTR order', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchemaWithDirectives,
            resolvers: testResolversDirectives,
            directiveResolvers: directiveResolvers,
        });
        var query = "{\n      multiDirectives\n    }";
        var expected = {
            multiDirectives: 'giau. tran minh',
        };
        return graphql_1.graphql(schema, query, {}, {}).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
    });
    it('Allow to catch error from next resolver', function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: testSchemaWithDirectives,
            resolvers: testResolversDirectives,
            directiveResolvers: directiveResolvers,
        });
        var query = "{\n      throwError\n    }";
        var expected = {
            throwError: 'This error for testing',
        };
        return graphql_1.graphql(schema, query, {}, {}).then(function (res) {
            chai_1.expect(res.data).to.deep.equal(expected);
        });
    });
});
describe('can specify lexical parser options', function () {
    it("can specify 'noLocation' option", function () {
        var schema = schemaGenerator_1.makeExecutableSchema({
            typeDefs: "\n        type RootQuery {\n          test: String\n        }\n        schema {\n          query: RootQuery\n        }\n      ",
            resolvers: {},
            parseOptions: {
                noLocation: true,
            },
        });
        chai_1.expect(schema.astNode.loc).to.equal(undefined);
    });
    if (['^0.11', '^0.12'].indexOf(process.env.GRAPHQL_VERSION) === -1) {
        it("can specify 'allowLegacySDLEmptyFields' option", function () {
            return chai_1.expect(function () {
                schemaGenerator_1.makeExecutableSchema({
                    typeDefs: "\n            type RootQuery {\n            }\n            schema {\n              query: RootQuery\n            }\n          ",
                    resolvers: {},
                    parseOptions: {
                        allowLegacySDLEmptyFields: true,
                    },
                });
            }).to.not.throw();
        });
        it("can specify 'allowLegacySDLImplementsInterfaces' option", function () {
            var typeDefs = "\n        interface A {\n          hello: String\n        }\n        interface B {\n          world: String\n        }\n        type RootQuery implements A, B {\n          hello: String\n          world: String\n        }\n        schema {\n          query: RootQuery\n        }\n      ";
            var resolvers = {};
            chai_1.expect(function () {
                schemaGenerator_1.makeExecutableSchema({
                    typeDefs: typeDefs,
                    resolvers: resolvers,
                    parseOptions: {
                        allowLegacySDLImplementsInterfaces: true,
                    },
                });
            }).to.not.throw();
            chai_1.expect(function () {
                schemaGenerator_1.makeExecutableSchema({
                    typeDefs: typeDefs,
                    resolvers: resolvers,
                    parseOptions: {
                        allowLegacySDLImplementsInterfaces: false,
                    },
                });
            }).to.throw('Syntax Error: Unexpected Name');
        });
    }
    if (process.env.GRAPHQL_VERSION !== '^0.11') {
        it("can specify 'experimentalFragmentVariables' option", function () {
            var typeDefs = "\n        type Hello {\n          world(phrase: String): String\n        }\n\n        fragment hello($phrase: String = \"world\") on Hello {\n          world(phrase: $phrase)\n        }\n\n        type RootQuery {\n          hello: Hello\n        }\n\n        schema {\n          query: RootQuery\n        }\n      ";
            var resolvers = {
                RootQuery: {
                    hello: function () {
                        return {
                            world: function (phrase) { return "hello " + phrase; },
                        };
                    },
                },
            };
            chai_1.expect(function () {
                schemaGenerator_1.makeExecutableSchema({
                    typeDefs: typeDefs,
                    resolvers: resolvers,
                    parseOptions: {
                        experimentalFragmentVariables: true,
                    },
                });
            }).to.not.throw();
        });
    }
});
describe('interfaces', function () {
    var testSchemaWithInterfaces = "\n  interface Node {\n    id: ID!\n  }\n  type User implements Node {\n    id: ID!\n    name: String!\n  }\n  type Query {\n    node: Node!\n    user: User!\n  }\n  schema {\n    query: Query\n  }\n  ";
    var user = { id: 1, type: 'User', name: 'Kim' };
    var queryResolver = {
        node: function () { return user; },
        user: function () { return user; },
    };
    var query = "query {\n    node { id __typename }\n    user { id name }\n  }";
    if (process.env.GRAPHQL_VERSION !== '^0.11') {
        it('throws if there is no interface resolveType resolver', function () { return __awaiter(_this, void 0, void 0, function () {
            var resolvers;
            return __generator(this, function (_a) {
                resolvers = {
                    Query: queryResolver,
                };
                try {
                    schemaGenerator_1.makeExecutableSchema({
                        typeDefs: testSchemaWithInterfaces,
                        resolvers: resolvers,
                        resolverValidationOptions: { requireResolversForResolveType: true },
                    });
                }
                catch (error) {
                    chai_1.assert.equal(error.message, 'Type "Node" is missing a "resolveType" resolver');
                    return [2 /*return*/];
                }
                throw new Error('Should have had an error.');
            });
        }); });
    }
    it('does not throw if there is an interface resolveType resolver', function () { return __awaiter(_this, void 0, void 0, function () {
        var resolvers, schema, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolvers = {
                        Query: queryResolver,
                        Node: {
                            __resolveType: function (_a) {
                                var type = _a.type;
                                return type;
                            },
                        },
                    };
                    schema = schemaGenerator_1.makeExecutableSchema({
                        typeDefs: testSchemaWithInterfaces,
                        resolvers: resolvers,
                        resolverValidationOptions: { requireResolversForResolveType: true },
                    });
                    return [4 /*yield*/, graphql_1.graphql(schema, query)];
                case 1:
                    response = _a.sent();
                    chai_1.assert.isUndefined(response.errors);
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not warn if requireResolversForResolveType is disabled and there are missing resolvers', function () { return __awaiter(_this, void 0, void 0, function () {
        var resolvers;
        return __generator(this, function (_a) {
            resolvers = {
                Query: queryResolver,
            };
            schemaGenerator_1.makeExecutableSchema({
                typeDefs: testSchemaWithInterfaces,
                resolvers: resolvers,
                resolverValidationOptions: { requireResolversForResolveType: false },
            });
            return [2 /*return*/];
        });
    }); });
});
describe('interface resolver inheritance', function () {
    it('copies resolvers from the interfaces', function () { return __awaiter(_this, void 0, void 0, function () {
        var testSchemaWithInterfaceResolvers, user, resolvers, schema, query, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testSchemaWithInterfaceResolvers = "\n    interface Node {\n      id: ID!\n    }\n    type User implements Node {\n      id: ID!\n      name: String!\n    }\n    type Query {\n      user: User!\n    }\n    schema {\n      query: Query\n    }\n    ";
                    user = { id: 1, name: 'Ada', type: 'User' };
                    resolvers = {
                        Node: {
                            __resolveType: function (_a) {
                                var type = _a.type;
                                return type;
                            },
                            id: function (_a) {
                                var id = _a.id;
                                return "Node:" + id;
                            },
                        },
                        User: {
                            name: function (_a) {
                                var name = _a.name;
                                return "User:" + name;
                            }
                        },
                        Query: {
                            user: function () { return user; }
                        }
                    };
                    schema = schemaGenerator_1.makeExecutableSchema({
                        typeDefs: testSchemaWithInterfaceResolvers,
                        resolvers: resolvers,
                        inheritResolversFromInterfaces: true,
                        resolverValidationOptions: { requireResolversForAllFields: true, requireResolversForResolveType: true }
                    });
                    query = "{ user { id name } }";
                    return [4 /*yield*/, graphql_1.graphql(schema, query)];
                case 1:
                    response = _a.sent();
                    chai_1.assert.deepEqual(response, {
                        data: {
                            user: {
                                id: "Node:1",
                                name: "User:Ada"
                            }
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('respects interface order and existing resolvers', function () { return __awaiter(_this, void 0, void 0, function () {
        var testSchemaWithInterfaceResolvers, cyborg, replicant, resolvers, schema, query, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testSchemaWithInterfaceResolvers = "\n    interface Node {\n      id: ID!\n    }\n    interface Person {\n      id: ID!\n      name: String!\n    }\n    type Replicant implements Node, Person {\n      id: ID!\n      name: String!\n    }\n    type Cyborg implements Person, Node {\n      id: ID!\n      name: String!\n    }\n    type Query {\n      cyborg: Cyborg!\n      replicant: Replicant!\n    }\n    schema {\n      query: Query\n    }\n    ";
                    cyborg = { id: 1, name: 'Alex Murphy', type: 'Cyborg' };
                    replicant = { id: 2, name: 'Rachael Tyrell', type: 'Replicant' };
                    resolvers = {
                        Node: {
                            __resolveType: function (_a) {
                                var type = _a.type;
                                return type;
                            },
                            id: function (_a) {
                                var id = _a.id;
                                return "Node:" + id;
                            },
                        },
                        Person: {
                            __resolveType: function (_a) {
                                var type = _a.type;
                                return type;
                            },
                            id: function (_a) {
                                var id = _a.id;
                                return "Person:" + id;
                            },
                            name: function (_a) {
                                var name = _a.name;
                                return "Person:" + name;
                            }
                        },
                        Query: {
                            cyborg: function () { return cyborg; },
                            replicant: function () { return replicant; },
                        }
                    };
                    schema = schemaGenerator_1.makeExecutableSchema({
                        parseOptions: { allowLegacySDLImplementsInterfaces: true },
                        typeDefs: testSchemaWithInterfaceResolvers,
                        resolvers: resolvers,
                        inheritResolversFromInterfaces: true,
                        resolverValidationOptions: { requireResolversForAllFields: true, requireResolversForResolveType: true }
                    });
                    query = "{ cyborg { id name } replicant { id name }}";
                    return [4 /*yield*/, graphql_1.graphql(schema, query)];
                case 1:
                    response = _a.sent();
                    chai_1.assert.deepEqual(response, {
                        data: {
                            cyborg: {
                                id: "Node:1",
                                name: "Person:Alex Murphy"
                            },
                            replicant: {
                                id: "Person:2",
                                name: "Person:Rachael Tyrell"
                            }
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('unions', function () {
    var testSchemaWithUnions = "\n    type Post {\n      title: String!\n    }\n    type Page {\n      title: String!\n    }\n    union Displayable = Page | Post\n    type Query {\n      page: Page!\n      post: Post!\n      displayable: [Displayable!]!\n    }\n    schema {\n      query: Query\n    }\n  ";
    var post = { title: 'I am a post', type: 'Post' };
    var page = { title: 'I am a page', type: 'Page' };
    var queryResolver = {
        page: function () { return page; },
        post: function () { return post; },
        displayable: function () { return [post, page]; },
    };
    var query = "query {\n    post { title }\n    page { title }\n    displayable {\n      ... on Post { title }\n      ... on Page { title }\n    }\n  }";
    if (process.env.GRAPHQL_VERSION !== '^0.11') {
        it('throws if there is no union resolveType resolver', function () { return __awaiter(_this, void 0, void 0, function () {
            var resolvers;
            return __generator(this, function (_a) {
                resolvers = {
                    Query: queryResolver,
                };
                try {
                    schemaGenerator_1.makeExecutableSchema({
                        typeDefs: testSchemaWithUnions,
                        resolvers: resolvers,
                        resolverValidationOptions: { requireResolversForResolveType: true },
                    });
                }
                catch (error) {
                    chai_1.assert.equal(error.message, 'Type "Displayable" is missing a "resolveType" resolver');
                    return [2 /*return*/];
                }
                throw new Error('Should have had an error.');
            });
        }); });
    }
    it('does not throw if there is a resolveType resolver', function () { return __awaiter(_this, void 0, void 0, function () {
        var resolvers, schema, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolvers = {
                        Query: queryResolver,
                        Displayable: {
                            __resolveType: function (_a) {
                                var type = _a.type;
                                return type;
                            },
                        },
                    };
                    schema = schemaGenerator_1.makeExecutableSchema({
                        typeDefs: testSchemaWithUnions,
                        resolvers: resolvers,
                        resolverValidationOptions: { requireResolversForResolveType: true },
                    });
                    return [4 /*yield*/, graphql_1.graphql(schema, query)];
                case 1:
                    response = _a.sent();
                    chai_1.assert.isUndefined(response.errors);
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not warn if requireResolversForResolveType is disabled', function () { return __awaiter(_this, void 0, void 0, function () {
        var resolvers;
        return __generator(this, function (_a) {
            resolvers = {
                Query: queryResolver,
            };
            schemaGenerator_1.makeExecutableSchema({
                typeDefs: testSchemaWithUnions,
                resolvers: resolvers,
                resolverValidationOptions: { requireResolversForResolveType: false },
            });
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=testSchemaGenerator.js.map