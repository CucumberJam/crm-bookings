import supabase from "./supabase.js";
import {PAGE_SIZE} from "../utils/constants.js";
export async function getGuests({filter, sortBy, currentPage}) {
    let query = supabase
        .from('guests')
        .select("*",{count: 'exact'});
    // FILTER - array of {field: key, value: filterValue}):
    if(filter){
        for(const item of filter){
            if(item) query = query['ilike'](item.field, item.value); //eq
        }
    }
    // SORT:
    if(sortBy){
        query = query.order(sortBy.field, {ascending: sortBy.direction === 'asc'})
    }
    // PAGINATION
    if(currentPage){
        const from = (currentPage-1) * PAGE_SIZE;
        const to = from + PAGE_SIZE  - 1;
        query = query.range(from, to)
    }

    const { data, error, count } = await query;

    if (error) {
        console.log(error);
        throw new Error('Guests could not be loaded');
    }

    return {data, count};
}

export async function createGuest(newGuest){
    const { data, error } = await supabase
        .from('guests')
        .insert([
            { ...newGuest },
        ])
        .select();

    if (error) {
        console.log(error);
        if(error.message === 'duplicate key value violates unique constraint "guests_email_key"'){
            throw new Error(`Guest with email ${newGuest.email} already exists`);
        }
        if(error.message === 'duplicate key value violates unique constraint "guests_phone_key"'){
            throw new Error(`Guest with phone number ${newGuest.phone} already exists`);
        }
        throw new Error(error.message);
    }
    return data;
}
export async function updateGuest(updatedGuest, id){
    const { data, error } = await supabase
        .from('guests')
        .update({ ...updatedGuest })
        .eq('id', id)
        .select().single();

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    return data;
}

export async function getGuestsSimply() {
    const { data, error} = await supabase
        .from("guests")
        .select("*")
        .order('fullName', {ascending: true});

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    return data;
}
export async function getGuest(id) {
    const { data, error } = await supabase
        .from("guests")
        .select( "*")
        .eq("id", id)
        .single();

    if(error){
        console.error(error);
        throw new Error(`Guest could not be loaded`);
    }

/*
    let { data: bookings, error: errorBookings } = await supabase
        .from('bookings')
        .select("*").eq('guestId', id);

    if(errorBookings){
        console.error(errorBookings);
        throw new Error(`Bookings of the guest could not be loaded`);
    }
*/

    return data; //{guest, bookings};
}