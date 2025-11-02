console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log(
  "DATABASE_URL value:",
  process.env.DATABASE_URL ? "SET" : "NOT SET"
);
