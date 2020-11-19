import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Link from 'next/link';
import copy from 'clipboard-copy';
import { ToastContainer, toast } from 'react-toastify';
import {
  deleteProject,
  patchProject,
  ProjectTitle,
  Suggestion,
  useProject,
  useToken,
} from '../../components/main.js';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import React from 'react';
import { Slide } from 'react-toastify';
export default function Manager(props) {
  const router = useRouter();
  const [origTimestamp, setOrigTimestamp] = useState(null);
  const { token } = router.query;
  const { data: tokenData, error } = useToken(token || props.token);
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
  useEffect(() => {
    if (project) {
      if (project.error) {
        Swal.fire('Deleted Project', 'This project has been deleted', 'error');
      }
      if (!origTimestamp) setOrigTimestamp(project.lastReadTimestamp);
      patchProject(tokenData.projectId, token || props.token, {
        lastReadTimestamp: Math.round(Date.now() / 1000),
      });
    }
  }, [project]);
  if (project) if (!origTimestamp) setOrigTimestamp(project.lastReadTimestamp);
  const [_document, set_document] = React.useState(null);
  React.useEffect(() => {
    set_document(document);
  }, []);
  if (error) {
    console.log(error);
    router.push('/');
  }
  return (
    <div className="floating_bg_box">
      <Head>
        <title>SuggestionManager Project</title>
        <meta
          content={
            project
              ? project.projectName + ' on SuggestionManager'
              : 'SuggestionManager Project'
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
        <div className="subtext">Remember, your URL is your admin password</div>
        <div className="manager_new_suggestions">
          {project &&
            (project.suggestions.filter(
              (s) => s.timestamp > (origTimestamp || Date.now()) && !s.inTrash
            ).length === 0
              ? 'No'
              : project.suggestions.filter(
                  (s) =>
                    s.timestamp > (origTimestamp || Date.now()) && !s.inTrash
                ).length)}{' '}
          New Suggestion
          {project &&
            (project.suggestions.filter(
              (s) => s.timestamp > (origTimestamp || Date.now()) && !s.inTrash
            ).length === 1
              ? ''
              : 's')}
          <Link href={`/suggestions/${token}`}>
            <a className="manager_view_all">View All</a>
          </Link>
        </div>
        <div className="suggestions_holder">
          {project &&
            project.suggestions
              .filter((s) => s.timestamp > (origTimestamp || Date.now()))
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
              ))}
        </div>
        <div className="manager_button_wrapper">
          <button
            className="manager_button share_button"
            onClick={() => {
              _document &&
                copy(
                  new URL(
                    '/suggest/' +
                      project.tokens.find(
                        (n) => n.permission === 'ADD_SUGGESTIONS'
                      ).key,
                    _document.baseURI
                  ).href
                );
              toast.info('Copied suggestion submission link');
            }}
          >
            Share
          </button>
          <div className="manager_button_padding" />
          <button
            className="manager_button delete_button"
            onClick={() =>
              Swal.fire({
                title: 'Are you sure?',
                text: "Once a project is deleted, it's gone forever",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await deleteProject(project.id, token || props.token);
                  Swal.fire(
                    'Deleted!',
                    'Your project has been deleted.',
                    'success'
                  ).then(() => router.push('/'));
                }
              })
            }
          >
            Delete Project
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
