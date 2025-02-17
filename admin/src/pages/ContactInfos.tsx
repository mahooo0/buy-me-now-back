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

export default function ContactInfos() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [isDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();
    console.log('id', id);

    const [lang] = useRecoilState(languageState);
    ///make it state qil

    const { data: ContactInfos } = GETRequest<any>(
        'contact-infos',
        'contact-infos',
        []
    );
    console.log('ContactInfos', ContactInfos);

    const handleSubmit = (values: Record<string, any>) => {
        // const newValues = objectToFormData(values);
        const newValues2 = transformObject(values);

        const newValues = new FormData();
        newValues.append('title', JSON.stringify(newValues2.title));
        newValues.append('image', newValues2.image[0]);
        console.log('Form Submitted:', newValues2);
        if (id === 0) {
            instanceAxios
                .post('contact-infos', newValues)
                .then(() => {
                    toast.success('seo sucsesfully aded');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['contact-infos'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.error);
                });
        } else {
            // const changingData = seo.find((item: any) => item._id === id);
            instanceAxios
                .put(`contact-infos/${id}`, newValues)
                .then(() => {
                    toast.success('ContactInfos sucsesfully updated');
                    setIsForumOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['contact-infos'],
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
                            Title: 'Image',
                            name: 'image',
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
                                  ContactInfos.find(
                                      (item: any) => item._id === id
                                  )
                              )
                    }
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        Contact Infos{' '}
                    </h1>
                    {ContactInfos && (
                        <TableDemo
                            structure={[
                                {
                                    HeadTitle: 'Id',
                                    key: ['_id'],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'Image',
                                    key: ['image'],
                                    type: 'img',
                                },
                                {
                                    HeadTitle: 'title',
                                    key: ['title', lang],
                                    type: 'str',
                                },
                            ]}
                            data={ContactInfos as any}
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
                        .delete(`contact-infos/${id}`)
                        .then(() => {
                            toast.success('meta sucsesfully deleted');
                            setIsDeletemodalOpen(false);
                            queryClient.invalidateQueries({
                                queryKey: ['contact-infos'],
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
