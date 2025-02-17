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

export default function AboutBunner1() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [IsDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    console.log('id', id);
    const [lang] = useRecoilState(languageState);

    const { data: AboutBunner1 } = GETRequest<any>(
        'about-bunner1',
        '/about-bunner1',
        []
    );
    console.log('AboutBunner1', AboutBunner1);

    const handleSubmit = (values: Record<string, any>) => {
        const newValues = transformObject(values);
        const ForumData = new FormData();
        const strTitle = JSON.stringify(newValues.title);
        const strdescription = JSON.stringify(newValues.description);
        console.log('Form Submitted:', newValues.image);

        ForumData.append('title', strTitle);
        ForumData.append('description', strdescription);
        ForumData.append('image', newValues.image[0]);

        if (id === 0) {
            instanceAxios
                .post('about-bunner1', newValues)
                .then(() => {
                    toast.success('category sucsesfully aded');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['/about-bunner1'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.error);
                });
        } else {
            instanceAxios
                .put(`about-bunner1`, ForumData)
                .then(() => {
                    toast.success('category sucsesfully updated');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['/about-bunner1'],
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
            .delete(`about-bunner1/${id}`)
            .then(() => {
                toast.success('category sucsesfully aded');
                setIsForumOpen(false);
                queryClient.invalidateQueries({
                    queryKey: ['/about-bunner1'],
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
                            Title: 'Image',
                            name: 'image',
                            type: 'single_img' as 'single_img',
                            isLanguages: true,
                        },
                    ]}
                    initialvalues={
                        id === 0 ? {} : reverseTransformObject(AboutBunner1[0])
                    }
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        About Info{' '}
                    </h1>
                    {AboutBunner1 && (
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
                                    HeadTitle: 'image',
                                    key: ['image'],
                                    type: 'img',
                                },
                            ]}
                            data={AboutBunner1 as any}
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
