
"use server";

import { revalidatePath } from "next/cache";

/**
 * A dummy API function to simulate feeding text data to a knowledge base.
 * @param textData The text data to feed.
 * @returns A promise that resolves with a success message.
 */
async function dummyTextFeedAPI(textData: string): Promise<{ success: boolean, message: string }> {
  console.log("--- Calling Dummy Text Feed API ---");
  console.log("Data:", textData.substring(0, 100) + "...");
  
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log("--- Dummy Text Feed API successful ---");
  return { success: true, message: "Text data processed by dummy API." };
}

/**
 * A dummy API function to simulate feeding a document to a knowledge base.
 * @param fileName The name of the document file.
 * @param fileContent The content of the document file.
 * @returns A promise that resolves with a success message.
 */
async function dummyDocumentFeedAPI(fileName: string, fileContent: string): Promise<{ success: boolean, message: string }> {
  console.log("--- Calling Dummy Document Feed API ---");
  console.log("File Name:", fileName);
  console.log("Content:", fileContent.substring(0, 200) + "...");

  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log("--- Dummy Document Feed API successful ---");
  return { success: true, message: "Document processed by dummy API." };
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

        // --- Your API call goes here ---
        const apiResponse = await dummyTextFeedAPI(textData);

        if (!apiResponse.success) {
            return { error: `API Error: ${apiResponse.message}` };
        }

        revalidatePath("/");
        return { message: "Text data has been fed to the knowledge base." };
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

        const fileContent = await documentFile.text();

        // --- Your API call goes here ---
        const apiResponse = await dummyDocumentFeedAPI(documentFile.name, fileContent);

        if (!apiResponse.success) {
            return { error: `API Error: ${apiResponse.message}` };
        }

        revalidatePath("/");
        return { message: "Document has been fed to the knowledge base." };

    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        console.error(e);
        return { error: `Failed to feed document: ${errorMessage}` };
    }
}
