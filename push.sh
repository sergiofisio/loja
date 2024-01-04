#!/bin/bash

echo "Enter the directory:"
read directory
echo "Enter the commit message:"
read commit_message
echo "Enter the branch name:"
read branch_name

cd "$directory" && git add . && git commit -m "$commit_message" && git push origin "$branch_name"

echo "Press any key to exit"
read
