// src/services/florenceService.js

import { Client } from "@gradio/client";

const FLORENCE_SPACE = "gokaygokay/Florence-2";
const FLORENCE_MODEL = "microsoft/Florence-2-large";
const HF_TOKEN = process.env.REACT_APP_HF_TOKEN;

const normalizeToFile = async (file) => {
  if (file instanceof File) return file;
  const response = await fetch(file);
  const blob = await response.blob();
  return new File([blob], "sample.jpg", { type: blob.type });
};

const extractLabels = (outputText) => {
  try {
    const parsed = typeof outputText === "string" ? JSON.parse(outputText.replace(/'/g, '"')) : outputText;
    return [...new Set(parsed?.["<OD>"]?.labels ?? [])];
  } catch (e) {
    console.error("[extractLabels] Failed to extract labels:", e);
    return [];
  }
};

const parseGradioError = (err) => {
  if (err && typeof err === "object" && err.type === "status") {
    console.error("[gradioError] Status:", err.stage);
    console.error("[gradioError] Message:", err.message);
    console.error("[gradioError] Full status object:", JSON.stringify(err, null, 2));
    return err.message || "Gradio space returned an error status: " + err.stage;
  }
  return err?.message || String(err);
};

export const detectObjects = async (file) => {
  console.log(
    "[detectObjects] HF_TOKEN loaded:",
    HF_TOKEN ? "YES (starts with: " + HF_TOKEN.slice(0, 2) + "...)" : "NO - token is undefined!",
  );

  console.log("[detectObjects] Normalizing file...");
  const imageFile = await normalizeToFile(file);

  console.log("[detectObjects] Connecting to Florence-2 space...");
  const client = await Client.connect(FLORENCE_SPACE, {
    token: HF_TOKEN,
  });

  console.log("[detectObjects] Running object detection...");
  try {
    const result = await client.predict("/process_image", {
      image: imageFile,
      task_prompt: "Object Detection",
      text_input: null,
      model_id: FLORENCE_MODEL,
    });

    console.log("[detectObjects] Raw response:", result.data[0]);

    const labels = extractLabels(result.data[0]);
    console.log("[detectObjects] Extracted labels:", labels);

    return {
      labels,
      image: result.data[1] ?? null,
    };
  } catch (err) {
    const message = parseGradioError(err);
    console.error("[detectObjects] Prediction failed:", message);
    throw new Error(message);
  }
};

export const isChickenDetected = (labels) => {
  return labels.some((label) => label.toLowerCase().includes("chicken"));
};
