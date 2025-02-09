import DeleteModal from '@/components/DeleteModal';
import Forum from '@/components/Forum';
import { TableDemo } from '@/components/Table';
import languageState from '@/StateManegmant/atom';
import instanceAxios from '@/utils/axios';
import Data_To_structure from '@/utils/Data_To_structure';
import GETRequest from '@/utils/Get';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';

export default function Users() {
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [isDeletemodalOpen, setIsDeletemodalOpen] = useState(false);
    const [id, setid] = useState(0);
    const queryClient = useQueryClient();

    const [lang] = useRecoilState(languageState);
    ///make it state qil

    const { data: Users } = GETRequest<any>('users', 'users', []);

    const handleSubmit = (values: Record<string, any>) => {
        console.log('Form Submitted:', values);
        instanceAxios
            .post('users/', values)
            .then(() => {
                toast.success('User sucsesfully aded');
                setIsForumOpen(false);
                queryClient.invalidateQueries({ queryKey: ['users'] });
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.error);
            });
        // alert('Form submitted successfully!');
    };
    return (
        <div>
            {isForumOpen ? (
                <Forum
                    dasHaveLanguage={false}
                    onClose={() => {
                        setIsForumOpen(false);
                    }}
                    inputs={[
                        {
                            Title: 'Email',
                            name: 'email',
                            type: 'email' as 'email',
                        },
                        {
                            Title: 'Passwors',
                            name: 'password',
                            type: 'password' as 'password',
                        },
                        {
                            Title: 'Role',
                            name: 'role',
                            type: 'select' as 'select',
                            options: [
                                { value: 'admin', text: 'admin' },
                                { value: 'editor', text: 'editor' },
                            ],
                        },
                    ]}
                    initialvalues={{}}
                    handleSubmit={handleSubmit}
                />
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold  text-start p-10 pb-0">
                        Users
                    </h1>
                    {Users && (
                        <TableDemo
                            structure={[
                                {
                                    HeadTitle: 'Id',
                                    key: ['_id'],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'Email',
                                    key: ['email'],
                                    type: 'str',
                                },
                                {
                                    HeadTitle: 'Role',
                                    key: ['role'],
                                    type: 'str',
                                },
                            ]}
                            data={Users as any}
                            onAdd={() => {
                                setIsForumOpen(true);
                            }}
                            // onEdit={(id) => {
                            //     setIsForumOpen(true);
                            //     setid(id);
                            // }}
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
                        .delete(`users/${id}`)
                        .then(() => {
                            toast.success('user sucsesfully deleted');
                            setIsDeletemodalOpen(false);
                            queryClient.invalidateQueries({
                                queryKey: ['users'],
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
