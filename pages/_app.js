import '../styles/globals.css';
import 'sweetalert2/src/sweetalert2.scss';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { MAINTENANCE } from '../components/constants.js';
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    if (MAINTENANCE && router.pathname !== '/') {
      router.push('/');
    }
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
