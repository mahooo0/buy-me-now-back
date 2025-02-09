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

export default function Category() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [isDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    console.log('id', id);
    const [lang] = useRecoilState(languageState);

    ///make it state qil

    const { data: category } = GETRequest<any>('category', 'category', []);
    console.log('category', category);

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
        // const newValues = objectToFormData(values);

        console.log('Form Submitted:', transformObject(values));
        if (id === 0) {
            instanceAxios
                .post('category', transformObject(values))
                .then(() => {
                    toast.success('category sucsesfully aded');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['category'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.error);
                });
        } else {
            // const changingData = seo.find((item: any) => item._id === id);
            instanceAxios
                .put(`category/${id}`, transformObject(values))
                .then(() => {
                    toast.success('category sucsesfully updated');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['category'],
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
                            Title: 'name',
                            name: 'name',
                            type: 'text' as 'text',
                            isLanguages: true,
                        },
                        {
                            Title: 'description',
                            name: 'description',
                            type: 'text' as 'text',
                            isLanguages: true,
                        },
                    ]}
                    initialvalues={
                        id === 0
                            ? {}
                            : reverseTransformObject(
                                  category.find((item: any) => item._id === id)
                              )
                    }
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        category{' '}
                    </h1>
                    {category && (
                        <TableDemo
                            structure={[
                                {
                                    HeadTitle: 'Id',
                                    key: ['_id'],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'name',
                                    key: ['name', lang],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'description',
                                    key: ['description', lang],
                                    type: 'str',
                                },
                            ]}
                            data={category as any}
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
