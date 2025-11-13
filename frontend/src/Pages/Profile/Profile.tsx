import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Password_Form from "../../Features/Profile/Form/Password_Form";
import Profile_Form from "../../Features/Profile/Form/Profile_Form";

import useAuth from "../../Hooks/useAuth";
import useToast from "../../Hooks/useToast";
import { convertProfileToFormData, useGet_Profile, useUpdate_Password, useUpdate_Profile } from "../../Features/Profile/Api";
import { Password_Schema, Profile_Schema } from "../../Features/Profile/Validations";

import type { Password_FormData, Profile_FormData } from "../../Features/Profile/Types";
import './Profile.scss';


const Profile: React.FC = () => {

  const { id } = useParams();
  const { user } = useAuth();
  const { setToast } = useToast();

  const { data: profile, refetch } = useGet_Profile({
    enabled: user?.id !== undefined
  });

  const { mutate: update_profile } = useUpdate_Profile();
  const { mutate: update_password } = useUpdate_Password();

  const profile_Form = useForm<Profile_FormData>({
    defaultValues: undefined,
    mode: "onChange",
    resolver: zodResolver(Profile_Schema),
  });

  const passwordForm = useForm<Password_FormData>({
    defaultValues: undefined,
    mode: "onChange",
    resolver: zodResolver(Password_Schema),
  });

  const { handleSubmit, reset } = profile_Form;
  const { handleSubmit: handleSubmitPassword } = passwordForm;

  useEffect(() => {
    if (profile?.data) {
      const user = profile.data.user;

      // Se o backend retornar base64 + mimetype, converte em dataURL
      const avatarUrl =
        user.avatar && user.avatar_mimmetype
          ? `data:${user.avatar_mimmetype};base64,${user.avatar}`
          : '';

      reset({
        avatar: avatarUrl,
        first_name: profile?.data.user.first_name,
        last_name: profile?.data.user.last_name,
        email: profile?.data.user.email,
      });
    }
  }, [profile, reset]);

  const onSubmit_Profile = (data: Profile_FormData) => {

    const formData = convertProfileToFormData(id!, data);

    update_profile(
      { data: formData }, {

      onSuccess: async () => {
        setToast({
          message: "Usuário editado com sucesso",
          type: "success",
        });

        await refetch();

        return;
      },

      onError: () => {
        setToast({
          message: "Não foi possível editar o usuário",
          type: "error",
        });
      },
    });
  };

  const onSubmit_Password = (data: Password_FormData) => {

    update_password({
      id_user: id!,
      data: {
        actual_password: (data.actual_password),
        new_password: (data.new_password),
      }
    }, {
      onSuccess: async () => {
        setToast({
          message: "Senha alterada com sucesso",
          type: "success",
        });

        await refetch();

        return;
      },

      onError: () => {
        setToast({
          message: "Não foi possível alterar a senha",
          type: "error",
        });
      },
    });
  };

  const renderForms = () => {
    return (
      <FormProvider {...profile_Form}>
        <Profile_Form onSubmit={handleSubmit(onSubmit_Profile)} />
      </FormProvider>
    );
  };

  return (
    <>
      {renderForms()}

      <div className="my-3" />

      <FormProvider {...passwordForm}>
        <Password_Form onSubmit={handleSubmitPassword(onSubmit_Password)} />
      </FormProvider>
    </>
  );
};

export default Profile;