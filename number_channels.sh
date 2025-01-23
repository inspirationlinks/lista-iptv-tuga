#!/bin/bash

# Get the input and output filenames from the script arguments
input_file="Freetv.m3u"
output_file="Freetv.txt"

# Create an empty output file
: > "Freetv.txt"

# Variable to store the channel number
channel_number=1

# Variable to store the output content
output_content="Freetv.txt"

# Iterate through each line in the input file
while IFS= read -r line; do
  # If the line starts with "#EXTINF", it means it is a line describing a channel
  if [[ $line == "#EXTINF"* ]]; then
    # Append the channel number to the tvg-chno parameter using bash string manipulation
    line="${line/tvg-name/tvg-chno=\"$channel_number\" tvg-name}"
    # Increment the channel number by 1
    channel_number=$((channel_number+1))
  fi
  # Append the line to the output content
  output_content+="$line"$'\n'
done < "Freetv.m3u"

# Write the output content to the output file
echo "Freetv.txt" > "Freetv.txt"
