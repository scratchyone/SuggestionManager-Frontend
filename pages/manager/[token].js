import { useRouter } from 'next/router';
import Link from 'next/link';
import copy from 'clipboard-copy';
import { gql, useMutation, useQuery } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import { ProjectTitle, Suggestion } from '../../components/main.js';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import React from 'react';
import { Slide } from 'react-toastify';
export default function Manager(props) {
  const router = useRouter();
  const [origTimestamp, setOrigTimestamp] = useState(null);
  const { token } = router.query;
  const [refreshLastRead] = useMutation(gql`
    mutation refreshLastRead($key: String!) {
      refreshLastRead(key: $key)
    }
  `);
  var { error, data, refetch } = useQuery(
    gql`
      query getProject($key: String!) {
        project(key: $key) {
          projectName
          lastReadTimestamp
          suggestions {
            id
            displayName
            suggestionText
            timestamp
            inTrash
          }
          tokens {
            key
            permission
          }
        }
      }
    `,
    { variables: { key: token || props.token } }
  );
  useEffect(() => {
    if (data) {
      if (!origTimestamp) setOrigTimestamp(data.project.lastReadTimestamp);
      refreshLastRead({ variables: { key: token || props.token } });
    }
  }, [data]);
  if (data)
    if (!origTimestamp) setOrigTimestamp(data.project.lastReadTimestamp);
  if (error) console.log(error.networkError.result.errors[0].message);
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
            data
              ? data.project.projectName + ' on SuggestionManager'
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
          name={data ? data.project.projectName : <br></br>}
          token={token || props.token}
        />
        <div className="subtext">Remember, your URL is your admin password</div>
        <div className="manager_new_suggestions">
          {data &&
            (data.project.suggestions.filter(
              (s) => s.timestamp > (origTimestamp || Date.now())
            ).length === 0
              ? 'No'
              : data.project.suggestions.filter(
                  (s) => s.timestamp > (origTimestamp || Date.now())
                ).length)}{' '}
          New Suggestion
          {data &&
            (data.project.suggestions.filter(
              (s) => s.timestamp > (origTimestamp || Date.now())
            ).length === 1
              ? ''
              : 's')}
          <Link href={`/suggestions/${token}`}>
            <a className="manager_view_all">View All</a>
          </Link>
        </div>
        <div className="suggestions_holder">
          {data &&
            data.project.suggestions
              .filter((s) => s.timestamp > (origTimestamp || Date.now()))
              .filter((s) => !s.inTrash)
              .map((s) => (
                <Suggestion
                  displayName={s.displayName}
                  description={s.suggestionText}
                  token={token || props.token}
                  id={s.id}
                  refetch={refetch}
                  toast={toast}
                  timestamp={s.timestamp}
                  key={s.id}
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
                      data.project.tokens.find(
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
            onClick={() => 4 /*router.push('/capability/454435435345435')*/}
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
