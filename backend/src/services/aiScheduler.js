// after you receive `response`
let json = null;

// try a few response shapes
if (response?.choices?.[0]?.message?.content) {
  json = response.choices[0].message.content;
} else if (response?.output?.[0]?.content?.[0]?.text) {
  json = response.output[0].content[0].text;
} else if (typeof response === "string") {
  json = response;
} else if (response?.choices?.[0]?.text) {
  json = response.choices[0].text;
}

try {
  return JSON.parse(json);
} catch {
  // If JSON failed, return empty array (or optionally try to extract timestamps via regex)
  return [];
}
