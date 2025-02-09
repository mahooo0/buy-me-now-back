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

export default function SubCategory() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [isDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    console.log('id', id);

    const [lang] = useRecoilState(languageState);
    ///make it state qil

    const { data } = GETRequest<any>('subcategory', 'subcategory', []);
    const { data: category } = GETRequest<any>('category', 'category', []);

    console.log('subcategory', data);

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
                .post('subcategory', transformObject(values))
                .then(() => {
                    toast.success('subcategory sucsesfully aded');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['subcategory'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.error);
                });
        } else {
            // const changingData = seo.find((item: any) => item._id === id);
            instanceAxios
                .put(`subcategory/${id}`, transformObject(values))
                .then(() => {
                    toast.success('subcategory sucsesfully updated');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['subcategory'],
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
                        {
                            Title: 'Category Relation',
                            name: 'CategoryId',
                            type: 'select' as 'select',
                            isLanguages: false,
                            options: category.map((category: any) => {
                                return {
                                    value: category._id,
                                    text: category.name[lang],
                                };
                            }),
                        },
                    ]}
                    initialvalues={
                        id === 0
                            ? {}
                            : {
                                  name_az: data.find(
                                      (item: any) => item._id === id
                                  ).name['az'],
                                  name_en: data.find(
                                      (item: any) => item._id === id
                                  ).name['en'],
                                  name_ru: data.find(
                                      (item: any) => item._id === id
                                  ).name['ru'],
                                  description_az: data.find(
                                      (item: any) => item._id === id
                                  ).description['az'],
                                  description_en: data.find(
                                      (item: any) => item._id === id
                                  ).description['en'],
                                  description_ru: data.find(
                                      (item: any) => item._id === id
                                  ).description['ru'],
                                  CategoryId: data.find(
                                      (item: any) => item._id === id
                                  ).CategoryId._id,
                              }
                    }
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        SubCategory{' '}
                    </h1>
                    {data && (
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
                                {
                                    HeadTitle: 'Category',
                                    key: ['CategoryId', 'name', lang],
                                    type: 'str',
                                },
                            ]}
                            data={data as any}
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
