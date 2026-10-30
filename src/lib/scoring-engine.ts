import {
  AssessmentFunction,
  AssessmentProfile,
  AFScore,
  SPScore,
  ModuleScore,
  CycleScore,
  OverallMaturityResult,
  StrategicPartitionId,
  StrategicCycle,
  StrategicPartition,
  ModuleDefinition,
} from '@/types';

export const STRATEGIC_PARTITIONS: StrategicPartition[] = [
  {
    id: 'SP1',
    code: 'SP1',
    name: 'Procurement Framework Strategy',
    weight: 0.25,
    description: 'Procurement mission, value contribution targets, cost, differentiation, sustainability and strategic guidelines.',
    iconName: 'Building2',
  },
  {
    id: 'SP2',
    code: 'SP2',
    name: 'Category Strategies',
    weight: 0.25,
    description: 'Category management, spend & demand analysis, category strategy development, sourcing levers and roadmaps.',
    iconName: 'FolderTree',
  },
  {
    id: 'SP3',
    code: 'SP3',
    name: 'Supplier Strategies',
    weight: 0.25,
    description: 'Supplier objectives, past performance, potential analysis, classification, approval, relationship strategies.',
    iconName: 'Users',
  },
  {
    id: 'SP4',
    code: 'SP4',
    name: 'Process / Digital Strategies',
    weight: 0.15,
    description: 'Digitalization, automation, process design, AI, contract management and digital infrastructure.',
    iconName: 'Cpu',
  },
  {
    id: 'SP5',
    code: 'SP5',
    name: 'Procurement Management System',
    weight: 0.10,
    description: 'Performance management, Target Operating Model (TOM), savings & value measurement, controlling and governance.',
    iconName: 'BarChart3',
  },
];

export const STAGES = [
  {
    number: 1,
    name: 'Operational',
    min: 0,
    max: 20,
    color: '#94a3b8',
    summary: 'Value contribution not recognizable. No real transparency. Hardly any strategic methods in use.',
    details: [
      'Value contribution not recognizable',
      'No real transparency across spend or suppliers',
      'Hardly any strategic methods in active use',
    ],
  },
  {
    number: 2,
    name: 'Classical Sourcing',
    min: 21,
    max: 40,
    color: '#38bdf8',
    summary: 'Some value contribution, not verifiable. Transparency mostly through individual projects. Use of simple strategic methods.',
    details: [
      'Some value contribution, not verifiable',
      'Transparency mostly through individual projects',
      'Use of simple strategic methods approach in some partitions',
    ],
  },
  {
    number: 3,
    name: 'Sourcing Expert',
    min: 41,
    max: 60,
    color: '#14b8a6',
    summary: 'Value contribution visible and partly verifiable. Comprehensive transparency. State-of-the-art methods with notable gaps.',
    details: [
      'Value contribution visible and partly verifiable',
      'Comprehensive transparency, partly documented',
      'Comprehensive state-of-the-art methods but with notable gaps',
    ],
  },
  {
    number: 4,
    name: 'Top Class Sourcing',
    min: 61,
    max: 80,
    color: '#6366f1',
    summary: 'High provable value. Very comprehensive transparency documented. World-class sourcing methods with some limitations.',
    details: [
      'High provable value demonstrated to board',
      'Very comprehensive transparency documented',
      'World-class sourcing methods with minor limitations',
    ],
  },
  {
    number: 5,
    name: 'World Sourcing Champion',
    min: 81,
    max: 100,
    color: '#10b981',
    summary: 'Maximum provable value. Complete transparency across the entire enterprise. Benchmark-setting practices.',
    details: [
      'Maximum provable value continuously delivered',
      'Complete transparency provided for the entire company',
      'World-class sourcing methods in all strategic partitions',
    ],
  },
];

export function getStageForScore(score: number) {
  const rounded = Math.round(score);
  return STAGES.find((s) => rounded >= s.min && rounded <= s.max) || STAGES[0];
}

/**
 * Calculates complete 15M scores based on the recovered authoritative formula:
 * Dimension score = Σ(prio * rel * answer) / Σ(prio * rel)
 * AF score = (5*concept + 5*process + 2*implementation) / 12 (or integrated score in quick check)
 * SP score = Σ(AF score * AF weight) / Σ(AF weight)
 * Overall = 0.25*SP1 + 0.25*SP2 + 0.25*SP3 + 0.15*SP4 + 0.10*SP5
 */
