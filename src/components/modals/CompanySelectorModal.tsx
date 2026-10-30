'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { CompanyProfile } from '@/types';
import { Building2, Search, Plus, Check, X, Shield, Globe2, Briefcase } from 'lucide-react';

export const CompanySelectorModal: React.FC = () => {
  const {
    companies,
    currentCompany,
    selectCompany,
    showCompanyModal,
    setShowCompanyModal,
    addNewCompany,
  } = useAssessment();

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newShortName, setNewShortName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newCountry, setNewCountry] = useState('Global');
  const [newBgColor, setNewBgColor] = useState('#0d9488');

  if (!showCompanyModal) return null;

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.shortName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const id = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newComp: CompanyProfile = {
      id,
      name: newName.trim(),
      shortName: newShortName.trim() || newName.trim().substring(0, 10),
      logoText: (newShortName.trim() || newName.trim().substring(0, 4)).toUpperCase(),
      logoBg: newBgColor,
      logoColor: '#ffffff',
      industry: newIndustry.trim() || 'General Enterprise',
      country: newCountry.trim() || 'Global',
      assessments: [
        {
          id: `${id}-2026`,
          name: '15M Maturity Assessment 2026',
          date: new Date().toISOString().substring(0, 7),
          status: 'Active',
        },
      ],
    };

    addNewCompany(newComp);
    setShowAddForm(false);
    setNewName('');
    setNewShortName('');
    setNewIndustry('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold">Select Client Company</h2>
              <p className="text-[11px] text-slate-400">Choose company to load logo, brand identity, and assessment scores</p>
            </div>
          </div>
          <button
            onClick={() => setShowCompanyModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Search & Add New Toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search company by name, industry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancel' : 'Add Company'}</span>
            </button>
          </div>

          {/* Add Company Form */}
          {showAddForm && (
            <form onSubmit={handleCreateCompany} className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-3">
              <div className="font-bold text-xs text-teal-900">Add New Enterprise Client</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siemens Energy"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Short Logo Text</label>
                  <input
                    type="text"
                    placeholder="e.g. SE"
                    value={newShortName}
                    onChange={(e) => setNewShortName(e.target.value)}
                    className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Renewable Energy"
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Brand Badge Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newBgColor}
                      onChange={(e) => setNewBgColor(e.target.value)}
                      className="w-8 h-8 rounded-md border border-slate-300 cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono text-slate-600">{newBgColor}</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-md shadow-xs"
              >
                Create & Switch to Company
              </button>
            </form>
          )}

          {/* Companies List */}
          <div className="space-y-2">
            {filteredCompanies.map((comp) => {
              const isSelected = comp.id === currentCompany.id;

              return (
                <div
                  key={comp.id}
                  onClick={() => selectCompany(comp.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 shadow-xs ring-1 ring-teal-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Dynamic Company Logo / Badge */}
                    <div
                      className="w-12 h-10 rounded-lg flex items-center justify-center font-extrabold text-xs shadow-xs px-2 text-center uppercase tracking-wider shrink-0"
                      style={{
                        backgroundColor: comp.logoBg,
                        color: comp.logoColor,
                      }}
                    >
                      {comp.logoText}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-sm text-slate-900">{comp.name}</h3>
                        {isSelected && (
                          <span className="bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          {comp.industry}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Globe2 className="w-3 h-3 text-slate-400" />
                          {comp.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
