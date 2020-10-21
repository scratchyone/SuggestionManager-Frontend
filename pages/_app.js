import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { GQL, MAINTENANCE } from '../components/constants.js';
const client = new ApolloClient({
  // uri: 'https://backend.suggestionmanager.com/graphql',
  uri: GQL,
  cache: new InMemoryCache(),
});
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    if (MAINTENANCE && router.pathname !== '/') {
      router.push('/');
    }
  }, []);
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
