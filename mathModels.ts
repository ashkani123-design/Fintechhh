/**
 * Mathematical engines for:
 * 1. Fuzzy DEMATEL (Direct -> Normalized -> Total Matrix, D+R Prominence, D-R Cause/Effect)
 * 2. DANP (DEMATEL-based Analytic Network Process - Unweighted, Weighted, Limit Supermatrix)
 * 3. Fuzzy Delphi Screening (Triangular Fuzzy Numbers & Defuzzification)
 * 4. Delphi Statistical Consensus & CVR/CVI Metrics
 */

// =========================================================================
// 1. MATRIX ALGEBRA UTILITIES
// =========================================================================

/**
 * Creates an N x N identity matrix
 */
export function identityMatrix(n: number): number[][] {
  const I: number[][] = [];
  for (let i = 0; i < n; i++) {
    I[i] = [];
    for (let j = 0; j < n; j++) {
      I[i][j] = i === j ? 1 : 0;
    }
  }
  return I;
}

/**
 * Subtracts matrix B from matrix A (A - B)
 */
export function subtractMatrices(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  const result: number[][] = [];
  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < n; j++) {
      result[i][j] = A[i][j] - B[i][j];
    }
  }
  return result;
}

/**
 * Multiplies two N x N matrices (A * B)
 */
export function multiplyMatrices(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  const result: number[][] = [];
  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

/**
 * Inverts an N x N matrix using Gauss-Jordan elimination with partial pivoting.
 */
export function invertMatrix(A: number[][]): number[][] {
  const n = A.length;
  // Clone A and augment with identity matrix
  const M: number[][] = [];
  for (let i = 0; i < n; i++) {
    M[i] = [...A[i]];
    for (let j = 0; j < n; j++) {
      M[i].push(i === j ? 1 : 0);
    }
  }

  // Forward & backward elimination
  for (let i = 0; i < n; i++) {
    // Pivot selection
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }

    if (Math.abs(M[maxRow][i]) < 1e-12) {
      // Degenerate/singular matrix fallback: add slight ridge regularization
      M[maxRow][i] += 1e-6;
    }

    // Swap rows
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    // Scale current row
    const pivot = M[i][i];
    for (let j = 0; j < 2 * n; j++) {
      M[i][j] /= pivot;
    }

    // Eliminate other rows
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = M[k][i];
        for (let j = 0; j < 2 * n; j++) {
          M[k][j] -= factor * M[i][j];
        }
      }
    }
  }

  // Extract right half
  const inv: number[][] = [];
  for (let i = 0; i < n; i++) {
    inv[i] = M[i].slice(n);
  }
  return inv;
}

// =========================================================================
// 2. FUZZY DEMATEL ENGINE
// =========================================================================

export interface DematelResult {
  directMatrix: number[][];
  normalizedMatrix: number[][];
  totalRelationMatrix: number[][];
  D: number[]; // Row sum (influence given)
  R: number[]; // Column sum (influence received)
  DplusR: number[]; // Prominence (importance in system)
  DminusR: number[]; // Net cause (>0) or net effect (<0)
  thresholdAlpha: number; // Mean of T
  causeEffectGroup: ('cause' | 'effect')[];
}

/**
 * Computes the complete DEMATEL model:
 * 1. Scale factor s = max(max row sum, max col sum)
 * 2. Normalized matrix X = A / s
 * 3. Total relation matrix T = X * (I - X)^(-1)
 * 4. D = sum rows(T), R = sum cols(T)
 * 5. Prominence = D + R, Relation = D - R
 */
