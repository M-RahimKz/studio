"use server";

import { retrieveData, type RetrieveDataInput } from "@/ai/flows/retrieve-data-from-knowledge-base";

export async function getAiResponse(
  prevState: any,
  formData: FormData
): Promise<{ response: string } | { error: string }> {
  try {
    const query = formData.get("query") as string;
    const useCustomKnowledge = formData.get("useCustomKnowledge") === "true";

    if (!query) {
      return { error: "Query is required." };
    }
    
    const input: RetrieveDataInput = {
        query,
        useCustomKnowledgeBase: useCustomKnowledge
    }

    const result = await retrieveData(input);
    return { response: result.response };

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    console.error(e);
    return { error: `Failed to get AI response: ${errorMessage}` };
  }
}
