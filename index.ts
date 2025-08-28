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
    const shortTitle = await terminal.question("Korte titel van taak: ");

    const { text: description } = await generateText({
        model: openai("gpt-5-mini"),
        system: `
            Je bent gespecialiseerd in het maken van taken voor een full-service online marketing bureau
            die bedrijven helpt hun klanten te bereiken en hun bedrijfsdoelen te behalen door middel van
            strategie, branding, advertenties en custom software development. Je krijgt als input een korte titel van een taak en je moet een beschrijving voor de taak genereren. De beschrijving mag niet meer dan 200 woorden bevatten. Deze beschrijving moet duidelijk zijn en geen namen bevatten. Gebruik geen markdown, speciale tekens of andere formatting. Gebruik alleen simpele zinnen en beschrijf niet zo uitgebreid.
        `,
        prompt: `Genereer een taakbeschrijving op basis van de volgende titel: ${shortTitle}`,
    });

    terminal.write(`Titel:\n${shortTitle}\n\n`);
    terminal.write(`Beschrijving:\n${description}\n\n`);

    const { object: task } = await generateObject({
        model: openai("gpt-5-nano"),
        system: `
            Je bent gespecialiseerd in het maken van taken voor een full-service online marketing bureau
            die bedrijven helpt hun klanten te bereiken en hun bedrijfsdoelen te behalen door middel van
            strategie, branding, advertenties en custom software development.
            Je krijgt als input een titel en beschrijving van een taak en je moet een taakobject genereren.
            Het taakobject moet de volgende vorm hebben:
            {
                department: "marketing" | "development" | "sales" | "finance",
                priority: "low" | "medium" | "high",
                subtasks?: string[],
                storyPoints?: "1" | "2" | "3" | "5" | "8",
            }
            Subtasks zijn optioneel en kunnen een lege array zijn. Elke subtitel is een korte titel.
            Story points zijn optioneel en kunnen "1", "2", "3", "5" of "8" zijn.
        `,
        prompt: `
            Genereer een taakobject voor de volgende data:
            Titel: ${shortTitle}
            Beschrijving: ${description}
        `,
        schema: AiTaskSchema.omit({
            title: true,
            description: true,
            status: true,
        }),
    });

    terminal.write(`Afdeling:\n${task.department}\n\n`);
    terminal.write(`Prioriteit:\n${task.priority}\n\n`);
    terminal.write(`Story Points:\n${task.storyPoints}\n\n`);
    terminal.write(
        `Onderdelen:\n${
            task.subtasks && task.subtasks.length > 0
                ? task.subtasks.map(subtask => `- ${subtask}`).join("\n")
                : "None"
        }\n`
    );

    process.exit(0);
}

main();
