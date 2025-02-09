type DataItem = Record<string, any>; // Generic type for dynamic data structure

interface StructureItem {
    type: 'str' | 'img';
    HeadTitle: string;
    key: string[];
}

export default function Data_To_structure(
    data: any[],
    lang: string
): StructureItem[] {
    if (!data || data.length === 0) {
        throw new Error('Data array is empty or invalid.');
    }

    const structure: StructureItem[] = [];

    Object.keys(data[0]).forEach((key) => {
        const field = data[0][key];

        if (typeof field === 'object' && field !== null && lang in field) {
            // For fields like { az: 'value', en: 'value', ru: 'value' }
            structure.push({
                type: 'str',
                HeadTitle: `${
                    key.charAt(0).toUpperCase() + key.slice(1)
                } (${lang})`,
                key: [key, lang],
            });
        } else if (
            typeof field === 'string' &&
            /\.(jpg|jpeg|png|gif|webp)$/.test(field)
        ) {
            // For image fields
            structure.push({
                type: 'img',
                HeadTitle: `${
                    key.charAt(0).toUpperCase() + key.slice(1)
                } Image`,
                key: [key],
            });
        } else if (typeof field === 'string') {
            // For simple string fields
            structure.push({
                type: 'str',
                HeadTitle: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
                key: [key],
            });
        } else if (typeof field === 'number') {
            // For number fields
            structure.push({
                type: 'str',
                HeadTitle: `${key.charAt(0).toUpperCase() + key.slice(1)} ID`,
                key: [key],
            });
        }
    });

    return structure;
}

// Example usage
const dataFromBackend: DataItem[] = [
    {
        title: { az: 'titleaz', en: 'titleen', ru: 'titleru' },
        desc: { az: 'descaz', en: 'descen', ru: 'descru' },
        id: 1,
        img: '/images/london.jpg',
        name: 'John Doe',
    },
    {
        title: { az: 'titleaz2', en: 'titleen2', ru: 'titleru2' },
        desc: { az: 'descaz2', en: 'descen2', ru: 'descru2' },
        id: 2,
        img: '/images/paris.jpg',
        name: 'Jane Doe',
    },
];

// const lang = 'en';
// const structure = Data_To_structure(dataFromBackend, lang);

// console.log(structure);
