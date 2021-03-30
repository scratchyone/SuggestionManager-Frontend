import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Field,
  useToken,
  useProject,
  addSuggestion,
} from '../../components/main.js';
import React from 'react';
import Head from 'next/head';
import Swal from 'sweetalert2';
export default function Suggest(props) {
  const router = useRouter();
  const { token } = router.query;
  const [displayName, setDisplayName] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const { data: tokenData } = useToken(token || props.token);
  const { data: project } = useProject(
    tokenData && tokenData.projectId,
    token || props.token
  );
  const [aserror, setAserror] = useState(undefined);
  useEffect(() => {
    if (project) router.prefetch('/thank/' + project.projectName);
  }, [project]);
  useEffect(() => {
    if (tokenData) {
      if (tokenData.error) {
        Swal.fire({
          title: 'Deleted Project',
          text: 'This project has been deleted',
          icon: 'error',
          showConfirmButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
      }
    }
  }, [tokenData]);
  return (
    <div className="floating_bg_box">
      <Head>
        <meta name="robots" content="noindex" />
        <title>
          {project
            ? 'Submit a suggestion for ' + project.projectName
            : 'Submit a suggestion'}
        </title>
        <meta
          content={
            project
              ? 'Submit a suggestion for ' + project.projectName
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
          {(project && project.projectName) || <br />}
        </div>
        <Field
          label="Suggestion"
          type="text"
          value={suggestionText}
          onChange={(e) => setSuggestionText(e.target.value)}
          textArea={true}
        />
        <Field
          label="Your Display Name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <div className="error">{aserror}</div>
        <div className="setup_button_wrapper">
          <button
            className="setup_button"
            onClick={async () => {
              const res = await addSuggestion(
                tokenData.projectId,
                token || props.token,
                {
                  displayName,
                  suggestionText,
                }
              );
              if (res.error) setAserror(res.error);
              else router.push('/thank/' + project.projectName);
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
