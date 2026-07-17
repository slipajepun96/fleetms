import ConfigurationLayout from '@/Layouts/ConfigurationLayout';
import { Head } from '@inertiajs/react';
// import VehicleDeleteVehicle from './Partials/VehicleDeleteVehicle';e
import AddCountryParameter from './Partials/AddCountryParameter';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
// import VehicleEditVehicle from './Partials/VehicleEditVehicle';

export default function CountryParameter({ mustVerifyEmail, status, countries }) {

    return (
        <ConfigurationLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Country
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-2">
                <div className="p-2 mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-2 md:p-4 shadow sm:rounded-lg sm:p-8">
                        <AddCountryParameter className="max-w-xl" />
                    </div>
                    <div className="bg-white p-2 md:p-4 shadow-lg sm:rounded-lg sm:p-8">
                        <div className="p-2 md:p-4 text-xl font-semibold leading-tight">
                            List of country
                        </div>
                        <div className="grid flex-1 gap-2 md:grid-cols-3 my-2"> 
                            {countries.map((country) => (
                            <div key={country.id}>         
                                <div className="p-4 text-gray-900 border border-gray-300 rounded-lg shadow">
                                    <div className='uppercase font-bold'>{country.country_name}</div>
                                    <div className="">{country.country_abbv}</div>
                                    <div className="">{country.fw_country_abbv}</div>
                                    <div className="flex">
                                        <div class='flex rounded' style={{ backgroundColor: country.color }}>{country.color}</div>
                                    </div>
                                </div>                                                          
                            </div>
                            ))}
                        </div>
                    </div> 
                </div>
            </div>
        </ConfigurationLayout>
    );
}