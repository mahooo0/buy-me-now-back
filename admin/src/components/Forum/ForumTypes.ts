export type Language = 'en' | 'az' | 'ru';

export type LocalizedString = {
    [key in Language]?: string;
};

export type SelectOption = {
    text: LocalizedString;
    value: string;
};

export type FieldConfig = {
    label: LocalizedString;
    type: 'text' | 'select' | 'editor' | 'single_img' | 'multiple_img';
    key: string;
    options?: SelectOption[];
    required?: boolean;
};

export type FormConfig = {
    fields: FieldConfig[];
    initialValues?: Record<string, any>;
};

export type FormState = {
    values: Record<string, any>;
    errors: Record<string, string>;
};
