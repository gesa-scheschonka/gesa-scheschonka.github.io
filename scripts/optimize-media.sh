#!/usr/bin/env bash
set -euo pipefail

# Re-encode the portfolio's muted motion assets for web delivery. The originals
# were mostly 540 × 960 clips at roughly 5 Mbps (and sometimes 60–120 fps),
# which is far above what the on-page cards need. This keeps the same paths and
# dimensions while removing unused audio, capping frame rate, and retaining
# progressive MP4 playback via fast-start metadata.

site_dir="${1:-.}"
media_dir="$site_dir/assets/projects"

if [[ ! -d "$media_dir" ]]; then
  echo "Project media directory not found: $media_dir" >&2
  exit 1
fi

while IFS= read -r -d '' source <&3; do
  temporary="${source%.mp4}.optimized.mp4"
  width="$(
    ffprobe -v error -select_streams v:0 -show_entries stream=width \
      -of default=noprint_wrappers=1:nokey=1 "$source" | head -n 1
  )"

  # The two horizontal Furla films are intentionally hero-sized. Keep them at
  # 1440 px wide; portrait/mobile clips retain their existing dimensions.
  if (( width > 1440 )); then
    video_filter="scale=1440:-2:flags=lanczos,fps=30"
  else
    video_filter="fps=30"
  fi

  ffmpeg -y -hide_banner -loglevel error \
    -i "$source" \
    -map_metadata 0 \
    -vf "$video_filter" \
    -c:v libx264 \
    -preset slow \
    -crf 24 \
    -profile:v high \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -an \
    "$temporary"

  mv "$temporary" "$source"
  echo "Optimized ${source#$site_dir/}"
done 3< <(find "$media_dir" -type f -name '*.mp4' -print0)
