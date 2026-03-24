// src/services/chickenService.js

import { Client } from "@gradio/client";
import { detectObjects, isChickenDetected } from "./florenceService";

const CHICKEN_SPACE = "cLoudstone99/chicken-scan";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const normalizeToFile = async (file) => {
  if (file instanceof File) return file;
  const response = await fetch(file);
  const blob = await response.blob();
  return new File([blob], "sample.jpg", { type: blob.type });
};

const parseBreedResults = (raw) => {
  const lines = (raw || "").split("\n").filter(Boolean);
  return lines.map((line, i) => {
    const match = line.match(/#\d+\s(.+)\s—\s([\d.]+)%/);
    return {
      rank: i + 1,
      breed: match ? match[1] : "Unknown",
      confidence: match ? parseFloat(match[2]) / 100 : 0,
    };
  });
};

const classifyBreed = async (imageFile, attempt = 1) => {
  try {
    console.log("[classifyBreed] Connecting to " + CHICKEN_SPACE + "... (attempt " + attempt + "/" + MAX_RETRIES + ")");
    const client = await Client.connect(CHICKEN_SPACE);

    console.log("[classifyBreed] Connected. Running breed classification...");
    const result = await client.predict("/predict", { img: imageFile });

    console.log("[classifyBreed] Raw response:", result.data[0]);
    const top_results = parseBreedResults(result.data[0]);
    console.log("[classifyBreed] Parsed breed results:", top_results);

    return top_results;
  } catch (err) {
    const isParseError = err.message?.includes("Could not parse server response") || err.message?.includes("<!DOCTYPE");

    if (isParseError && attempt < MAX_RETRIES) {
      console.warn(
        "[classifyBreed] Space may be waking up. Retrying in " +
          RETRY_DELAY_MS +
          "ms... (" +
          attempt +
          "/" +
          MAX_RETRIES +
          ")",
      );
      await wait(RETRY_DELAY_MS);
      return classifyBreed(imageFile, attempt + 1);
    }

    console.error("[classifyBreed] Failed after retries:", err.message);
    throw err;
  }
};

export const scanChicken = async (file) => {
  if (!file) throw new Error("No file provided");

  console.log("[scanChicken] Starting pipeline...");

  // --- Step 1: Object Detection ---
  console.log("[scanChicken] Step 1: Running object detection via Florence-2...");
  const { labels } = await detectObjects(file);
  console.log("[scanChicken] Detected labels:", labels);

  if (!isChickenDetected(labels)) {
    console.log("[scanChicken] No chicken detected. Stopping pipeline.");
    return {
      is_chicken: false,
      detected_labels: labels,
      message:
        labels.length > 0
          ? "No chicken detected. Found: " + labels.join(", ") + "."
          : "No recognizable objects detected.",
    };
  }

  console.log("[scanChicken] Chicken detected! Proceeding to breed classification...");

  // --- Step 2: Breed Classification ---
  const imageFile = await normalizeToFile(file);
  const startTime = Date.now();

  console.log("[scanChicken] Step 2: Running breed classification...");
  const top_results = await classifyBreed(imageFile);
  console.log("[scanChicken] Breed classification complete:", top_results);

  const elapsed = Date.now() - startTime;
  const remaining = 3000 - elapsed;
  if (remaining > 0) {
    console.log("[scanChicken] Waiting " + remaining + "ms for minimum UX delay...");
    await wait(remaining);
  }

  console.log("[scanChicken] Pipeline complete.");
  return {
    is_chicken: true,
    top_results,
  };
};
