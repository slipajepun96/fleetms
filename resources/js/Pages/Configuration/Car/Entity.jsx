import ConfigurationLayout from '@/Layouts/ConfigurationLayout';
import { Head } from '@inertiajs/react';
import EntityDeleteEntity from './Partials/EntityDeleteEntity';
import EntityAddEntity from './Partials/EntityAddEntity';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import EntityEditEntity from './Partials/EntityEditEntity';

export default function Entity({ mustVerifyEmail, status, entities }) {

    
    return (
        <ConfigurationLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Entity
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-2">
                <div className="p-2 mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-2 md:p-4 shadow sm:rounded-lg sm:p-8">
                        <EntityAddEntity className="max-w-xl" />
                    </div>
                    <div className="p-2 md:p-4 text-xl font-semibold leading-tight">
                        List of entity
                    </div>
                    <div className="grid flex-1 gap-2 md:grid-cols-3 my-2"> 
                        {entities.map((entity) => (
                        <div key={entity.id}>         
                            <div className="p-4 text-gray-900 border border-gray-300 rounded-lg shadow">
                                <div className='uppercase font-bold'>
                                {entity.estate_name}                                        
                                </div>
                                <div className="">{entity.address}</div>
                                <div className="">{entity.abbroviation}</div>
                                <div className="">{entity.entity_type}</div>
                                <div className="flex gap-2 justify-end my-2">
                                    <EntityEditEntity entity={entity}/>
                                    <EntityDeleteEntity entityId={entity.id} />
                                </div>
                            </div>                                                          
                        </div>
                        ))}
                    </div> 
                </div>
            </div>
        </ConfigurationLayout>
    );
}
