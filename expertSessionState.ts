/**
 * EXPERT SESSION STATE AND DATABASE SCHEMAS
 * Models the complete 24-step respondent journey for the Expert Portal
 * and maintains auditability, versioning, and researcher approval flags.
 */

export type UserRole = 'expert' | 'researcher';

export type ExpertPortalStep =
  | 'welcome_consent'          // 1. Welcome & Consent
  | 'expert_profile'            // 2. Expert Profile & Qualifications
  | 'framework_explorer'        // 3. Framework Familiarization (Interactive Baseline)
  | 'overall_validation'        // 4. Overall Framework Validation (Q-OVR-01 to 12)
  | 'hd_validation'             // 5. Higher-Order Dimensions Validation (HD1-HD4)
  | 'st_validation'             // 6. Second-Order Themes Validation (ST1-ST7)
  | 'mapping_validation'        // 7. HD–ST Mapping Validation & Custom Remapping
  | 'boundary_validation'       // 8. Boundary Conditions Validation
  | 'outcome_validation'        // 9. Outcome Validation
  | 'contradiction_validation'  // 10. Contradictions C1–C6 Validation
  | 'relationship_validation'   // 11. Relationship Validation (R1–R7)
  | 'feedback_loop_validation'  // 12. Feedback Loop Validation (Micro & Macro)
  | 'missing_elements'          // 13. Completeness Check & Missing Elements
  | 'final_global_judgment'     // 14. Final Global Judgment (Q-FINAL-01 to 03)
  | 'iran_contextualization'    // 15. Iran Contextualization (Applicability & Adaptation)
  | 'iran_discovery'            // 16. Iran Context Discovery (Q-IR-01 to 11 with voice)
  | 'fuzzy_delphi'              // 17. Fuzzy Delphi Screening
  | 'gap_assessment'            // 18. Importance, Current State, Feasibility, Urgency
  | 'dematel_module'            // 19. DEMATEL Direct Influence Matrix
  | 'anp_module'                // 20. ANP Pairwise Comparisons & Consistency Check
  | 'ideal_architecture'        // 21. Ideal Architecture Synthesis & Backward Traceability
  | 'final_perspective';        // 22. Expert Final Perspective (Q-END-01 to 07)

export interface ExpertProfileState {
  hasConsented: boolean; // Q-CONSENT-01
  consentTimestamp?: string;
  name: string;
  email: string;
  organization: string;
  primaryExpertiseAreas: string[]; // Q-EXP-01
  primaryRole: string; // Q-EXP-02
  totalYearsExperience: string; // Q-EXP-03 (<5, 5-10, 11-15, 16-20, >20)
  digitalFinanceYearsExperience: string; // Q-EXP-04 (<3, 3-5, 6-10, 11-15, >15)
  academicBackground: string; // Q-EXP-05
  familiarityDigitalInvestment: number; // Q-EXP-06 (1-7)
  familiarityAiInvestment: number; // Q-EXP-07 (1-7)
  familiarityIranianEcosystem: number; // Q-EXP-08 (1-7)
  directExperiences: string[]; // Q-EXP-09
}

export interface OverallValidationState {
  // Q-OVR-01 to Q-OVR-10 (1-7 or null for 'insufficient')
  ratings: Record<string, number | 'insufficient' | null>;
  weaknessQ11: string; // Open response + voice
  strengthQ12: string; // Open response + voice
}

export interface HDValidationItemState {
  relevance: number | 'insufficient' | null; // 1-7
  adequacy: number | 'insufficient' | null;
  clarity: number | 'insufficient' | null;
  distinctiveness: number | 'insufficient' | null;
  placement: number | 'insufficient' | null;
  decision: 'retain_no_change' | 'retain_minor' | 'retain_major' | 'merge' | 'remove' | 'insufficient';
  explanation: string;
}

