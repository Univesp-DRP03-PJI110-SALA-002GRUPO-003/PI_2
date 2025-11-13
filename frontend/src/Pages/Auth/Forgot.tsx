import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import GenericInput from '../../Components/Ui/generic/generic';

import useToast from '../../Hooks/useToast';
import { useForgot } from '../../Features/Auth/Api';
import { Forgot_Schema } from '../../Features/Auth/Validations';

import type { Forgot_FormData } from '../../Features/Auth/Types';
import './Auth.scss';


const Forgot: React.FC = () => {

  const navigate = useNavigate();
  const { setToast } = useToast();

  const { mutate: forgot, isPending } = useForgot();

  const Form = useForm<Forgot_FormData>({
    defaultValues: undefined,
    mode: "onChange",
    resolver: zodResolver(Forgot_Schema),
  });

  const { handleSubmit, reset } = Form;


  useEffect(() => {

    reset({ email: "" });

  }, [reset]);

  const onSubmit = async (data: Forgot_FormData) => {

    forgot({ email: data.email }, {
      onSuccess: () => {
        setToast({
          message: "Email de recuperação enviado com sucesso",
          type: "success"
        });

        navigate("/login");

        return;
      },
      onError: () => {
        return setToast({
          message: "Não foi possível enviar o email de recuperação",
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
                <div className="row">

                <div className="col-12 my-3">
                <GenericInput
                  name="email"
                  label="Email"
                  isRequired
                  iconClass="icon-email"
                  placeholder="Digite seu email"
                  />
                </div>

                <div className="col-12 my-3">
                  <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-outline-secondary"
                    style={{ width: "100px" }}
                    onClick={handleSubmit(onSubmit)}
                    disabled={!Form.formState.isValid || isPending}
                  >
                    Enviar
                  </button>
                  </div>
                </div>

                  </div>
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
    </div>
  )
}

export default Forgot;