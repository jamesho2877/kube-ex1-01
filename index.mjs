const { randomUUID } = await import("node:crypto");

const logAfter5s = () => {
  const time = new Date().toISOString();
  console.log(`${time}: ${randomUUID()}`);
  setTimeout(logAfter5s, 5000);
};

logAfter5s();