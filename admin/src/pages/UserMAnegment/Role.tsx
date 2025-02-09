import Forum from '@/components/Forum';
import { TableDemo } from '@/components/Table';
import languageState from '@/StateManegmant/atom';
import Data_To_structure from '@/utils/Data_To_structure';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

export default function ROle() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [lang] = useRecoilState(languageState);
    ///make it state qil
    const dataFromBackend = [
        { name: 'ss', Email: 'sjkhsjkhfjkf', role: 'jhjdh' }, // Other user objects as needed...
    ];
    const inputs = [
        {
            Title: 'name',
            name: 'name',
            type: 'text' as 'text',
        },
        {
            Title: 'Email',
            name: 'Email',
            type: 'email' as 'email',
        },
        {
            Title: 'Passwors',
            name: 'Passwors',
            type: 'password' as 'password',
        },
        {
            Title: 'ROle',
            name: 'role',
            type: 'select' as 'select',
            options: [
                { value: 'admin', text: 'admin' },
                { value: 'editor', text: 'editor' },
                { value: 'wiuver', text: 'wiuver' },
            ],
        },
    ];

    const initialValues = {};

    const handleSubmit = (values: Record<string, any>) => {
        console.log('Form Submitted:', values);
        alert('Form submitted successfully!');
    };
    return (
        <div>
            {isForumOpen ? (
                <Forum
                    dasHaveLanguage={false}
                    onClose={() => {
                        setIsForumOpen(false);
                    }}
                    inputs={inputs}
                    initialvalues={initialValues}
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="p-10">
                    <TableDemo
                        structure={Data_To_structure(dataFromBackend, lang)}
                        data={dataFromBackend}
                        onAdd={() => {
                            setIsForumOpen(true);
                        }}
                        onEdit={(id) => {}}
                        onDelete={(id) => {}}
                    />
                </div>
            )}
        </div>
    );
}