export interface STValidationItemState {
  relevance: number | 'insufficient' | null;
  clarity: number | 'insufficient' | null;
  literatureAdequacy: number | 'insufficient' | null;
  distinctiveness: number | 'insufficient' | null;
  placement: number | 'insufficient' | null;
  decision: 'retain' | 'revise' | 'merge' | 'remove' | 'insufficient';
  suggestedChanges: string;
}

export interface MappingValidationState {
  agreementLevel: 'full' | 'minor_change' | 'major_change';
  suggestedMapping: Record<string, 'HD1' | 'HD2' | 'HD3' | 'HD4'>;
  comments: string;
}

export interface BoundaryValidationItemState {
  meaningfulChangeScore: number | 'insufficient' | null; // 1-7
  retentionDecision: 'yes' | 'no' | 'reposition';
  comments?: string;
}

export interface OutcomeValidationItemState {
  relevance: number | 'insufficient' | null;
  adequacy: number | 'insufficient' | null;
  placement: number | 'insufficient' | null;
  decision: 'retain' | 'revise' | 'remove';
  comments: string;
}

export interface ContradictionValidationItemState {
  theoreticalSignificance: number | 'insufficient' | null; // 1-7
  practicalSignificance: number | 'insufficient' | null; // 1-7
  decision: 'retain' | 'revise' | 'remove';
  comment: string;
}

export interface RelationshipValidationItemState {
  presenceScore: number | 'insufficient' | null; // 1-7
  directionScore: number | 'insufficient' | null; // 1-7
  strengthScore: number | 'insufficient' | null; // 1-7
  preferredType: string;
  retentionDecision: 'yes' | 'revised' | 'removed';
  comment: string;
}

export interface FeedbackLoopValidationItemState {
  conceptuallyMeaningful: number | 'insufficient' | null; // 1-7
  directionAppropriate: number | 'insufficient' | null; // 1-7
  decision: 'yes' | 'revised' | 'remove';
  comment: string;
}

export interface ExpertMissingElementItem {
  id: string;
  name: string;
  description: string;
  suggestedCategory: string;
  suggestedLocation: string;
  importance: number; // 1-7
  comment: string;
  approvalStatus: 'pending_review' | 'approved' | 'rejected' | 'merged';
}

export interface FinalGlobalJudgmentState {
  robustForArchitecture: 'yes_no_change' | 'yes_minor' | 'yes_substantial' | 'no'; // Q-FINAL-01
  singleMostImportantModification: string; // Q-FINAL-02
  recommendContextualizationForIran: 'definitely_yes' | 'probably_yes' | 'uncertain' | 'probably_no' | 'definitely_no'; // Q-FINAL-03
}

export interface IranContextualizationItemState {
  applicability: number | 'insufficient' | null; // 1-7
  transferability: number | 'insufficient' | null; // 1-7
  requiredAdaptation: number | 'insufficient' | null; // 1-7
  strategicImportance: number | 'insufficient' | null; // 1-7
  currentState: number | 'insufficient' | null; // 1-7
  feasibility: number | 'insufficient' | null; // 1-7
  urgency: number | 'insufficient' | null; // 1-7
  treatment: 'transfer' | 'adapt' | 'redesign' | 'remove' | 'uncertain';
}

export interface IranDiscoveryItemState {
  questionId: string;
  answerText: string;
  tag?: string;
  confidenceScore: number; // 1-7
  audioUrl?: string;
}

export interface AnpComparisonItem {
  pairId: string;
  dimensionId?: string;
  factorA: string;
  factorB: string;
  preferredSide: 'A' | 'B' | 'Equal';
  intensity: number; // 1, 3, 5, 7, 9
}

export interface FinalPerspectiveState {
  qEnd01Appropriateness: number; // 1-7
  qEnd02Coherence: number; // 1-7
  qEnd03Implementability: number; // 1-7
  qEnd04HighestPriority: string;
  qEnd05LowestPriority: string;
  qEnd06MajorRisk: string;
  qEnd07OneChange: string;
}

