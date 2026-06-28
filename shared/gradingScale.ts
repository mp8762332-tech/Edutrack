/**
 * Centralized Grading Scale
 * Ensures consistent grading across all modules (Mid-Term, End-of-Term, etc.)
 * 
 * Scale:
 * 80-100 = A (Exceptional)
 * 60-79 = B (Outstanding)
 * 49-59 = C (Satisfactory)
 * 20-39 = D (Basic)
 * 0-19 = E (Elementary)
 */

export type Grade = "A" | "B" | "C" | "D" | "E";

export interface GradeInfo {
  grade: Grade;
  minScore: number;
  maxScore: number;
  remark: string;
  description: string;
}

export const GRADING_SCALE: Record<Grade, GradeInfo> = {
  A: {
    grade: "A",
    minScore: 80,
    maxScore: 100,
    remark: "Exceptional",
    description: "Excellent performance with mastery of concepts",
  },
  B: {
    grade: "B",
    minScore: 60,
    maxScore: 79,
    remark: "Outstanding",
    description: "Very good performance with strong understanding",
  },
  C: {
    grade: "C",
    minScore: 49,
    maxScore: 59,
    remark: "Satisfactory",
    description: "Good performance meeting expected standards",
  },
  D: {
    grade: "D",
    minScore: 20,
    maxScore: 39,
    remark: "Basic",
    description: "Basic performance with gaps in understanding",
  },
  E: {
    grade: "E",
    minScore: 0,
    maxScore: 19,
    remark: "Elementary",
    description: "Needs improvement with significant gaps",
  },
};

/**
 * Calculate grade from score
 */
export function calculateGrade(score: number): Grade {
  if (score >= 80 && score <= 100) return "A";
  if (score >= 60 && score <= 79) return "B";
  if (score >= 49 && score <= 59) return "C";
  if (score >= 20 && score <= 39) return "D";
  return "E";
}

/**
 * Get grade info
 */
export function getGradeInfo(grade: Grade): GradeInfo {
  return GRADING_SCALE[grade];
}

/**
 * Get remark for score
 */
export function getRemarkForScore(score: number): string {
  const grade = calculateGrade(score);
  return GRADING_SCALE[grade].remark;
}

/**
 * Get description for score
 */
export function getDescriptionForScore(score: number): string {
  const grade = calculateGrade(score);
  return GRADING_SCALE[grade].description;
}

/**
 * Validate score is within valid range
 */
export function isValidScore(score: number): boolean {
  return score >= 0 && score <= 100;
}

/**
 * Calculate average score from multiple scores
 */
export function calculateAverageScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  const average = sum / scores.length;
  return Math.round(average * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate paper average (Paper1 + Paper2) / 2
 */
export function calculatePaperAverage(paper1: number, paper2?: number): number {
  if (paper2 === undefined || paper2 === null) {
    return Math.round(paper1 * 100) / 100;
  }
  const average = (paper1 + paper2) / 2;
  return Math.round(average * 100) / 100;
}

/**
 * Get all grades in order
 */
export function getAllGrades(): Grade[] {
  return ["A", "B", "C", "D", "E"];
}

/**
 * Get grade boundaries
 */
export function getGradeBoundaries(): Array<{ grade: Grade; min: number; max: number }> {
  return [
    { grade: "A", min: 80, max: 100 },
    { grade: "B", min: 60, max: 79 },
    { grade: "C", min: 49, max: 59 },
    { grade: "D", min: 20, max: 39 },
    { grade: "E", min: 0, max: 19 },
  ];
}

/**
 * Validate score range for a specific grade
 */
export function isScoreInGradeRange(score: number, grade: Grade): boolean {
  const gradeInfo = GRADING_SCALE[grade];
  return score >= gradeInfo.minScore && score <= gradeInfo.maxScore;
}

/**
 * Get color for grade (for UI display)
 */
export function getGradeColor(grade: Grade): string {
  const colors: Record<Grade, string> = {
    A: "#22c55e", // Green
    B: "#3b82f6", // Blue
    C: "#f59e0b", // Amber
    D: "#ef4444", // Red
    E: "#6b7280", // Gray
  };
  return colors[grade];
}

/**
 * Get badge variant for grade (for shadcn/ui Badge)
 */
export function getGradeBadgeVariant(grade: Grade): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<Grade, "default" | "secondary" | "destructive" | "outline"> = {
    A: "default",
    B: "secondary",
    C: "outline",
    D: "destructive",
    E: "destructive",
  };
  return variants[grade];
}
