#!/bin/bash

LAST_DEPLOY_COMMIT=$(git rev-parse HEAD^)

CHANGED_FILES=$(git diff --name-only $LAST_DEPLOY_COMMIT HEAD)

# Define an array of paths and files to check
CHECK_PATHS_AND_FILES=("apps/server/" "packages/" "package.json" "pnpm-lock.yaml")

ONLY_SERVER_OR_PACKAGES_CHANGES=true
for file in $CHANGED_FILES; do
  MATCH_FOUND=false
  for path in "${CHECK_PATHS_AND_FILES[@]}"; do
    if [[ $file == $path* ]]; then
      MATCH_FOUND=true
      break
    fi
  done
  if [ "$MATCH_FOUND" = false ]; then
    ONLY_SERVER_OR_PACKAGES_CHANGES=false
    break
  fi
done

if [ "$ONLY_SERVER_OR_PACKAGES_CHANGES" = true ]; then
  echo "continue"
  echo "Changed files: $CHANGED_FILES"
  exit 1
else
  echo "skip"
  exit
fi
