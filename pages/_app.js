import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
const client = new ApolloClient({
  // uri: 'https://backend.suggestionmanager.com/graphql',
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});
function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
