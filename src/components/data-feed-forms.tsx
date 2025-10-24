"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, Text } from "lucide-react";

export function DataFeedForms() {
  const { toast } = useToast();

  const handleTextFeed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Text data has been fed to the knowledge base.",
    });
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  const handleDocumentFeed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Document has been fed to the knowledge base.",
    });
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="p-2">
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">
                <Text className="mr-2 h-4 w-4" />
                Text
            </TabsTrigger>
            <TabsTrigger value="document">
                <Paperclip className="mr-2 h-4 w-4" />
                Document
            </TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <form onSubmit={handleTextFeed} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="text-data">Text Data</Label>
                <Textarea
                  id="text-data"
                  placeholder="Paste your text data here..."
                  rows={12}
                  required
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Feed Text
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="document">
            <form onSubmit={handleDocumentFeed} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="document-file">Document</Label>
                <Input id="document-file" type="file" required className="bg-background"/>
                <p className="text-xs text-muted-foreground">Upload a document to add its contents to the knowledge base.</p>
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4">
                Feed Document
              </Button>
            </form>
          </TabsContent>
        </Tabs>
    </div>
  );
}
