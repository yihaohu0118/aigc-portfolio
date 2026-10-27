"""Create H.264/AAC web copies and actual video-frame posters on the CI runner."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "dist" / "assets"
POSTERS = ASSETS / "posters"


def run(arguments):
    try:
        return subprocess.run(arguments, check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as error:
        print(error.stderr, file=sys.stderr)
        raise


def prepare_video(source):
    output = source.with_suffix(".web.mp4")
    try:
        run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(source), "-map", "0:v:0", "-map", "0:a:0?",
            "-vf", "scale=w='min(1280,iw)':h='min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,format=yuv420p",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-threads", "2", "-c:a", "aac", "-b:a", "128k",
            "-map_metadata", "-1", "-movflags", "+faststart", str(output),
        ])
        info = json.loads(run([
            "ffprobe", "-v", "error", "-show_streams", "-of", "json", str(output)
        ]).stdout)
        video_stream = next(stream for stream in info["streams"] if stream["codec_type"] == "video")
        if video_stream["codec_name"] != "h264":
            raise ValueError(f"Expected H.264: {source.name}")
        if output.stat().st_size >= 100 * 1024 * 1024:
            raise ValueError(f"Web video is still too large: {source.name}")
        poster = POSTERS / (source.stem + ".jpg")
        run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-ss", "0.6", "-i", str(output), "-frames:v", "1",
            "-vf", "scale=w='min(1000,iw)':h=-2", "-q:v", "3", str(poster),
        ])
        if not poster.is_file() or poster.stat().st_size == 0:
            raise ValueError(f"Missing video poster: {source.name}")
        output.replace(source)
        print(f"Prepared {source.name}: H.264 / {source.stat().st_size / 1024 / 1024:.1f} MiB")
    finally:
        output.unlink(missing_ok=True)


def main():
    POSTERS.mkdir(parents=True, exist_ok=True)
    sources = sorted(ASSETS.glob("film-*.mp4"))
    if len(sources) != 21:
        raise ValueError(f"Expected 21 source videos, found {len(sources)}")
    for source in sources:
        prepare_video(source)
    (ROOT / "dist" / "media-ready.js").write_text("window.MEDIA_READY = true;\n", encoding="utf-8")


if __name__ == "__main__":
    main()
