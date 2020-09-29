export function Field(props) {
  return (
    <div className="field_wrapper">
      <div className="field_label">{props.label}</div>
      {props.textArea ? (
        <textarea
          className="field_input"
          type={props.type}
          value={props.value}
          onChange={props.onChange}
        ></textarea>
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
import formatDistance from 'date-fns/formatDistance';
import add from 'date-fns/add';
import { gql, useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
export function Suggestion(props) {
  const [deleteSuggestion, {}] = useMutation(gql`
    mutation deleteSuggestion($key: String!, $id: Int!) {
      deleteSuggestion(key: $key, id: $id) {
        id
      }
    }
  `);
  const [undeleteSuggestion, {}] = useMutation(gql`
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
          <div className="suggestion_displayname">{props.displayName}</div>
          <div className="suggestion_desc">{props.description}</div>
        </div>
        <div
          className="suggestion_right"
          title={props.inTrash ? 'Restore Suggestion' : 'Delete Suggestion'}
        >
          {props.inTrash ? (
            <i
              class="fas fa-undo"
              onClick={() => {
                undeleteSuggestion({
                  variables: { key: props.token, id: props.id },
                });
                props.refetch();
              }}
            ></i>
          ) : (
            <i
              class="fas fa-trash-alt"
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
