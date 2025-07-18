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