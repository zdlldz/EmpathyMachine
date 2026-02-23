# Docs: The Armory

This directory contains the canonical templates for the Docs framework. 

## 1. Scaffolding a Release
When starting a new release version (e.g., `v0.3.0`):

```bash
# Copy the release bundle to the release directory
cp -r docs/templates/release-bundle docs/release/[version]
```

## 2. Scaffolding a Task
When starting a new task (e.g., `DEV-1234`):

```bash
# 1. Create the task slug directory
mkdir -p docs/release/[version]/[category]/[slug]

# 2. Copy the task bundle
cp docs/templates/task-bundle/*.md docs/release/[version]/[category]/[slug]/

# 3. Rename the phase files to include the slug
cd docs/release/[version]/[category]/[slug]/
for f in *.md; do 
  if [[ "$f" != _* ]]; then 
    mv "$f" "[slug]-$f"; 
  else
    # Handle the _PM.md specially
    mv "$f" "_[slug]-PM.md";
  fi
done

# 4. Fill in the placeholders
# Use a simple loop to hydrate the {{PLACEHOLDERS}}:
for f in *.md; do
  sed -i '' "s/{{TITLE}}/My Task Title/g" "$f"
  sed -i '' "s/{{ID}}/DEV-1234/g" "$f"
  sed -i '' "s/{{SLUG}}/dev-1234-my-task/g" "$f"
  sed -i '' "s/{{CATEGORY}}/add/g" "$f"
  sed -i '' "s/{{AUTHOR}}/agent-id/g" "$f"
  sed -i '' "s/{{VERSION}}/v0.2.0/g" "$f"
  sed -i '' "s/{{DATE}}/2026-02-16/g" "$f"
done
```

## Template Definitions
- **`task-bundle/`**: The 10-file payload required for every material task.
- **`release-bundle/`**: The standard category structure for a new release.
