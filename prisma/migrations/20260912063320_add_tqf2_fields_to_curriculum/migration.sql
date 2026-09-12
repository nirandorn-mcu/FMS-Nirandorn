-- AlterTable
ALTER TABLE "curriculums" ADD COLUMN     "admission_req" TEXT,
ADD COLUMN     "campus_location" VARCHAR(255),
ADD COLUMN     "career_paths" TEXT,
ADD COLUMN     "duration_years" INTEGER DEFAULT 4,
ADD COLUMN     "graduation_criteria" TEXT,
ADD COLUMN     "objectives" TEXT,
ADD COLUMN     "philosophy" TEXT,
ADD COLUMN     "plos" JSONB DEFAULT '[]',
ADD COLUMN     "study_type" VARCHAR(255),
ADD COLUMN     "tuition_fees" VARCHAR(255);