export function computeDematel(directMatrix: number[][]): DematelResult {
  const n = directMatrix.length;

  // Compute row and column sums of direct matrix
  let maxRowSum = 0;
  let maxColSum = 0;

  for (let i = 0; i < n; i++) {
    let rSum = 0;
    for (let j = 0; j < n; j++) {
      rSum += directMatrix[i][j];
    }
    if (rSum > maxRowSum) maxRowSum = rSum;
  }

  for (let j = 0; j < n; j++) {
    let cSum = 0;
    for (let i = 0; i < n; i++) {
      cSum += directMatrix[i][j];
    }
    if (cSum > maxColSum) maxColSum = cSum;
  }

  const s = Math.max(maxRowSum, maxColSum, 1);

  // Normalized direct-relation matrix X
  const X: number[][] = [];
  for (let i = 0; i < n; i++) {
    X[i] = [];
    for (let j = 0; j < n; j++) {
      X[i][j] = directMatrix[i][j] / s;
    }
  }

  // Total relation matrix T = X * (I - X)^(-1)
  const I = identityMatrix(n);
  const I_minus_X = subtractMatrices(I, X);
  const inv = invertMatrix(I_minus_X);
  const T = multiplyMatrices(X, inv);

  // D (row sums) and R (column sums)
  const D: number[] = new Array(n).fill(0);
  const R: number[] = new Array(n).fill(0);

  let totalSum = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      D[i] += T[i][j];
      R[j] += T[i][j];
      totalSum += T[i][j];
    }
  }

  const DplusR: number[] = [];
  const DminusR: number[] = [];
  const causeEffectGroup: ('cause' | 'effect')[] = [];

  for (let i = 0; i < n; i++) {
    DplusR[i] = D[i] + R[i];
    DminusR[i] = D[i] - R[i];
    causeEffectGroup[i] = DminusR[i] >= 0 ? 'cause' : 'effect';
  }

  const thresholdAlpha = totalSum / (n * n);

  return {
    directMatrix,
    normalizedMatrix: X,
    totalRelationMatrix: T,
    D,
    R,
    DplusR,
    DminusR,
    thresholdAlpha,
    causeEffectGroup,
  };
}

// =========================================================================
// 3. DANP (DEMATEL-BASED ANP) ENGINE
// =========================================================================

export interface DanpResult {
  unweightedSupermatrix: number[][];
  weightedSupermatrix: number[][];
  limitSupermatrix: number[][];
  globalWeights: number[]; // sum to 100%
  rankedIndices: number[]; // indices sorted by weight descending
}

/**
 * Computes DANP weights:
 * 1. Transposes & column-normalizes T to form unweighted supermatrix W
 * 2. Multiplies by dimension weights to form stochastic weighted supermatrix
 * 3. Computes limit supermatrix by raising W to powers until convergence
 * 4. Extracts stable global priority weights
 */
export function computeDanp(totalRelationMatrix: number[][]): DanpResult {
  const n = totalRelationMatrix.length;

  // Unweighted supermatrix W = (T transposed, then column normalized)
  // Or row-normalized T transposed
  const W: number[][] = [];
  for (let i = 0; i < n; i++) {
    W[i] = new Array(n).fill(0);
  }

  // Compute column sums of T for column normalization
  const colSums = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += totalRelationMatrix[i][j];
    }
  }

  // W = T_normalized transposed
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const denom = colSums[j] > 0 ? colSums[j] : 1;
      // standard DANP: W_ij = T_ji / sum_k(T_ki)
      W[i][j] = totalRelationMatrix[j][i] / denom;
    }
  }

  // For weighted supermatrix, ensure columns sum strictly to 1
  const W_weighted: number[][] = [];
  for (let i = 0; i < n; i++) {
    W_weighted[i] = [...W[i]];
  }

  for (let j = 0; j < n; j++) {
    let colTotal = 0;
    for (let i = 0; i < n; i++) {
      colTotal += W_weighted[i][j];
    }
    if (colTotal > 0) {
      for (let i = 0; i < n; i++) {
        W_weighted[i][j] /= colTotal;
      }
    }
  }

  // Power method to find Limit Supermatrix
  let currentMatrix = W_weighted;
  for (let iter = 0; iter < 100; iter++) {
    const nextMatrix = multiplyMatrices(currentMatrix, currentMatrix);
    // Check convergence
    let maxDiff = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const diff = Math.abs(nextMatrix[i][j] - currentMatrix[i][j]);
        if (diff > maxDiff) maxDiff = diff;
      }
    }
    currentMatrix = nextMatrix;
    if (maxDiff < 1e-7) break;
  }

  // Extract steady-state weights from first column
  const rawWeights: number[] = [];
  let sumW = 0;
  for (let i = 0; i < n; i++) {
    rawWeights[i] = currentMatrix[i][0];
    sumW += rawWeights[i];
  }

  const globalWeights: number[] = rawWeights.map((w) =>
    sumW > 0 ? (w / sumW) * 100 : 100 / n
  );

  const rankedIndices = globalWeights
    .map((w, idx) => ({ idx, w }))
    .sort((a, b) => b.w - a.w)
    .map((item) => item.idx);

  return {
    unweightedSupermatrix: W,
    weightedSupermatrix: W_weighted,
    limitSupermatrix: currentMatrix,
    globalWeights,
    rankedIndices,
  };
}

