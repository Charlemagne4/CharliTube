export function titlePrompt(params: string) {
  return `Your task is to generate an SEO-focused title for a YouTube video from this description: (${params}). Please follow these guidelines:

- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. NEVER add quotes or ANY additional formatting.`;
}

export function descriptionPrompt(params: string) {
  return `Your task is to create a Youtube video description from this title: (${params}). Please follow these guidelines:

- Be brief. Condense the content into a description that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the description, no other text, annotations, or comments.
- Aim for a description that is 8-12 sentences long and no more than 200 characters.
- NEVER write the title in it and write it as you are interested in the subject`;
}

export const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:

- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

export const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video into a Youtube video description. Please follow these guidelines:

- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 1-3 sentences long and no more than 200 characters.
- ONLY return the description as plain text. Do not add quotes or any additional formatting.
- NEVER write the title in it and write it as you are interested in the subject`;
