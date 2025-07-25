const URL = 'https://tanlov.medsfera.uz/api/'


export const UsersList = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(URL + 'admin-users/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw {detail: data}
      }
      
      dispatch({type: 'SET_USERS', payload: data})

    } catch (error) {
      console.error('Error getting user:', error);
      throw error
    }
  };
};


export const CurrentUser = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(URL + 'admin/account/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw {detail: data}
      }
      
      dispatch({type: 'SET_USER', payload: data})

    } catch (error) {
      console.error('Error getting user:', error);
      throw error
    }
  };
};

export const ChangePassword = (passData) => {
  return async (dispatch) => {
    try {
      const response = await fetch(URL + 'admin/auth/change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw data; // бросаем объект ошибки от сервера
      }

      // успешный ответ
      dispatch({ type: 'SET_USER', payload: data });

      return { detail: "Parol muvaffaqiyatli o'zgartirildi." };

    } catch (error) {
      return {
        error: error?.old_password || "Parolni o'zgartirishda xatolik yuz berdi."
      };
    }
  };
};
