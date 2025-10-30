"use server";

type RagSearchInput = {
  sessionId: string;
  prompt: string;
  useModelKnowledge: boolean;
};

async function ragSearchAPI(input: RagSearchInput): Promise<{ response: string } | { error: string }> {
  try {
    const response = await fetch("http://localhost:8081/api/rag-search", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
        return { error: responseText || `API Error: ${response.status}` };
    }
    
    return { response: responseText };

  } catch (error) {
    console.error("RAG Search API Error:", error);
    const errorMessage = error instanceof Error ? `${error.name}: ${error.message}` : "An unknown error occurred.";
    return { error: errorMessage };
  }
}


export async function getAiResponse(
  prevState: any,
  formData: FormData
): Promise<{ response: string } | { error: string }> {
  const query = formData.get("query") as string;
  const useCustomKnowledge = formData.get("useCustomKnowledge") === "true";
  const sessionId = formData.get("sessionId") as string;

  if (!query) {
    return { error: "Query is required." };
  }
  if (!sessionId) {
    return { error: "Session ID is required." };
  }
  
  const input: RagSearchInput = {
      sessionId,
      prompt: query,
      useModelKnowledge: !useCustomKnowledge // In UI it's "Use Custom Knowledge", in API it's useModelKnowledge. They are opposites.
  }

  const result = await ragSearchAPI(input);
  return result;
}
