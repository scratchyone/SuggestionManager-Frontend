import { useRouter } from 'next/router';
import { React } from 'react';
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
        <div className="setup_button_wrapper">
          <button
            className="setup_button thank_back_button"
            onClick={() => router.back()}
          >
            Submit Another
          </button>
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
