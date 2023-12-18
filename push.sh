#!/bin/bash

echo "Enter the directory:"
read directory
echo "Enter the commit message:"
read commit_message

cd "$directory" && git add . && git commit -m "$commit_message" && git push

echo "Press any key to exit"
read
