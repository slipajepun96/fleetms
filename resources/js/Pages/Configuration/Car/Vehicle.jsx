import ConfigurationLayout from '@/Layouts/ConfigurationLayout';
import { Head } from '@inertiajs/react';
import VehicleDeleteVehicle from './Partials/VehicleDeleteVehicle';
import VehicleAddVehicle from './Partials/VehicleAddVehicle';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import VehicleEditVehicle from './Partials/VehicleEditVehicle';

export default function Vehicle({ mustVerifyEmail, status, vehicles }) {

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
                        <VehicleAddVehicle className="max-w-xl" />
                    </div>
                    <div className="p-2 md:p-4 text-xl font-semibold leading-tight">
                        List of vehicle
                    </div>
                    <div className="grid flex-1 gap-2 md:grid-cols-3 my-2"> 
                        {vehicles.map((vehicle) => (
                        <div key={vehicle.id}>         
                            <div className="p-4 text-gray-900 border border-gray-300 rounded-lg shadow">
                                <div className='uppercase font-bold'>
                                {vehicle.plateNum}                                          
                                </div>
                                <div className="">{vehicle.vehicle_model}</div>
                                <div className="flex gap-2 justify-end my-2">
                                    <VehicleEditVehicle vehicle={vehicle}/>
                                    <VehicleDeleteVehicle vehicleId={vehicle.id} />
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
