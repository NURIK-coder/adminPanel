const URL = 'http://192.168.2.73:8000/api/admin/'

export const userLogin = (userdata) => {
  return async (dispatch) => {
    try {
      const response = await fetch(URL + 'login/', {
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

      return data; // успешный результат
    } catch (error) {
      console.error('Login error:', error);
      return Promise.reject(error); // пробросить ошибку в компонент
    }
  };
};
