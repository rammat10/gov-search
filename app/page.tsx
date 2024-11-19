"use client"

import { useChat } from "ai/react"

import { Chat } from "@/components/ui/chat"

export default function ChatDemo() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
  } = useChat()

  // filter out messages that have no content
  const filteredMessages = messages.filter((message) => message.content !== "")

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex  sm:my-auto h-[100dvh] sm:h-[600px] w-full max-w-3xl overflow-hidden rounded-none sm:rounded-lg shadow-none sm:shadow-sm relative mx-auto">
        <Chat
          className="flex flex-col w-full"
          messages={filteredMessages}
          handleSubmit={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          isGenerating={isLoading}
          stop={stop}
          append={append}
          suggestions={[
            "What recent bills have been introduced about climate change?",
            "Show me legislation related to healthcare reform from the past year.",
            "What bills are currently being discussed about cybersecurity?",
          ]}
        />
      </div>
    </div>
  )
}
