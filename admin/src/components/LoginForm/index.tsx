import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import instanceAxios from '@/utils/axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'form'>) {
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();

    return (
        <form className={cn('flex flex-col gap-6 ', className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-start">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        {/* <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a> */}
                    </div>
                    <Input id="password" type="password" required />
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    onClick={async (e) => {
                        e.preventDefault();
                        const email = (
                            document.getElementById('email') as HTMLInputElement
                        ).value;
                        const password = (
                            document.getElementById(
                                'password'
                            ) as HTMLInputElement
                        ).value;
                        setloading(true);
                        await instanceAxios
                            .post('usersControll/login', {
                                email: email,
                                password: password,
                            })
                            .then((respose) => {
                                console.log(respose);
                                setloading(false);
                                const adminUser = respose.data.user;
                                localStorage.setItem(
                                    'adminUser',
                                    JSON.stringify(adminUser)
                                );
                                toast.success('login sucsesfully');
                                navigate('/Dasboard');
                            })
                            .catch((error) => {
                                setloading(false);

                                toast.error(error.response.data.error);
                                console.log(error);
                            });
                        console.log({ email, password });
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <svg
                            className="animate-spin h-5 w-5 mr-3 ..."
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        'Login'
                    )}
                </Button>
            </div>
        </form>
    );
}
