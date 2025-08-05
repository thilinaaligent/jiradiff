# 🦒 JIRAdiff

A simple command-line tool to extract **JIRA ticket IDs** from Git commit messages between two branches and copy the corresponding JIRA ticket URLs to your clipboard.

## Usage

```
npx jiradiff
```

npx will temporarily download it from the npm registry, execute the specified command, and then clean up the temporary installation.

## Features

-   Automatically remembers your JIRA URL for future use.
-   Extracts unique JIRA ticket keys (e.g., `ABC-123`) from Git logs.
-   Builds direct links to the tickets.
-   Copies the list of ticket URLs to your clipboard for easy pasting.

## Example

```
$ npx jiradiff
```

```
? What is the target branch? › production
? What is the source branch? › staging
? What's your JIRA browse link? › https://client.atlassian.net/browse/

🎟️  JIRA tickets between `production` and `staging`:

- https://client.atlassian.net/browse/ABC-101
- https://client.atlassian.net/browse/ABC-122
- https://client.atlassian.net/browse/XYZ-13

Copied to clipboard!
```

## Config

JIRA link gets saved in `.jiradiff` for future use so you don't have to enter it again. This file gets automatically ignored by git since its added to `.git/info/exclude`
