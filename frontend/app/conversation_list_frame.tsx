import { RoomActions } from "./room_actions";
import { auth } from "./api/auth/[...nextauth]/auth";
import Link from "next/link";
import { get_conversations } from "./actions/conversations";

export async function ConversationListFrame() {
  const session = await auth();
  const conversations = await get_conversations(session?.user?.email!);

  return (
    <div className="flex flex-col w-full  bg-slate-200 p-6 min-h-96 rounded-lg border border-slate-400">
      <div>
        <div className="font-bold text-2xl">Conversations</div>
        <RoomActions email={session!.user!.email!} />
        <div className="border border-slate-400 rounded m-2 flex flex-col divide-y divide-slate-400">
          {conversations.map((val: any, index: number) => {
            return (
              <Link
                key={val._id}
                className="p-4 hover:bg-slate-400/50"
                href={"/?conId=" + val._id}
              >
                {index + 1}) {val._id}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
