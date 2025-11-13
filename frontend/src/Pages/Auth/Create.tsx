import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Create_Form from '../../Features/Auth/Components/Form/Create_Form';

import useToast from '../../Hooks/useToast';
import { useCreate } from '../../Features/Auth/Api';
import { Create_Schema } from '../../Features/Auth/Validations';

import type { Create_FormData } from '../../Features/Auth/Types';
import './Auth.scss';
import CustomAlerts from '../../Components/CustomAlerts/CustomAlerts';


const Create: React.FC = () => {

  const navigate = useNavigate();
  const { toast, setToast } = useToast();

  const { mutate: create } = useCreate();

  const Form = useForm<Create_FormData>({
    defaultValues: undefined,
    mode: "onChange",
    resolver: zodResolver(Create_Schema),
  });

  const { handleSubmit, reset } = Form;


  useEffect(() => {

    reset({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: ""
    });

  }, [reset]);

  const onSubmit = async (data: Create_FormData) => {

    create({ data: data }, {
      onSuccess: () => {
        setToast({
          message: "Usuário criado com sucesso. Bem-vindo!",
          type: "success"
        });

        return navigate("/home");
      },

      onError: (error) => {
        return setToast({
          // message: "Não foi possível criar o usuário",
          message: error.error,
          type: "error"
        });
      },
    });
  };


  return (
    <div id="login" className="container-xxl">

      <div className="row align-items-center justify-content-center h-100">

        <div className="col-12 col-md-6 h-100">
          <div className='border-container'>
            <div className="auth-container">

              <FormProvider {...Form}>
                <Create_Form
                  onSubmit={handleSubmit(onSubmit)}
                />
              </FormProvider>

              <div className="row my-4 w-100">
                <div className="col-12 col-sm-6 my-2 text-center text-sm-start">
                  <a
                    className="auth-text auth-link"
                    onClick={() => navigate("/reset")}
                  >
                    ESQUECI MINHA SENHA
                  </a>
                </div>

                <div className="col-12 col-sm-6 my-2 text-center text-sm-end">
                  <a
                    className="auth-text auth-link"
                    onClick={() => navigate("/login")}
                  >
                    LOGIN
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast.message && toast.type && (
        <CustomAlerts
          message={toast.message}
          type={toast.type}
        />
      )}
    </div>
  )
}

export default Create;