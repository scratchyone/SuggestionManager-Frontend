import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

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
        <div className="homescreen_tagline">
          Take Suggestions,{' '}
          <span className="homescreen_tagline_highlight">
            Quickly And Easily
          </span>
        </div>
        <div className="homescreen_desc">
          SuggestionManager is the best way to get ideas from your users. No
          accounts are required, so every project is just a private link.{' '}
        </div>
        <button
          className={
            !MAINTENANCE ? 'homescreen_getstarted' : 'homescreen_comingsoon'
          }
          onClick={() => !MAINTENANCE && router.push('/setup')}
        >
          {!MAINTENANCE ? 'Create a Project' : 'Under Maintenance'}
        </button>
        <div className="homepage_cards">
          {[
            {
              heading: 'Open Source',
              subtitle: 'SuggestionManager is 100% Open Source',
            },
            {
              heading: 'No Accounts',
              subtitle: 'No account is needed to use SuggestionManager',
            },
            {
              heading: 'Simple',
              subtitle: 'SuggestionManager is designed to be easy to use',
            },
          ].map(({ heading, subtitle }) => (
            <FeatureCard heading={heading} subtitle={subtitle} key={heading} />
          ))}
        </div>
      </div>
    </div>
  );
}
function FeatureCard({ heading, subtitle }) {
  return (
    <div className="homepage_card">
      <div className="homepage_card_heading">{heading}</div>
      <div className="homepage_card_subtitle">{subtitle}</div>
    </div>
  );
}