// =========================================================================
// 4. FUZZY DELPHI ENGINE (SCREENING)
// =========================================================================

export interface FuzzyDelphiEvaluation {
  criteriaId: string;
  l: number; // lower bound
  m: number; // modal value
  u: number; // upper bound
  defuzzifiedScore: number;
  status: 'retained' | 'revised' | 'excluded';
}

/**
 * Defuzzifies a Triangular Fuzzy Number (TFN) (l, m, u) using Center of Gravity / Graded Mean:
 * S = (l + 2m + u) / 4
 */
export function defuzzifyTFN(l: number, m: number, u: number): number {
  return (l + 2 * m + u) / 4;
}

/**
 * Evaluates Fuzzy Delphi screening against threshold (default S >= 0.70)
 */
export function evaluateFuzzyDelphi(
  l: number,
  m: number,
  u: number,
  threshold = 0.70
): { defuzzifiedScore: number; status: 'retained' | 'revised' | 'excluded' } {
  const score = defuzzifyTFN(l, m, u);
  let status: 'retained' | 'revised' | 'excluded' = 'excluded';
  if (score >= threshold) {
    status = 'retained';
  } else if (score >= threshold - 0.1) {
    status = 'revised';
  }
  return { defuzzifiedScore: score, status };
}

// =========================================================================
// 5. STATISTICAL CONSENSUS & CVR / CVI METRICS
// =========================================================================

export interface ConsensusEvaluation {
  n: number;
  mean: number;
  median: number;
  q1: number;
  q3: number;
  iqr: number;
  agreementRate: number; // % rating 6 or 7 on 7-point scale
  disagreementRate: number; // % rating 1 or 2
  neutralRate: number; // % rating 3, 4, 5
  cvr: number; // Content Validity Ratio
  cvi: number; // Content Validity Index
  isConsensusAchieved: boolean; // >= 80% agreement, Median >= 6, IQR <= 1
  consensusLabelFa: string;
}

/**
 * Computes descriptive statistics, CVR, and CVI for a set of ratings (scale 1-7):
 * - Consensus Rule: Agreement Rate >= 80% (ratings 6-7), Median >= 6, IQR <= 1
 * - CVR = (ne - N/2) / (N/2), where ne is count of ratings >= 6
 * - CVI = n_relevant / N (ratings >= 6)
 */
