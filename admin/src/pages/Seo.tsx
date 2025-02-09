import DeleteModal from '@/components/DeleteModal';
import Forum from '@/components/Forum';
import { TableDemo } from '@/components/Table';
import languageState from '@/StateManegmant/atom';
import instanceAxios from '@/utils/axios';
import GETRequest from '@/utils/Get';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';

export default function Seo() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [isDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    console.log('id', id);

    const [lang] = useRecoilState(languageState);
    ///make it state qil

    const { data: seo } = GETRequest<any>('seo', 'seo', []);
    console.log('seo', seo);

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
                .post('seo', newValues)
                .then(() => {
                    toast.success('seo sucsesfully aded');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['seo'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.error);
                });
        } else {
            // const changingData = seo.find((item: any) => item._id === id);
            instanceAxios
                .put(`seo/${id}`, newValues)
                .then(() => {
                    toast.success('seo sucsesfully updated');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['seo'],
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
                            Title: 'heading',
                            name: 'heading',
                            type: 'text' as 'text',
                            isLanguages: true,
                        },
                        {
                            Title: 'meta Title',
                            name: 'metaTitle',
                            type: 'text' as 'text',
                            isLanguages: true,
                        },
                        {
                            Title: 'meta Description',
                            name: 'metaDescription',
                            type: 'text' as 'text',
                            isLanguages: true,
                        },
                        {
                            Title: 'meta Keywords',
                            name: 'metaKeywords',
                            type: 'text' as 'text',
                            isLanguages: true,
                        },
                        {
                            Title: 'type',
                            name: 'type',
                            type: 'text' as 'text',
                            isLanguages: false,
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
                                  seo.find((item: any) => item._id === id)
                              )
                    }
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        Seo
                    </h1>
                    {seo && (
                        <TableDemo
                            structure={[
                                {
                                    HeadTitle: 'Id',
                                    key: ['_id'],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'heading',
                                    key: ['heading', lang],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'metaTitle',
                                    key: ['metaTitle', lang],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'metaDescription',
                                    key: ['metaDescription', lang],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'metaKeywords',
                                    key: ['metaKeywords', lang],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'type',
                                    key: ['type'],
                                    type: 'str',
                                },
                            ]}
                            data={seo as any}
                            onAdd={() => {
                                setIsForumOpen(true);
                            }}
                            onEdit={(id) => {
                                setIsForumOpen(true);
                                setid(id);
                            }}
                            onDelete={(id) => {
                                setIsDeletemodalOpen(true);
                                setid(id);
                            }}
                        />
                    )}
                </div>
            )}
            <DeleteModal
                isOpen={isDeletemodalOpen}
                onDelete={async () => {
                    await instanceAxios
                        .delete(`seo/${id}`)
                        .then(() => {
                            toast.success('meta sucsesfully deleted');
                            setIsDeletemodalOpen(false);
                            queryClient.invalidateQueries({
                                queryKey: ['seo'],
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
