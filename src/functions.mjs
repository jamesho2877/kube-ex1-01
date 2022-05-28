const { randomUUID } = await import("node:crypto");

export function getTimeAndHash() {
  const time = new Date().toISOString();
  return `${time}: ${randomUUID()}`;
};