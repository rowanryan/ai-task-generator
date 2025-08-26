async function main() {
    // Get command line arguments
    const args = process.argv.slice(2);

    // Find the --input flag
    const inputIndex = args.indexOf("--input");

    if (inputIndex === -1 || inputIndex === args.length - 1) {
        console.error("Error: --input flag is required with a value");
        console.error('Usage: bun index.ts --input "your text here"');
        process.exit(1);
    }

    const inputValue = args[inputIndex + 1];

    if (!inputValue) {
        console.error("Error: No value provided for --input flag");
        console.error('Usage: bun index.ts --input "your text here"');
        process.exit(1);
    }

    console.log("Input received:", inputValue);
    console.log("Hello from Bun!");
}

main();
