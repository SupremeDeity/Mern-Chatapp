"use server";

export async function get_messages(conversation_id: string) {
  const res = fetch(
    `${process.env.SERVER_URL}/messages/${conversation_id}`
  ).then((val) => val.json());

  return res;
}

export async function send_message(
  conversation_id: string,
  author: string,
  content: string,
  author_img?: string | null
) {
  const body = JSON.stringify({
    conversation_id: conversation_id,
    author: author,
    author_img: author_img,
    content: content,
  });

  const res = fetch(`${process.env.SERVER_URL}/messages/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  }).then((val) => val.json());

  return res;
}
