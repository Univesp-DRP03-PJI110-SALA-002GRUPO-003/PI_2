import { client } from "../../../../Client";
import { createMutation } from "react-query-kit";
import { AxiosError } from "axios";

import type { ApiResponse } from "../../../../Types";
import type { IUser } from "../../Types";
import type { IProfile } from "../../../Profile/Types";


type Variables = {
  id_user: string;
  data: Partial<IUser>;
};

type Response = ApiResponse<IProfile>;

type Error = { message: string };

export const useUpdate_User_ById = createMutation<
  Response,
  Variables,
  AxiosError<Error>
>({
  mutationFn: async ({ id_user, data }) => {

    const response = await client.put<Response>(`https://wfrkrytdntmuwoejewbj.supabase.co/functions/v1/update-user-byid/${id_user}`,
      data, {
      headers: {
        "Content-Type": "application/json",
        // apikey: import.meta.env.VITE_API_DB_KEY,
      },
    });

    return response.data;
  }
});
