import React from 'react';
import { LOGO_URL } from '../constants';

const ArchivedProject: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in flex flex-col items-center justify-center min-h-full text-center">
        {LOGO_URL && <img src={LOGO_URL} alt="Logo Andreza Tattoo" className="w-96 h-96 object-contain animate-fade-in"/>}
        <h1 className="text-4xl font-bold mt-4">Projeto Arquivado</h1>
        <p className="text-slate-400 mt-2 max-w-lg">
            A primeira edição deste projeto foi concluída e arquivada. Todos os dados e a lógica de negócio foram preservados para futuras referências e para a construção de novas aplicações.
        </p>
    </div>
  );
};

export default ArchivedProject;
