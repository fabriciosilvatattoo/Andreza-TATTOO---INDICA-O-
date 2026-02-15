import React, { useState } from 'react';
import { QrCodeIcon } from './icons';

const QrCodeTool: React.FC = () => {
    const [linkData, setLinkData] = useState('https://wa.me/5519998748041?text=Oi%2C%20vim%20pela%20indica%C3%A7%C3%A3o%20de%20"Aqui_vai_ser_colocado_o_nome_do_indicador_que_esta_se_cadastrando_agora"%20(c%C3%B3digo%3A%20IND-V7M7)');
    const [phoneNumber, setPhoneNumber] = useState('5519998748041');
    const [caption, setCaption] = useState('Aqui está seu QR Code! 📱');
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateAndSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!linkData || !phoneNumber) {
            alert('Por favor, preencha o link e o número de telefone.');
            return;
        }

        setIsLoading(true);
        setStatusMessage('1/3 - Gerando QR Code...');
        setQrCodeUrl(null);

        // 1. Generate QR Code URL (Simulates the first n8n node: QR Code Generator)
        const generatedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=png&data=${encodeURIComponent(linkData)}`;
        setQrCodeUrl(generatedUrl);

        // 2. Simulate Extract from File & Send to WhatsApp (Simulates other n8n nodes)
        setTimeout(() => {
            setStatusMessage(`2/3 - Convertendo para envio... (Simulação)`);
            
            setTimeout(() => {
                setStatusMessage(`3/3 - ✅ QR Code enviado com sucesso para ${phoneNumber}! (Simulação)`);
                setIsLoading(false);
            }, 1500);

        }, 1000);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Ferramenta de QR Code</h1>
            <p className="text-slate-400 mb-8">Simulador do workflow n8n para geração e envio de QR Codes via WhatsApp.</p>
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Configuração do Envio</h2>
                    <form onSubmit={handleGenerateAndSend} className="space-y-4">
                        <div>
                            <label htmlFor="linkData" className="block text-sm font-medium text-slate-300 mb-2">Link para o QR Code</label>
                            <textarea
                                id="linkData"
                                value={linkData}
                                onChange={e => setLinkData(e.target.value)}
                                placeholder="https://..."
                                rows={4}
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-mono"
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300 mb-2">Enviar para (Número)</label>
                             <input
                                id="phoneNumber"
                                type="text"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                placeholder="5519..."
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="caption" className="block text-sm font-medium text-slate-300 mb-2">Legenda da Imagem</label>
                             <input
                                id="caption"
                                type="text"
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                placeholder="Sua legenda aqui..."
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-violet-600/30 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <QrCodeIcon className="h-5 w-5 mr-2" />
                            {isLoading ? 'Processando...' : 'Gerar e Enviar QR Code'}
                        </button>
                    </form>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl min-h-[420px] flex flex-col items-center justify-center">
                    {isLoading && !qrCodeUrl && (
                        <div className="text-center text-slate-400">
                            <p>{statusMessage}</p>
                        </div>
                    )}
                    {qrCodeUrl && (
                         <div className="text-center animate-fade-in space-y-4">
                            <h3 className="text-lg font-bold text-white">QR Code Gerado:</h3>
                            <img src={qrCodeUrl} alt="QR Code Gerado" className="w-48 h-48 rounded-lg bg-white p-2 mx-auto" />
                            <p className="text-sm text-slate-300 font-mono break-all">{statusMessage}</p>
                        </div>
                    )}
                    {!isLoading && !qrCodeUrl && (
                        <div className="text-center text-slate-500">
                            <QrCodeIcon className="h-12 w-12 mx-auto mb-4" />
                            <p>O QR Code gerado e o status do envio aparecerão aqui.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QrCodeTool;
