#!/bin/bash

# Eingabedatei (M3U)
input_file="Freetv.m3u"
# Ausgabedatei (XMLTV)
output_file="epg.xmltv"

# XMLTV Header
echo '<?xml version="1.0" encoding="UTF-8"?>' > "$output_file"
echo '<tv>' >> "$output_file"

# EPG aus M3U auslesen
while IFS= read -r line; do
    if [[ $line == *"#EXTINF:"* ]]; then
        # Extrahiere den Sendernamen und die EPG-Daten
        channel_name=$(echo "$line" | sed 's/#EXTINF:-1,//;s/,.*//')
        epg_data=$(echo "$line" | sed 's/#EXTINF:-1,[^,]*,//')

        # Füge den Channel zur XMLTV-Datei hinzu
        echo "  <channel id=\"$channel_name\">" >> "$output_file"
        echo "    <display-name>$channel_name</display-name>" >> "$output_file"
        echo "  </channel>" >> "$output_file"

        # Füge die EPG-Daten hinzu
        echo "  <programme start=\"$(date +%Y%m%d%H%M%S) +0000\" stop=\"$(date +%Y%m%d%H%M%S -d '+1 hour') +0000\" channel=\"$channel_name\">" >> "$output_file"
        echo "    <title>$epg_data</title>" >> "$output_file"
        echo "  </programme>" >> "$output_file"
    fi
done < "$input_file"

# XMLTV Footer
echo '</tv>' >> "$output_file"

echo "EPG-Daten wurden erfolgreich in $output_file gespeichert."
