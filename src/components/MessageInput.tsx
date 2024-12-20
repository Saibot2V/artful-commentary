import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const MessageInput = ({
  onSendMessage,
  disabled,
}: {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="min-h-[60px]"
        disabled={disabled}
      />
      <Button type="submit" disabled={!message.trim() || disabled}>
        Send
      </Button>
    </form>
  );
};