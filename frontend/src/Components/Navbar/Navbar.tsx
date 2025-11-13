import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../Sidebar/Sidebar';
import ProfileButton from '../ProfileButton/ProfileButton';
import CustomAlerts from '../CustomAlerts/CustomAlerts';

import useAuth from '../../Hooks/useAuth';
import useSidebar from '../../Hooks/useSidebar';
import useToast from '../../Hooks/useToast';

import '../Loading/Structure/LoadingStructure.scss';
import './Navbar.scss';
import { useGet_Profile } from '../../Features/Profile/Api';
import type { IMe } from '../../Features/Auth/Types';


const Navbar: React.FC = () => {

  const navigate = useNavigate();

  const { isExpanded, toggleSidebar } = useSidebar();
  const { user, setUser } = useAuth();
  const { toast, setToast } = useToast();

  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const rawId = localStorage.getItem("Authenticated-User");
  const parsedId = rawId ?? undefined;

  const { data: profile } = useGet_Profile({
    variables: { id_user: parsedId! },
    enabled: !!parsedId,
  });

  useEffect(() => { profile && setUser(profile.data.user as IMe) }, [profile]);

  useEffect(() => {
    if (user && user.avatar && user.avatar_mimmetype) {
      setAvatarUrl(`data:${user.avatar_mimmetype};base64,${user.avatar}`);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('Authentication-Token');
    const user = localStorage.getItem('Authenticated-User');

    if (!token || !user) {
      localStorage.removeItem('Authentication-Token');
      localStorage.removeItem('Authenticated-User');

      setUser({} as IMe);

      setToast({
        message: "Sessão expirada. Por favor, faça login novamente.",
        type: "error",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, []);


  const onLogout = () => {
    localStorage.removeItem('Authentication-Token');
    localStorage.removeItem('Authenticated-User');

    setToast({
      message: "Logout realizado com sucesso.",
      type: "success",
    });

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };


  return (
    <>
      <div className={`navbar-container ${isExpanded ? 'expanded' : 'collapsed'}`}>

        <div className={`navbar-toggler-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <i className="icon-menu nav-icon" onClick={() => toggleSidebar()}></i>
        </div>

        <nav className={`main-navbar ${isExpanded ? 'expanded-navbar' : ''}`}>

          <div className='nav-items'>

            {user && profile ? (
              <ProfileButton
                id={user.id!}
                name={user.first_name}
                email={user.email}
                avatar={avatarUrl ?? null}
                onLogout={onLogout}
              />
            ) : (
              <div className="struture-loading">
                <div className="row align-items-center">
                  <div className="col p-0">
                    <div className='structure-loader'
                      style={{ height: "44px" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Sidebar />
        </nav>
      </div>

      {toast.message && toast.type && (
        <CustomAlerts
          message={toast.message}
          type={toast.type}
        />
      )}
    </>
  );
};

export default Navbar;