export function calculateMaturityScores(
  assessment: AssessmentProfile,
  assessmentFunctions: AssessmentFunction[],
  modules: ModuleDefinition[]
): OverallMaturityResult {
  const isQuickCheck = assessment.mode === 'quick_check';

  const afScores: Record<string, AFScore> = {};
  let completedCount = 0;

  for (const af of assessmentFunctions) {
    const qConcept = af.questions.concept;
    const qProcess = af.questions.process;
    const qImpl = af.questions.implementation;
    const qInteg = af.questions.integrated;

    const aConcept = assessment.answers[qConcept.id] || { asIs: 0, plan: 80, prio: qConcept.defaultPrio, rel: qConcept.defaultRel };
    const aProcess = assessment.answers[qProcess.id] || { asIs: 0, plan: 80, prio: qProcess.defaultPrio, rel: qProcess.defaultRel };
    const aImpl = assessment.answers[qImpl.id] || { asIs: 0, plan: 80, prio: qImpl.defaultPrio, rel: qImpl.defaultRel };
    const aInteg = assessment.answers[qInteg.id] || { asIs: 0, plan: 80, prio: 5, rel: 1 };

    // Check completion status
    const isCompleted = isQuickCheck
      ? assessment.answers[qInteg.id]?.asIs !== undefined
      : assessment.answers[qConcept.id]?.asIs !== undefined ||
        assessment.answers[qProcess.id]?.asIs !== undefined ||
        assessment.answers[qImpl.id]?.asIs !== undefined;

    if (isCompleted) {
      completedCount++;
    }

    // Dimension scoring with dynamic prio * rel denominator
    // Concept
    const conceptPrio = aConcept.prio ?? qConcept.defaultPrio;
    const conceptRel = aConcept.rel ?? qConcept.defaultRel;
    const conceptDenom = conceptPrio * conceptRel;
    const conceptAsIs = conceptDenom > 0 ? aConcept.asIs : 0;
    const conceptPlan = conceptDenom > 0 ? aConcept.plan : 80;

    // Process
    const processPrio = aProcess.prio ?? qProcess.defaultPrio;
    const processRel = aProcess.rel ?? qProcess.defaultRel;
    const processDenom = processPrio * processRel;
    const processAsIs = processDenom > 0 ? aProcess.asIs : 0;
    const processPlan = processDenom > 0 ? aProcess.plan : 80;

    // Implementation
    const implPrio = aImpl.prio ?? qImpl.defaultPrio;
    const implRel = aImpl.rel ?? qImpl.defaultRel;
    const implDenom = implPrio * implRel;
    const implAsIs = implDenom > 0 ? aImpl.asIs : 0;
    const implPlan = implDenom > 0 ? aImpl.plan : 80;

    // Integrated / Quick Check
    const integAsIs = aInteg.asIs ?? 0;
    const integPlan = aInteg.plan ?? 80;

    let afAsIs = 0;
    let afPlan = 0;

    if (isQuickCheck) {
      afAsIs = integAsIs;
      afPlan = integPlan;
    } else {
      // Authoritative formula: (5 * concept + 5 * process + 2 * implementation) / 12
      // If a dimension is excluded (rel = 0 or prio = 0), dynamically adjust weights
      const wConcept = conceptDenom > 0 ? 5 : 0;
      const wProcess = processDenom > 0 ? 5 : 0;
      const wImpl = implDenom > 0 ? 2 : 0;
      const totalWeight = wConcept + wProcess + wImpl;

      if (totalWeight > 0) {
        afAsIs = (wConcept * conceptAsIs + wProcess * processAsIs + wImpl * implAsIs) / totalWeight;
        afPlan = (wConcept * conceptPlan + wProcess * processPlan + wImpl * implPlan) / totalWeight;
      } else {
        afAsIs = 0;
        afPlan = 80;
      }
    }

    afScores[af.id] = {
      afId: af.id,
      code: af.code,
      name: af.name,
      partitionId: af.partitionId,
      moduleId: af.moduleId,
      cycle: af.cycle,
      asIs: Math.round(afAsIs * 10) / 10,
      plan: Math.round(afPlan * 10) / 10,
      gap: Math.round((afPlan - afAsIs) * 10) / 10,
      weight: af.weight,
      dimensionScores: {
        concept: { asIs: conceptAsIs, plan: conceptPlan, prio: conceptPrio, rel: conceptRel },
        process: { asIs: processAsIs, plan: processPlan, prio: processPrio, rel: processRel },
        implementation: { asIs: implAsIs, plan: implPlan, prio: implPrio, rel: implRel },
        integrated: { asIs: integAsIs, plan: integPlan },
      },
    };
  }

  // Calculate Strategic Partition (SP) Scores
  const spScores: Record<StrategicPartitionId, SPScore> = {
    SP1: { partitionId: 'SP1', name: 'Framework Strategy', weight: 0.25, asIs: 0, plan: 0, gap: 0 },
    SP2: { partitionId: 'SP2', name: 'Category Strategies', weight: 0.25, asIs: 0, plan: 0, gap: 0 },
    SP3: { partitionId: 'SP3', name: 'Supplier Strategies', weight: 0.25, asIs: 0, plan: 0, gap: 0 },
    SP4: { partitionId: 'SP4', name: 'Process & Digital Strategies', weight: 0.15, asIs: 0, plan: 0, gap: 0 },
    SP5: { partitionId: 'SP5', name: 'Performance Management', weight: 0.10, asIs: 0, plan: 0, gap: 0 },
  };

  const partitionAFMap: Record<StrategicPartitionId, AFScore[]> = {
    SP1: [],
    SP2: [],
    SP3: [],
    SP4: [],
    SP5: [],
  };

  Object.values(afScores).forEach((af) => {
    partitionAFMap[af.partitionId]?.push(af);
  });

  (Object.keys(spScores) as StrategicPartitionId[]).forEach((spId) => {
    const afs = partitionAFMap[spId] || [];
    if (afs.length > 0) {
      const sumWeight = afs.reduce((acc, curr) => acc + (curr.weight || 1), 0);
      const weightedAsIs = afs.reduce((acc, curr) => acc + curr.asIs * (curr.weight || 1), 0);
      const weightedPlan = afs.reduce((acc, curr) => acc + curr.plan * (curr.weight || 1), 0);

      const asIs = sumWeight > 0 ? weightedAsIs / sumWeight : 0;
      const plan = sumWeight > 0 ? weightedPlan / sumWeight : 80;

      spScores[spId].asIs = Math.round(asIs * 10) / 10;
      spScores[spId].plan = Math.round(plan * 10) / 10;
      spScores[spId].gap = Math.round((spScores[spId].plan - spScores[spId].asIs) * 10) / 10;
    }
  });

  // Authoritative Overall score:
  // 0.25*SP1 + 0.25*SP2 + 0.25*SP3 + 0.15*SP4 + 0.10*SP5
  const overallAsIs =
    0.25 * spScores.SP1.asIs +
    0.25 * spScores.SP2.asIs +
    0.25 * spScores.SP3.asIs +
    0.15 * spScores.SP4.asIs +
    0.10 * spScores.SP5.asIs;

  const overallPlan =
    0.25 * spScores.SP1.plan +
    0.25 * spScores.SP2.plan +
    0.25 * spScores.SP3.plan +
    0.15 * spScores.SP4.plan +
    0.10 * spScores.SP5.plan;

  const roundedOverallAsIs = Math.round(overallAsIs);
  const roundedOverallPlan = Math.round(overallPlan);
  const stage = getStageForScore(roundedOverallAsIs);

  // Module scores (M1 - M15)
  const moduleScores: Record<string, ModuleScore> = {};
  modules.forEach((mod) => {
    const afs = Object.values(afScores).filter((af) => af.moduleId === mod.id);
    if (afs.length > 0) {
      const avgAsIs = afs.reduce((acc, curr) => acc + curr.asIs, 0) / afs.length;
      const avgPlan = afs.reduce((acc, curr) => acc + curr.plan, 0) / afs.length;
      moduleScores[mod.id] = {
        moduleId: mod.id,
        name: mod.name,
        partitionId: mod.partitionId,
        asIs: Math.round(avgAsIs * 10) / 10,
        plan: Math.round(avgPlan * 10) / 10,
        gap: Math.round((avgPlan - avgAsIs) * 10) / 10,
      };
    } else {
      moduleScores[mod.id] = {
        moduleId: mod.id,
        name: mod.name,
        partitionId: mod.partitionId,
        asIs: 0,
        plan: 80,
        gap: 80,
      };
    }
  });

  // Strategic Cycle scores (Zi, An, Au, St - 25% each)
  const cycleLabels: Record<StrategicCycle, string> = {
    Zi: 'Target (Zi)',
    An: 'Analysis (An)',
    Au: 'Alignment (Au)',
    St: 'Control (St)',
  };

  const cycleScores: Record<StrategicCycle, CycleScore> = {
    Zi: { cycle: 'Zi', label: cycleLabels.Zi, asIs: 0, plan: 0, gap: 0 },
    An: { cycle: 'An', label: cycleLabels.An, asIs: 0, plan: 0, gap: 0 },
    Au: { cycle: 'Au', label: cycleLabels.Au, asIs: 0, plan: 0, gap: 0 },
    St: { cycle: 'St', label: cycleLabels.St, asIs: 0, plan: 0, gap: 0 },
  };

  (['Zi', 'An', 'Au', 'St'] as StrategicCycle[]).forEach((cycle) => {
    const afs = Object.values(afScores).filter((af) => af.cycle === cycle);
    if (afs.length > 0) {
      const avgAsIs = afs.reduce((acc, curr) => acc + curr.asIs, 0) / afs.length;
      const avgPlan = afs.reduce((acc, curr) => acc + curr.plan, 0) / afs.length;
      cycleScores[cycle].asIs = Math.round(avgAsIs * 10) / 10;
      cycleScores[cycle].plan = Math.round(avgPlan * 10) / 10;
      cycleScores[cycle].gap = Math.round((avgPlan - avgAsIs) * 10) / 10;
    }
  });

  return {
    asIs: roundedOverallAsIs,
    plan: roundedOverallPlan,
    gap: roundedOverallPlan - roundedOverallAsIs,
    stageNumber: stage.number,
    stageName: stage.name,
    stageDescription: stage.summary,
    spScores,
    afScores,
    moduleScores,
    cycleScores,
    completedAFs: completedCount,
    totalAFs: assessmentFunctions.length,
    completionRate: Math.round((completedCount / (assessmentFunctions.length || 1)) * 100),
  };
}
