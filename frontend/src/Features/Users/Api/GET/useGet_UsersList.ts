import { createQuery } from "react-query-kit";
import { client } from "../../../../Client";
import type { AxiosError } from "axios";

import type { PaginatedResponse } from "../../../../Types";
import type { IUser } from "../../Types";


type Variables = {
  page?: number;
  per_page?: number;
};

type Response = PaginatedResponse<IUser[]>;

type Error = { message: string };

export const useGet_UserList = createQuery<
  Response,
  Variables,
  AxiosError<Error>
>({
  queryKey: ["user_list"],
  fetcher: async ({ page = 1, per_page = 5 }) => {

    const response = await client.get<Response>(`https://wfrkrytdntmuwoejewbj.supabase.co/functions/v1/get-users-list`, {
      params: {
        page: page,
        per_page: per_page
      },
    });
    return response.data;
  },
});