import { client } from "../../../../Client";
import { createMutation } from "react-query-kit";
import { AxiosError } from "axios";


type Variables = {
  id_user: string;
  data: {
    actual_password: string;
    new_password: string;
  };
};

type Response = { message: string };

type Error = { message: string };

export const useUpdate_Password = createMutation<
  Response,
  Variables,
  AxiosError<Error>
>({
  mutationFn: async ({ id_user, data }) => {

    const response = await client.put<Response>(`https://wfrkrytdntmuwoejewbj.supabase.co/functions/v1/update-password/${id_user}`, 
      data, {
        headers: {
          "Content-Type": "application/json",
          // apikey: import.meta.env.VITE_API_DB_KEY,
        },
      });
    return response.data;
  }
});