#!/usr/bin/env node

import { promisify } from "util";
import { exec } from "child_process";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { intro, outro, text, isCancel, cancel } from "@clack/prompts";
import clipboardy from "clipboardy";

const execChildProcess = promisify(exec);
const CONFIG_FILE_NAME = ".jiradiff";

// Utility function to validate non-empty input
function requiredInput(value, name) {
    if (!value.trim()) return `${name} is required!`;
}

// Reads saved Jira link from config file
async function getSavedJiraLink() {
    try {
        if (!existsSync(CONFIG_FILE_NAME)) return "";
        return readFileSync(CONFIG_FILE_NAME, "utf8").trim();
    } catch {
        return "";
    }
}

// Saves Jira link and excludes config file from git
async function saveJiraLink(jiraLink, alreadySaved) {
    try {
        writeFileSync(CONFIG_FILE_NAME, jiraLink.trim());

        if (!alreadySaved) {
            await execChildProcess(
                `echo ${CONFIG_FILE_NAME} >> .git/info/exclude`
            );
        }
    } catch (err) {
        console.error("Error saving Jira link:", err.message);
    }
}

// Fetches the JIRA ticket diff between two branches
async function getJIRADiff(target, source, link) {
    try {
        const { stdout, stderr } = await execChildProcess(
            `git log origin/${target}..origin/${source} --oneline --no-merges \
| grep -oE '^[a-f0-9]+.[A-Z]{2,}-[0-9]+' \
| grep -oE '[A-Z]{2,}-[0-9]+' \
| sort -u \
| sed 's|^|- ${link}|'`
        );

        if (stderr) {
            console.warn(stderr);
        }

        const result = stdout.trim();

        if (result) {
            await clipboardy.write(result);
            outro(
                `🎟️  JIRA tickets between \`${target}\` and \`${source}\`:\n\n${result}\n\n Copied to clipboard!`
            );
        } else {
            outro(
                "No JIRA tickets found between these branches. You may want to run git fetch origin before running JIRAdiff."
            );
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
}

// Start the script
async function main() {
    intro("🦒 JIRAdiff");

    try {
        const targetBranch = await text({
            message: "What is the target branch?",
            placeholder: "production",
            initialValue: "production",
            validate: (val) => requiredInput(val, "Target branch"),
        });

        const sourceBranch = await text({
            message: "What is the source branch?",
            placeholder: "staging",
            initialValue: "staging",
            validate: (val) => requiredInput(val, "Source branch"),
        });

        const savedJiraLink = await getSavedJiraLink();
        const jiraLink = await text({
            message: "What's your JIRA browse link?",
            placeholder: "e.g. https://client.atlassian.net/browse/",
            initialValue: savedJiraLink,
            validate: (val) => requiredInput(val, "JIRA link"),
        });

        if ([targetBranch, sourceBranch, jiraLink].some(isCancel)) {
            cancel("Operation cancelled.");
            process.exit(0);
        }

        await saveJiraLink(jiraLink, !!savedJiraLink);
        await getJIRADiff(
            targetBranch.trim(),
            sourceBranch.trim(),
            jiraLink.trim()
        );
    } catch (err) {
        console.error("Unexpected error:", err.message);
        process.exit(1);
    }
}

main();
