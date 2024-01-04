#!/bin/bash
echo "Enter the directory:"
read directory
echo "Enter the commit message:"
read commit_message

branch_name=""
while [ -z "$branch_name" ]; do
  echo "Enter the branch name (this field is mandatory):"
  read branch_name
  if [ -z "$branch_name" ]; then
    echo "Error: You must enter a branch name."
  fi
done

cd "$directory" && git add . && git commit -m "$commit_message" && git push origin "$branch_name"

echo "Press any key to exit"
read