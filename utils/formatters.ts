const prepositions = new Set(['de', 'da', 'do', 'das', 'dos']);

/**
 * Normaliza um nome próprio, capitalizando a primeira letra de cada palavra,
 * exceto para preposições comuns (de, da, do, etc.) que são mantidas em minúsculas,
 * a menos que sejam a primeira palavra do nome.
 * @param name O nome a ser normalizado.
 * @returns O nome normalizado.
 */
export const normalizeName = (name: string): string => {
    if (!name) return '';
    return name
        .trim()
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0) // Remove espaços múltiplos
        .map((word, index) => {
            if (index > 0 && prepositions.has(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};
