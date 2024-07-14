import { useQuery } from "@tanstack/react-query";
import {getNationalitiesDictionary} from "../../../services/apiNationalitiesFlags.js";

export function useGetNationalities() {
    const { isLoading, data: nationalities = {} } = useQuery({
        queryKey: ["nationalities"],
        queryFn: getNationalitiesDictionary,
    });

    return { isLoading, nationalities };
}
