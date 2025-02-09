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

export default function ExsampleData() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [isDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [SelectCategory, setSelectCategory] = useState(null);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    console.log('id', id);

    const [lang] = useRecoilState(languageState);
    ///make it state qil

    const { data } = GETRequest<any>('exampleData', 'exampleData', []);
    const { data: category } = GETRequest<any>(`category`, 'category', []);
    const { data: subcategory } = GETRequest<any>(
        `subcategory${SelectCategory ? `?categoryid=${SelectCategory}` : ``}`,
        'subcategory',
        [SelectCategory]
    );

    console.log('subcategory', subcategory);

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
    const transformToForumData = (data: Record<string, any>) => {
        const transformedData: Record<string, any> = {};

        // Helper function to flatten nested objects with language keys
        const flattenNestedObject = (
            obj: Record<string, any>,
            prefix: string
        ) => {
            for (const [key, value] of Object.entries(obj)) {
                transformedData[`${prefix}_${key}`] = value;
            }
        };

        // Helper function to log file data
        const logFileData = (files: any[], fieldName: string) => {
            console.log(`Files for ${fieldName}:`);
            files.forEach((file, index) => {
                console.log(`File ${index + 1}:`, file);
            });
        };

        // Iterate over the input data
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object' && !Array.isArray(value)) {
                // Handle nested objects (e.g., description, title)
                flattenNestedObject(value, key);
            } else if (Array.isArray(value)) {
                // Handle arrays (e.g., image, images, video, videos)
                if (
                    key === 'image' ||
                    key === 'images' ||
                    key === 'video' ||
                    key === 'videos'
                ) {
                    // Log file data for these fields
                    logFileData(value, key);
                }
                transformedData[key] = value;
            } else {
                // Handle primitive values (e.g., CategoryId, SubCategoryId, price, discount)
                transformedData[key] = value;
            }
        }

        return transformedData;
    };
    const handleSubmit = (values: Record<string, any>) => {
        // const newValues = objectToFormData(values);
        const newData = transformObject(values);
        console.log('Form Submitted:', transformToForumData(newData));
        if (id === 0) {
            // instanceAxios
            //     .post('exampleData', transformObject(values))
            //     .then(() => {
            //         toast.success('exampleData sucsesfully aded');
            //         setIsForumOpen(false);
            //         queryClient.invalidateQueries({
            //             queryKey: ['exampleData'],
            //         });
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //         toast.error(error.response.data.error);
            //     });
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
    const handleChange = (name: string, value: any) => {
        // console.table({ name, value });
        setSelectCategory(value);
        // setFormValues((prev) => ({
        //     ...prev,
        //     [name]: value,
        // }));
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
                            Title: 'title',
                            name: 'title',
                            type: 'text' as 'text',
                            isLanguages: true,
                        },
                        {
                            Title: 'description',
                            name: 'description',
                            type: 'quil' as 'quil',
                            isLanguages: true,
                        },
                        {
                            Title: 'price',
                            name: 'price',
                            type: 'text' as 'text',
                            isLanguages: false,
                        },
                        {
                            Title: 'discount',
                            name: 'discount',
                            type: 'text' as 'text',
                            isLanguages: false,
                        },
                        {
                            Title: 'image',
                            name: 'image',
                            type: 'single_img' as 'single_img',
                            isLanguages: false,
                        },
                        {
                            Title: 'images',
                            name: 'images',
                            type: 'multiple_img' as 'multiple_img',
                            isLanguages: false,
                        },
                        {
                            Title: 'video',
                            name: 'video',
                            type: 'single_video' as 'single_video',
                            isLanguages: false,
                        },
                        {
                            Title: 'videos',
                            name: 'videos',
                            type: 'multiple_video' as 'multiple_video',
                            isLanguages: false,
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
                        {
                            Title: 'Sub Category Relation',
                            name: 'SubCategoryId',
                            type: 'select' as 'select',
                            isLanguages: false,
                            options: subcategory?.map((category: any) => {
                                return {
                                    value: category._id,
                                    text: category.name[lang],
                                };
                            }),
                        },
                    ]}
                    onChange={handleChange} // Pass the onChange callback
                    initialvalues={
                        id === 0
                            ? {}
                            : {
                                  //   name_az: data.find(
                                  //       (item: any) => item._id === id
                                  //   ).name['az'],
                                  //   name_en: data.find(
                                  //       (item: any) => item._id === id
                                  //   ).name['en'],
                                  //   name_ru: data.find(
                                  //       (item: any) => item._id === id
                                  //   ).name['ru'],
                                  //   description_az: data.find(
                                  //       (item: any) => item._id === id
                                  //   ).description['az'],
                                  //   description_en: data.find(
                                  //       (item: any) => item._id === id
                                  //   ).description['en'],
                                  //   description_ru: data.find(
                                  //       (item: any) => item._id === id
                                  //   ).description['ru'],
                                  //   CategoryId: data.find(
                                  //       (item: any) => item._id === id
                                  //   ).CategoryId._id,
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
                                    HeadTitle: 'title',
                                    key: ['title', lang],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'description',
                                    key: ['description', lang],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'price',
                                    key: ['price'],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'discount',
                                    key: ['discount'],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'image',
                                    key: ['image'],
                                    type: 'img',
                                },

                                {
                                    HeadTitle: 'Category',
                                    key: ['CategoryId', 'name', lang],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'SubCategoryId',
                                    key: ['SubCategoryId', 'name', lang],
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
