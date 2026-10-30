'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AssessmentProfile,
  AnswerItem,
  ImprovementAction,
  OverallMaturityResult,
  StrategicPartitionId,
  DimensionType,
  MaturityLevel,
  CompanyProfile,
} from '@/types';
import {
  ASSESSMENT_FUNCTIONS,
  MODULES,
  DEFAULT_BAM_PROFILE,
  COMPANIES,
} from '@/data/configuration';
import { calculateMaturityScores, STRATEGIC_PARTITIONS } from '@/lib/scoring-engine';

interface AssessmentContextType {
  profile: AssessmentProfile;
  overallResult: OverallMaturityResult;
  companies: CompanyProfile[];
  currentCompany: CompanyProfile;
  activeTab: 'dashboard' | 'assessment' | 'tables' | 'analytics' | 'about' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'assessment' | 'tables' | 'analytics' | 'about' | 'settings') => void;
  activePartitionId: StrategicPartitionId;
  setActivePartitionId: (id: StrategicPartitionId) => void;
  activeAFId: string;
  setActiveAFId: (id: string) => void;
  activeDimension: DimensionType;
  setActiveDimension: (dim: DimensionType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showReportModal: boolean;
  setShowReportModal: (show: boolean) => void;
  showCompanyModal: boolean;
  setShowCompanyModal: (show: boolean) => void;
  showAssessmentModal: boolean;
  setShowAssessmentModal: (show: boolean) => void;

  // Actions
  selectCompany: (companyId: string) => void;
  selectAssessment: (assessmentId: string) => void;
  updateCompanyLogo: (logoUrl: string) => void;
  addNewCompany: (newComp: CompanyProfile) => void;
  updateAnswer: (
    questionId: string,
    asIs: MaturityLevel,
    plan?: MaturityLevel,
    prio?: number,
    rel?: number
  ) => void;
  updateStatusNote: (afId: string, text: string) => void;
  addImprovementAction: (action: Omit<ImprovementAction, 'id'>) => void;
  updateImprovementAction: (action: ImprovementAction) => void;
  deleteImprovementAction: (id: string) => void;
  toggleAssessmentMode: () => void;
  setAssessmentMode: (mode: 'comprehensive' | 'quick_check') => void;
  resetToDefault: () => void;
  updateCompanyDetails: (companyName: string, assessmentName: string) => void;
  exportJSON: () => void;
  importJSON: (data: AssessmentProfile) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const STORAGE_KEY = '15m_maturity_assessment_profile_v3';
const COMPANIES_KEY = '15m_maturity_companies_v3';

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<AssessmentProfile>(DEFAULT_BAM_PROFILE);
  const [companyList, setCompanyList] = useState<CompanyProfile[]>(COMPANIES);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assessment' | 'tables' | 'analytics' | 'about' | 'settings'>('dashboard');
  const [activePartitionId, setActivePartitionId] = useState<StrategicPartitionId>('SP3');
  const [activeAFId, setActiveAFId] = useState<string>('af_3_4');
  const [activeDimension, setActiveDimension] = useState<DimensionType>('concept');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showCompanyModal, setShowCompanyModal] = useState<boolean>(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed && parsed.answers) {
          setProfile(parsed);
        }
      }
      const savedCompanies = localStorage.getItem(COMPANIES_KEY);
      if (savedCompanies) {
        const parsedComp = JSON.parse(savedCompanies);
        if (Array.isArray(parsedComp) && parsedComp.length > 0) {
          setCompanyList(parsedComp);
        }
      }
    } catch (e) {
      console.error('Failed to load assessment data from localStorage', e);
    }
  }, []);

  // Save to localStorage whenever profile changes
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch (e) {
        console.error('Failed to save assessment to localStorage', e);
      }
    }
  }, [profile, isClient]);

  // Current company derived from profile or default
  const currentCompany = useMemo(() => {
    return (
      companyList.find((c) => c.id === profile.companyId || c.name === profile.companyName) ||
      companyList[0] ||
      COMPANIES[0]
    );
  }, [companyList, profile.companyId, profile.companyName]);

  // Real-time calculated scores using authoritative engine
  const overallResult = useMemo(() => {
    return calculateMaturityScores(profile, ASSESSMENT_FUNCTIONS, MODULES);
  }, [profile]);

  const selectCompany = (companyId: string) => {
    const targetComp = companyList.find((c) => c.id === companyId);
    if (!targetComp) return;

    const firstAssessment = targetComp.assessments[0]?.name || 'Procurement Maturity Assessment 2026';

    setProfile((prev) => ({
      ...prev,
      companyId: targetComp.id,
      companyName: targetComp.name,
      assessmentName: firstAssessment,
      updatedAt: new Date().toISOString(),
    }));
    setShowCompanyModal(false);
  };

  const selectAssessment = (assessmentId: string) => {
    const assessment = currentCompany.assessments.find((a) => a.id === assessmentId);
    if (assessment) {
      setProfile((prev) => ({
        ...prev,
        assessmentName: assessment.name,
        updatedAt: new Date().toISOString(),
      }));
    }
    setShowAssessmentModal(false);
  };

  const updateCompanyLogo = (logoUrl: string) => {
    setCompanyList((prev) =>
      prev.map((c) => (c.id === currentCompany.id ? { ...c, logoUrl } : c))
    );
  };

  const addNewCompany = (newComp: CompanyProfile) => {
    setCompanyList((prev) => {
      const updated = [newComp, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(COMPANIES_KEY, JSON.stringify(updated));
      }
      return updated;
    });
    selectCompany(newComp.id);
  };

  const updateAnswer = (
    questionId: string,
    asIs: MaturityLevel,
    plan?: MaturityLevel,
    prio?: number,
    rel?: number
  ) => {
    setProfile((prev) => {
      const existing = prev.answers[questionId] || {
        asIs: 0,
        plan: 80,
        prio: 5,
        rel: 1,
      };

      const updated: AnswerItem = {
        asIs,
        plan: plan !== undefined ? plan : existing.plan,
        prio: prio !== undefined ? prio : existing.prio,
        rel: rel !== undefined ? rel : existing.rel,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        answers: {
          ...prev.answers,
          [questionId]: updated,
        },
      };
    });
  };

  const updateStatusNote = (afId: string, text: string) => {
    setProfile((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      statusNotes: {
        ...prev.statusNotes,
        [afId]: text,
      },
    }));
  };

  const addImprovementAction = (actionData: Omit<ImprovementAction, 'id'>) => {
    const newAction: ImprovementAction = {
      ...actionData,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    setProfile((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      actions: [...prev.actions, newAction],
    }));
  };

  const updateImprovementAction = (action: ImprovementAction) => {
    setProfile((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      actions: prev.actions.map((a) => (a.id === action.id ? action : a)),
    }));
  };

  const deleteImprovementAction = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      actions: prev.actions.filter((a) => a.id !== id),
    }));
  };

  const toggleAssessmentMode = () => {
    setProfile((prev) => ({
      ...prev,
      mode: prev.mode === 'comprehensive' ? 'quick_check' : 'comprehensive',
      updatedAt: new Date().toISOString(),
    }));
  };

  const setAssessmentMode = (mode: 'comprehensive' | 'quick_check') => {
    setProfile((prev) => ({
      ...prev,
      mode,
      updatedAt: new Date().toISOString(),
    }));
  };

  const resetToDefault = () => {
    setProfile(DEFAULT_BAM_PROFILE);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BAM_PROFILE));
    }
  };

  const updateCompanyDetails = (companyName: string, assessmentName: string) => {
    setProfile((prev) => ({
      ...prev,
      companyName,
      assessmentName,
      updatedAt: new Date().toISOString(),
    }));
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.companyName.replace(/\s+/g, '_')}_15M_Assessment.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSON = (data: AssessmentProfile) => {
    if (data && data.answers) {
      setProfile(data);
    }
  };

  return (
    <AssessmentContext.Provider
      value={{
        profile,
        overallResult,
        companies: companyList,
        currentCompany,
        activeTab,
        setActiveTab,
        activePartitionId,
        setActivePartitionId,
        activeAFId,
        setActiveAFId,
        activeDimension,
        setActiveDimension,
        searchQuery,
        setSearchQuery,
        showReportModal,
        setShowReportModal,
        showCompanyModal,
        setShowCompanyModal,
        showAssessmentModal,
        setShowAssessmentModal,
        selectCompany,
        selectAssessment,
        updateCompanyLogo,
        addNewCompany,
        updateAnswer,
        updateStatusNote,
        addImprovementAction,
        updateImprovementAction,
        deleteImprovementAction,
        toggleAssessmentMode,
        setAssessmentMode,
        resetToDefault,
        updateCompanyDetails,
        exportJSON,
        importJSON,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
