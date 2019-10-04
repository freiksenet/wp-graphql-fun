const { createHttpLink } = require(`apollo-link-http`)
const fetch = require("node-fetch")

exports.createClient = async (
  { createLink, url, headers, fetchOptions } = { headers: {}, fetchOptions: {} }
) => {
  let link
  if (createLink) {
    link = await createLink(options)
  } else {
    link = createHttpLink({
      uri: url,
      fetch,
      headers,
      fetchOptions,
    })
  }

  return link
}
