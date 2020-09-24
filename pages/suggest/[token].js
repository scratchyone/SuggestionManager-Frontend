import { useRouter } from 'next/router';
import { useState, useHook, useEffect } from 'react';
import { Field } from '../../components/main.js';
import { gql, useMutation, useQuery } from '@apollo/client';
import Head from 'next/head';
export default function Suggest(props) {
  const router = useRouter();
  const { token } = router.query;
  const [displayName, setDisplayName] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  var { loading, error, data, refetch } = useQuery(
    gql`
      query getProject($key: String!) {
        project(key: $key) {
          projectName
        }
      }
    `,
    { variables: { key: token || props.token } }
  );
  const [addSuggestion, { error: aserror, data: asdata }] = useMutation(gql`
    mutation addSuggestion(
      $displayName: String!
      $suggestionText: String!
      $key: String!
    ) {
      addSuggestion(
        displayName: $displayName
        suggestionText: $suggestionText
        key: $key
      ) {
        project {
          projectName
        }
      }
    }
  `);
  useEffect(() => {
    if (data) router.prefetch('/thank/' + data.project.projectName);
  }, [data]);
  if (asdata) {
    router.push('/thank/' + data.project.projectName);
  }
  return (
    <div className="floating_bg_box">
      <Head>
        <title>
          {data
            ? 'Submit a suggestion for ' + data.project.projectName
            : 'Submit a suggestion'}
        </title>
        <meta
          content={
            data
              ? 'Submit a suggestion for ' + data.project.projectName
              : 'Submit a suggestion'
          }
          property="og:title"
        />
        <meta
          content="SuggestionManager lets you submit suggestions to your favorite projects, quickly and easily."
          property="og:description"
        />
        <meta content="SuggestionManager" property="og:site_name" />
      </Head>
      <div className="floating_card setup_card">
        <div className="setup_title">Add a suggestion</div>
        <div className="suggest_subtext">
          {data && data.project.projectName}
        </div>
        <Field
          label="Suggestion"
          type="text"
          value={suggestionText}
          onChange={(e) => setSuggestionText(e.target.value)}
        />
        <Field
          label="Your Display Name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <div className="error">
          {aserror && aserror.networkError.result.errors[0].message}
        </div>
        <div className="setup_button_wrapper">
          <button
            className="setup_button"
            onClick={() => {
              addSuggestion({
                variables: { displayName, suggestionText, key: token },
              });
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  const { token } = context.params;
  return {
    props: { token },
  };
}
