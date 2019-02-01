// import "cross-fetch/polyfill";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { withClientState } from "apollo-link-state";
import { defaults, resolvers } from "./clientQueries";
import { getTokenFromAsyncStorage } from "../utils/handleAsyncStorage";
import { getAPIUrl } from "../env.config";

// ================= PROD =================
const GRAPHQL_URL = getAPIUrl("prod");
// ========================================
// const GRAPHQL_URL = getAPIUrl("dev");

const initApollo = () => {
  const httpLink = createUploadLink({
    uri: GRAPHQL_URL,
    credentials: "same-origin"
  });

  const authLink = setContext(async (_, { headers }) => {
    let token;
    try {
      token = await getTokenFromAsyncStorage();
    } catch (err) {
      console.log(`Can't get a token`, err);
    }
    return {
      headers: {
        ...headers,
        authorization: token ? `${token}` : ""
      }
    };
  });

  const cache = new InMemoryCache();

  const stateLink = withClientState({
    defaults,
    resolvers
  });

  return new ApolloClient({
    link: ApolloLink.from([authLink, stateLink, httpLink]),
    cache
  });
};

export default App =>
  class WithApollo extends React.Component {
    constructor(props) {
      super(props);
      this.client = initApollo();
    }
    render() {
      return (
        <ApolloProvider client={this.client}>
          <App />
        </ApolloProvider>
      );
    }
  };
