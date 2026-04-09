import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function generateVideoPosterFromBuffer(buffer: Buffer) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "wsod-video-"));
  const inputPath = path.join(tempDir, "input-video");
  const outputPath = path.join(tempDir, "poster.jpg");

  try {
    await fs.writeFile(inputPath, buffer);

    await execFileAsync("ffmpeg", [
      "-i",
      inputPath,
      "-ss",
      "00:00:01",
      "-frames:v",
      "1",
      "-q:v",
      "2",
      outputPath,
      "-y",
    ]);

    const posterBuffer = await fs.readFile(outputPath);
    return posterBuffer;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
