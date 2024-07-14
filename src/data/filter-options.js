const bookingFilter = [
    { value: "all", label: "All" },
    { value: "checked-out", label: "Checked out" },
    { value: "checked-in", label: "Checked in" },
    { value: "unconfirmed", label: "Unconfirmed" },
]
const cabinFilter = [
    {value: 'all', label: 'All'},
    {value: 'no', label: 'No discount'},
    {value: 'with', label: 'With discount'},
]
const guestFilter = [
    {value: 'fullName', label: 'by full name'},
    {value: 'email', label: 'by email'},
]
export {bookingFilter, cabinFilter, guestFilter};