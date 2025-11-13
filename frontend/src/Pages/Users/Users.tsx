import React, { useEffect, useState } from 'react'
import { useDelete_User_ById, useGet_UserList, useUpdate_User_ById } from '../../Features/Users/Api';
import useToast from '../../Hooks/useToast';
import type { IUser } from '../../Features/Users/Types';
import Modal from '../../Components/Modal/Modal';
import Edit_User_Form from '../../Features/Users/Components/Form/Edit_User_Form';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Edit_User_FormData } from '../../Features/Users/Types/FormData/Edit_User_FormData';
import { Edit_User_Schema } from '../../Features/Users/Validations';
import { Spinner } from 'react-bootstrap';
import Users_Table from '../../Features/Users/Components/Table/Users_Table';

const Users: React.FC = () => {

  const { setToast } = useToast();

  const [paginationParams, setPaginationParams] = useState({ page: 1, per_page: 10 });
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<IUser>({} as IUser);

  const { data: usersList, isPending, refetch } = useGet_UserList({
    variables: {
      page: paginationParams.page,
      per_page: paginationParams.per_page
    },
  });

  const { mutate: edit_user, isPending: isLoadindEdit } = useUpdate_User_ById();
  const { mutate: delete_user, isPending: isLoadindDelete } = useDelete_User_ById();

  const EditUser_Form = useForm<Edit_User_FormData>({
    defaultValues: undefined,
    mode: "onChange",
    resolver: zodResolver(Edit_User_Schema),
  });

  const { handleSubmit, reset, formState: { isValid } } = EditUser_Form;

  useEffect(() => {
    reset({
      id: userData?.id ?? undefined,
      email: userData?.email ?? "",
      first_name: userData?.first_name ?? "",
      last_name: userData?.last_name ?? "",
    });
  }, [userData, reset]);

  const onEdit = () => {

    const updatedData = {
      email: EditUser_Form.getValues("email"),
      first_name: EditUser_Form.getValues("first_name"),
      last_name: EditUser_Form.getValues("last_name"),
    }

    edit_user({ id_user: userData.id!, data: updatedData }, {
      onSuccess: async () => {
        setToast({
          message: "Usuário editado com sucesso",
          type: "success"
        })

        await refetch();
        setUserData({} as IUser);
        setShowEditModal(false);

        return;
      },

      onError: () => {
        return setToast({
          message: "Não foi possível editar o usuário",
          type: "error"
        });
      },
    });
  }

  const onDelete = () => {
    delete_user({ id_user: userData.id! }, {

      onSuccess: async () => {
        setToast({
          message: "Usuário excluído com sucesso",
          type: "success"
        })

        await refetch();
        setUserData({} as IUser);
        setShowDeleteModal(false);

        return;
      },

      onError: () => {
        return setToast({
          message: "Não foi possível excluir o usuário",
          type: "error"
        });
      },
    });
  };


  // Manipulador de mudança de página
  const handlePageChange = (page: number, perPage: number) => {
    setPaginationParams(prev => ({
      ...prev,
      page: page,
      per_page: perPage
    }));
  };

  // Manipulador de mudança de linhas por página
  const handleRowsPerPageChange = (rows: number) => {
    setPaginationParams({
      page: 1, // Resetar para a primeira página
      per_page: rows
    });
  };

  return (
    <>
      <div className='hello'>Listagem de Usuários</div>

      {isPending ? (
        <div className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" variant='dark' />
        </div>
      ) : (
        usersList && (
          <Users_Table
            data={usersList}
            onEdit={(data) => {
              setUserData(data);
              setShowEditModal(true);
            }}
            onDelete={(data) => {
              setUserData(data);
              setShowDeleteModal(true);
            }}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            currentPage={paginationParams.page}
            rowsPerPage={paginationParams.per_page}
          />
        )
      )}

      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onCancel={() => setShowEditModal(false)}
        onSubmit={onEdit}
        title={"Editar Usuário"}
        submitButtonText="Salvar"
        isValid={isValid}
        isLoading={isLoadindEdit}
        size="large"
      >
        <FormProvider {...EditUser_Form}>
          <Edit_User_Form
            onSubmit={handleSubmit(onEdit)}
          />
        </FormProvider>
      </Modal>

      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onCancel={() => setShowDeleteModal(false)}
        onSubmit={onDelete}
        title={"Excluir Usuário"}
        submitButtonText="Excluir"
        isLoading={isLoadindDelete}
        size="medium"
      >
        <p>Tem certeza que deseja excluir o usuário? {userData?.first_name} {userData?.last_name}</p>
      </Modal>
    </>
  )
}

export default Users;