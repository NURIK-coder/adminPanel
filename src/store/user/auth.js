const URL = 'https://tanlov.medsfera.uz/api/admin/'

export const userLogin = (userdata) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${URL}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userdata),
      });

      const data = await response.json();

      if (!response.ok) {
        // Вернуть ошибку с backend-сообщением
        return Promise.reject(data);
      }
      console.log(data);
      
      // Сохраняем токен и диспатчим
      localStorage.setItem('token', data.access);
      dispatch({ type: 'SET_USER', payload: data });

      return data; 
    } catch (error) {
      console.error('Login error:', error);
      return Promise.reject(error); // пробросить ошибку в компонент
    }
  };
};
