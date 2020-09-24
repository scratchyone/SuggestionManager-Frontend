import { useState, useHook } from 'react';
import { useRouter } from 'next/router';
import { Field } from '../../components/main.js';
import { gql, useMutation } from '@apollo/client';
import Head from 'next/head';
export default function Setup() {
  const router = useRouter();
  const [ownerName, setOwnerName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [newProject, { error, data }] = useMutation(gql`
    mutation newProject($ownerName: String!, $projectName: String!) {
      newProject(ownerName: $ownerName, projectName: $projectName) {
        tokens {
          key
        }
      }
    }
  `);
  if (data) {
    console.log(data);
    router.push('/manager/' + data.newProject.tokens[0].key);
  }
  return (
    <div className="floating_bg_box">
      <Head>
        <title>Create a new SuggestionManager Project</title>
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
        <div className="error">
          {error && error.networkError.result.errors[0].message}
        </div>
        <div className="setup_button_wrapper">
          <button
            className="setup_button"
            onClick={() => {
              newProject({
                variables: { ownerName: ownerName, projectName: projectName },
              });
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
