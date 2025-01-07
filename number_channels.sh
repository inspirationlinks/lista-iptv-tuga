#!/bin/bash

# Get the input and output filenames from the script arguments
input_file="Freetv.m3u"
output_file="Freetv.txt"

# Create an empty output file
touch $output_file

# Variable to store the channel number
channel_number=1

# Iterate through each line in the input file
while read line; do
  # If the line starts with "#EXTINF", it means it is a line describing a channel
  if [[ $line == "#EXTINF"* ]]; then
    # Append the channel number to the tvg-chno parameter
    line=$(echo $line | sed "s/tvg-name/tvg-chno=\"$channel_number\" tvg-name/")
    # Increment the channel number by 1
    channel_number=$((channel_number+1))
  fi
  # Append the line to the output file
  echo $line >> $output_file
done < $input_file
