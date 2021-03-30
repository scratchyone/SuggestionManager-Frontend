import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { addProject, Field } from '../../components/main.js';
import Head from 'next/head';
export default function Setup() {
  const router = useRouter();
  const [ownerName, setOwnerName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState(undefined);
  return (
    <div className="floating_bg_box">
      <Head>
        <title>Create a new SuggestionManager Project</title>
        <meta name="robots" content="noindex" />
        <meta
          content="Create a new SuggestionManager Project"
          property="og:title"
        />
        <meta
          content="SuggestionManager lets you get ideas from your users, quickly and easily."
          property="og:description"
        />
        <meta content="SuggestionManager" property="og:site_name" />
      </Head>
      <div className="floating_card setup_card">
        <div className="setup_title">Setup a project</div>
        <Field
          label="Project Name"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <Field
          label="Your Display Name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          type="text"
        />
        <div className="error">{error}</div>
        <div className="setup_button_wrapper">
          <button
            className="setup_button"
            onClick={async () => {
              const res = await addProject({
                ownerName,
                projectName,
              });
              if (res.error) setError(res.error);
              else
                router.push(
                  '/manager/' +
                    res.data.tokens.find(
                      (token) => token.permission === 'ADMIN'
                    ).key
                );
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
