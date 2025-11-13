import { client } from "../../../../Client";
import { createMutation } from "react-query-kit";
import { AxiosError } from "axios";

import type { ApiResponse } from "../../../../Types";


type Variables = {
  id_user: string;
};

type Response = ApiResponse<{ message: string}>;

type Error = {message: string};

export const useDelete_User_ById = createMutation<
  Response,
  Variables,
  AxiosError<Error>
>({
  mutationFn: async ({ id_user }) => {

    const response = await client.post<Response>(`https://wfrkrytdntmuwoejewbj.supabase.co/functions/v1/delete-user-byId`, {id_user});
    return response.data;
  }
});
