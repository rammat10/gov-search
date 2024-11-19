"use client"

import { Chat } from "@/components/ui/chat"
import { getRandomSuggestions } from "@/lib/suggestions"
import { useChat } from "ai/react"

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

  const filteredMessages = messages.filter((message) => message.content !== "")

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
          suggestions={getRandomSuggestions(3)}
        />
      </div>
    </div>
  )
}
