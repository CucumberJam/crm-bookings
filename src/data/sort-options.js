const bookingsSort = [
    { value: "startDate-desc", label: "Sort by date (recent first)" },
    { value: "startDate-asc", label: "Sort by date (earlier first)" },
    {
        value: "totalPrice-desc",
        label: "Sort by amount (high first)",
    },
    { value: "totalPrice-asc", label: "Sort by amount (low first)" },
]
const cabinSort = [
    {value: 'name-asc', label: 'Sort by name (A-Z)'},
    {value: 'name-desc', label: 'Sort by name (Z-A)'},
    {value: 'regularPrice-asc', label: 'Sort by price (low first)'},
    {value: 'regularPrice-desc', label: 'Sort by price (high first)'},
    {value: 'maxCapacity-asc', label: 'Sort by capacity (low first)'},
    {value: 'maxCapacity-desc', label: 'Sort by capacity (high first)'},
]
const guestSort = [
    {value: 'fullName-asc', label: 'Sort by name (A-Z)'},
    {value: 'fullName-desc', label: 'Sort by name (Z-A)'},
    {value: 'email-asc', label: 'Sort by email (A-Z)'},
    {value: 'email-desc', label: 'Sort by email (A-Z)'},
]
export {bookingsSort, cabinSort, guestSort}