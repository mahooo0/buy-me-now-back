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

export default function Home_Product_bunner() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    console.log('id', id);
    const [lang] = useRecoilState(languageState);

    const { data: Bunner } = GETRequest<any>('home-bunner', '/home-bunner', []);
    console.log('Bunner', Bunner);

    const handleSubmit = (values: Record<string, any>) => {
        const newValues = transformObject(values);

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
            const ForumData = new FormData();
            const strTitlr = JSON.stringify(newValues.title);
            const strdescription = JSON.stringify(newValues.description);
            console.log('Form Submitted:', strdescription);

            ForumData.append('title', strTitlr);
            ForumData.append('description', strdescription);
            ForumData.append('video', values.video[0]);
            instanceAxios
                .put(`home-bunner`, ForumData)
                .then(() => {
                    toast.success('category sucsesfully updated');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['/home-bunner'],
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
                            Title: 'video',
                            name: 'video',
                            type: 'single_video' as 'single_video',
                        },
                    ]}
                    initialvalues={
                        id === 0 ? {} : reverseTransformObject(Bunner[0])
                    }
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        Home Bunner{' '}
                    </h1>
                    {Bunner && (
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
                                    HeadTitle: 'video',
                                    key: ['video'],
                                    type: 'video',
                                },
                            ]}
                            data={Bunner as any}
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
        </div>
    );
}
