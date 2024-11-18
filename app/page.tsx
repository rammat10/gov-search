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
  const filteredMessages = messages.filter((message) => message.content !== '');
 
  return (
    <div className="flex min-h-screen items-center justify-center w-full p-4">
      <div className="flex h-[600px] w-full max-w-3xl border rounded-lg shadow-sm p-4">
        <Chat
          className="grow"
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