"use server";

import { revalidateTag } from "next/cache";

export async function create_conversation(email: string) {
  const res = fetch(`${process.env.SERVER_URL}/conversations/`, {
    body: JSON.stringify({
      participant: email,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }).then(async (val) => val.json());

  revalidateTag("conversation_list");

  return res;
}

export async function join_conversation(
  conversation_id: string,
  participant: string
) {
  const res = fetch(`${process.env.SERVER_URL}/conversations/join/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      participant: participant,
      conversation_id: conversation_id,
    }),
  }).then(async (val) => val.json());

  return res;
}

export async function get_conversations(email: string) {
  const res = fetch(`${process.env.SERVER_URL}/conversations/${email}`, {
    next: { tags: ["conversation_list"] },
  }).then((val) => val.json());

  return res;
}
export async function verify_participant(
  conversation_id: string,
  participant: string
) {
  const res = fetch(
    `${process.env.SERVER_URL}/conversations/verify/${conversation_id}/${participant}`,
    {}
  ).then(async (val) => val.json());

  return res;
}
