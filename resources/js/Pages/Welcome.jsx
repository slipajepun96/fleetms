import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';



export default function Welcome({ auth, canResetPassword, status }) {
    const [formType, setFormType] = useState('login'); // 'login', 'register', or 'admin'

    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_contact_person: '',
        vendor_email: '',
        password: '',
        password_confirmation: '',
    });

    const switchForm = (type) => {
        reset();
        setFormType(type);
    };

    const submitLogin = (e) => {
        e.preventDefault();

        post(route('vendor.login.store'), {
            preserveScroll: true,
            preserveState: (page) => Object.keys(page.props.errors).length,
            onFinish: () => reset('password'),
        });
    };

    const submitRegister = (e) => {
        e.preventDefault();

        post(route('vendor.register.store'), {
            preserveScroll: true,
            preserveState: (page) => Object.keys(page.props.errors).length,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-white text-black/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <main className="mt-6">
                            <section className="sm:bg-white md:bg-white">
                                <div className=" py-2 md:py-8 px-2 md:mx-auto md:max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
                                    <div className="flex flex-col justify-center items-center">
                                        <img
                                            src="/img/attend.png"
                                            alt="Hadir Logo"
                                            className="mb-4 w-3/4 md:w-1/2"
                                        />
                                        {/* <h1 className="mb-2 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">Hadir</h1> */}
                                        <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl">Event & Meeting Attendance Recorder</p>
                                    </div>
                                    <div>
                                        <div className="w-full lg:max-w-xl md:p-6 md:space-y-2 sm:p-8 bg-white rounded-2xl md:shadow-sm flex flex-col items-center justify-center md:border">
                                           <p className='text-center mb-4'>Log in or register using your Google Account</p>
                                           <a href={route('auth.google.redirect')}>
                                               <PrimaryButton className=" ">Google</PrimaryButton>
                                           </a>
                                        
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>

                        <footer className="text-center text-sm text-black">
                        2026 slipa.dev
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
