import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch('/setup');
  }, []);
  let ready = true;
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
          className={ready ? 'homescreen_getstarted' : 'homescreen_comingsoon'}
          onClick={() => ready && router.push('/setup')}
        >
          {ready ? 'Get Started' : 'Coming Soon'}
        </button>
      </div>
      <div className="homescreen_box_holder">
        <div className="homescreen_box">
          <div className="homescreen_why">
            Why should you use SuggestionManager?
          </div>
          <div className="homescreen_reasons">
            <div className="homescreen_reason">
              <i class="fas fa-check"></i> No signup required
            </div>
            <div className="homescreen_reason">
              <i class="fas fa-check"></i> Easy to setup
            </div>
            <div className="homescreen_reason">
              <i class="fas fa-check"></i> 100% Free
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
