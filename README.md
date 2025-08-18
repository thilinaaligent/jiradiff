# 🦒 Jiradiff

Pronounced "giraffe", Jiradiff is a simple command-line tool to extract **Jira ticket IDs** from Git commit messages between two branches and copy the corresponding Jira ticket URLs to your clipboard.

## Usage

```
npx jiradiff
```

npx will temporarily download it from the npm registry, execute the specified command, and then clean up the temporary installation.

## Features

-   Extracts unique Jira ticket keys (e.g., `ABC-123`) from Git logs.
-   Builds direct links to the tickets.
-   Copies the list of ticket URLs to your clipboard for easy pasting.
-   Automatically remembers your Jira URL for future use.

## Example

```
$ npx jiradiff
```

```
? What is the target branch? › production
? What is the source branch? › staging
? What's your Jira browse link? › https://client.atlassian.net/browse/

🎟️  Found 3 Jira tickets between `production` and `staging`:

- https://client.atlassian.net/browse/ABC-101
- https://client.atlassian.net/browse/ABC-122
- https://client.atlassian.net/browse/ABC-134

Copied to clipboard!
```

## Config

Jira link gets saved in `.jiradiff` for future use so you don't have to enter it again. This file gets automatically ignored by git since its added to `.git/info/exclude`
