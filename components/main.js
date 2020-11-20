import TextareaAutosize from 'react-textarea-autosize';
import React from 'react';
import Link from 'next/link';
import { API_URL } from './constants';
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
      <a className="manager_title" role="heading" aria-level="1">
        {props.name}
      </a>
    </Link>
  );
}
import formatDistance from 'date-fns/formatDistance';
import add from 'date-fns/add';
import { toast } from 'react-toastify';
export function Suggestion(props) {
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
              onClick={async () => {
                await patchSuggestion(props.project.id, props.token, {
                  id: props.id,
                  inTrash: false,
                });
                props.refetch();
              }}
            ></i>
          ) : (
            <i
              className="fas fa-trash-alt"
              onClick={async () => {
                await patchSuggestion(props.project.id, props.token, {
                  id: props.id,
                  inTrash: true,
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

import useSWR from 'swr';
export const useProject = (id, token) => {
  return useSWR(
    id && `${API_URL}projects/${id}${token}`,
    async () =>
      await (
        await fetch(`${API_URL}projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).json()
  );
};
export const useToken = (token) => {
  return useSWR(
    `${API_URL}tokens/${token}`,
    async () => await (await fetch(`${API_URL}tokens/${token}`)).json()
  );
};
export async function addSuggestion(id, token, suggestion) {
  const res = await fetch(`${API_URL}projects/${id}/suggestions`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      displayName: suggestion.displayName,
      suggestionText: suggestion.suggestionText,
    }),
  });
  if (res.status !== 200)
    return { error: (await res.json()).error, success: false };
  else return { success: true };
}
export async function addProject(project) {
  const res = await fetch(`${API_URL}projects`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      ownerName: project.ownerName,
      projectName: project.projectName,
    }),
  });
  if (res.status !== 200)
    return { error: (await res.json()).error, success: false };
  else return { success: true, data: await res.json() };
}
export async function patchProject(id, token, project) {
  const res = await fetch(`${API_URL}projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(project),
  });
  if (res.status !== 200)
    return { error: (await res.json()).error, success: false };
  else return { success: true };
}
export async function deleteProject(id, token) {
  const res = await fetch(`${API_URL}projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'DELETE',
  });
  if (res.status !== 200)
    return { error: (await res.json()).error, success: false };
  else return { success: true };
}
export async function patchSuggestion(projectId, token, suggestion) {
  const res = await fetch(
    `${API_URL}projects/${projectId}/suggestions/${suggestion.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify(suggestion),
    }
  );
  if (res.status !== 200)
    return { error: (await res.json()).error, success: false };
  else return { success: true };
}
