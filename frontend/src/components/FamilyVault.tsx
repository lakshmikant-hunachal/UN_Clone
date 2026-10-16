'use client';

import React, { useState, useEffect } from 'react';
import { Users, KeyRound, Plus, ShieldCheck, Phone, Trash2, Info, Loader2 } from 'lucide-react';
import { FamilyMember, Language, UserProfile } from '../types';
import { translations } from '../lib/translations';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

interface FamilyVaultProps {
  lang: Language;
  token: string | null;
  currentUser: UserProfile | null;
}

export const FamilyVault: React.FC<FamilyVaultProps> = ({ lang, token, currentUser }) => {
  const t = translations[lang];

  // Starts empty as required by v2 guide
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Son / Daughter');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Fetch real user vault from backend
  const fetchVault = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/vault`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (e) {
      console.error('Error fetching vault:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, [token]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/vault`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          relation: newRelation,
          phone: newPhone,
          notes: newNotes,
        }),
      });

      if (res.ok) {
        setNewName('');
        setNewPhone('');
        setNewNotes('');
        setShowAddModal(false);
        fetchVault();
      }
    } catch (e) {
      console.error('Error adding member:', e);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/vault/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error('Error deleting member:', e);
    }
  };

  const safeWord = currentUser?.safe_word || 'Family Secret Code';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
          <Users className="w-7 h-7 text-blue-400" />
          <span>{t.vaultTitle}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.vaultDesc}</p>
      </div>

      {/* Account Safe-Word Card */}
      <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-indigo-800/40">
          <div>
            <div className="flex items-center space-x-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Your Account Safe-Word</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              A private verbal phrase randomly generated for your family account. Cloned AI voices cannot know this.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/80 p-5 rounded-xl border border-indigo-500/20">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Active Household Code-Word
            </span>
            <span className="text-2xl font-black text-amber-300 tracking-wide font-mono">
              "{safeWord}"
            </span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Stored privately per-user in SQLite</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Never share via SMS or WhatsApp; speak only verbally in emergencies.
            </p>
          </div>
        </div>
      </div>

      {/* Family Directory */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Trusted Family Contacts</h3>
            <p className="text-xs text-slate-400">Direct callback numbers to verify caller claims.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addMemberBtn}</span>
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading contacts...</span>
          </div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800 p-8 space-y-2">
            <Users className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-300">{t.emptyVault}</p>
            <p className="text-[11px] text-slate-500">Starts empty per user account as required by v2.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((m) => (
              <div
                key={m.id}
                className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{m.name}</h4>
                      <span className="text-[11px] text-blue-400">{m.relation}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteMember(m.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-xs font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60 flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{m.phone}</span>
                  </div>
                  {m.notes && <p className="text-[11px] text-slate-400 mt-2 italic">{m.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Family Contact</h3>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Relationship</label>
                <select
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option>Grandson / Granddaughter</option>
                  <option>Son / Daughter</option>
                  <option>Spouse / Partner</option>
                  <option>Parent / In-law</option>
                  <option>Other Trusted Relative</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Saved Trusted Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. In college hostel"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md"
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
