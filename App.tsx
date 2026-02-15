
import React, { useEffect, useState } from 'react';
import { BACKGROUND_IMAGE_URL, LOGO_URL } from './constants';
import ReferralSystem from './components/ReferralSystem';
import VoucherSystem from './components/VoucherSystem';
import { AppView } from './types';
import { GiftIcon, TicketIcon } from './components/icons';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('referral');

  useEffect(() => {
    if (BACKGROUND_IMAGE_URL) {
        document.body.style.backgroundImage = `url('${BACKGROUND_IMAGE_URL}')`;
    }
  }, []);

  const NavButton: React.FC<{
      targetView: AppView;
      label: string;
      icon: React.ReactNode;
  }> = ({ targetView, label, icon }) => (
      <button
          onClick={() => setView(targetView)}
          className={`relative flex items-center space-x-2 px-6 py-3 text-sm font-bold rounded-full transition-all duration-300 overflow-hidden group
              ${view === targetView 
                  ? 'text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] ring-1 ring-white/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
          }
      >
          {view === targetView && (
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-100 -z-10"></div>
          )}
          <span className={`relative z-10 ${view === targetView ? 'animate-pulse' : ''}`}>{icon}</span>
          <span className="relative z-10">{label}</span>
      </button>
  );

  return (
    <div className="relative min-h-screen text-slate-200 font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      {/* Overlay de fundo melhorado para contraste */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-900/90 backdrop-blur-sm fixed z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col min-h-screen">
          <header className="flex flex-col md:flex-row justify-between items-center p-6 md:p-8 pb-0">
              <div className="flex items-center gap-4 mb-6 md:mb-0">
                  {LOGO_URL ? (
                      <img src={LOGO_URL} alt="Logo" className="h-16 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                  ) : (
                      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                          ANDREZA TATTOO
                      </h1>
                  )}
              </div>
              
              <nav className="flex items-center p-1.5 bg-slate-950/50 border border-white/10 backdrop-blur-md rounded-full shadow-2xl">
                  <NavButton targetView="referral" label="Indicações" icon={<GiftIcon className="h-5 w-5" />} />
                  <NavButton targetView="voucher" label="Vouchers" icon={<TicketIcon className="h-5 w-5" />} />
              </nav>
          </header>

          <main className="flex-1 p-4 md:p-8">
            <div className="transition-all duration-500 ease-in-out">
                {view === 'referral' && <ReferralSystem />}
                {view === 'voucher' && <VoucherSystem />}
            </div>
          </main>

          <footer className="p-6 text-center text-slate-600 text-xs border-t border-white/5 mt-auto">
              <p>© {new Date().getFullYear()} TattooFlow System. Desenvolvido com Inteligência.</p>
          </footer>
      </div>
    </div>
  );
};

export default App;
