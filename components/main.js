import TextareaAutosize from 'react-textarea-autosize';
import React from 'react';
import Link from 'next/link';

export function Field(props) {
  return (
    <div className="field_wrapper">
      <div className="field_label">{props.label}</div>
      {props.textArea ? (
        <TextareaAutosize
          className="field_input"
          type={props.type}
          maxRows={8}
          value={props.value}
          onChange={props.onChange}
        ></TextareaAutosize>
      ) : (
        <input
          className="field_input"
          type={props.type}
          value={props.value}
          onChange={props.onChange}
        ></input>
      )}
    </div>
  );
}
export function ProjectTitle(props) {
  return (
    <Link href={`/manager/${props.token}`}>
      <a className="manager_title">{props.name}</a>
    </Link>
  );
}
import formatDistance from 'date-fns/formatDistance';
import add from 'date-fns/add';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
export function Suggestion(props) {
  const [deleteSuggestion] = useMutation(gql`
    mutation deleteSuggestion($key: String!, $id: Int!) {
      deleteSuggestion(key: $key, id: $id) {
        id
      }
    }
  `);
  const [undeleteSuggestion] = useMutation(gql`
    mutation undeleteSuggestion($key: String!, $id: Int!) {
      undeleteSuggestion(key: $key, id: $id) {
        id
      }
    }
  `);
  return (
    <div className="suggestion_columns">
      <div className="suggestion_wrapper">
        <div className="suggestion_left">
          <div className="suggestion_displayname">
            {props.displayName}{' '}
            {!props.inTrash && (
              <span className="suggestion_timestamp">
                {formatDistance(new Date(props.timestamp * 1000), Date.now(), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
          <div className="suggestion_desc">{props.description}</div>
        </div>
        <div
          className="suggestion_right"
          title={props.inTrash ? 'Restore Suggestion' : 'Delete Suggestion'}
        >
          {props.inTrash ? (
            <i
              className="fas fa-undo"
              onClick={() => {
                undeleteSuggestion({
                  variables: { key: props.token, id: props.id },
                });
                props.refetch();
              }}
            ></i>
          ) : (
            <i
              className="fas fa-trash-alt"
              onClick={() => {
                deleteSuggestion({
                  variables: { key: props.token, id: props.id },
                });
                props.refetch();
                toast.info('Moved suggestion to trash');
              }}
            ></i>
          )}
        </div>
      </div>
      {props.inTrash && (
        <div className="trash_countdown">
          Deleting{' '}
          {formatDistance(
            add(new Date(props.trashedTimestamp * 1000), { days: 5 }),
            Date.now(),
            {
              addSuffix: true,
            }
          )}
        </div>
      )}
    </div>
  );
}
