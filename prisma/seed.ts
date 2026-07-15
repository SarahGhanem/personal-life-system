import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const QUESTIONS = [
  "What am I most proud of this week?",
  "What drained my energy this week?",
  "What gave me energy this week?",
  "What's one thing I avoided that I should face next week?",
  "Who made a positive difference in my week, and how?",
  "What did I learn about myself this week?",
  "What's one small win I might otherwise overlook?",
  "Where did I show up as my best self this week?",
  "What's a moment I'd like to relive, and why?",
  "What's still weighing on my mind from this week?",
  "What did I do for my physical health this week?",
  "What did I do for my mental health this week?",
  "What boundary did I set (or fail to set) this week?",
  "What am I grateful for this week?",
  "If this week had a title, what would it be?",
  "What's one thing I'd do differently if I could redo this week?",
  "How did I move closer to a long-term goal this week?",
  "What made me laugh or smile this week?",
];

async function main() {
  await prisma.questionBank.createMany({
    data: QUESTIONS.map((text) => ({ text })),
    skipDuplicates: true,
  });
  console.log(`Seeded ${QUESTIONS.length} reflection questions (duplicates skipped).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
