import { useRouter } from 'next/router';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import {
  Suggestion,
  ProjectTitle,
  useToken,
  useProject,
} from '../../components/main.js';
import Head from 'next/head';
import { useEffect } from 'react';
import add from 'date-fns/add';
import compareAsc from 'date-fns/compareAsc';
import Swal from 'sweetalert2';
export default function Suggestions(props) {
  const router = useRouter();
  const { token } = router.query;
  useEffect(() => {
    router.prefetch('/suggestions/' + (token || props.token));
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
  let filt = (s) =>
    s.inTrash &&
    compareAsc(
      add(new Date(s.trashedTimestamp * 1000), { days: 5 }),
      Date.now()
    ) == 1;
  return (
    <div className="floating_bg_box">
      <Head>
        <meta name="robots" content="noindex" />
        <title>
          {project
            ? 'Trashed Suggestions for ' + project.projectName
            : 'Trashed Suggestions'}
        </title>
        <meta
          content={
            project
              ? 'Trashed Suggestions for ' + project.projectName
              : 'Trashed Suggestions'
          }
          property="og:title"
        />
        <meta
          content="SuggestionManager lets you get ideas from your users, quickly and easily."
          property="og:description"
        />
        <meta content="SuggestionManager" property="og:site_name" />
      </Head>
      <ToastContainer />
      <div className="floating_card manager_card">
        <div className="trash_title_wrapper">
          <ProjectTitle
            name={project ? project.projectName : <br></br>}
            token={token || props.token}
          />
          <div className="trash_indicator">Trash</div>
        </div>
        <div className="subtext">
          Items will be permanently deleted after 5 days
        </div>
        <div className="suggestions_holder">
          {project &&
            (project.suggestions.filter(filt).length ? (
              [...project.suggestions.filter(filt)]
                .sort((a, b) => b.trashedTimestamp - a.trashedTimestamp)
                .map((s) => (
                  <Suggestion
                    displayName={s.displayName}
                    description={s.suggestionText}
                    token={token || props.token}
                    id={s.id}
                    refetch={mutate}
                    inTrash={s.inTrash}
                    trashedTimestamp={s.trashedTimestamp}
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
              router.push('/suggestions/' + (token || props.token));
            }}
          >
            Go Back
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
