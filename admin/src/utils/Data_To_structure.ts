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
export function transformObject<T extends Record<string, any>>(
    obj: T
): Record<string, any> {
    const transformed: Record<string, any> = {};

    Object.entries(obj).forEach(([key, value]) => {
        if (key.includes('_')) {
            const [prefix, lang] = key.split('_'); // Split key into prefix and language
            if (lang) {
                // Ensure the prefix exists in the transformed object
                if (!transformed[prefix]) {
                    transformed[prefix] = {};
                }
                // Assign the value under the corresponding language key
                transformed[prefix][lang] = value;
            }
        } else {
            // Copy other keys as-is (e.g., email, name, etc.)
            transformed[key] = value;
        }
    });

    return transformed;
}
export function reverseTransformObject<T extends Record<string, any>>(
    obj: T
): Record<string, any> {
    const reversed: Record<string, any> = {};

    Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            // If value is an array, return it as-is
            reversed[key] = value;
        } else if (typeof value === 'object' && value !== null) {
            // Iterate over each language in the value object
            Object.entries(value).forEach(([lang, langValue]) => {
                reversed[`${key}_${lang}`] = langValue;
            });
        } else {
            // Copy non-object values as-is
            reversed[key] = value;
        }
    });

    return reversed;
}

// const lang = 'en';
// const structure = Data_To_structure(dataFromBackend, lang);

// console.log(structure);
