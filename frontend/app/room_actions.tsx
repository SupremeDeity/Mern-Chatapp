"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  create_conversation,
  join_conversation,
} from "./actions/conversations";

export function RoomActions({ email }: { email: string }) {
  const router = useRouter();
  const [conversationId, setConversationId] = useState("");

  const create = async () => {
    const res = await create_conversation(email);
    if (res.acknowledged) router.push("/?conId=" + res.insertedId);
    else {
      alert(res);
    }
  };

  const join = async () => {
    const res = await join_conversation(conversationId, email);
    if (res._id) router.push("/?conId=" + res._id);
    else {
      alert(res)
    }
  };

  return (
    <div className="flex justify-between p-4 border border-slate-400 rounded m-2">
      <Button onClick={create}>Create Room</Button>
      <fieldset className="flex gap-x-2">
        <Input
          value={conversationId}
          onChange={(e) => setConversationId(e.target.value)}
          className=""
          placeholder="Enter Room ID"
          maxLength={24}
        />
        <Button onClick={join}>Join Room</Button>
      </fieldset>
    </div>
  );
}
