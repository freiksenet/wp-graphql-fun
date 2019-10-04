const { HttpLink } = require("apollo-link-http")
const fetch = require("node-fetch")

exports.createClient = async ({ createLink, url }) => {
  let link
  if (createLink) {
    link = await createLink(options)
  } else {
    const link = new HttpLink({ uri: url, fetch })
  }

  return link
}
