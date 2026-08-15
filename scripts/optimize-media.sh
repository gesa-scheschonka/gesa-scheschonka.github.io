#!/usr/bin/env bash
set -euo pipefail

# Build lightweight six-second card previews from the portfolio's full-quality
# detail videos. The detail files are deliberately never overwritten here:
# they are first-generation 1080p (or native 720p) web encodes made from the
# supplied camera originals, while the overview uses these smaller derivatives.

site_dir="${1:-.}"
media_dir="$site_dir/assets/projects"

if [[ ! -d "$media_dir" ]]; then
  echo "Project media directory not found: $media_dir" >&2
  exit 1
fi

while IFS= read -r -d '' source <&3; do
  source_dir="${source%/*}"
  preview_dir="$source_dir/previews"
  preview="$preview_dir/${source##*/}"
  mkdir -p "$preview_dir"

  width="$(
    ffprobe -v error -select_streams v:0 -show_entries stream=width \
      -of default=noprint_wrappers=1:nokey=1 "$source" | head -n 1
  )"
  height="$(
    ffprobe -v error -select_streams v:0 -show_entries stream=height \
      -of default=noprint_wrappers=1:nokey=1 "$source" | head -n 1
  )"

  if (( width > height )); then
    video_filter="scale=w='min(1280,iw)':h=-2:flags=lanczos,fps=25"
    keyframe_interval=50
    minimum_keyframe_interval=25
  else
    video_filter="scale=w='min(720,iw)':h=-2:flags=lanczos"
    keyframe_interval=60
    minimum_keyframe_interval=30
  fi

  ffmpeg -y -hide_banner -loglevel error \
    -i "$source" \
    -t 6 \
    -map 0:v:0 \
    -map_metadata 0 \
    -vf "$video_filter" \
    -c:v libx264 \
    -preset slow \
    -crf 23 \
    -profile:v high \
    -pix_fmt yuv420p \
    -g "$keyframe_interval" \
    -keyint_min "$minimum_keyframe_interval" \
    -movflags +faststart \
    -an \
    "$preview"

  echo "Built ${preview#$site_dir/}"
done 3< <(
  find "$media_dir" -type f -path '*/videos/*.mp4' \
    ! -path '*/videos/previews/*' -print0
)
