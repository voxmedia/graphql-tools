"use strict";
// Generates a schema for graphql-js given a shorthand schema
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: document each function clearly in the code: what arguments it accepts
// and what it outputs.
// TODO: we should refactor this file, rename it to makeExecutableSchema, and move
// a bunch of utility functions into a separate utitlities folder, one file per function.
var graphql_1 = require("graphql");
var schemaVisitor_1 = require("./schemaVisitor");
var deprecated_decorator_1 = require("deprecated-decorator");
var mergeDeep_1 = require("./mergeDeep");
// @schemaDefinition: A GraphQL type schema in shorthand
// @resolvers: Definitions for resolvers to be merged with schema
var SchemaError = /** @class */ (function (_super) {
    __extends(SchemaError, _super);
    function SchemaError(message) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return SchemaError;
}(Error));
exports.SchemaError = SchemaError;
// type definitions can be a string or an array of strings.
function _generateSchema(typeDefinitions, resolveFunctions, logger, 
    // TODO: rename to allowUndefinedInResolve to be consistent
    allowUndefinedInResolve, resolverValidationOptions, parseOptions, inheritResolversFromInterfaces) {
    if (typeof resolverValidationOptions !== 'object') {
        throw new SchemaError('Expected `resolverValidationOptions` to be an object');
    }
    if (!typeDefinitions) {
        throw new SchemaError('Must provide typeDefs');
    }
    if (!resolveFunctions) {
        throw new SchemaError('Must provide resolvers');
    }
    var resolvers = Array.isArray(resolveFunctions)
        ? resolveFunctions
            .filter(function (resolverObj) { return typeof resolverObj === 'object'; })
            .reduce(mergeDeep_1.default, {})
        : resolveFunctions;
    // TODO: check that typeDefinitions is either string or array of strings
    var schema = buildSchemaFromTypeDefinitions(typeDefinitions, parseOptions);
    addResolveFunctionsToSchema({ schema: schema, resolvers: resolvers, resolverValidationOptions: resolverValidationOptions, inheritResolversFromInterfaces: inheritResolversFromInterfaces });
    assertResolveFunctionsPresent(schema, resolverValidationOptions);
    if (!allowUndefinedInResolve) {
        addCatchUndefinedToSchema(schema);
    }
    if (logger) {
        addErrorLoggingToSchema(schema, logger);
    }
    return schema;
}
function makeExecutableSchema(_a) {
    var typeDefs = _a.typeDefs, _b = _a.resolvers, resolvers = _b === void 0 ? {} : _b, connectors = _a.connectors, logger = _a.logger, _c = _a.allowUndefinedInResolve, allowUndefinedInResolve = _c === void 0 ? true : _c, _d = _a.resolverValidationOptions, resolverValidationOptions = _d === void 0 ? {} : _d, _e = _a.directiveResolvers, directiveResolvers = _e === void 0 ? null : _e, _f = _a.schemaDirectives, schemaDirectives = _f === void 0 ? null : _f, _g = _a.parseOptions, parseOptions = _g === void 0 ? {} : _g, _h = _a.inheritResolversFromInterfaces, inheritResolversFromInterfaces = _h === void 0 ? false : _h;
    var jsSchema = _generateSchema(typeDefs, resolvers, logger, allowUndefinedInResolve, resolverValidationOptions, parseOptions, inheritResolversFromInterfaces);
    if (typeof resolvers['__schema'] === 'function') {
        // TODO a bit of a hack now, better rewrite generateSchema to attach it there.
        // not doing that now, because I'd have to rewrite a lot of tests.
        addSchemaLevelResolveFunction(jsSchema, resolvers['__schema']);
    }
    if (connectors) {
        // connectors are optional, at least for now. That means you can just import them in the resolve
        // function if you want.
        attachConnectorsToContext(jsSchema, connectors);
    }
    if (directiveResolvers) {
        attachDirectiveResolvers(jsSchema, directiveResolvers);
    }
    if (schemaDirectives) {
        schemaVisitor_1.SchemaDirectiveVisitor.visitSchemaDirectives(jsSchema, schemaDirectives);
    }
    return jsSchema;
}
exports.makeExecutableSchema = makeExecutableSchema;
function isDocumentNode(typeDefinitions) {
    return typeDefinitions.kind !== undefined;
}
function uniq(array) {
    return array.reduce(function (accumulator, currentValue) {
        return accumulator.indexOf(currentValue) === -1
            ? accumulator.concat([currentValue]) : accumulator;
    }, []);
}
function concatenateTypeDefs(typeDefinitionsAry, calledFunctionRefs) {
    if (calledFunctionRefs === void 0) { calledFunctionRefs = []; }
    var resolvedTypeDefinitions = [];
    typeDefinitionsAry.forEach(function (typeDef) {
        if (isDocumentNode(typeDef)) {
            typeDef = graphql_1.print(typeDef);
        }
        if (typeof typeDef === 'function') {
            if (calledFunctionRefs.indexOf(typeDef) === -1) {
                calledFunctionRefs.push(typeDef);
                resolvedTypeDefinitions = resolvedTypeDefinitions.concat(concatenateTypeDefs(typeDef(), calledFunctionRefs));
            }
        }
        else if (typeof typeDef === 'string') {
            resolvedTypeDefinitions.push(typeDef.trim());
        }
        else {
            var type = typeof typeDef;
            throw new SchemaError("typeDef array must contain only strings and functions, got " + type);
        }
    });
    return uniq(resolvedTypeDefinitions.map(function (x) { return x.trim(); })).join('\n');
}
exports.concatenateTypeDefs = concatenateTypeDefs;
function buildSchemaFromTypeDefinitions(typeDefinitions, parseOptions) {
    // TODO: accept only array here, otherwise interfaces get confusing.
    var myDefinitions = typeDefinitions;
    var astDocument;
    if (isDocumentNode(typeDefinitions)) {
        astDocument = typeDefinitions;
    }
    else if (typeof myDefinitions !== 'string') {
        if (!Array.isArray(myDefinitions)) {
            var type = typeof myDefinitions;
            throw new SchemaError("typeDefs must be a string, array or schema AST, got " + type);
        }
        myDefinitions = concatenateTypeDefs(myDefinitions);
    }
    if (typeof myDefinitions === 'string') {
        astDocument = graphql_1.parse(myDefinitions, parseOptions);
    }
    var backcompatOptions = { commentDescriptions: true };
    // TODO fix types https://github.com/apollographql/graphql-tools/issues/542
    var schema = graphql_1.buildASTSchema(astDocument, backcompatOptions);
    var extensionsAst = extractExtensionDefinitions(astDocument);
    if (extensionsAst.definitions.length > 0) {
        // TODO fix types https://github.com/apollographql/graphql-tools/issues/542
        schema = graphql_1.extendSchema(schema, extensionsAst, backcompatOptions);
    }
    return schema;
}
exports.buildSchemaFromTypeDefinitions = buildSchemaFromTypeDefinitions;
// This was changed in graphql@0.12
// See https://github.com/apollographql/graphql-tools/pull/541
// TODO fix types https://github.com/apollographql/graphql-tools/issues/542
var oldTypeExtensionDefinitionKind = 'TypeExtensionDefinition';
var newExtensionDefinitionKind = 'ObjectTypeExtension';
var interfaceExtensionDefinitionKind = 'InterfaceTypeExtension';
function extractExtensionDefinitions(ast) {
    var extensionDefs = ast.definitions.filter(function (def) {
        return def.kind === oldTypeExtensionDefinitionKind ||
            def.kind === newExtensionDefinitionKind ||
            def.kind === interfaceExtensionDefinitionKind;
    });
    return Object.assign({}, ast, {
        definitions: extensionDefs,
    });
}
exports.extractExtensionDefinitions = extractExtensionDefinitions;
function forEachField(schema, fn) {
    var typeMap = schema.getTypeMap();
    Object.keys(typeMap).forEach(function (typeName) {
        var type = typeMap[typeName];
        // TODO: maybe have an option to include these?
        if (!graphql_1.getNamedType(type).name.startsWith('__') &&
            type instanceof graphql_1.GraphQLObjectType) {
            var fields_1 = type.getFields();
            Object.keys(fields_1).forEach(function (fieldName) {
                var field = fields_1[fieldName];
                fn(field, typeName, fieldName);
            });
        }
    });
}
exports.forEachField = forEachField;
// takes a GraphQL-JS schema and an object of connectors, then attaches
// the connectors to the context by wrapping each query or mutation resolve
// function with a function that attaches connectors if they don't exist.
// attaches connectors only once to make sure they are singletons
var attachConnectorsToContext = deprecated_decorator_1.deprecated({
    version: '0.7.0',
    url: 'https://github.com/apollostack/graphql-tools/issues/140',
}, function (schema, connectors) {
    if (!schema || !(schema instanceof graphql_1.GraphQLSchema)) {
        throw new Error('schema must be an instance of GraphQLSchema. ' +
            'This error could be caused by installing more than one version of GraphQL-JS');
    }
    if (typeof connectors !== 'object') {
        var connectorType = typeof connectors;
        throw new Error("Expected connectors to be of type object, got " + connectorType);
    }
    if (Object.keys(connectors).length === 0) {
        throw new Error('Expected connectors to not be an empty object');
    }
    if (Array.isArray(connectors)) {
        throw new Error('Expected connectors to be of type object, got Array');
    }
    if (schema['_apolloConnectorsAttached']) {
        throw new Error('Connectors already attached to context, cannot attach more than once');
    }
    schema['_apolloConnectorsAttached'] = true;
    var attachconnectorFn = function (root, args, ctx) {
        if (typeof ctx !== 'object') {
            // if in any way possible, we should throw an error when the attachconnectors
            // function is called, not when a query is executed.
            var contextType = typeof ctx;
            throw new Error("Cannot attach connector because context is not an object: " + contextType);
        }
        if (typeof ctx.connectors === 'undefined') {
            ctx.connectors = {};
        }
        Object.keys(connectors).forEach(function (connectorName) {
            var connector = connectors[connectorName];
            if (!!connector.prototype) {
                ctx.connectors[connectorName] = new connector(ctx);
            }
            else {
                throw new Error("Connector must be a function or an class");
            }
        });
        return root;
    };
    addSchemaLevelResolveFunction(schema, attachconnectorFn);
});
exports.attachConnectorsToContext = attachConnectorsToContext;
// wraps all resolve functions of query, mutation or subscription fields
// with the provided function to simulate a root schema level resolve funciton
function addSchemaLevelResolveFunction(schema, fn) {
    // TODO test that schema is a schema, fn is a function
    var rootTypes = [
        schema.getQueryType(),
        schema.getMutationType(),
        schema.getSubscriptionType(),
    ].filter(function (x) { return !!x; });
    rootTypes.forEach(function (type) {
        // XXX this should run at most once per request to simulate a true root resolver
        // for graphql-js this is an approximation that works with queries but not mutations
        var rootResolveFn = runAtMostOncePerRequest(fn);
        var fields = type.getFields();
        Object.keys(fields).forEach(function (fieldName) {
            // XXX if the type is a subscription, a same query AST will be ran multiple times so we
            // deactivate here the runOnce if it's a subscription. This may not be optimal though...
            if (type === schema.getSubscriptionType()) {
                fields[fieldName].resolve = wrapResolver(fields[fieldName].resolve, fn);
            }
            else {
                fields[fieldName].resolve = wrapResolver(fields[fieldName].resolve, rootResolveFn);
            }
        });
    });
}
exports.addSchemaLevelResolveFunction = addSchemaLevelResolveFunction;
function getFieldsForType(type) {
    if (type instanceof graphql_1.GraphQLObjectType ||
        type instanceof graphql_1.GraphQLInterfaceType) {
        return type.getFields();
    }
    else {
        return undefined;
    }
}
function addResolveFunctionsToSchema(options, legacyInputResolvers, legacyInputValidationOptions) {
    if (options instanceof graphql_1.GraphQLSchema) {
        console.warn('The addResolveFunctionsToSchema function takes named options now; see IAddResolveFunctionsToSchemaOptions');
        options = {
            schema: options,
            resolvers: legacyInputResolvers,
            resolverValidationOptions: legacyInputValidationOptions
        };
    }
    var schema = options.schema, inputResolvers = options.resolvers, _a = options.resolverValidationOptions, resolverValidationOptions = _a === void 0 ? {} : _a, _b = options.inheritResolversFromInterfaces, inheritResolversFromInterfaces = _b === void 0 ? false : _b;
    var _c = resolverValidationOptions.allowResolversNotInSchema, allowResolversNotInSchema = _c === void 0 ? false : _c, requireResolversForResolveType = resolverValidationOptions.requireResolversForResolveType;
    var resolvers = inheritResolversFromInterfaces
        ? extendResolversFromInterfaces(schema, inputResolvers)
        : inputResolvers;
    Object.keys(resolvers).forEach(function (typeName) {
        var type = schema.getType(typeName);
        if (!type && typeName !== '__schema') {
            if (allowResolversNotInSchema) {
                return;
            }
            throw new SchemaError("\"" + typeName + "\" defined in resolvers, but not in schema");
        }
        Object.keys(resolvers[typeName]).forEach(function (fieldName) {
            if (fieldName.startsWith('__')) {
                // this is for isTypeOf and resolveType and all the other stuff.
                type[fieldName.substring(2)] = resolvers[typeName][fieldName];
                return;
            }
            if (type instanceof graphql_1.GraphQLScalarType) {
                type[fieldName] = resolvers[typeName][fieldName];
                return;
            }
            if (type instanceof graphql_1.GraphQLEnumType) {
                if (!type.getValue(fieldName)) {
                    throw new SchemaError(typeName + "." + fieldName + " was defined in resolvers, but enum is not in schema");
                }
                type.getValue(fieldName)['value'] =
                    resolvers[typeName][fieldName];
                return;
            }
            // object type
            var fields = getFieldsForType(type);
            if (!fields) {
                if (allowResolversNotInSchema) {
                    return;
                }
                throw new SchemaError(typeName + " was defined in resolvers, but it's not an object");
            }
            if (!fields[fieldName]) {
                if (allowResolversNotInSchema) {
                    return;
                }
                throw new SchemaError(typeName + "." + fieldName + " defined in resolvers, but not in schema");
            }
            var field = fields[fieldName];
            var fieldResolve = resolvers[typeName][fieldName];
            if (typeof fieldResolve === 'function') {
                // for convenience. Allows shorter syntax in resolver definition file
                setFieldProperties(field, { resolve: fieldResolve });
            }
            else {
                if (typeof fieldResolve !== 'object') {
                    throw new SchemaError("Resolver " + typeName + "." + fieldName + " must be object or function");
                }
                setFieldProperties(field, fieldResolve);
            }
        });
    });
    checkForResolveTypeResolver(schema, requireResolversForResolveType);
}
exports.addResolveFunctionsToSchema = addResolveFunctionsToSchema;
function extendResolversFromInterfaces(schema, resolvers) {
    var typeNames = Object.keys(__assign({}, schema.getTypeMap(), resolvers));
    var extendedResolvers = {};
    typeNames.forEach(function (typeName) {
        var typeResolvers = resolvers[typeName];
        var type = schema.getType(typeName);
        if (type instanceof graphql_1.GraphQLObjectType) {
            var interfaceResolvers = type.getInterfaces().map(function (iFace) { return resolvers[iFace.name]; });
            extendedResolvers[typeName] = Object.assign.apply(Object, [{}].concat(interfaceResolvers, [typeResolvers]));
        }
        else {
            if (typeResolvers) {
                extendedResolvers[typeName] = typeResolvers;
            }
        }
    });
    return extendedResolvers;
}
// If we have any union or interface types throw if no there is no resolveType or isTypeOf resolvers
function checkForResolveTypeResolver(schema, requireResolversForResolveType) {
    Object.keys(schema.getTypeMap())
        .map(function (typeName) { return schema.getType(typeName); })
        .forEach(function (type) {
        if (!(type instanceof graphql_1.GraphQLUnionType || type instanceof graphql_1.GraphQLInterfaceType)) {
            return;
        }
        if (!type.resolveType) {
            if (requireResolversForResolveType === false) {
                return;
            }
            if (requireResolversForResolveType === true) {
                throw new SchemaError("Type \"" + type.name + "\" is missing a \"resolveType\" resolver");
            }
            // tslint:disable-next-line:max-line-length
            console.warn("Type \"" + type.name + "\" is missing a \"resolveType\" resolver. Pass false into \"resolverValidationOptions.requireResolversForResolveType\" to disable this warning.");
        }
    });
}
function setFieldProperties(field, propertiesObj) {
    Object.keys(propertiesObj).forEach(function (propertyName) {
        field[propertyName] = propertiesObj[propertyName];
    });
}
function assertResolveFunctionsPresent(schema, resolverValidationOptions) {
    if (resolverValidationOptions === void 0) { resolverValidationOptions = {}; }
    var _a = resolverValidationOptions.requireResolversForArgs, requireResolversForArgs = _a === void 0 ? false : _a, _b = resolverValidationOptions.requireResolversForNonScalar, requireResolversForNonScalar = _b === void 0 ? false : _b, _c = resolverValidationOptions.requireResolversForAllFields, requireResolversForAllFields = _c === void 0 ? false : _c;
    if (requireResolversForAllFields &&
        (requireResolversForArgs || requireResolversForNonScalar)) {
        throw new TypeError('requireResolversForAllFields takes precedence over the more specific assertions. ' +
            'Please configure either requireResolversForAllFields or requireResolversForArgs / ' +
            'requireResolversForNonScalar, but not a combination of them.');
    }
    forEachField(schema, function (field, typeName, fieldName) {
        // requires a resolve function for *every* field.
        if (requireResolversForAllFields) {
            expectResolveFunction(field, typeName, fieldName);
        }
        // requires a resolve function on every field that has arguments
        if (requireResolversForArgs && field.args.length > 0) {
            expectResolveFunction(field, typeName, fieldName);
        }
        // requires a resolve function on every field that returns a non-scalar type
        if (requireResolversForNonScalar &&
            !(graphql_1.getNamedType(field.type) instanceof graphql_1.GraphQLScalarType)) {
            expectResolveFunction(field, typeName, fieldName);
        }
    });
}
exports.assertResolveFunctionsPresent = assertResolveFunctionsPresent;
function expectResolveFunction(field, typeName, fieldName) {
    if (!field.resolve) {
        console.warn(
        // tslint:disable-next-line: max-line-length
        "Resolve function missing for \"" + typeName + "." + fieldName + "\". To disable this warning check https://github.com/apollostack/graphql-tools/issues/131");
        return;
    }
    if (typeof field.resolve !== 'function') {
        throw new SchemaError("Resolver \"" + typeName + "." + fieldName + "\" must be a function");
    }
}
function addErrorLoggingToSchema(schema, logger) {
    if (!logger) {
        throw new Error('Must provide a logger');
    }
    if (typeof logger.log !== 'function') {
        throw new Error('Logger.log must be a function');
    }
    forEachField(schema, function (field, typeName, fieldName) {
        var errorHint = typeName + "." + fieldName;
        field.resolve = decorateWithLogger(field.resolve, logger, errorHint);
    });
}
exports.addErrorLoggingToSchema = addErrorLoggingToSchema;
// XXX badly named function. this doesn't really wrap, it just chains resolvers...
function wrapResolver(innerResolver, outerResolver) {
    return function (obj, args, ctx, info) {
        return Promise.resolve(outerResolver(obj, args, ctx, info)).then(function (root) {
            if (innerResolver) {
                return innerResolver(root, args, ctx, info);
            }
            return graphql_1.defaultFieldResolver(root, args, ctx, info);
        });
    };
}
function chainResolvers(resolvers) {
    return function (root, args, ctx, info) {
        return resolvers.reduce(function (prev, curResolver) {
            if (curResolver) {
                return curResolver(prev, args, ctx, info);
            }
            return graphql_1.defaultFieldResolver(prev, args, ctx, info);
        }, root);
    };
}
exports.chainResolvers = chainResolvers;
/*
 * fn: The function to decorate with the logger
 * logger: an object instance of type Logger
 * hint: an optional hint to add to the error's message
 */
