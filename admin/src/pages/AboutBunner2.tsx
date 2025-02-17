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

export default function AboutBunner2() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [IsDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    const [lang] = useRecoilState(languageState);

    const { data: AboutBunner2 } = GETRequest<any>(
        'about-bunner2',
        '/about-bunner2',
        []
    );
    // console.log('AboutBunner2', reverseTransformObject(AboutBunner2));

    const handleSubmit = (values: Record<string, any>) => {
        const newValues = transformObject(values);
        const ForumData = new FormData();
        const strTitle = JSON.stringify(newValues.title);
        const strdescription = JSON.stringify(newValues.description);
        console.log('Form Submitted:', newValues.images);

        ForumData.append('title', strTitle);
        ForumData.append('description', strdescription);
        const images = Array.isArray(newValues.images)
            ? newValues.images.flat() // Flatten any nested arrays
            : [];

        images.forEach((file) => {
            if (file instanceof File) {
                console.log('file');

                ForumData.append('images', file);
            } else if (typeof file === 'string') {
                console.log('STriiing');

                ForumData.append('imageUrls', file); // Separate handling for URLs if needed
            }
        });
        // ForumData.append('images', newValues.images);
        if (id === 0) {
            instanceAxios
                .post('about-bunner2', newValues)
                .then(() => {
                    toast.success('category sucsesfully aded');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['/about-bunner2'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.error);
                });
        } else {
            instanceAxios
                .put(`about-bunner2`, ForumData)
                .then(() => {
                    toast.success('category sucsesfully updated');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['/about-bunner2'],
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
    const handleDelete = async () => {
        await instanceAxios
            .delete(`about-bunner2/${id}`)
            .then(() => {
                toast.success('category sucsesfully aded');
                setIsForumOpen(false);
                queryClient.invalidateQueries({
                    queryKey: ['/about-bunner2'],
                });
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.error);
            });
        setIsDeletemodalOpen(false);
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
                            type: 'text' as 'text',
                            isLanguages: true,
                        },
                        {
                            Title: 'Images',
                            name: 'images',
                            type: 'multiple_img' as 'multiple_img',
                            isLanguages: false,
                        },
                    ]}
                    initialvalues={
                        id === 0 ? {} : reverseTransformObject(AboutBunner2[0])
                    }
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        About Bunner Second{' '}
                    </h1>
                    {AboutBunner2 && (
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
                                // {
                                //     HeadTitle: 'images',
                                //     key: ['images', '0'],
                                //     type: 'img',
                                // },
                            ]}
                            data={AboutBunner2 as any}
                            // onAdd={() => {
                            //     setIsForumOpen(true);
                            // }}
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
                onCancel={() => {
                    setIsDeletemodalOpen(false), setid(0);
                }}
                onDelete={handleDelete}
                isOpen={IsDeletemodalOpen}
            />
        </div>
    );
}
