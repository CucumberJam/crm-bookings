import supabase, {supabaseUrl} from "./supabase.js";
const AVATARS_URL = '/storage/v1/object/public/avatars'
export async function signUp({fullName, email, password}){
    const { data, error } = await supabase.auth.signUp({
        email, password, options: {
            data: {
                fullName,
                avatar: '',
            }
        }
    })
    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    return data;
}
export async function login({email, password}){
    const { data, error } = await supabase.auth.signInWithPassword(
        {email, password});
    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    return data;
}
export async function getCurrentUser(){
    const {data: session} = await supabase.auth.getSession();
    if(!session.session) return null;

    const {data, error} = await supabase.auth.getUser();
    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    return data?.user;
}
export async function logout(){
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.error(error);
        throw new Error(error.message);
    }
}
export async function updateUser({password, fullName, avatar}){
    //1. Update password or fullName
    let updateData;
    if(password) updateData = {password};
    if(fullName) updateData = {data: {fullName}};

    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }
    if(!avatar) return data;

    //2. Upload the avatar image
    const fileName = `avatar-${data.user.id}-${Math.random()}`;
    const {  error: storageError } = await supabase
        .storage
        .from('avatars')
        .upload(fileName, avatar);

    if(storageError){
        await supabase
            .from('avatars')
            .delete()
            .eq('id', data.id);
        console.error(storageError);
        throw new Error('Avatar image could not be uploaded')
    }

    //3. Update avatar in user
    const {data: updatedUser, errorUpdated} = await supabase.auth.updateUser({data: {
        avatar: `${supabaseUrl}${AVATARS_URL}/${fileName}`
        }});
    if (errorUpdated) {
        console.error(errorUpdated);
        throw new Error(errorUpdated.message);
    }
    return updatedUser;
}