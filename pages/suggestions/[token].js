import { useRouter } from 'next/router';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  Suggestion,
  ProjectTitle,
  useToken,
  useProject,
} from '../../components/main.js';
import Head from 'next/head';
import { useEffect } from 'react';
import { Slide } from 'react-toastify';
import Swal from 'sweetalert2';
export default function Suggestions(props) {
  const router = useRouter();
  const { token } = router.query;
  useEffect(() => {
    router.prefetch('/suggestions_trash/' + (token || props.token));
  }, []);
  const { data: tokenData } = useToken(token || props.token);
  const { data: project, mutate } = useProject(
    tokenData && tokenData.projectId,
    token || props.token
  );
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
        <title>
          {project ? 'Suggestions for ' + project.projectName : 'Suggestions'}
        </title>
        <meta
          content={
            project ? 'Suggestions for ' + project.projectName : 'Suggestions'
          }
          property="og:title"
        />
        <meta
          content="SuggestionManager lets you get ideas from your users, quickly and easily."
          property="og:description"
        />
        <meta content="SuggestionManager" property="og:site_name" />
      </Head>
      <ToastContainer transition={Slide} />
      <div className="floating_card manager_card">
        <ProjectTitle
          name={project ? project.projectName : <br></br>}
          token={token || props.token}
        />
        <div className="suggestions_holder">
          {project &&
            (project.suggestions.filter((s) => !s.inTrash).length ? (
              project.suggestions
                .filter((s) => !s.inTrash)
                .map((s) => (
                  <Suggestion
                    displayName={s.displayName}
                    description={s.suggestionText}
                    token={token || props.token}
                    id={s.id}
                    refetch={mutate}
                    toast={toast}
                    timestamp={s.timestamp}
                    key={s.id}
                    project={project}
                  />
                ))
            ) : (
              <div className="subtext">No Suggestions</div>
            ))}
        </div>
        <div className="setup_button_wrapper">
          <button
            className="setup_button"
            onClick={() => {
              router.push('/suggestions_trash/' + (token || props.token));
            }}
          >
            View Trash
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
