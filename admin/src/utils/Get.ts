import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Axios Instance

import { useParams } from 'react-router-dom';
import instanceAxios from './axios';

export default function GETRequest<T>(
    api: string,
    querykey: string,
    dependencies: any[],
    params?: Record<string, any>
) {
    const { lang = 'ru' } = useParams<{ lang: string }>();
    console.log('request', dependencies);

    const { data, isLoading, isError } = useQuery<T>({
        queryKey: [querykey, ...dependencies, params],
        queryFn: async () => {
            try {
                // const userStr = localStorage.getItem('user-info');

                const data = await instanceAxios
                    .get<T>(api, {
                        // headers: {
                        //     'Accept-Language': lang,
                        //     Authorization: userStr
                        //         ? `Bearer ${JSON.parse(userStr).data.token}`
                        //         : '',
                        // },
                        // params: params,
                    })
                    .then((res) => res.data);
                return data;
            } catch (error) {
                // toast.error('Error occurred');
                console.log(error, `querykey: ${querykey}`);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 60,
    });

    return { data, isLoading, isError };
}

// API Helper Methods
