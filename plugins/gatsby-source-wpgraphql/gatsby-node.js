const { createClient } = require("./create-client")
const { introspectSchema } = require(`graphql-tools`)

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

exports.onPreBootstrap = () => {
  CLIENT = createClient()
}

exports.createSchemaCustomizatino = async ({ actions, options }) => {
  const introspection = await introspectSchema(CLIENT)
  const typesToCreate = Object.keys(options.types)
  for (const type of typesToCreate) {
    const typeIntrospection = introspection.data.__schema.types.find(
      ({ name }) => name === type
    )
    const fields = {}
    typeIntrospection.fields.forEach(field => {
      if (field.type.kind === "SCALAR") {
      }
    })
  }
}

exports.sourceNodes = ({ actions }) => {}
