
"use server";

import { revalidatePath } from "next/cache";

export async function feedText(
    prevState: any,
    formData: FormData
): Promise<{ message: string } | { error: string }> {
    try {
        const textData = formData.get("text-data") as string;

        if (!textData) {
            return { error: "Text data is required." };
        }

        console.log("Feeding text data:", textData.substring(0, 100));
        // TODO: Implement actual text feeding logic here

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

        console.log("Feeding document:", documentFile.name);
        const fileContent = await documentFile.text();
        console.log("Document content:", fileContent.substring(0, 200));
        
        // TODO: Implement actual document feeding logic here

        revalidatePath("/");
        return { message: "Document has been fed to the knowledge base." };

    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        console.error(e);
        return { error: `Failed to feed document: ${errorMessage}` };
    }
}
