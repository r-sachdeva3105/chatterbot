"use client";
import { useState } from "react";

export default function Home() {

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([
    {
      role: 'assistant',
      content: 'Hey, this is ChatterBot! How may I help you?'
    }
  ]);

  const callGetResponse = async () => {
    setLoading(true);
    let temp = message;
    temp.push({ role: "user", content: input });
    setMessage(temp)
    setInput("");
    console.log("Calling OpenAI...");

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.content);

    setMessage((prevMessages) => [...prevMessages, output]);
    setLoading(false);
  }

  const submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      callGetResponse();
    }
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between px-24 py-5"
    >
      <h1 className="text-5xl font-sans font-semibold">ChatterBot</h1>

      <div
        className="flex  h-[35rem] w-[40rem] flex-col items-center bg-gray-600 rounded-xl"
      >
        <div className=" h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
          {message.map((e) => {
            return (
              <div
                key={e.content}
                className={`w-max max-w-[18rem] rounded-md px-4 py-3 h-min ${e.role === "assistant"
                  ? "self-start  bg-gray-200 text-gray-800"
                  : "self-end  bg-gray-800 text-gray-50"
                  } `}
              >
                {e.content}
              </div>
            );
          })}



          {loading ? <div className="self-start  bg-gray-200 text-gray-800 w-max max-w-[18rem] rounded-md px-4 py-3 h-min">*thinking*</div> : ""}
        </div>
        <div className="relative  w-[80%] bottom-4 flex justify-center">
          <textarea value={input} onChange={(event) =>
            setInput(event.target.value)} className="w-[85%] h-10 px-3 py-2
          resize-none overflow-y-auto text-black bg-gray-100 rounded-l outline-none"
            onKeyDown={submit} />
          <button
            onClick={callGetResponse}
            className="w-[15%] bg-gray-800 text-gray-50 px-4 py-2 rounded-r"
          >
            SEND
          </button>
        </div>
      </div>

      <div></div>
    </main>
  );


}