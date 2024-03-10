"use client";
import { useEffect, useRef, useState } from "react";
import { DefaultSession, Session } from "next-auth";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { send_message } from "./actions/messages";
import io, { Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

let socket: Socket;

export function MessageFrame({
  session,
  initialMessages,
}: {
  session: Session;
  initialMessages: any;
}) {
  
  const searchParams = useSearchParams();
  const conId = searchParams.get("conId");

  const messageEl = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const prevScrollHeightRef = useRef(0);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>(initialMessages);

  useEffect(()=>{
    socket = io("http://localhost:8000")
  }, [])

  useEffect(() => {
    socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err);
    });
    socket.on("connect", () => {
      socket.emit("joinRoom", conId);
    });

    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

   
  }, [conId]);

  useEffect(() => {
    if (messageEl.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageEl.current;
      const isAtBottom = scrollTop >= scrollHeight;
      if (!isAtBottom && !loading) {
        messageEl.current.scrollTop = scrollHeight;
      } else {
        setLoading(false);
        messageEl.current.scrollTop =
          prevScrollHeightRef.current + clientHeight;
      }
      prevScrollHeightRef.current = messageEl.current.scrollTop;
    }
  }, [messages]);

  // const loadMoreMessages = () => {
  //   if (hasMoreMessages && !loading) {
  //     setLoading(true);

  //     setTimeout(() => {
  //       const newMessages = generateMessages();
  //       setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  //       setHasMoreMessages(false);
  //     }, 1000);
  //   }
  // };

  // const handleScroll = () => {
  //   // @ts-ignore
  //   if (messageEl && messageEl.current.scrollTop === 0) {
  //     loadMoreMessages();
  //   }
  // };

  const sendMessage = async () => {
    if (inputMessage && !sending) {
      setSending(true)
      await send_message(
        conId!,
        session.user?.email!,
        inputMessage,
        session?.user?.image
      );

      socket.emit("message", {
        conversation_id: conId!,
        author: session.user?.email!,
        content: inputMessage,
        author_img: session.user?.image,
        createdAt: new Date(),
      });

      setInputMessage("");
      setSending(false)
    }
  };

  return (
    <div className="flex flex-col w-full border border-slate-400 rounded bg-slate-200 p-4">
      <Link className="mb-2" href="/"><Button className="w-full" variant={"destructive"}>Leave Room</Button></Link>
      <div className="h-96 overflow-y-auto" ref={messageEl}>
        <div
          className="flex flex-col gap-2 justify-end min-h-full"
          // onScroll={handleScroll}
        >
          {loading && <div>Loading... </div>}
          {messages.map((val, index) => (
            <Message
              key={index}
              message={val}
              isAuthor={val.author === session.user?.email}
            />
          ))}
        </div>
      </div>
      <div className="mt-6 flex gap-x-2 items-center">
        <Input
          value={inputMessage}
          onChange={(event) => setInputMessage(event.target.value)}
          maxLength={250}
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
          placeholder="Enter new message"
        />
        <Button
          onClick={sendMessage}
          disabled={sending}
        >
          Send
        </Button>
      </div>
    </div>
  );
}

function Message({
  message,
  isAuthor,
}: {
  message: IMessage;
  isAuthor: boolean;
}) {
  return (
    <div
      className={
        "flex items-center gap-x-2 " +
        (isAuthor ? "self-end flex-row-reverse" : "")
      }
    >
      <div className="size-7">
        {message.author_img ? (
          <Image
            className="h-full w-full  rounded-full"
            src={message.author_img}
            height={24}
            width={24}
            alt="img"
          />
        ) : (
          <div className="bg-red-300 p-2 rounded-full size-7" />
        )}
      </div>
      <div className="bg-slate-400/50 rounded p-4 w-max font-semibold">
          <div className="text-xs text-blue-800">
          {message.author}
          </div>
        {message.content}
      </div>
    </div>
  );
}

type IMessage = {
  conversation_id: string;
  author: string;
  author_img?: string | null;
  content: string;
  createdAt: Date;
};