function decorateWithLogger(fn, logger, hint) {
    if (typeof fn === 'undefined') {
        fn = graphql_1.defaultFieldResolver;
    }
    var logError = function (e) {
        // TODO: clone the error properly
        var newE = new Error();
        newE.stack = e.stack;
        /* istanbul ignore else: always get the hint from addErrorLoggingToSchema */
        if (hint) {
            newE['originalMessage'] = e.message;
            newE['message'] = "Error in resolver " + hint + "\n" + e.message;
        }
        logger.log(newE);
    };
    return function (root, args, ctx, info) {
        try {
            var result = fn(root, args, ctx, info);
            // If the resolve function returns a Promise log any Promise rejects.
            if (result &&
                typeof result.then === 'function' &&
                typeof result.catch === 'function') {
                result.catch(function (reason) {
                    // make sure that it's an error we're logging.
                    var error = reason instanceof Error ? reason : new Error(reason);
                    logError(error);
                    // We don't want to leave an unhandled exception so pass on error.
                    return reason;
                });
            }
            return result;
        }
        catch (e) {
            logError(e);
            // we want to pass on the error, just in case.
            throw e;
        }
    };
}
function addCatchUndefinedToSchema(schema) {
    forEachField(schema, function (field, typeName, fieldName) {
        var errorHint = typeName + "." + fieldName;
        field.resolve = decorateToCatchUndefined(field.resolve, errorHint);
    });
}
exports.addCatchUndefinedToSchema = addCatchUndefinedToSchema;
function decorateToCatchUndefined(fn, hint) {
    if (typeof fn === 'undefined') {
        fn = graphql_1.defaultFieldResolver;
    }
    return function (root, args, ctx, info) {
        var result = fn(root, args, ctx, info);
        if (typeof result === 'undefined') {
            throw new Error("Resolve function for \"" + hint + "\" returned undefined");
        }
        return result;
    };
}
// XXX this function only works for resolvers
// XXX very hacky way to remember if the function
// already ran for this request. This will only work
// if people don't actually cache the operation.
// if they do cache the operation, they will have to
// manually remove the __runAtMostOnce before every request.
function runAtMostOncePerRequest(fn) {
    var value;
    var randomNumber = Math.random();
    return function (root, args, ctx, info) {
        if (!info.operation['__runAtMostOnce']) {
            info.operation['__runAtMostOnce'] = {};
        }
        if (!info.operation['__runAtMostOnce'][randomNumber]) {
            info.operation['__runAtMostOnce'][randomNumber] = true;
            value = fn(root, args, ctx, info);
        }
        return value;
    };
}
function attachDirectiveResolvers(schema, directiveResolvers) {
    if (typeof directiveResolvers !== 'object') {
        throw new Error("Expected directiveResolvers to be of type object, got " + typeof directiveResolvers);
    }
    if (Array.isArray(directiveResolvers)) {
        throw new Error('Expected directiveResolvers to be of type object, got Array');
    }
    var schemaDirectives = Object.create(null);
    Object.keys(directiveResolvers).forEach(function (directiveName) {
        schemaDirectives[directiveName] = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.visitFieldDefinition = function (field) {
                var _this = this;
                var resolver = directiveResolvers[directiveName];
                var originalResolver = field.resolve || graphql_1.defaultFieldResolver;
                var directiveArgs = this.args;
                field.resolve = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var source = args[0], context = args[2], info = args[3];
                    return resolver(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, originalResolver.apply(field, args)];
                    }); }); }, source, directiveArgs, context, info);
                };
            };
            return class_1;
        }(schemaVisitor_1.SchemaDirectiveVisitor));
    });
    schemaVisitor_1.SchemaDirectiveVisitor.visitSchemaDirectives(schema, schemaDirectives);
}
exports.attachDirectiveResolvers = attachDirectiveResolvers;
//# sourceMappingURL=schemaGenerator.js.map