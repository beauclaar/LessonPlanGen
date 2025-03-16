import k5Data from '@/data/k5.json';
import g612Data from '@/data/612.json';

export interface LessonPlanData {
  activities: string[];
  assessments: {
    formative: string[];
    summative: string[];
  };
  supports: {
    sensory: string[];
    graphic: string[];
    interactive: string[];
  };
}

// Common options that are available for all grade levels
export const commonOptions = {
  activities: [
    'Partner work',
    'Small group discussion',
    'Vocabulary practice',
    'Graphic organizer',
    'Writing practice'
  ],
  assessments: {
    formative: [
      'Exit ticket',
      'Observation checklist',
      'Group discussion',
      'Portfolio review',
      'Quick write'
    ]
  }
};

export function getGradeLevelData(gradeLevel: string): LessonPlanData {
  const gradeNum = gradeLevel.toLowerCase() === 'k' ? 0 : parseInt(gradeLevel, 10);
  return (gradeNum >= 0 && gradeNum <= 5) ? k5Data : g612Data;
}

export function getAvailableActivities(gradeLevel: string): string[] {
  const data = getGradeLevelData(gradeLevel);
  return [...data.activities, ...commonOptions.activities];
}

export function getAvailableAssessments(gradeLevel: string) {
  const data = getGradeLevelData(gradeLevel);
  return {
    formative: [...data.assessments.formative, ...commonOptions.assessments.formative],
    summative: data.assessments.summative
  };
}

export function getAvailableSupports(gradeLevel: string) {
  const data = getGradeLevelData(gradeLevel);
  return data.supports;
}