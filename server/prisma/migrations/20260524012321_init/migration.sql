-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'ACCEPTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Application" (
    "app_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "application_date" TIMESTAMP(3),
    "job_description_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("app_id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "skill_id" TEXT NOT NULL,
    "skill_name" TEXT NOT NULL,
    "category" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("skill_id")
);

-- CreateTable
CREATE TABLE "ApplicationSkill" (
    "app_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,

    CONSTRAINT "ApplicationSkill_pkey" PRIMARY KEY ("app_id","skill_id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "contact_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "linkedin_url" TEXT,
    "last_contact_date" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "ApplicationContact" (
    "app_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,

    CONSTRAINT "ApplicationContact_pkey" PRIMARY KEY ("app_id","contact_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "User"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Application_user_id_idx" ON "Application"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_skill_name_key" ON "Skill"("skill_name");

-- CreateIndex
CREATE INDEX "ApplicationSkill_skill_id_idx" ON "ApplicationSkill"("skill_id");

-- CreateIndex
CREATE INDEX "Contact_user_id_idx" ON "Contact"("user_id");

-- CreateIndex
CREATE INDEX "ApplicationContact_contact_id_idx" ON "ApplicationContact"("contact_id");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationSkill" ADD CONSTRAINT "ApplicationSkill_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "Application"("app_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationSkill" ADD CONSTRAINT "ApplicationSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("skill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationContact" ADD CONSTRAINT "ApplicationContact_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "Application"("app_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationContact" ADD CONSTRAINT "ApplicationContact_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("contact_id") ON DELETE CASCADE ON UPDATE CASCADE;
