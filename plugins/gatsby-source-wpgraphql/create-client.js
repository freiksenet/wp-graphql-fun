const { createHttpLink } = require(`apollo-link-http`)

exports.createClient = async ({ createLink }) => {
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

    return link;
}