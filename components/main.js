export function Field(props) {
  return (
    <div className="field_wrapper">
      <div className="field_label">{props.label}</div>
      <input
        className="field_input"
        type={props.type}
        value={props.value}
        onChange={props.onChange}
      ></input>
    </div>
  );
}
import { gql, useMutation, useQuery } from '@apollo/client';
export function Suggestion(props) {
  const [deleteSuggestion, { error, data }] = useMutation(gql`
    mutation deleteSuggestion($key: String!, $id: Int!) {
      deleteSuggestion(key: $key, id: $id) {
        id
      }
    }
  `);
  return (
    <div className="suggestion_wrapper">
      <div className="suggestion_left">
        <div className="suggestion_displayname">{props.displayName}</div>
        <div className="suggestion_desc">{props.description}</div>
      </div>
      <div className="suggestion_right" title="Delete Suggestion">
        <i
          class="fas fa-trash-alt"
          onClick={() => {
            deleteSuggestion({
              variables: { key: props.token, id: props.id },
            });
            props.refetch();
          }}
        ></i>
      </div>
    </div>
  );
}
