'use client';

import React, { useState, useEffect } from 'react';
import { Users, KeyRound, Plus, ShieldCheck, Phone, Sparkles, Check, Trash2, Mic, Info } from 'lucide-react';
import { FamilyMember, Language } from '../types';
import { translations } from '../lib/translations';

interface FamilyVaultProps {
  lang: Language;
}

const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    relation: 'Grandson',
    phone: '+91 98765 43210',
    safeWordHint: 'Shared vacation dessert in Manali',
    voiceEnrolled: true,
    notes: 'Studying in Bangalore. Only calls from this saved number.'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    relation: 'Daughter',
    phone: '+91 98123 45678',
    safeWordHint: 'Grandpa’s old vintage car model',
    voiceEnrolled: true,
    notes: 'Working hours: 9 AM - 6 PM.'
  }
];

const SAFE_WORD_SUGGESTIONS = [
  'Copper Teapot',
  'Velvet Mango',
  'Midnight Bicycle',
  'Silver Monsoon',
  'Paper Lighthouse',
  'Golden Marigold'
];

export const FamilyVault: React.FC<FamilyVaultProps> = ({ lang }) => {
  const t = translations[lang];

  const [members, setMembers] = useState<FamilyMember[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unclone_family_vault');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return INITIAL_MEMBERS;
  });

  const [familySafeWord, setFamilySafeWord] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('unclone_safe_word') || 'Copper Teapot';
    }
    return 'Copper Teapot';
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Son / Daughter');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('unclone_family_vault', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('unclone_safe_word', familySafeWord);
  }, [familySafeWord]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newName,
      relation: newRelation,
      phone: newPhone,
      safeWordHint: 'Household secret',
      voiceEnrolled: false,
      notes: newNotes,
    };

    setMembers([...members, newMember]);
    setNewName('');
    setNewPhone('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleGenerateSafeWord = () => {
    const randomWord = SAFE_WORD_SUGGESTIONS[Math.floor(Math.random() * SAFE_WORD_SUGGESTIONS.length)];
    setFamilySafeWord(randomWord);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
          <Users className="w-7 h-7 text-blue-400" />
          <span>{t.vaultTitle}</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">{t.vaultDesc}</p>
      </div>

      {/* Safe-Word Coach Card (Step 8 from guide) */}
      <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-indigo-800/40">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">{t.safeWordTitle}</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">{t.safeWordDesc}</p>
          </div>

          <button
            onClick={handleGenerateSafeWord}
            className="flex items-center space-x-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate New Safe-Word</span>
          </button>
        </div>

        {/* Current Active Family Safe Word */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/80 p-5 rounded-xl border border-indigo-500/20">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Current Household Safe-Word
            </span>
            <span className="text-2xl font-black text-amber-300 tracking-wide font-mono">
              "{familySafeWord}"
            </span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Never shared via online message</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Teach this verbally to grandparents & immediate family only.
            </p>
          </div>
        </div>

        {/* Best Practice Tip */}
        <div className="mt-4 flex items-start space-x-2 text-xs text-indigo-300/80 bg-indigo-950/30 p-3 rounded-lg border border-indigo-800/30">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-400" />
          <p>{t.safeWordTip}</p>
        </div>
      </div>

      {/* Enrolled Relatives Directory */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Verified Family Directory</h3>
            <p className="text-xs text-slate-400">
              Direct callback numbers to verify emergency claims.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addMemberBtn}</span>
          </button>
        </div>

        {/* Members Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{member.name}</h4>
                    <span className="text-xs font-medium text-blue-400">{member.relation}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{member.phone}</span>
                </div>

                {member.notes && (
                  <p className="text-xs text-slate-400 mt-2 italic">{member.notes}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Speaker Verification:</span>
                {member.voiceEnrolled ? (
                  <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Voice Enrolled</span>
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center space-x-1">
                    <Mic className="w-3.5 h-3.5" />
                    <span>Pending Voice Clip</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Trusted Family Contact</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Relationship</label>
                <select
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option>Grandson / Granddaughter</option>
                  <option>Son / Daughter</option>
                  <option>Spouse / Partner</option>
                  <option>Parent / In-law</option>
                  <option>Brother / Sister</option>
                  <option>Other Trusted Contact</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Trusted Saved Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Verification Notes</label>
                <input
                  type="text"
                  placeholder="e.g. In college hostel, only calls from this phone"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
