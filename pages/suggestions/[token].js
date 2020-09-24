import { useRouter } from 'next/router';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Suggestion } from '../../components/main.js';
import Head from 'next/head';
export default function Suggestions(props) {
  const router = useRouter();
  const { token } = router.query;
  var { loading, error, data, refetch } = useQuery(
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
        }
      }
    `,
    { variables: { key: token || props.token } }
  );
  return (
    <div className="floating_bg_box">
      <Head>
        <title>
          {data ? 'Suggestions for ' + data.project.projectName : 'Suggestions'}
        </title>
        <meta
          content={
            data ? 'Suggestions for ' + data.project.projectName : 'Suggestions'
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
        <div className="manager_title">
          {data ? data.project.projectName : <br></br>}
        </div>
        <div className="suggestions_holder">
          {data &&
            (data.project.suggestions.filter((s) => !s.inTrash).length ? (
              data.project.suggestions
                .filter((s) => !s.inTrash)
                .map((s) => (
                  <Suggestion
                    displayName={s.displayName}
                    description={s.suggestionText}
                    token={token || props.token}
                    id={s.id}
                    refetch={refetch}
                  />
                ))
            ) : (
              <div className="subtext">No Suggestions</div>
            ))}
        </div>
        <div className="setup_button_wrapper">
          <button className="setup_button">View Trash</button>
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
