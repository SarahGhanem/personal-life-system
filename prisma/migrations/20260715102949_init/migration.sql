-- CreateEnum
CREATE TYPE "GoalCategory" AS ENUM ('HEALTH', 'CAREER', 'PERSONAL', 'SOCIAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Month" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,

    CONSTRAINT "Month_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Week" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,

    CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "category" "GoalCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionBank" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "QuestionBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReflection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyFinance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "totalIncome" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalSavings" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalExpenses" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyFinance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyReflection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "emotions" TEXT,
    "whatWentWell" TEXT,
    "whatWentWrong" TEXT,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyReflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Month_userId_idx" ON "Month"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Month_userId_year_month_key" ON "Month"("userId", "year", "month");

-- CreateIndex
CREATE INDEX "Week_monthId_idx" ON "Week"("monthId");

-- CreateIndex
CREATE UNIQUE INDEX "Week_userId_startDate_key" ON "Week"("userId", "startDate");

-- CreateIndex
CREATE INDEX "WeeklyGoal_weekId_category_idx" ON "WeeklyGoal"("weekId", "category");

-- CreateIndex
CREATE INDEX "DailyNote_weekId_idx" ON "DailyNote"("weekId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyNote_userId_date_key" ON "DailyNote"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionBank_text_key" ON "QuestionBank"("text");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReflection_weekId_key" ON "WeeklyReflection"("weekId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyFinance_monthId_key" ON "MonthlyFinance"("monthId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyReflection_monthId_key" ON "MonthlyReflection"("monthId");

-- CreateIndex
CREATE INDEX "CalendarEvent_userId_date_idx" ON "CalendarEvent"("userId", "date");

-- AddForeignKey
ALTER TABLE "Month" ADD CONSTRAINT "Month_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyGoal" ADD CONSTRAINT "WeeklyGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyGoal" ADD CONSTRAINT "WeeklyGoal_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyNote" ADD CONSTRAINT "DailyNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyNote" ADD CONSTRAINT "DailyNote_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReflection" ADD CONSTRAINT "WeeklyReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReflection" ADD CONSTRAINT "WeeklyReflection_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReflection" ADD CONSTRAINT "WeeklyReflection_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyFinance" ADD CONSTRAINT "MonthlyFinance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyFinance" ADD CONSTRAINT "MonthlyFinance_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyReflection" ADD CONSTRAINT "MonthlyReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyReflection" ADD CONSTRAINT "MonthlyReflection_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;
