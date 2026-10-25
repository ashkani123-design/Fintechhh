/**
 * Typed Data Structures for Expert Elicitation and Model Validation System
 * Designed specifically for 15-20 invited expert meeting evaluating:
 * Objective A: Literature-Derived Baseline Model Validation
 * Objective B: Iran-Specific FinTech Architecture Development
 */

export type ConstructDecision =
  | 'accept_as_is'
  | 'accept_with_modifications'
  | 'reject'
  | 'unable_to_assess';

export interface ConstructRatings {
  conceptualClarity: number | null; // 1-5, null if 'not sufficiently familiar'
  relevanceToProblem: number | null; // 1-5
  theoreticalJustification: number | null; // 1-5
  applicabilityToIran: number | null; // 1-5
  importanceForPhenomenon: number | null; // 1-5
  distinctiveness: number | null; // 1-5
}

export interface ConstructAssessment {
  constructId: string;
  decision: ConstructDecision;
  ratings: ConstructRatings;
  confidence: number; // 1-5
  explanation: string;
  suggestedModification?: string;
  conceptualOverlap?: string;
  missingAspects?: string;
  iranianConditions?: string;
  audioTranscript?: string;
  lastUpdated: string;
}

export interface OverallModelRatings {
  conceptualCoherence: number | null; // 1-5
  domainCoverage: number | null; // 1-5
  constructCompleteness: number | null; // 1-5
  dimensionConsistency: number | null; // 1-5
  relationshipPlausibility: number | null; // 1-5
  suitabilityForIran: number | null; // 1-5
  practicalUsefulness: number | null; // 1-5
}

export interface OverallModelValidation {
  ratings: Partial<OverallModelRatings>;
  q1OmittedDimension: string;
  q2Redundancies: string;
  q3QuestionableRelationships: string;
  q4UnsoundAssumptionsIran: string;
  q5SingleWeakness: string;
  lastUpdated?: string;
}

export interface ProposedMissingConstruct {
  id: string;
  nameFa: string;
  nameEn: string;
  preliminaryDefinition: string;
  assignedDimension: string;
  whyNecessary: string;
  whyExistingInadequate: string;
  iranSpecificEvidence: string;
  proposalType: 'new_construct' | 'extension_of_existing' | 'contextual_condition';
  proposedAt: string;
}

export interface IranContextualFactorAssessment {
  factorId: string;
  promptTopic: string;
  description: string;
  mechanism: string;
  theoreticalRole: 'core_construct' | 'contextual_condition' | 'moderator' | 'mediator' | 'antecedent' | 'outcome';
  supportingRationale: string;
  expectedDirection: 'positive' | 'negative' | 'bidirectional' | 'conditional';
  confidence: number; // 1-5
  isActive: boolean;
}

export interface ProposedRelationship {
  id: string;
  sourceConstruct: string;
  targetConstruct: string;
  direction: 'unidirectional' | 'bidirectional';
  relationshipType: 'direct_effect' | 'mediation' | 'moderation' | 'reciprocal' | 'enabling_condition' | 'constraint';
  mechanism: string;
  conditions: string;
  evidence: string;
  confidence: number; // 1-5
}

export interface PriorityItem {
  proposalId: string;
  title: string;
  rationale: string;
}

export interface IranModelPrioritization {
  top1?: PriorityItem;
  top2?: PriorityItem;
  top3?: PriorityItem;
}

export interface ExpertConsentRecord {
  hasAgreedToResearch: boolean;
  hasAgreedToAudioRecording: boolean;
  agreedTimestamp?: string;
}

export interface OralDiscussionTopicState {
  topicId: string;
  topicTitleFa: string;
  audioUrl?: string;
  rawTranscript?: string;
  refinedText: string;
  lastUpdated?: string;
}

export interface FullExpertElicitationState {
  expertId: string;
  invitationCode: string;
  consent: ExpertConsentRecord;
  profile: {
    name: string;
    organization: string;
    professionalRole: string;
    primaryExpertise: string;
    yearsExperience: string;
    familiarityEcosystem: number; // 1-5
    familiarityTheoretical: number; // 1-5
    academicDegree: string;
    email?: string;
  };
  constructAssessments: Record<string, ConstructAssessment>;
  overallValidation: OverallModelValidation;
  oralFeedback: Record<string, OralDiscussionTopicState>;
  missingConstructs: ProposedMissingConstruct[];
  contextualFactors: Record<string, IranContextualFactorAssessment>;
  proposedRelationships: ProposedRelationship[];
  prioritization: IranModelPrioritization;
  isFinalSubmitted: boolean;
  submittedAt?: string;
  lastSavedAt: string;
  dematelMatrix?: (number | null)[][];
  dematelNotes?: string;
  anpMethod?: 'danp' | 'pairwise';
  anpComparisons?: Record<string, { id: string; dimA: string; dimB: string; preferredSide?: 'A' | 'B' | 'Equal' | null; intensity?: number | null }>;
  anpNotes?: string;
}

export const DEFAULT_EXPERT_ELICITATION_STATE: FullExpertElicitationState = {
  expertId: 'EXP-001',
  invitationCode: 'INV-FINTECH-001',
  consent: {
    hasAgreedToResearch: false,
    hasAgreedToAudioRecording: false,
  },
  profile: {
    name: '',
    organization: '',
    professionalRole: '',
    primaryExpertise: '',
    yearsExperience: '',
    familiarityEcosystem: 0,
    familiarityTheoretical: 0,
    academicDegree: '',
  },
  constructAssessments: {},
  overallValidation: {
    ratings: {},
    q1OmittedDimension: '',
    q2Redundancies: '',
    q3QuestionableRelationships: '',
    q4UnsoundAssumptionsIran: '',
    q5SingleWeakness: '',
  },
  oralFeedback: {},
  missingConstructs: [],
  contextualFactors: {},
  proposedRelationships: [],
  prioritization: {
    top1: undefined,
    top2: undefined,
    top3: undefined,
  },
  dematelMatrix: [
    [0, null, null, null],
    [null, 0, null, null],
    [null, null, 0, null],
    [null, null, null, 0],
  ],
  dematelNotes: '',
  anpMethod: 'pairwise',
  anpComparisons: {},
  anpNotes: '',
  isFinalSubmitted: false,
  lastSavedAt: new Date().toISOString(),
};
