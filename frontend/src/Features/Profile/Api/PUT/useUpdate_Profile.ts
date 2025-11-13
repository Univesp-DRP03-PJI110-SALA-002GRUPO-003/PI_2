import { client } from "../../../../Client";
import { createMutation } from "react-query-kit";
import { AxiosError } from "axios";

import type { Profile_FormData } from "../../Validations";
import type { ApiResponse } from "../../../../Types";
import type { IProfile } from "../../Types";


type Variables = {
  data: FormData;
};

type Response = ApiResponse<IProfile>;

type Error = { message: string };

export const useUpdate_Profile = createMutation<
  Response,
  Variables,
  AxiosError<Error>
>({
  mutationFn: async ({ data }) => {

    const response = await client.put<Response>(`https://wfrkrytdntmuwoejewbj.supabase.co/functions/v1/update-profile`, data, {
      headers: {
        apikey: import.meta.env.VITE_API_DB_KEY,
      },
    });
    return response.data;
  }
});

export const convertProfileToFormData = (id_user: string, data: Profile_FormData) => {
  
  const formData = new FormData();
  
  formData.append("id_user", String(id_user));
  formData.append("first_name", String(data.first_name));
  formData.append("last_name", String(data.last_name));
  formData.append("email", String(data.email));

  if (data.avatar) {
    formData.append("avatar", data.avatar!);
  }

  return formData;
}