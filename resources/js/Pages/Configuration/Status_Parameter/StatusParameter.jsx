import ConfigurationLayout from '@/Layouts/ConfigurationLayout';
import { Head } from '@inertiajs/react';
import AddStatusParameter from './Partials/AddStatusParameter';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';

export default function StatusParameter({ mustVerifyEmail, status, statusParameter }) {

    // console.log(countries);

    const columns=[
        {
            Header: 'Id',
            accessor: ['id'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.id}</div> 
                </div>
            )
        },
        {
            Header: 'Color',
            accessor: ['status'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div style={{ backgroundColor: row.color }}>{row.color}</div> 
                </div>
            )
        },
        {
            Header: 'Status Value',
            accessor: ['status'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.status_value}</div> 
                </div>
            )
        }
    ]
    return (
        <ConfigurationLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Vehicle
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-2">
                <div className="p-2 mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-2 md:p-4 shadow sm:rounded-lg sm:p-8">
                        <AddStatusParameter className="max-w-xl" />
                    </div>
                    <div className="p-2 md:p-4 text-xl font-semibold leading-tight">
                        Status Parameter
                    </div>
                    <div className="m-2 p-4 text-gray-900 border border-gray-300 rounded-lg shadow">
                        <div className="text-gray-900">
                            <DataTable columns={columns} data={statusParameter} className='mt-4'/>
                        </div>
                    </div>
                </div>
            </div>
        </ConfigurationLayout>
    );
}
