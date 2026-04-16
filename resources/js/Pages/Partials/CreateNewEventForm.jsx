
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/popover';
import { Calendar } from '@/Components/ui/calendar';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useEffect, useRef } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CreateNewEventForm({ onSubmitSuccess }) {
    const user = usePage().props.auth.user;
    const [openEventDate, setOpenEventDate] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        event_name: '',
        event_date: '',
        event_venue: '',
        event_participant_entity_organisation: '',
        event_description: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('event.saveNewEvent'), {
            onSuccess: () => {
                reset(
                    'event_name',
                    'event_date',
                    'event_venue',
                    'event_participant_entity_organisation',
                    'event_description',
                );
                // Close the dialog
                onSubmitSuccess();
            },
        });
    };

    return (
        <div>
            <form className='mt-4 space-y-4'>
                <div className='grid md:grid-cols-1 gap-2'>
                    <InputLabel
                        htmlFor="event_name"
                        value="Name Of Event"
                    />
                    <TextInput
                        id="event_name"
                        name="event_name"
                        value={data.event_name}
                        className="mt-1 block w-full"
                        autoComplete="event_name"
                        onChange={(e) =>
                            setData('event_name', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.event_name}
                        className="mt-2"
                    />
                </div>
                <div className='grid md:grid-cols-2 gap-2'>
                    <div className=''>
                        <InputLabel
                            htmlFor="event_date"
                            value={
                                <>
                                    Date
                                </>
                            }
                        />
                        <Popover open={openEventDate} onOpenChange={setOpenEventDate} modal={false}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                        !data.event_date && "text-muted-foreground"
                                    )}
                                >
                                    { data.event_date ? format(data.event_date, "dd/MM/yyyy") : "Select date"}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" trapFocus={false}>
                                <Calendar
                                mode="single"
                                selected={data.event_date ? new Date(data.event_date) : undefined}
                                onSelect={selectedDate => {
                                        setData('event_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                        setOpenEventDate(false);
                                    }}
                                captionLayout="dropdown"
                                fromYear={2026}
                                toYear={2030}
                                className="rounded-lg border shadow-sm"
                            />
                            </PopoverContent>
                        </Popover>
                        <InputError
                            message={errors.event_date}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="event_venue"
                            value="Venue"
                        />
                        <TextInput
                            id="event_venue"
                            name="event_venue"
                            value={data.event_venue}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData(
                                    'event_venue',
                                    e.target.value,
                                )
                            }
                        />
                        <InputError
                            message={errors.event_venue}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className='grid md:grid-cols-2 gap-2'>
                    <div>
                        <InputLabel
                            htmlFor="event_participant_entity_organisation"
                            value="Entity / Organization (separate with semicolon ; if more than one)"
                        />
                        <TextInput
                            id="event_participant_entity_organisation"
                            name="event_participant_entity_organisation"
                            value={data.event_participant_entity_organisation}
                            className="mt-1 block w-full"
                            autoComplete="event_participant_entity_organisation"
                            onChange={(e) =>
                                setData('event_participant_entity_organisation', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.event_participant_entity_organisation}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="event_description"
                            value="Event Description"
                        />
                        <TextInput
                            id="event_description"
                            name="event_description"
                            value={data.event_description}
                            className="mt-1 block w-full"
                            autoComplete="event_description"
                            onChange={(e) =>
                                setData('event_description', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.event_description}
                            className="mt-2"
                        />
                    </div>

                </div>

                <PrimaryButton onClick={submit}>Create!</PrimaryButton>

            </form>
        </div>
    );
}
