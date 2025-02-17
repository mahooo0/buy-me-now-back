import DeleteModal from '@/components/DeleteModal';
import Forum from '@/components/Forum';
import { TableDemo } from '@/components/Table';
import languageState from '@/StateManegmant/atom';
import instanceAxios from '@/utils/axios';
import {
    reverseTransformObject,
    transformObject,
} from '@/utils/Data_To_structure';
import GETRequest from '@/utils/Get';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';

export default function ProductCategory() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [isDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    console.log('id', id);

    const [lang] = useRecoilState(languageState);
    ///make it state qil

    const { data: ProductCategory } = GETRequest<any>(
        'product-category',
        'product-category',
        []
    );
    console.log('ProductCategory', ProductCategory);

    const handleSubmit = (values: Record<string, any>) => {
        // const newValues = objectToFormData(values);
        const newValues2 = transformObject(values);

        const newValues = new FormData();
        newValues.append('title', JSON.stringify(newValues2.title));

        console.log('Form Submitted:', values);
        if (Array.isArray(values.image)) {
            newValues.append('image', values.image[0]);
        } else {
            newValues.append('image', values.image);
        }
        values.image_bg && newValues.append('image_bg', values.image_bg[0]);
        if (id === 0) {
            instanceAxios
                .post('product-category', newValues)
                .then(() => {
                    toast.success('seo sucsesfully aded');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['product-category'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.error);
                });
        } else {
            // const changingData = seo.find((item: any) => item._id === id);
            instanceAxios
                .put(`product-category/${id}`, newValues)
                .then(() => {
                    toast.success('ProductCategory sucsesfully updated');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['product-category'],
                    });
                    setid(0);
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
                            Title: 'Image title',
                            name: 'image',
                            type: 'single_img' as 'single_img',
                            isLanguages: false,
                        },
                        {
                            Title: 'Image BG',
                            name: 'image_bg',
                            type: 'single_img' as 'single_img',
                            isLanguages: false,
                        },
                        {
                            Title: 'title',
                            name: 'title',
                            type: 'text' as 'text',
                            isLanguages: true,
                        },
                    ]}
                    initialvalues={
                        id === 0
                            ? {}
                            : reverseTransformObject(
                                  ProductCategory.find(
                                      (item: any) => item._id === id
                                  )
                              )
                    }
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        Product Category{' '}
                    </h1>
                    {ProductCategory && (
                        <TableDemo
                            structure={[
                                {
                                    HeadTitle: 'Id',
                                    key: ['_id'],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'image_bg',
                                    key: ['image_bg'],
                                    type: 'img',
                                },
                                {
                                    HeadTitle: 'Title Image',
                                    key: ['image'],
                                    type: 'img',
                                },
                                {
                                    HeadTitle: 'title',
                                    key: ['title', lang],
                                    type: 'str',
                                },
                            ]}
                            data={ProductCategory as any}
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
                        .delete(`product-category/${id}`)
                        .then(() => {
                            toast.success('meta sucsesfully deleted');
                            setIsDeletemodalOpen(false);
                            queryClient.invalidateQueries({
                                queryKey: ['product-category'],
                            });
                            setid(0);
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
