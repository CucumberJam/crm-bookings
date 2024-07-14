import supabase, {supabaseUrl} from "./supabase.js";
import {getFiltersOfMethodsByDates} from "../utils/helpers.js";

export async function getCabins(){
    const { data, error } = await supabase
        .from('cabins')
        .select('*');

    if(error){
        console.error(error);
        throw new Error('Cabins could not be loaded')
    }

    return data;
}
export async function getCabin(id) {
    const { data, error } = await supabase
        .from("cabins")
        .select( "*")
        .eq("id", id)
        .single();

    if(error){
        console.error(error);
        throw new Error(`Cabin №${id} could not be loaded`)
    }

    return data;
}
export async function deleteCabin(id, images){
    const { data, error } = await supabase
        .from('cabins')
        .delete()
        .eq('id', id);

    if(error){
        console.error(error);
        throw new Error('Cabin could not be deleted')
    }
    const res = await deleteCabinImages(images);
    console.log(res);

    return data;
}
export async function editCabin(cabin){
    // 1 upload new images:
    let imgPaths = await uploadImages(cabin.images)
    cabin.image = imgPaths[0]; // update main image
    cabin.images = JSON.stringify(imgPaths); // update images

    // 2 update cabin
    const {data,  error } = await supabase
        .from('cabins')
        .update({...cabin})
        .eq('id', cabin.id)
        .select().single();

    if(error){
        console.error(error);
        throw new Error('Cabin could not be updated')
    }
    return data;
}
export async function createCabin(newCabin){
    // 1 upload new images:
    let imgPaths = await uploadImages(newCabin.images);
    newCabin.image = imgPaths[0]; // update main image
    newCabin.images = JSON.stringify(imgPaths); // update images

    // 2 insert new cabin:
    const {data,  error } = await supabase
        .from('cabins')
        .insert([newCabin])
        .select().single();

    if(error){
        console.error(error);
        throw new Error('Cabin could not be created')
    }

    return data;
}
async function uploadImages(cabinImages){
    let imgPaths = []; // contains existing and new images-src
    for await (const image of cabinImages){
        if(typeof image === 'string') {
            imgPaths.push(image); // existing image
        } else{
            const imageName =`${Math.random()}-${image.name}`.replaceAll('/', '');

            const {  error: storageError } = await supabase
                .storage
                .from('cabin-images')
                .upload(imageName, image);

            if(!storageError){
                const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
                imgPaths.push(imagePath); // new uploaded image
            }
        }
    }
    return imgPaths;
}
export async function deleteCabinImages(images){ // strings of existing images
    let arrayOfFilesToDelete = []
    for(const image of images){
        arrayOfFilesToDelete.push(`${supabaseUrl}/storage/v1/object/public/cabin-images/${image}`);
    }
    const {  error  } = await supabase
        .storage
        .from('cabin-images')
        .remove(arrayOfFilesToDelete);

    if(error){
        console.error(error);
        throw new Error('Images could not be deleted')
    }
    return {success: true};
}
export async function createEditCabin(newCabin, id){
    //in case edit cabin and use the same image = cabin.image = existing path in supabase:
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

    /*https://wrqzxugiqlvhgzjltpfr.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg?t=2024-05-26T14%3A58%3A36.403Z*/
    const imageName =`${Math.random()}-${newCabin.image.name}`.replaceAll('/', ''); // in order to avoid creating unnecessary folders
    const imagePath =  hasImagePath? newCabin.image :
        `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    // 1 create cabin (Before edit functionality was inserted)
    /*    const {data,  error } = await supabase
        .from('cabins')
        .insert([{...newCabin, image: imagePath}])
        .select();*/

    // 1 Create /edit cabin:
    let query = supabase.from('cabins');

    // a) Create cabin (if in props no id = means that is creating cabin / not editing existing one)
    if(!id) query = query.insert([{...newCabin, image: imagePath}]);

    // b) Edit cabin:
    if(id) query = query.update({...newCabin, image: imagePath}).eq('id', id);

    const {data,  error } =
        await query.select().single();

    if(error){
        console.error(error);
        throw new Error('Cabin could not be created')
    }

    // if we already have the same image we don't need to upload image
    if(hasImagePath) return data;
    // 2 upload image
    const {  error: storageError } = await supabase
        .storage
        .from('cabin-images')
        .upload(imageName, newCabin.image)

    //3.Delete the cabin If there was an error uploading image
    if(storageError){
        await supabase
            .from('cabins')
            .delete()
            .eq('id', data.id);
        console.error(storageError);
        throw new Error('Cabin image could not be uploaded and Cabin was not created')
    }

    return data;
}

export async function getCabinsFreeFromBookings(startDate, endDate) {
    if(!startDate || !endDate) return;
    const cabins = await getCabins();
    const availableCabins = {};

    for await (const cabin of cabins){

        for await(const filters of getFiltersOfMethodsByDates(startDate, endDate)){
            let query = supabase
                .from("bookings")
                .select( "*")
                .eq("cabinId", cabin.id);

            for await(const filter of filters){
                query = query[filter.method](filter.field, filter.value);
            }
            const { data, error } = await query;
            if(error){
                console.error(error);
                throw new Error(`Bookings available from ${startDate} to ${endDate} could not be loaded`);
            }
            if(!data.length) {
                if(!availableCabins[cabin.id]){
                    availableCabins[cabin.id] = cabin;
                }
            }
        }
    }


    return Object.values(availableCabins);
}