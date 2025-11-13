import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Reset_Form from '../../Features/Auth/Components/Form/Reset_Form';

import useToast from '../../Hooks/useToast';
import { useReset } from '../../Features/Auth/Api';
import { Reset_Schema } from '../../Features/Auth/Validations';

import type { Reset_FormData } from '../../Features/Auth/Types';
import './Auth.scss';
import CustomAlerts from '../../Components/CustomAlerts/CustomAlerts';


const Reset: React.FC = () => {

  const navigate = useNavigate();
  const { toast, setToast } = useToast();

  const { mutate: reset_password } = useReset();

  const Form = useForm<Reset_FormData>({
    defaultValues: undefined,
    mode: "onChange",
    resolver: zodResolver(Reset_Schema),
  });

  const { handleSubmit, reset } = Form;

  useEffect(() => {

    reset({
      code: "",
      new_password: "",
      confirm_new_password: "",
    });

  }, [reset]);

  const onSubmit = async (data: Reset_FormData) => {

    reset_password({ data: data }, {
      onSuccess: () => {
        setToast({
          message: "Senha alterada com sucesso",
          type: "success"
        });

        return navigate("/home");
      },
      onError: (error) => {
        return setToast({
          message: error.error || "Não foi possível alterar a senha",
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
                <Reset_Form
                  onSubmit={handleSubmit(onSubmit)}
                />
              </FormProvider>

              <div className="row my-4 w-100">
                <div className="col-12 col-sm-6 my-2 text-center text-sm-start">
                  <a
                    className="auth-text auth-link"
                    onClick={() => navigate("/login")}
                  >
                    LOGIN
                  </a>
                </div>

                <div className="col-12 col-sm-6 my-2 text-center text-sm-end">
                  <a
                    className="auth-text auth-link"
                    onClick={() => navigate("/register")}
                  >
                    CADASTRE-SE
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

export default Reset;