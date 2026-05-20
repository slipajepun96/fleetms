import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SmallNavLink from '@/Components/SmallNavLink';
import InputLabel from '@/Components/InputLabel';
import FleetUsage from './FleetUsage';
import { ChevronLeft } from 'lucide-react';

export default function ReportView({ header, children, vehicles, vehicle_usages, users, fuelTransactions, selectedMonthYear, previous_month_odometer }) {
    const user = usePage().props.auth.user;

    const [previousOdometer, setPreviousOdometer] = useState(previous_month_odometer);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    
    const [currentView, setCurrentView] = useState('usage');

    const formatDateTime = (dateTimeString) => 
    {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        // Convert to UTC+8
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        // const month = String(date.toLocaleString('en-My', { month: 'long' }));
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const changeCurrentView = (target) =>
    {
        setCurrentView (now=>target);
    }

    const getUsername = (user_uuid) => {
        const user = users?.find(v => v.id === user_uuid);
        // console.log(approver_uuid);
        return user ? user.name : 'Unknown Vehicle';
    }

    let totalDistanceTraveled = 0 

    let totalLiter = 0
    let totalPrice = 0
    function getFuelUsages (vehicle_usage_uuid) {
            let totalFuelLiter = 0
            let totalFuelPrice = 0
        fuelTransactions.map((fuelTransaction) =>{

            if (fuelTransaction.vehicle_usage_uuid === vehicle_usage_uuid)
            {
                totalFuelLiter = totalFuelLiter + fuelTransaction.fuel_liter;
                totalFuelPrice = totalFuelPrice + fuelTransaction.fuel_total_price;
                totalLiter  = totalLiter + fuelTransaction.fuel_liter;
                totalPrice  = totalPrice + fuelTransaction.fuel_total_price;
            }
            
        });
        return {totalFuelLiter, totalFuelPrice};
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => window.history.back()}
                        className="hover:bg-gray-100 rounded px-1 transition-colors"
                    >
                        <ChevronLeft className="w-7 h-7" />
                    </button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Report
                    </h2>
                </div>
            }
        >
            <Head title="Detail" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div>
                                <table style={{ width: '50%' }}>
                            <tr>
                                <td style={{ width: '200px' }}>Vehicle Log</td>
                                <td style={{ width: '10px' }}>:</td>
                                <td className='uppercase px-1 py-1 text-sm font-semibold'>{vehicles.vehicle_manufacturer} {vehicles.vehicle_model} {vehicles.plateNum}</td>
                            </tr>
                            <tr>
                                <td>Month</td>
                                <td>:</td>
                                <td className='uppercase px-1 py-1 text-sm font-semibold'>{selectedMonthYear}</td>
                            </tr>
                        </table>
                                <table className="w-full border-collapse border border-gray-400 mt-4">
                                    <thead>
                                        <tr >
                                            <th colSpan="2" className="border border-gray-900 bg-gray-200">Usage</th>
                                            <th rowSpan="2" className="border border-gray-900 bg-gray-200">Travel Details</th>
                                            <th colSpan="2" className="border border-gray-900 bg-gray-200">Mileage</th>
                                            <th colSpan="2" className="border border-gray-900 bg-gray-200">Fuel Purchase</th>
                                            <th rowSpan="2" className="border border-gray-900 bg-gray-200">Remark</th>
                                            <th rowSpan="2" className="border border-gray-900 bg-gray-200">User</th>
                                        </tr>
                                        <tr>
                                            <th className="border border-gray-900 bg-gray-200">Start</th>
                                            <th className="border border-gray-900 bg-gray-200">End</th>
                                        
                                            <th className="border border-gray-900 bg-gray-200">Odo meter</th>
                                            <th className="border border-gray-900 bg-gray-200">KM</th>

                                            <th className="border border-gray-900 bg-gray-200">Liter</th>
                                            <th className="border border-gray-900 bg-gray-200">RM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan="3" className="border border-gray-900 text-center">b/f</td>
                                            <td  className="border border-gray-900">{previous_month_odometer}</td>
                                            <td colSpan="5" className="border border-gray-900"></td>
                                        </tr>

                                        {vehicle_usages.map((vehicle_usage, index) => {
                                            const previousOdometer =
                                                index === 0
                                                    ? previous_month_odometer
                                                    : vehicle_usages[index - 1].end_odometer;


                                            const distanceTraveled =
                                                vehicle_usage.end_odometer - previousOdometer;
                                            
                                            // let totalDistanceTraveled = 0 
                                                totalDistanceTraveled = totalDistanceTraveled + distanceTraveled;

                                            // console.log(getFuelUsages(vehicle_usage.id,totalFuelLiter));
                                            const fuelUsage = getFuelUsages(vehicle_usage.id);

                                            return(
                                            <tr key={vehicle_usage.id}>
                                                
                                                <td className="border border-gray-900">{formatDateTime(vehicle_usage.actual_start_datetime)}</td>
                                                <td className="border border-gray-900">{formatDateTime(vehicle_usage.actual_end_datetime)}</td>
                                                <td className="border border-gray-900">{vehicle_usage.destination}, {vehicle_usage.purpose}</td>
                                                <td className="border border-gray-900">{vehicle_usage.end_odometer}</td>
                                                <td className="border border-gray-900">{distanceTraveled}</td>
                                                <td className="border border-gray-900">{fuelUsage.totalFuelLiter}</td>
                                                <td className="border border-gray-900">RM{fuelUsage.totalFuelPrice}</td>
                                                <td className="border border-gray-900">{vehicle_usage.notes_on_return}</td>
                                                <td className="border border-gray-900">{getUsername(vehicle_usage.user_uuid)}</td>
                                            </tr>
                                        )})}

                                        <tr>
                                            <td colSpan="4" className="border border-gray-900 text-center">Total</td>
                                            <td className="border border-gray-900">{totalDistanceTraveled}</td>
                                            <td className="border border-gray-900">{totalLiter}</td>
                                            <td className="border border-gray-900">RM{totalPrice}</td>
                                            <td colSpan="3" className="border border-gray-900"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
