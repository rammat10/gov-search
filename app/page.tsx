import { getRandomSuggestions } from "@/lib/suggestions";
import ClientChat from "./client-chat";

export default function ChatPage() {
  const initialSuggestions = getRandomSuggestions(3);

  return <ClientChat initialSuggestions={initialSuggestions} />;
}
