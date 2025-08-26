import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import "dotenv/config";
import { AiTaskSchema } from "./lib/schemas";
import * as readline from "node:readline/promises";

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function main() {
    const shortTitle = await terminal.question("Enter a short title: ");

    const { text: description } = await generateText({
        model: openai("gpt-4o-mini"),
        system: `
            You are a task creator for a full service online marketing agency that helps
            clients reach their target audience and achieve their
            business goals through strategy, branding, advertisements
            and custom development.
            You are given a short title of a task and you need to generate a description for the task.
            The description should have at least 100 words and cannot have more than 500 words. It should be descriptive enough
            to give the reader a good idea of what the requirements of the task are. Make sure you return the description in markdown format.
        `,
        prompt: `Generate a description for the following title: ${shortTitle}`,
    });

    const { object: task } = await generateObject({
        model: openai("gpt-4o-mini"),
        system: `
            You are a task creator for a full service online marketing agency that helps
            clients reach their target audience and achieve their
            business goals through strategy, branding, advertisements
            and custom development. You are given a title and description (written in markdown format) of a task and you need to generate a task object.
            The task object should be in the following format:
            {
                department: "marketing" | "development" | "sales" | "finance",
                priority: "low" | "medium" | "high",
                subtasks?: string[],
                storyPoints?: "1" | "2" | "3" | "5" | "8",
            }
            Subtasks are optional and can be an empty array.
            Story points are optional and can be "1", "2", "3", "5", or "8".
        `,
        prompt: `
            Generate a task object for the following data:
            Title: ${shortTitle}
            Description: ${description}
        `,
        schema: AiTaskSchema,
    });

    process.exit(0);
}

main();
