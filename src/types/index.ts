export type MaturityLevel = number;

export type DimensionType = 'concept' | 'process' | 'implementation' | 'integrated';

export type StrategicCycle = 'Zi' | 'An' | 'Au' | 'St'; // Target (Ziel), Analysis (Analyse), Alignment (Ausrichtung), Control (Steuerung)

export type StrategicPartitionId = 'SP1' | 'SP2' | 'SP3' | 'SP4' | 'SP5';

export interface RubricOption {
  value: MaturityLevel;
  label: string;
  description: string;
}

export interface Question {
  id: string;
  dimension: DimensionType;
  title: string;
  questionText: string;
  rubric: RubricOption[];
  defaultPrio: number; // 0 - 5
  defaultRel: number;  // 0 or 1
}

export interface AssessmentFunction {
  id: string;
  code: string; // e.g. "1.1", "3.4"
  name: string;
  partitionId: StrategicPartitionId;
  moduleId: string; // M1 - M15
  moduleName: string;
  cycle: StrategicCycle;
  weight: number; // Relative weight within the partition (0 to 1, or 1 to 5)
  definition: string;
  goals: string[];
  probeQuestions: string[];
  questions: {
    concept: Question;
    process: Question;
    implementation: Question;
    integrated: Question; // For quick check mode
  };
}

export interface StrategicPartition {
  id: StrategicPartitionId;
  code: string;
  name: string;
  weight: number; // 0.25, 0.25, 0.25, 0.15, 0.10
  description: string;
  iconName: string;
}

export interface ModuleDefinition {
  id: string; // M1 - M15
  code: string;
  name: string;
  partitionId: StrategicPartitionId;
}

export interface AnswerItem {
  asIs: MaturityLevel;
  plan: MaturityLevel;
  prio: number;
  rel: number;
  updatedAt?: string;
}

export interface ImprovementAction {
  id: string;
  afId: string;
  dimension?: DimensionType;
  index: number;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  owner: string;
  targetDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface CompanyProfile {
  id: string;
  name: string;
  shortName: string;
  logoText: string;
  logoBg: string;
  logoColor: string;
  logoBorder?: string;
  logoUrl?: string; // Optional custom uploaded logo data URL / image URL
  industry: string;
  country: string;
  assessments: { id: string; name: string; date: string; status: 'Active' | 'Completed' | 'Draft' }[];
}

export interface AssessmentProfile {
  id: string;
  companyId?: string;
  companyName: string;
  assessmentName: string;
  mode: 'comprehensive' | 'quick_check';
  updatedAt: string;
  // Map of question id -> AnswerItem
  answers: Record<string, AnswerItem>;
  // Map of afId -> qualitative notes
  statusNotes: Record<string, string>;
  // Improvement actions
  actions: ImprovementAction[];
}

export interface AFScore {
  afId: string;
  code: string;
  name: string;
  partitionId: StrategicPartitionId;
  moduleId: string;
  cycle: StrategicCycle;
  asIs: number;
  plan: number;
  gap: number;
  weight: number;
  dimensionScores: {
    concept: { asIs: number; plan: number; prio: number; rel: number };
    process: { asIs: number; plan: number; prio: number; rel: number };
    implementation: { asIs: number; plan: number; prio: number; rel: number };
    integrated?: { asIs: number; plan: number };
  };
}

export interface SPScore {
  partitionId: StrategicPartitionId;
  name: string;
  weight: number;
  asIs: number;
  plan: number;
  gap: number;
}

export interface ModuleScore {
  moduleId: string;
  name: string;
  partitionId: StrategicPartitionId;
  asIs: number;
  plan: number;
  gap: number;
}

export interface CycleScore {
  cycle: StrategicCycle;
  label: string;
  asIs: number;
  plan: number;
  gap: number;
}

export interface OverallMaturityResult {
  asIs: number;
  plan: number;
  gap: number;
  stageNumber: number; // 1 to 5
  stageName: string;
  stageDescription: string;
  spScores: Record<StrategicPartitionId, SPScore>;
  afScores: Record<string, AFScore>;
  moduleScores: Record<string, ModuleScore>;
  cycleScores: Record<StrategicCycle, CycleScore>;
  completedAFs: number;
  totalAFs: number;
  completionRate: number;
}
