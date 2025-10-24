import { DataFeedForms } from "@/components/data-feed-forms";
import { ChatInterface } from "@/components/chat-interface";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { MessageSquareText } from "lucide-react";

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <MessageSquareText className="text-primary" />
            <h1 className="text-xl font-semibold">DataChat</h1>
          </div>
          <p className="text-sm text-muted-foreground">Feed your knowledge base</p>
        </SidebarHeader>
        <SidebarContent>
          <DataFeedForms />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <ChatInterface />
      </SidebarInset>
    </SidebarProvider>
  );
}
