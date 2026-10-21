import React, { useState } from 'react';
import { X, MapPin, PhoneCall, Clock, MessageSquare, Search, Navigation } from 'lucide-react';
import { pharmacyBranches } from '../data/pharmacyData';

interface BranchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatWithBranch: (branchName: string) => void;
}

export const BranchesModal: React.FC<BranchesModalProps> = ({
  isOpen,
  onClose,
  onOpenChatWithBranch
}) => {
  const [selectedArea, setSelectedArea] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const areas = ['all', 'طنطا', 'الجيزة (المهندسين)'];

  const filtered = pharmacyBranches.filter(b => {
    const matchesArea = selectedArea === 'all' 
      ? true 
      : selectedArea === 'طنطا' 
      ? b.cityAr === 'طنطا' 
      : b.cityAr === 'الجيزة';

    const matchesSearch = 
      b.nameAr.includes(searchTerm) || 
      b.addressAr.includes(searchTerm) || 
      b.phone.includes(searchTerm);

    return matchesArea && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-bendary-950 text-white rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-bendary-800 rounded-xl">
              <MapPin className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">فروع صيدليات البنداري الـ 11 المعتمدة</h3>
              <span className="text-[11px] text-slate-300">خدمة 24 ساعة لجميع الفروع • الخط الساخن: 01200400094</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-bendary-800 hover:bg-bendary-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ابحث باسم الفرع، الشارع، أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs pr-9"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1">
              {areas.map((a) => (
                <button
                  key={a}
                  onClick={() => setSelectedArea(a)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedArea === a
                      ? 'bg-bendary-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {a === 'all' ? 'جميع الفروع (11)' : a}
                </button>
              ))}
            </div>
          </div>

          {/* Branches List */}
          <div className="space-y-3">
            {filtered.map((branch, index) => {
              // Extract first phone for direct call
              const firstPhone = branch.phone.split('/')[0]?.trim() || '01200400094';

              return (
                <div
                  key={branch.id}
                  className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-bendary-400 hover:shadow-md transition space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-bendary-100 text-bendary-800 font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-bendary-700 bg-bendary-50 px-2 py-0.5 rounded">
                          {branch.cityAr}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 mt-0.5">{branch.nameAr}</h4>
                      </div>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" /> 24 ساعة
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-100">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="font-medium">{branch.addressAr}</span>
                  </div>

                  {/* Contact Numbers */}
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-500 text-[11px]">أرقام التواصل:</div>
                    <div className="font-mono font-bold text-slate-800 tracking-wider text-[11px] bg-slate-100/80 p-2 rounded-lg">
                      {branch.phone}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
                    <a
                      href={`tel:${firstPhone}`}
                      className="bg-amber-100 hover:bg-amber-200 text-bendary-950 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition text-[11px]"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-bendary-700" />
                      <span>اتصال مباشر: {firstPhone}</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onOpenChatWithBranch(branch.nameAr);
                          onClose();
                        }}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 transition text-[11px]"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>استشر صيدلي الفرع</span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.googleMapsQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900 hover:bg-black text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition text-[11px]"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>الاتجاهات</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
