import ConfigurationLayout from '@/Layouts/ConfigurationLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft, ArrowUp } from 'lucide-react';

export default function ConfigurationIndex({}) {
    // console.log(users);


    return (
        <ConfigurationLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User 
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="p-4 text-gray-900 border border-gray-300 bg-gradient-to-bl from-blue-300 to-yellow-400 rounded-lg shadow">
                        <div className="p-6 flex flex-col md:flex-row text-gray-900">
                            <div className='hidden md:block'><ArrowLeft /></div>
                            <div className='block md:hidden'><ArrowUp /></div>
                            Select module
                        </div>
                    </div>
                </div>
            </div>
        </ConfigurationLayout>
    );
}
