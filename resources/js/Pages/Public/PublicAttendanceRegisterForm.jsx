import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';



export default function PublicForm({event}) {
    const [formType, setFormType] = useState('login'); // 'login', 'register', or 'admin'
    const [hasRegister, setHasRegister] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        participant_name: '',
        participant_nric: '',
        participant_entity: '',
        participant_designation: '',
        event_id: event.id,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('public.event.attendance.submitForm', event.id), {

            onFinish: () => reset(
                'participant_name',
                'participant_entity',
                'participant_designation',
                'event_id'),
            onSuccess: () => setHasRegister(true),
            onBefore: () => {
            // Add a 15 second delay to see the loading screen
            return new Promise(resolve => setTimeout(resolve, 15000));
        },
        });
    };

    return (
            <div className="bg-white text-black/50">
                    {processing && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="flex flex-col items-center">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                                    <p className="mt-4 text-gray-700 font-medium">Submitting your attendance...</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="relative flex min-h-screen flex-col items-center justify-center">
                        <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                            <main className="mt-6">
                                <div className=" py-2 md:py-8 px-2  md:max-w-screen-xl ">
                                    <div className="flex flex-col ">
                                        <img
                                            src="/img/attend.png"
                                            alt="Hadir Logo"
                                            className="mb-4 w-48 "
                                        />
                                        {/* <h1 className="mb-2 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">Hadir</h1> */}
                                        <p className="text-lg font-normal text-gray-500 lg:text-xl">Register Attendance for</p>
                                        <p className='font-bold text-xl text-gray-800'>{event.event_name}</p>
                                        <p className='font-base text-md text-gray-800'>{event.event_date} , {event.event_venue}</p>
                                    </div>
                                    {/* form */}
                                    {hasRegister ? (
                                        <div className='text-gray-700 mt-8 border rounded-xl p-4'>
                                            Your attendance has been registered.
                                            Thank you!
                                        </div>

                                    ) : (
                                        <div className="w-full md:p-3 md:space-y-2 sm:p-4 bg-white ">
                                            <form className='mt-4 space-y-4'>
                                                <div className='grid md:grid-cols-2 gap-2'>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="participant_name"
                                                            value="Name"
                                                        />
                                                        <TextInput
                                                            id="participant_name"
                                                            name="participant_name"
                                                            value={data.participant_name}
                                                            className=" block w-full"
                                                            autoComplete="participant_name"
                                                            onChange={(e) =>
                                                                setData('participant_name', e.target.value)
                                                            }
                                                            required
                                                        />
                                                        <InputError
                                                            message={errors.participant_name}
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="participant_designation"
                                                            value="Designation"
                                                        />
                                                        <TextInput
                                                            id="participant_designation"
                                                            name="participant_designation"
                                                            value={data.participant_designation}
                                                            className=" block w-full"
                                                            autoComplete="participant_designation"
                                                            onChange={(e) =>
                                                                setData('participant_designation', e.target.value)
                                                            }
                                                            required
                                                        />
                                                        <InputError
                                                            message={errors.participant_designation}
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor="participant_entity"
                                                            value="Entity / Organisation"
                                                        />
                                                        <TextInput
                                                            id="participant_entity"
                                                            name="participant_entity"
                                                            value={data.participant_entity}
                                                            className=" block w-full"
                                                            autoComplete="participant_entity"
                                                            onChange={(e) =>
                                                                setData('participant_entity', e.target.value)
                                                            }
                                                            required
                                                        />
                                                        <InputError
                                                            message={errors.participant_entity}
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    
                                                </div>

                                                <PrimaryButton onClick={submit}>Register</PrimaryButton>
                                            
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </main>

                            <footer className="text-center text-sm text-black">
                            2026 slipa.dev
                            </footer>
                        </div>
                    </div>

            </div>
    );
}
