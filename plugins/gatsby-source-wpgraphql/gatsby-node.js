const { parse, print, Kind } = require("graphql")
const { createClient } = require("./create-client")
const { HttpLink } = require("apollo-link-http")
const { introspectSchema } = require("apollo-server")
const fetch = require("node-fetch")

const DEFAULT_TYPE_CONFIG = {
  MediaType: {
    onCreateNode: obj => {
      createRemoteFileNode({
        url: obj.sourceUrl,
      })
    },
  },
}

let CLIENT

exports.onPreBootstrap = (_, options) => {
  CLIENT = createClient({ url: options.url })
}

exports.createSchemaCustomization = async ({ actions }, options) => {
  const link = new HttpLink({ uri: options.url, fetch })
  const introspection = await introspectSchema(link)
  console.log(introspection)

  const typesToCreate = Object.keys(options.types)
  const types = []
  for (const type of typesToCreate) {
    const typeIntrospection = introspection.data.__schema.types.find(
      ({ name }) => name === type
    )
    const fields = {}
    typeIntrospection.fields.forEach(field => {
      const namedType = getNamedTyped()
      if (field.type.kind === "SCALAR") {
        fields[field.name] = {
          type: typeStringFromIntrospection(field.type),
        }
      }
    })
    types.push(
      schema.buildObjectType({
        name: type,
        fields,
        extensions: {
          infer: false,
        },
      })
    )
  }
}

const typeStringFromIntrospection = type => {
  if (type.kind === "LIST") {
    return `[${typeStringFromIntrospection(type.ofType)}]`
  } else if (type.kind === "NON_NULL") {
    return `${typeStringFromIntrospection(type.ofType)}!`
  } else {
    return type.name
  }
}

const getNamedType = type => {
  if (type.kind === "LIST" || type.kind === "NON_NULL") {
    return getNamedType(type.ofType)
  } else {
    return type
  }
}

const consructQueryForType = (type, queryHeader, nodeTypes, inlineTypes) => {
  const queryHeaderDoc = parse(`query { ${queryHeader} }`)
  const header = queryHeaderDoc.definitions[0].selectionSet.selections[0]
  const selections = []
  type.fields.forEach(field => {
    if (field.type.kind === "SCALAR") {
      selections.push({
        kind: Kind.FIELD_NODE,
        name: {
          kind: Kind.NAME_NODE,
          value: field.name,
        },
      })
    } else if (field.type.kind === "OBJECT") {
      if (nodeTypes[field.type.name]) {
      } else if (inlineTypes[field.type.name]) {
      }
    }
  })
}

const ID_SELECTION_FRAGMENT = {
  kind: Kind.INLINE_FRAGMENT_NODE,
  selectionSet: {
    kind: Kind.SELECTION_SET_NODE,
    selections: [
      {
        kind: Kind.FIELD_NODE,
        name: {
          kind: Kind.NAME_NODE,
          value: "id",
        },
      },
    ],
  },
}

exports.sourceNodes = ({ actions }) => {}
