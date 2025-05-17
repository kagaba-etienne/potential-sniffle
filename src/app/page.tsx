"use client";

import { useRef } from "react";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] border-2 rounded-sm m-5">
      <div className="chat-area w-full">
        <div className="message border-b-1 flex justify-start">
          <p className="w-fit max-w-[70%] border-2 border-red-500 p-3 text-left">
            Hello!
          </p>
        </div>
        <div className="message border-b-1 flex justify-end">
          <p className="w-fit max-w-[70%] border-2 border-red-500 p-3 text-left">
            Hello!
          </p>
        </div>
      </div>
      <div className="input-area w-full">
        <form className="w-full flex" ref={formRef}>
          <textarea
            name="query"
            id="query"
            placeholder="Ask me anything"
            className="w-full p-2"
            onKeyDown={handleKeyDown}
          ></textarea>
          <button
            type="submit"
            className="px-5 bg-black hover:cursor-pointer disabled:bg-gray-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
