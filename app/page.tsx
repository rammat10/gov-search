"use client"
 
import { type UseChatOptions, useChat } from "ai/react"
 
import { Chat } from "@/components/ui/chat"
 
type ChatDemoProps = {
  initialMessages?: UseChatOptions["initialMessages"]
}
 
export default function ChatDemo(props: ChatDemoProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
  } = useChat(props)
 
  return (
    <div className="flex min-h-screen items-center justify-center w-full p-4">
      <div className="flex h-[600px] w-full max-w-3xl border rounded-lg shadow-sm p-4">
        <Chat
          className="grow"
          messages={messages}
          handleSubmit={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          isGenerating={isLoading}
          stop={stop}
          append={append}
          suggestions={[
            "Generate a tasty vegan lasagna recipe for 3 people.",
            "Generate a list of 5 questions for a job interview for a software engineer.",
            "Who won the 2022 FIFA World Cup?",
          ]}
        />
      </div>
    </div>
  )
}