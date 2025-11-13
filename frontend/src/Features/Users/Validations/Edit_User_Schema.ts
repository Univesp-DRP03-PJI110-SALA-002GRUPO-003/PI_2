import { z } from "zod";

export const Edit_User_Schema = z.object({

  id: z.string().optional(),

  email: z.string({ required_error: "Email é obrigatório" })
    .email("Email inválido"),

  first_name: z.string({ required_error: "Nome é obrigatório" })
    .min(1, "Nome deve ter pelo menos 1 caracter"),

  last_name: z.string({ required_error: "Sobrenome é obrigatório" })
    .min(1, "Sobrenome deve ter pelo menos 1 caracter"),
});