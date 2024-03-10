import { Suspense } from "react";
import { auth } from "./api/auth/[...nextauth]/auth";
import { MessageFrame } from "./message-frame";
import { ConversationListFrame } from "./conversation_list_frame";
import { get_messages } from "./actions/messages";
import { verify_participant } from "./actions/conversations";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session) {
    return <div>UNAUTHENTICATED</div>;
  }

  if (searchParams.conId) {
    const verify = await verify_participant(searchParams.conId.toString(), session.user?.email!);
    if (!verify._id) {
      throw new Error(verify)
    }
  }

  const messages = searchParams.conId ? await get_messages(searchParams.conId.toString()) : [];

  return (
    <div className="h-full flex place-items-center">
      {searchParams.conId ? (
        <Suspense fallback={<div>Loading...</div>}>
          <MessageFrame session={session} initialMessages={messages} />
        </Suspense>
      ) : (
        <ConversationListFrame />
      )}
    </div>
  );
}
