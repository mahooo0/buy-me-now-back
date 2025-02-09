import DeleteModal from '@/components/DeleteModal';
import Forum from '@/components/Forum';
import { TableDemo } from '@/components/Table';
import languageState from '@/StateManegmant/atom';
import instanceAxios from '@/utils/axios';
import Data_To_structure from '@/utils/Data_To_structure';
import GETRequest from '@/utils/Get';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';

export default function Translations() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [isDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    console.log('id', id);

    const [lang] = useRecoilState(languageState);
    ///make it state qil

    const { data: translations } = GETRequest<any>(
        'translations/admin',
        'translations',
        []
    );
    function transformObject<T extends Record<string, any>>(
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
    function reverseTransformObject<T extends Record<string, any>>(
        obj: T
    ): Record<string, any> {
        const reversed: Record<string, any> = {};

        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                // Iterate over each language in the value object
                Object.entries(value).forEach(([lang, langValue]) => {
                    // Create the key by combining the prefix and language
                    reversed[`${key}_${lang}`] = langValue;
                });
            } else {
                // Copy non-object values as-is
                reversed[key] = value;
            }
        });

        return reversed;
    }

    const handleSubmit = (values: Record<string, any>) => {
        const newValues = transformObject(values);
        // console.log('Form Submitted:', values, newValues);
        if (id === 0) {
            instanceAxios
                .post('translations', newValues)
                .then(() => {
                    toast.success('translation sucsesfully aded');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['translations'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.error);
                });
        } else {
            const changingData = translations.find(
                (item: any) => item._id === id
            );
            instanceAxios
                .put(`translations/${changingData.key}`, newValues)
                .then(() => {
                    toast.success('translation sucsesfully updated');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['translations'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.error);
                });
        }
        // alert('Form submitted successfully!');
    };
    return (
        <div>
            {isForumOpen ? (
                <Forum
                    dasHaveLanguage={true}
                    onClose={() => {
                        setIsForumOpen(false);
                        setid(0);
                    }}
                    inputs={[
                        {
                            Title: 'Key',
                            name: 'key',
                            type: 'text' as 'text',
                            isLanguages: false,
                            cantEdit: !(id === 0),
                        },
                        {
                            Title: 'value',
                            name: 'value',
                            type: 'text' as 'text',
                            isLanguages: true,
                        },

                        // {
                        //     Title: 'Role',
                        //     name: 'role',
                        //     type: 'select' as 'select',
                        //     options: [
                        //         { value: 'admin', text: 'admin' },
                        //         { value: 'editor', text: 'editor' },
                        //     ],
                        // },
                    ]}
                    initialvalues={
                        id === 0
                            ? {}
                            : reverseTransformObject(
                                  translations.find(
                                      (item: any) => item._id === id
                                  )
                              )
                    }
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        Translations
                    </h1>
                    {translations && (
                        <TableDemo
                            structure={[
                                {
                                    HeadTitle: 'Id',
                                    key: ['_id'],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'Key',
                                    key: ['key'],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'value',
                                    key: ['value', lang],
                                    type: 'str',
                                },
                            ]}
                            data={translations as any}
                            onAdd={() => {
                                setIsForumOpen(true);
                            }}
                            onEdit={(id) => {
                                setIsForumOpen(true);
                                setid(id);
                            }}
                            // onDelete={(id) => {
                            //     setIsDeletemodalOpen(true);
                            //     setid(id);
                            // }}
                        />
                    )}
                </div>
            )}
            <DeleteModal
                isOpen={isDeletemodalOpen}
                onDelete={async () => {
                    await instanceAxios
                        .delete(`translations/${id}`)
                        .then(() => {
                            toast.success('user sucsesfully deleted');
                            setIsDeletemodalOpen(false);
                            queryClient.invalidateQueries({
                                queryKey: ['usersControll'],
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            toast.error(error.response.data.error);
                        });
                }}
                onCancel={() => {
                    setIsDeletemodalOpen(false);
                }}
            />
        </div>
    );
}