export function evaluateConsensus(ratings: number[]): ConsensusEvaluation {
  if (!ratings || ratings.length === 0) {
    return {
      n: 0,
      mean: 0,
      median: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      agreementRate: 0,
      disagreementRate: 0,
      neutralRate: 0,
      cvr: 0,
      cvi: 0,
      isConsensusAchieved: false,
      consensusLabelFa: 'داده‌ای ثبت نشده است',
    };
  }

  const n = ratings.length;
  const sorted = [...ratings].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Q1 and Q3
  const lowerHalf = sorted.slice(0, Math.floor(n / 2));
  const upperHalf = n % 2 === 0 ? sorted.slice(mid) : sorted.slice(mid + 1);

  const getMedian = (arr: number[]) => {
    if (arr.length === 0) return median;
    const m = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[m] : (arr[m - 1] + arr[m]) / 2;
  };

  const q1 = getMedian(lowerHalf);
  const q3 = getMedian(upperHalf);
  const iqr = Math.max(0, q3 - q1);

  // Agreement (ratings 6 or 7)
  const agreementCount = sorted.filter((r) => r >= 6).length;
  const disagreementCount = sorted.filter((r) => r <= 2).length;
  const neutralCount = sorted.filter((r) => r >= 3 && r <= 5).length;

  const agreementRate = (agreementCount / n) * 100;
  const disagreementRate = (disagreementCount / n) * 100;
  const neutralRate = (neutralCount / n) * 100;

  // CVR & CVI
  const cvr = (agreementCount - n / 2) / (n / 2);
  const cvi = agreementCount / n;

  // Multi-criteria consensus: >= 80% agreement, Median >= 6, IQR <= 1
  const isConsensusAchieved = agreementRate >= 80 && median >= 6 && iqr <= 1;

  let consensusLabelFa = 'نیازمند بررسی در دور سوم (اختلاف نظر)';
  if (isConsensusAchieved) {
    consensusLabelFa = 'اجماع کامل حاصل شد (تأیید قطعی)';
  } else if (agreementRate < 50 && median < 5) {
    consensusLabelFa = 'رد مؤلفه توسط خبرگان';
  }

  return {
    n,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(1)),
    q1: Number(q1.toFixed(1)),
    q3: Number(q3.toFixed(1)),
    iqr: Number(iqr.toFixed(1)),
    agreementRate: Number(agreementRate.toFixed(1)),
    disagreementRate: Number(disagreementRate.toFixed(1)),
    neutralRate: Number(neutralRate.toFixed(1)),
    cvr: Number(cvr.toFixed(2)),
    cvi: Number(cvi.toFixed(2)),
    isConsensusAchieved,
    consensusLabelFa,
  };
}

// =========================================================================
// 6. SAATY PAIRWISE COMPARISON & CONSISTENCY CHECK (AHP / ANP)
// =========================================================================

export const RANDOM_INDEX_TABLE: Record<number, number> = {
  1: 0.0,
  2: 0.0,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

export interface PairwiseMatrixResult {
  matrix: number[][];
  weights: number[]; // Priority vector (sum = 100%)
  lambdaMax: number;
  CI: number; // Consistency Index
  CR: number; // Consistency Ratio
  isConsistent: boolean; // CR <= 0.10
}

export function computePairwisePriorities(pairwiseMatrix: number[][]): PairwiseMatrixResult {
  const n = pairwiseMatrix.length;
  // Geometric mean method (Logarithmic Least Squares)
  const geoMeans: number[] = [];
  let sumGeo = 0;
  for (let i = 0; i < n; i++) {
    let prod = 1;
    for (let j = 0; j < n; j++) {
      prod *= pairwiseMatrix[i][j];
    }
    const gm = Math.pow(prod, 1 / n);
    geoMeans.push(gm);
    sumGeo += gm;
  }
  const weights = geoMeans.map((gm) => (sumGeo > 0 ? (gm / sumGeo) * 100 : 100 / n));
  const wNorm = weights.map((w) => w / 100);

  // Compute lambdaMax = average of (A * w)_i / w_i
  let lambdaMax = 0;
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      rowSum += pairwiseMatrix[i][j] * wNorm[j];
    }
    lambdaMax += wNorm[i] > 0 ? rowSum / wNorm[i] : n;
  }
  lambdaMax /= n;

  const CI = n > 1 ? (lambdaMax - n) / (n - 1) : 0;
  const RI = RANDOM_INDEX_TABLE[n] || 0.90;
  const CR = RI > 0 ? CI / RI : 0;

  return {
    matrix: pairwiseMatrix,
    weights: weights.map((w) => Number(w.toFixed(2))),
    lambdaMax: Number(lambdaMax.toFixed(4)),
    CI: Number(CI.toFixed(4)),
    CR: Number(CR.toFixed(4)),
    isConsistent: CR <= 0.10,
  };
}

