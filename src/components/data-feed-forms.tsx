
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, Text, Loader } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { feedText, feedDocument } from "@/app/feed-actions";

const initialState = {
  message: "",
  error: "",
};

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={pending}>
      {pending ? <Loader className="animate-spin" /> : children}
    </Button>
  );
}

export function DataFeedForms() {
  const { toast } = useToast();
  
  const [textState, textFormAction] = useFormState(feedText, initialState);
  const [docState, docFormAction] = useFormState(feedDocument, initialState);
  
  const textFormRef = useRef<HTMLFormElement>(null);
  const docFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (textState.message) {
      toast({
        title: "Success",
        description: textState.message,
      });
      textFormRef.current?.reset();
      textState.message = "";
    }
    if (textState.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: textState.error,
      });
      textState.error = "";
    }
  }, [textState, toast]);

  useEffect(() => {
    if (docState.message) {
      toast({
        title: "Success",
        description: docState.message,
      });
      docFormRef.current?.reset();
      docState.message = "";
    }
    if (docState.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: docState.error,
      });
      docState.error = ""
    }
  }, [docState, toast]);


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
          <form ref={textFormRef} action={textFormAction} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="text-data">Text Data</Label>
              <Textarea
                id="text-data"
                name="text-data"
                placeholder="Paste your text data here..."
                rows={12}
                required
                className="bg-background"
              />
            </div>
            <SubmitButton>Feed Text</SubmitButton>
          </form>
        </TabsContent>
        <TabsContent value="document">
          <form ref={docFormRef} action={docFormAction} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="document-file">Document</Label>
              <Input id="document-file" name="document-file" type="file" required className="bg-background" />
              <p className="text-xs text-muted-foreground">
                Upload a document to add its contents to the knowledge base.
              </p>
            </div>
            <SubmitButton>Feed Document</SubmitButton>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
