// Workout Types
export interface WorkoutSet {
  id?: string | number;
  type: string;
  weight_kg: number;
  reps: number;
  distance_meters?: number;
  duration_seconds?: number;
  custom_metric?: any;
}

export interface Exercise {
  exercise_template_id: string;
  superset_id?: string;
  rest_seconds: number;
  notes: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  created_at?: string;
}

export interface WorkoutResponse {
  workouts: Workout[];
}

// Routine Types
export interface Routine {
  id: string;
  title: string;
  folder_id: string | null;
  updated_at: string;
  created_at: string;
  exercises: Exercise[];
}

export interface RoutineResponse {
  page: number;
  page_count: number;
  routines: Routine[];
}

// Exercise Template Types
export interface ExerciseTemplate {
  id: string;
  title: string;
  type: string;
  primary_muscle_group: string;
  secondary_muscle_groups: string[];
  equipment: string;
  is_custom: boolean;
}

export interface WorkoutTemplatesData {
  exercise_templates: ExerciseTemplate[];
}

// AI Coach Types
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Firebase/Gemini Types
export interface SafetySetting {
  category: string;
  threshold: string;
}

export interface GenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  candidateCount?: number;
  responseMimeType?: string;
}

export interface Content {
  role: string;
  parts: Array<{ text: string }>;
}