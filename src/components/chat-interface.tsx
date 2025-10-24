"use client";

import { Bot, Loader, Send, User, BrainCircuit, MessageSquareText } from "lucide-react";
import { useEffect, useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";

import { getAiResponse } from "@/app/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { SidebarTrigger } from "./ui/sidebar";

type Message = {
  role: "user" | "bot";
  content: string;
};

const initialState = {
  response: "",
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} className="shrink-0">
      {pending ? <Loader className="animate-spin" /> : <Send />}
      <span className="sr-only">Send</span>
    </Button>
  );
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [useCustomKnowledge, setUseCustomKnowledge] = useState(true);
  const [state, formAction] = useActionState(getAiResponse, initialState);

  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
      state.error = ""; // Clear error
    }

    if (state.response) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: state.response },
      ]);
      state.response = ""; // Clear response to avoid re-adding
    }
  }, [state, state.error, state.response]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = (formData: FormData) => {
    const query = formData.get("query") as string;
    if (query?.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: query }]);
      formAction(formData);
      formRef.current?.reset();
    }
  };

  return (
    <div className="flex h-svh flex-col bg-background">
      <header className="flex items-center justify-between border-b p-4 shrink-0">
        <div className="flex items-center gap-2">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <h1 className="text-xl font-semibold">Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          <BrainCircuit size={16} className="text-muted-foreground" />
          <Label htmlFor="knowledge-toggle" className="text-sm">Use Custom Knowledge</Label>
          <Switch
            id="knowledge-toggle"
            checked={useCustomKnowledge}
            onCheckedChange={setUseCustomKnowledge}
            aria-label="Toggle custom knowledge source"
          />
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {messages.length === 0 ? (
                 <Card className="max-w-2xl mx-auto mt-8 border-dashed shadow-none">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
                           <MessageSquareText className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle>Welcome to DataChat!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">
                            You can start chatting with the AI. Use the sidebar to feed it new information.
                            <br />
                            The toggle in the header lets you switch between using your custom knowledge and the AI's general knowledge.
                        </p>
                    </CardContent>
                 </Card>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "bot" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xl rounded-lg p-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
             <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="border-t p-4 bg-background/80 backdrop-blur-sm shrink-0">
        <form
          ref={formRef}
          action={handleFormSubmit}
          className="flex items-start gap-2"
        >
          <Textarea
            name="query"
            placeholder="Type your message..."
            className="flex-1 resize-none"
            rows={1}
            required
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <input
            type="hidden"
            name="useCustomKnowledge"
            value={String(useCustomKnowledge)}
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
