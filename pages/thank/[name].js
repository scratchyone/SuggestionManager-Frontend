import { useRouter } from 'next/router';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import ClipboardJS from 'clipboard';
import { Suggestion } from '../../components/main.js';
import Head from 'next/head';
export default function Manager(props) {
  const router = useRouter();
  const { name } = router.query;
  return (
    <div className="floating_bg_box">
      <Head>
        <title>Thanks for submitting!</title>
      </Head>
      <div className="floating_card manager_card">
        <div className="thank_text">
          Thanks so much for submitting to {name || props.name}!
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  const { name } = context.params;
  return {
    props: { name },
  };
}
