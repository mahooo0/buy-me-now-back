import * as React from 'react';
import { Check, Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRecoilState } from 'recoil';
import languageState from '@/StateManegmant/atom';

const languages = [
    { code: 'az', label: 'Azərbaycan' },
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
];

export function LanguageSwitcher() {
    const [currentLang, setCurrentLang] = useRecoilState(languageState);

    const handleLanguageChange = (langCode: string) => {
        setCurrentLang(langCode);
        // You can store the language preference in localStorage
        // localStorage.setItem('preferredLanguage', langCode);
        // Redirect to the same page with new locale
        // router.push(`/${langCode}${window.location.pathname}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                >
                    <Globe className="h-4 w-4" />
                    <span className="capitalize">{currentLang}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[130px]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="flex items-center justify-between"
                    >
                        {lang.label}
                        {currentLang === lang.code && (
                            <Check className="h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
