"use client";

import { Chat } from "@/components/ui/chat";
// import { getRandomSuggestions } from "@/lib/suggestions"
import { useChat } from "ai/react";
// import { useCallback, useMemo } from "react"
import { toast } from "sonner";

export default function ChatDemo() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
  } = useChat({
    onResponse(response) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("response", response);
    },
    async onFinish(response) {
      try {
        console.log("finish", response);
      } catch (error) {
        console.error("Finish error:", error);
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("An error occurred while processing your request.");
    },
  });

  // const memoizedSuggestions = useMemo(() => getRandomSuggestions(3), [])

  const filteredMessages = messages.filter((message) => message.content !== "");
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex sm:my-auto h-[100dvh] sm:h-[600px] w-full max-w-3xl overflow-hidden rounded-none sm:rounded-lg shadow-none relative mx-auto">
        <Chat
          className="flex flex-col w-full"
          messages={filteredMessages}
          handleSubmit={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          isGenerating={isLoading}
          stop={stop}
          append={append}
          // suggestions={memoizedSuggestions}
          suggestions={[
            "Show me ongoing legislation about banking reform",
            "What current bills address social media regulation?",
            "Find active legislation about infrastructure improvements",
          ]}
        />
      </div>
    </div>
  );
}
