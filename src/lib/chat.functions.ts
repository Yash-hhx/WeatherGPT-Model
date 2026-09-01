import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider, createOpenAiProvider } from "./ai-gateway.server";

const ChatInput = z.object({
  hazard: z.string(),
  states: z.string(),
  context: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

export const askWeatherGpt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const openaiKey = process.env["OPENAI_API_KEY"];
    
    if (!lovableKey && !openaiKey) {
      throw new Error("AI not configured. Set LOVABLE_API_KEY or OPENAI_API_KEY in environment.");
    }

    const gateway = lovableKey 
      ? createLovableAiGatewayProvider(lovableKey)
      : createOpenAiProvider(openaiKey!);

    const modelName = lovableKey 
      ? "google/gemini-3.7-flash"
      : "gpt-4o-mini";

    const result = streamText({
      model: gateway(modelName),
      system: [
        "You are WeatherGPT, a tactical weather and disaster-intelligence analyst for INDIA, inside an emergency operations console.",
        "Ground everything in the Indian context: IMD colour-coded warnings (red/orange/yellow/green), CWC river danger levels, CPCB AQI and GRAP stages, NDMA/NDRF/SDRF and state SDMA/DDMA protocols, Sachet cell broadcast and the Damini lightning app.",
        "Use Indian units, place names, districts, states, crops (kharif/rabi, paddy, parali), monsoon terminology, INR and IST timings. Reference schemes like PMFBY, MGNREGA and PM-KISAN where relevant.",
        "Answer in tight, operational language. No pleasantries, no markdown headings, no emoji.",
        "Keep responses under 120 words unless the user asks for a full briefing.",
        "When relevant, give occupation-specific precautions (civilians, farmers, businesses, commuters, government authorities).",
        "Always state uncertainty plainly and never invent official evacuation orders.",
        `Currently monitored event: ${data.hazard}.`,
        `Affected states / UTs: ${data.states}.`,
        `Live telemetry: ${data.context}`,
      ].join("\n"),
      messages: data.messages,
    });

    return { text: await result.text };
  });
