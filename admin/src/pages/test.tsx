import Forum from '@/components/Forum';
import { AppSidebar } from '@/components/Sidebar';
import { TableDemo } from '@/components/Table';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import languageState from '@/StateManegmant/atom';
import Data_To_structure from '@/utils/Data_To_structure';
import GETRequest from '@/utils/Get';
import { Separator } from '@radix-ui/react-separator';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

// type Field = {
//     name: string;
//     label: string;
//     type: 'text' | 'textarea' | 'rich-text' | 'number';
//     placeholder?: string;
// };
// const fields: Field[] = [
//     { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter title' },
//     {
//         name: 'description',
//         label: 'Description',
//         type: 'textarea',
//         placeholder: 'Enter description',
//     },
//     {
//         name: 'content',
//         label: 'Content',
//         type: 'rich-text',
//         placeholder: 'Write your content...',
//     },
// ];

const handleSubmit = (values: Record<string, any>) => {
    console.log('Form submitted with values:', values);
};
export default function Exsample() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [lang] = useRecoilState(languageState);
    ///make it state qil
    const dataFromBackend = [
        {
            title: {
                az: 'titlekjhnkjaz',
                en: 'titleen',
                ru: 'titleru',
            },
            desc: {
                az: 'descaz',
                en: 'descen',
                ru: 'descru',
            },
            category_id: 12,
            price: '54545',
            id: 1,
            img: '/images/london.jpg',
        },

        // Other user objects as needed...
    ];
    const inputs = [
        {
            Title: 'Name',
            name: 'name',
            type: 'text' as 'text',
            isLanguages: true,
        },
        {
            Title: 'Bio',
            name: 'bio',
            type: 'quil' as 'quil',
            isLanguages: true,
        },
        // {
        //     Title: 'Bio',
        //     name: 'bio',
        //     type: 'quil' as 'quil',
        // },
        // {
        //     Title: 'Name',
        //     name: 'name2',
        //     type: 'text' as 'text',
        // },

        // {
        //     Title: 'Age',
        //     name: 'age',
        //     type: 'number' as 'number',
        // },
        // {
        //     Title: 'Language',
        //     name: 'language',
        //     type: 'select' as 'select',
        //     options: [
        //         { value: 'en', text: 'English' },
        //         { value: 'az', text: 'Azerbaijani' },
        //         { value: 'ru', text: 'Russian' },
        //     ],
        // },

        // {
        //     Title: 'Profile Picture',
        //     name: 'profilePicture',
        //     type: 'single_img' as 'single_img',
        // },
        // {
        //     Title: 'Gallery',
        //     name: 'gallery',
        //     type: 'multiple_img' as 'multiple_img',
        // },
        // {
        //     Title: 'Profile video',
        //     name: 'profilePicture',
        //     type: 'single_video' as 'single_video',
        // },
        // {
        //     Title: 'Gallery video',
        //     name: 'gallery',
        //     type: 'multiple_video' as 'multiple_video',
        // },
    ];

    const initialValues = {
        name_az: 'dddddddd',
        name_en: 'name_en',
        name_ru: 'name_ru',
        age: 11,
        language: 'en',
        bio_en: 'aaaqaaa',
        bio_az: 'a22aaaaa',
        bio_ru: 'aaa2aaa',
        profilePicture: '/images/london.jpg',
        gallery: [],
    };

    const handleSubmit = (values: Record<string, any>) => {
        console.log('Form Submitted:', values);
        alert('Form submitted successfully!');
    };
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                    </div>
                </header>
                {isForumOpen ? (
                    <Forum
                        onClose={() => {
                            setIsForumOpen(false);
                        }}
                        inputs={inputs}
                        initialvalues={initialValues}
                        handleSubmit={handleSubmit}
                    />
                ) : (
                    <TableDemo
                        structure={Data_To_structure(dataFromBackend, lang)}
                        data={dataFromBackend}
                        onAdd={() => {
                            setIsForumOpen(true);
                        }}
                        // onEdit={(id) => {}}
                        // onDelete={(id) => {}}
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
