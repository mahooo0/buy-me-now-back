import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Input } from '../ui/input';
import { FileInput } from './imgInput';
import { VideoInput } from './video-input';
import toast from 'react-hot-toast';

interface Props {
    inputs: {
        Title: string;
        name: string;
        type:
            | 'text'
            | 'number'
            | 'select'
            | 'single_img'
            | 'multiple_img'
            | 'quil'
            | 'single_video'
            | 'multiple_video'
            | 'email'
            | 'password';
        options?: {
            value: string;
            text: string;
        }[];
        isLanguages?: boolean;
        cantEdit?: boolean;
    }[];
    initialvalues: Record<string, any>;
    handleSubmit: (values: Record<string, any>) => void;
    onClose: () => void;
    dasHaveLanguage?: boolean;
    onChange?: (name: string, value: any) => void; // Add this line
}

export default function Forum({
    dasHaveLanguage = true,
    inputs,
    initialvalues,
    handleSubmit,
    onClose,
    onChange,
}: Props) {
    const [CurrentLang, setCurrentLang] = useState<'az' | 'en' | 'ru'>('az');

    const [formValues, setFormValues] =
        useState<Record<string, any>>(initialvalues);

    // const handleInputChange = (name: string, value: any) => {
    //     setFormValues((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };
    const handleInputChange = (name: string, value: any) => {
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (onChange) {
            onChange(name, value); // Call the onChange callback
        }
    };
    const validateForm = () => {
        for (const input of inputs) {
            if (input.type === 'text' || input.type === 'quil') {
                if (input.isLanguages) {
                    for (const lang of ['en', 'ru', 'az']) {
                        const key = `${input.name}_${lang}`;
                        if (!formValues[key] || formValues[key].trim() === '') {
                            toast.error(
                                `Please fill out ${
                                    input.Title
                                } (${lang.toUpperCase()})`
                            );
                            return false;
                        }
                    }
                } else if (
                    !formValues[input.name] ||
                    formValues[input.name].toString().trim() === ''
                ) {
                    toast.error(`Please fill out ${input.Title}`);
                    return false;
                }
            } else if (
                (input.type === 'number' ||
                    input.type === 'select' ||
                    input.type === 'email' ||
                    input.type === 'password') &&
                (!formValues[input.name] ||
                    formValues[input.name].toString().trim() === '')
            ) {
                toast.error(`Please fill out ${input.Title}`);
                return false;
            } else if (
                (input.type === 'single_img' ||
                    input.type === 'multiple_img') &&
                (!formValues[input.name] || formValues[input.name].length === 0)
            ) {
                toast.error(`Please upload a file for ${input.Title}`);
                return false;
            } else if (
                (input.type === 'single_video' ||
                    input.type === 'multiple_video') &&
                (!formValues[input.name] || formValues[input.name].length === 0)
            ) {
                toast.error(`Please upload a file for ${input.Title}`);
                return false;
            }
        }
        return true;
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            handleSubmit(formValues);
        }
    };

    return (
        <div className="mx-5 relative">
            <button
                type="button"
                onClick={onClose}
                className="absolute top-2 right-2 p-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <Card className="w-full">
                <CardHeader className="flex justify-start items-start w-full">
                    <CardTitle className="text-[24px]">Dynamic Form</CardTitle>
                    {dasHaveLanguage && (
                        <CardDescription className="border-b border-black w-full flex justify-start relative h-[50px]">
                            <div className="flex absolute top-4 left-2">
                                {(['en', 'ru', 'az'] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => setCurrentLang(lang)}
                                        className={`px-3 py-1.5 border-t border-x border-black text-sm font-medium transition-colors rounded-t-md ${
                                            CurrentLang === lang
                                                ? 'bg-background text-foreground shadow-sm'
                                                : 'text-muted-foreground hover:bg-background/50 border-b border-opacity-40'
                                        }`}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </CardDescription>
                    )}
                </CardHeader>
                <form onSubmit={handleFormSubmit}>
                    <CardContent className="space-y-6">
                        {inputs.map((input) => {
                            switch (input.type) {
                                case 'text':
                                case 'quil':
                                    return (
                                        <>
                                            {input.isLanguages ? (
                                                (
                                                    ['en', 'ru', 'az'] as const
                                                ).map((lang) => (
                                                    <div
                                                        style={
                                                            lang === CurrentLang
                                                                ? {}
                                                                : {
                                                                      display:
                                                                          'none',
                                                                  }
                                                        }
                                                        key={input.name + lang}
                                                    >
                                                        <label className="block w-full text-start font-medium">
                                                            {input.Title} {lang}
                                                        </label>
                                                        {input.type ===
                                                        'text' ? (
                                                            <Input
                                                                type={
                                                                    input.type
                                                                }
                                                                name={
                                                                    input.name +
                                                                    `_${lang}`
                                                                }
                                                                value={
                                                                    formValues[
                                                                        input.name +
                                                                            `_${lang}`
                                                                    ] || ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        input.name +
                                                                            `_${lang}`,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="border p-2 w-full rounded-md"
                                                            />
                                                        ) : (
                                                            <ReactQuill
                                                                value={
                                                                    formValues[
                                                                        input.name +
                                                                            `_${lang}`
                                                                    ] || ''
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    handleInputChange(
                                                                        input.name +
                                                                            `_${lang}`,
                                                                        value
                                                                    )
                                                                }
                                                                className=""
                                                            />
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    <div key={input.name}>
                                                        <label className="block w-full text-start font-medium">
                                                            {input.Title}
                                                        </label>
                                                        {input.type ===
                                                        'text' ? (
                                                            <Input
                                                                type={
                                                                    input.type
                                                                }
                                                                name={
                                                                    input.name
                                                                }
                                                                value={
                                                                    formValues[
                                                                        input
                                                                            .name
                                                                    ] || ''
                                                                }
                                                                disabled={
                                                                    input.cantEdit
                                                                }
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        input.name,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="border p-2 w-full rounded-md"
                                                            />
                                                        ) : (
                                                            <ReactQuill
                                                                value={
                                                                    formValues[
                                                                        input
                                                                            .name
                                                                    ] || ''
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    handleInputChange(
                                                                        input.name,
                                                                        value
                                                                    )
                                                                }
                                                                className=" h-"
                                                            />
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    );
                                case 'number':
                                case 'email':
                                case 'password':
                                    return (
                                        <div key={input.name}>
                                            <label className="block font-medium w-full text-start">
                                                {input.Title}
                                            </label>
                                            <Input
                                                type={input.type}
                                                name={input.name}
                                                value={
                                                    formValues[input.name] || ''
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        input.name,
                                                        e.target.value
                                                    )
                                                }
                                                className="border p-2 w-full rounded-md"
                                            />
                                        </div>
                                    );
                                case 'select':
                                    return (
                                        <div key={input.name}>
                                            <label className="block w-full text-start font-medium">
                                                {input.Title}
                                            </label>
                                            <select
                                                name={input.name}
                                                value={
                                                    formValues[input.name] || ''
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        input.name,
                                                        e.target.value
                                                    )
                                                }
                                                className="border p-2 w-full rounded-md"
                                            >
                                                <option value="">
                                                    Select an option
                                                </option>
                                                {input.options?.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.text}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    );
                                case 'single_img':
                                case 'multiple_img':
                                    return (
                                        <div key={input.name}>
                                            <label className="block font-medium w-full text-start">
                                                {input.Title}
                                            </label>
                                            <FileInput
                                                name={input.name}
                                                title={input.Title}
                                                value={
                                                    formValues[input.name] || []
                                                }
                                                multiple={
                                                    input.type ===
                                                    'multiple_img'
                                                }
                                                onChange={(files) => {
                                                    handleInputChange(
                                                        input.name,
                                                        files
                                                            ? Array.from(files)
                                                            : null
                                                    );
                                                }}
                                            />
                                        </div>
                                    );
                                case 'single_video':
                                case 'multiple_video':
                                    return (
                                        <div key={input.name}>
                                            <label className="block font-medium w-full text-start">
                                                {input.Title}
                                            </label>
                                            <VideoInput
                                                name={input.name}
                                                title={input.Title}
                                                multiple={
                                                    input.type ===
                                                    'multiple_video'
                                                }
                                                onChange={(files) => {
                                                    handleInputChange(
                                                        input.name,
                                                        files
                                                            ? Array.from(files)
                                                            : null
                                                    );
                                                }}
                                            />
                                        </div>
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </CardContent>
                    <CardFooter className="space-x-4">
                        <Button type="submit">Submit</Button>
                        <Button
                            type="button"
                            onClick={() => {
                                onClose();
                                setFormValues(initialvalues);
                            }}
                        >
                            Cancel
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
