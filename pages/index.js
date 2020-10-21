import { useRouter } from 'next/router';
import { React, useEffect } from 'react';
import Head from 'next/head';
import { MAINTENANCE } from '../components/constants';
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch('/setup');
  }, []);
  return (
    <div className="homescreen_background">
      <Head>
        <title>Take Suggestions, Quickly</title>
        <meta content="Take Suggestions, Quickly" property="og:title" />
        <meta
          content="SuggestionManager lets you get ideas from your users, quickly and easily."
          property="og:description"
        />
        <meta content="SuggestionManager" property="og:site_name" />
      </Head>
      <div className="homescreen_cover">
        <div className="homescreen_tagline">Take Suggestions, Quickly</div>
        <div className="homescreen_desc">
          SuggestionManager lets you get ideas from your users, quickly and
          easily.
        </div>
        <button
          className={
            !MAINTENANCE ? 'homescreen_getstarted' : 'homescreen_comingsoon'
          }
          onClick={() => !MAINTENANCE && router.push('/setup')}
        >
          {!MAINTENANCE ? 'Get Started' : 'Under Maintenance'}
        </button>
      </div>
      <div className="homescreen_box_holder">
        <div className="homescreen_box">
          <div className="homescreen_why">
            Why should you use SuggestionManager?
          </div>
          <div className="homescreen_reasons">
            <div className="homescreen_reason">
              <i className="fas fa-check"></i> No signup required
            </div>
            <div className="homescreen_reason">
              <i className="fas fa-check"></i> Easy to setup
            </div>
            <div className="homescreen_reason">
              <i className="fas fa-check"></i> 100% Free
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
