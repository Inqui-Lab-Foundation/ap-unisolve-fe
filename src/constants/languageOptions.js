export const languageOptions = [
    {
        code: 'en',
        name: 'English',
        country_code: 'in'
    },
    {
        code: 'tn',
        name: 'తెలుగు',
        country_code: 'in'
    }
];

export const getLanguage = (lang) => {
    return `locale=${lang?.code}`;
};
