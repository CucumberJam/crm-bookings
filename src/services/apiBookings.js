import {getFiltersOfMethodsByDates, getToday} from "../utils/helpers.js";
import supabase from "./supabase";
import {PAGE_SIZE} from "../utils/constants.js";


export async function getBookings({filter, sortBy, currentPage}){
  let query = supabase
      .from('bookings')
      .select('id,  created_at, startDate, endDate, numNights, numGuests, totalPrice, status,' +
          ' cabins(name), guests(fullName, email)',
          {count: 'exact'});

  // FILTER
  if(filter){
    //query = query[filter.method || 'eq'](filter.field, filter.value); // if filter contains options greater or less than exact price you can transmit name of method (gte/lse)
    for(const item of filter){
      if(item) query = query[filter.method || 'eq'](item.field, item.value);
    }
  }

  // SORT
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
  if(error){
    console.error(error);
    throw new Error('Bookings could not be loaded')
  }

  return {data, count};

}
export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select( "*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if(error){
    console.error(error);
    throw new Error(`Booking №${id} could not be loaded`)
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date: ISOString
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}
export async function getBookingsByCabinIdOfDate(date, cabinId){
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month, 2).toISOString();
  const endDate = new Date(year, month+1, 1).toISOString();

  const bookings = {};

  for await(const filters of getFiltersOfMethodsByDates(startDate, endDate)){
    let query = supabase
        .from('bookings')
        .select('*')
        .eq("cabinId", cabinId);

    for await(const filter of filters){
      query = query[filter.method](filter.field, filter.value);
    }
    const { data, error } = await query;
    if (error) {
      console.error(error);
      throw new Error(`Bookings of cabin #${cabinId} of ${month} month could not get loaded`);
    }
    if(data.length){
      data.forEach(el => {
        if(!bookings[el.id]){
          bookings[el.id] = el;
        }
      })
    }
  }

    return Object.values(bookings);
}
// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

//createBooking API
export async function createBooking(newBooking) {
  const { data, error } = await supabase
      .from("bookings")
      .insert([{...newBooking}])
      .select();

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  return data;
}
