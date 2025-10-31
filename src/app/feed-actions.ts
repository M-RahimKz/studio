
"use server";

import { revalidatePath } from "next/cache";

const API_BASE_URL = "http://localhost:8081/api/rag-data";

/**
 * Feeds text data to the knowledge base via API.
 * @param textData The text data to feed.
 * @returns A promise that resolves with the API response.
 */
async function textFeedAPI(textData: string): Promise<{ success: boolean, message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/feed-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: textData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Failed to read error response');
      return { success: false, message: errorText || `HTTP error! status: ${response.status}` };
    }

    const resultText = await response.text();
    return { success: true, message: resultText || "Text data fed successfully." };
  } catch (error) {
    console.error("Text Feed API Error:", error);
    const errorMessage = error instanceof Error ? `${error.name}: ${error.message}` : "An unknown error occurred.";
    return { success: false, message: errorMessage };
  }
}

/**
 * Feeds a document to the knowledge base via API.
 * @param documentFile The document file to feed.
 * @returns A promise that resolves with the API response.
 */
async function documentFeedAPI(documentFile: File): Promise<{ success: boolean, message: string }> {
  try {
    // Read the file into a buffer and create a Blob
    const fileBuffer = await documentFile.arrayBuffer();
    const blob = new Blob([fileBuffer], { type: documentFile.type });

    const formData = new FormData();
    // Use the blob to send the file, preserving the original filename
    formData.append('file', blob, documentFile.name);

    const response = await fetch(`${API_BASE_URL}/feed-file`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Failed to read error response');
      console.error(`Document Feed API Error (${response.status}):`, errorText);
      return { success: false, message: errorText || `HTTP error! status: ${response.status}` };
    }
    
    const resultText = await response.text();
    return { success: true, message: resultText || "Document fed successfully." };
  } catch (error) {
    console.error("Document Feed API Error:", error);
    const errorMessage = error instanceof Error ? `${error.name}: ${error.message}` : "An unknown error occurred.";
    return { success: false, message: errorMessage };
  }
}


export async function feedText(
    prevState: any,
    formData: FormData
): Promise<{ message: string } | { error: string }> {
    try {
        const textData = formData.get("text-data") as string;

        if (!textData) {
            return { error: "Text data is required." };
        }

        const apiResponse = await textFeedAPI(textData);

        if (!apiResponse.success) {
            return { error: `API Error: ${apiResponse.message}` };
        }

        revalidatePath("/");
        return { message: apiResponse.message };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        console.error(e);
        return { error: `Failed to feed text: ${errorMessage}` };
    }
}

export async function feedDocument(
    prevState: any,
    formData: FormData
): Promise<{ message: string } | { error: string }> {
    try {
        const documentFile = formData.get("document-file") as File;
        
        if (!documentFile || documentFile.size === 0) {
            return { error: "Document file is required." };
        }

        const apiResponse = await documentFeedAPI(documentFile);

        if (!apiResponse.success) {
            return { error: `API Error: ${apiResponse.message}` };
        }

        revalidatePath("/");
        return { message: apiResponse.message };

    } catch (e: any) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        console.error(e);
        // Check for Next.js specific body size error
        if (e.code === 'FST_ERR_CTP_BODY_TOO_LARGE' || (e.message && e.message.includes("body exceeded"))) {
             return { error: 'File size exceeds the 4MB limit. Please upload a smaller file.' };
        }
        return { error: `Failed to feed document: ${errorMessage}` };
    }
}
