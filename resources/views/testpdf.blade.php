<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="p-6 text-gray-900">
                <div class="grid">
                    <table style="width: 50%;">
                        <tr>
                            <td style="width: 200px;" class='uppercase px-1 py-1 text-sm font-semibold'>PKPP agro sdn.bhd.</td>
                        </tr>
                        <tr>
                            <td style="width: 200px;" class='uppercase px-1 py-1 text-sm font-semibold'>Vehicle Log</td>
                            <td style="width: 10px;">:</td>
                            <td class='uppercase px-1 py-1 text-sm font-bold'>{{$vehicles['vehicle_manufacturer']}} {{$vehicles['vehicle_model']}} {{$vehicles['plateNum']}}</td>
                        </tr>
                        <tr>
                            <td class='uppercase px-1 py-1 text-sm font-semibold'>Month</td>
                            <td>:</td>
                            <td class='uppercase px-1 py-1 text-sm font-bold'>{{ $selectedMonthYear ?? '-' }}</td>
                        </tr>
                    </table>
                    <table class="w-full border-collapse border border-gray-400 mt-4">
                        <thead>
                            <tr >
                                <th colspan="2" class="text-xs border border-gray-900 bg-gray-200">Usage</th>
                                <th rowspan="2" class="text-xs border border-gray-900 bg-gray-200">Travel Details</th>
                                <th colspan="2" class="text-xs border border-gray-900 bg-gray-200">Mileage</th>
                                <th colspan="2" class="text-xs border border-gray-900 bg-gray-200">Fuel Purchase</th>
                                <th rowspan="2" class="text-xs border border-gray-900 bg-gray-200">Remark</th>
                                <th rowspan="2" class="text-xs border border-gray-900 bg-gray-200">User</th>
                            </tr>
                            <tr>
                                <th class="text-xs border border-gray-900 bg-gray-200">Start</th>
                                <th class="text-xs border border-gray-900 bg-gray-200">End</th>
                            
                                <th class="text-xs border border-gray-900 bg-gray-200">Odo meter</th>
                                <th class="text-xs border border-gray-900 bg-gray-200">KM</th>

                                <th class="text-xs border border-gray-900 bg-gray-200">Liter</th>
                                <th class="text-xs border border-gray-900 bg-gray-200">RM</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="3" class="text-xs border border-gray-900 text-center">b/f</td>
                                <td  class="text-xs border border-gray-900 py-1 px-2 text-right">{{$previous_month_odometer}}</td>
                                <td colspan="5" class="text-xs border border-gray-900"></td>
                            </tr>
                                @php
                                    $totalDistanceTraveled = 0;
                                    $totalLiter = 0;
                                    $totalPrice = 0;
                                @endphp

                                @foreach($vehicle_usages as $index => $vehicle_usage)
                                    @php
                                        $previousOdometer =
                                            $index === 0
                                                ? $previous_month_odometer
                                                : $vehicle_usages[$index - 1]->end_odometer;

                                        $distanceTraveled = 
                                            $vehicle_usage->end_odometer - $previousOdometer;

                                            $totalDistanceTraveled = $totalDistanceTraveled + $distanceTraveled;

                                        $totalFuelLiter = 0;
                                        $totalFuelPrice = 0;

                                        foreach($fuelTransactions as $fuelTransaction)
                                        {
                                            if ($fuelTransaction->vehicle_usage_uuid == $vehicle_usage->id)
                                                {
                                                    $totalFuelLiter = $totalFuelLiter + $fuelTransaction->fuel_liter;
                                                    $totalFuelPrice = $totalFuelPrice + $fuelTransaction->fuel_total_price;
                                                    $totalLiter  = $totalLiter + $fuelTransaction->fuel_liter;
                                                    $totalPrice  = $totalPrice + $fuelTransaction->fuel_total_price;
                                                }
                                        }

                                    @endphp
                            
                                    <tr>
                                        <td class="text-xs border border-gray-900 py-1 px-2"><?php echo date_format(new DateTime($vehicle_usage->actual_start_datetime), "j/m/Y h:i A"); ?></td>
                                        <td class="text-xs border border-gray-900 py-1 px-2"><?php echo date_format(new DateTime($vehicle_usage->actual_end_datetime), "j/m/Y h:i A"); ?></td>
                                        <td class="text-xs border border-gray-900 py-1 px-2">{{$vehicle_usage->destination}}, {{$vehicle_usage->purpose}}</td>
                                        <td class="text-xs border border-gray-900 py-1 px-2 text-right">{{$vehicle_usage->end_odometer}}</td>
                                        <td class="text-xs border border-gray-900 py-1 px-2 text-right">{{$distanceTraveled}}</td>
                                        <td class="text-xs border border-gray-900 py-1 px-2 text-right">{{$totalFuelLiter}}</td>
                                        <td class="text-xs border border-gray-900 py-1 px-2 text-right">RM{{$totalFuelPrice}}</td>
                                        <td class="text-xs border border-gray-900 py-1 px-2">{{$vehicle_usage->notes_on_return}}</td>
                                        <td class="text-xs border border-gray-900 py-1 px-2"><?php foreach($users as $user){
                                            if ($user->id == $vehicle_usage->user_uuid)
                                                {
                                                    echo($user->name);
                                                    break;
                                                }
                                        }?></td>
                                    </tr>
                                @endforeach
                            <tr>
                                <td colspan="4" class="text-xs font-bold border border-gray-900 text-center">Total</td>
                                <td class="text-xs border border-gray-900 py-1 px-2 text-right">{{$totalDistanceTraveled}}</td>
                                <td class="text-xs border border-gray-900 py-1 px-2 text-right">{{$totalLiter}}</td>
                                <td class="text-xs border border-gray-900 py-1 px-2 text-right">RM{{$totalPrice}}</td>
                                <td colspan="3" class="text-xs border border-gray-900"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>