export interface CompleteExpertSession {
  expertId: string;
  roundId: string;
  frameworkVersion: string;
  currentStep: ExpertPortalStep;
  completedSteps: ExpertPortalStep[];
  profile: ExpertProfileState;
  overallValidation: OverallValidationState;
  hdValidation: Record<string, HDValidationItemState>;
  stValidation: Record<string, STValidationItemState>;
  mappingValidation: MappingValidationState;
  boundaryValidation: Record<string, BoundaryValidationItemState>;
  missingBoundaryConditions: string;
  outcomeValidation: Record<string, OutcomeValidationItemState>;
  missingOutcomes: string;
  contradictionValidation: Record<string, ContradictionValidationItemState>;
  relationshipValidation: Record<string, RelationshipValidationItemState>;
  feedbackLoopValidation: Record<string, FeedbackLoopValidationItemState>;
  missingElements: ExpertMissingElementItem[];
  finalGlobalJudgment: FinalGlobalJudgmentState;
  iranContextualization: Record<string, IranContextualizationItemState>;
  iranDiscovery: Record<string, IranDiscoveryItemState>;
  fuzzyDelphiRatings: Record<string, number | 'insufficient' | null>; // 1-5 scale
  gapAssessments: Record<
    string,
    { importance: number; currentState: number; feasibility: number; urgency: number }
  >;
  dematelMatrixRatings: (number | null)[][]; // 4x4 or NxN
  anpComparisons: Record<string, AnpComparisonItem>;
  finalPerspective: FinalPerspectiveState;
  lastSavedTimestamp: string;
}

export const INITIAL_EXPERT_PROFILE: ExpertProfileState = {
  hasConsented: false,
  name: '',
  email: '',
  organization: '',
  primaryExpertiseAreas: [],
  primaryRole: '',
  totalYearsExperience: '11–15',
  digitalFinanceYearsExperience: '6–10',
  academicBackground: 'Finance',
  familiarityDigitalInvestment: 6,
  familiarityAiInvestment: 5,
  familiarityIranianEcosystem: 6,
  directExperiences: [],
};

export const INITIAL_EXPERT_SESSION: CompleteExpertSession = {
  expertId: 'EXP-' + Math.floor(1000 + Math.random() * 9000),
  roundId: 'ROUND-1',
  frameworkVersion: 'v1.0',
  currentStep: 'welcome_consent',
  completedSteps: [],
  profile: INITIAL_EXPERT_PROFILE,
  overallValidation: {
    ratings: {},
    weaknessQ11: '',
    strengthQ12: '',
  },
  hdValidation: {},
  stValidation: {},
  mappingValidation: {
    agreementLevel: 'full',
    suggestedMapping: {
      ST1: 'HD1',
      ST2: 'HD2',
      ST3: 'HD3',
      ST4: 'HD3',
      ST5: 'HD1',
      ST6: 'HD4',
      ST7: 'HD2',
    },
    comments: '',
  },
  boundaryValidation: {},
  missingBoundaryConditions: '',
  outcomeValidation: {},
  missingOutcomes: '',
  contradictionValidation: {},
  relationshipValidation: {},
  feedbackLoopValidation: {},
  missingElements: [],
  finalGlobalJudgment: {
    robustForArchitecture: null as any,
    singleMostImportantModification: '',
    recommendContextualizationForIran: null as any,
  },
  iranContextualization: {},
  iranDiscovery: {},
  fuzzyDelphiRatings: {},
  gapAssessments: {},
  dematelMatrixRatings: [
    [0, null, null, null],
    [null, 0, null, null],
    [null, null, 0, null],
    [null, null, null, 0],
  ],
  anpComparisons: {},
  finalPerspective: {
    qEnd01Appropriateness: null as any,
    qEnd02Coherence: null as any,
    qEnd03Implementability: null as any,
    qEnd04HighestPriority: '',
    qEnd05LowestPriority: '',
    qEnd06MajorRisk: '',
    qEnd07OneChange: '',
  },
  lastSavedTimestamp: new Date().toISOString(),
};
