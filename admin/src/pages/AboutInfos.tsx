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

export default function AboutInfos() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [IsDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    console.log('id', id);
    const [lang] = useRecoilState(languageState);

    const { data: AboutInfos } = GETRequest<any>('abouts', '/abouts', []);
    console.log('AboutInfos', AboutInfos);

    const handleSubmit = (values: Record<string, any>) => {
        const newValues = transformObject(values);

        if (id === 0) {
            instanceAxios
                .post('abouts', newValues)
                .then(() => {
                    toast.success('category sucsesfully aded');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['/abouts'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.error);
                });
        } else {
            instanceAxios
                .put(`abouts/${id}`, newValues)
                .then(() => {
                    toast.success('category sucsesfully updated');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['/abouts'],
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
            .delete(`abouts/${id}`)
            .then(() => {
                toast.success('category sucsesfully aded');
                setIsForumOpen(false);
                queryClient.invalidateQueries({
                    queryKey: ['/abouts'],
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
                    ]}
                    initialvalues={
                        id === 0 ? {} : reverseTransformObject(AboutInfos[0])
                    }
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        About Info{' '}
                    </h1>
                    {AboutInfos && (
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
                            ]}
                            data={AboutInfos as any}
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
                onCancel={() => {
                    setIsDeletemodalOpen(false), setid(0);
                }}
                onDelete={handleDelete}
                isOpen={IsDeletemodalOpen}
            />
        </div>
    );
}
