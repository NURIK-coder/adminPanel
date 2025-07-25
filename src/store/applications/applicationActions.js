
const URL = 'https://tanlov.medsfera.uz/api/'

export const loginAndSaveToken = async () => {
    
    const userData = {
        username: localStorage.getItem('username'),
        password: localStorage.getItem('password')
    }
    const response = await fetch(URL + 'admin/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh", data.refresh);
        return data;
    }

    console.error("Автовход не удался:", data);
    return null;
};



    export const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return null;

    try {
        const response = await fetch(URL + 'token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Token refresh failed", data);
            return null;
        }

        // Сохраняем новый access
        localStorage.setItem("token", data.access);
        return data; // { access: "...", ... }
    } catch (e) {
        console.error("Token refresh error:", e);
        return null;
    }
};



export const ApplicationList = (page = 1, name='') => {
    return async (dispatch) => {
        const request = () =>
            fetch(`${URL}admin/applications/?page=${page}&student=${name}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                }
            });

        let res = await request();

        if (res.status === 401) {
            const refreshed = await refreshToken();
            if (!refreshed) {
                await loginAndSaveToken();
            }

            res = await request(); // повторный запрос после обновления токена
        }

        if (res.status === 403) {
            const error = await res.json();
            return { error: error.detail || "Xatolik yuz berdi." };
        }

        if (res.ok) {
            const data = await res.json();
            dispatch({ type: 'SET_APPLICATIONS', payload: data });
            return { payload: data }; // ВАЖНО: возвращаем данные для пагинации
        }

        return { error: "Tarmoq yoki server xatoligi" };
    };
};



export const ApplicationDetail = (id) => {
    return async (dispatch) => {
        const request = () =>
            fetch(URL + `admin/applications/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                }
            });

        let res = await request();

        if (res.status === 401) {
            const refreshed = await refreshToken();
            if (!refreshed) {
                await loginAndSaveToken();
                res = await request();
            }

        }

        if (res.status === 403) {
            const error = await res.json();
            return error.detail || "Xatolik yuz berdi.";
        }

        if (res.ok) {
            const data = await res.json();
            dispatch({ type: 'SET_APPLICATION', payload: data });
            return { payload: data }
        }
    };
};  


export const sendScoreWithAuth = (data) => async (dispatch, getState) => {
    let token = localStorage.getItem("token");

    const makeRequest = async (accessToken) => {
        return await fetch(URL + `admin/score/create/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });
    };

    let response = await makeRequest(token);

    if (response.status === 401) {
        const refreshed = await refreshToken();

        if (refreshed?.access) {
            token = refreshed.access;
            response = await makeRequest(token);
        } else {
            await loginAndSaveToken();
            return;
        }
    }

    // Обработка ошибок 400 и 403 с детальным текстом
    if (response.status === 400 || response.status === 403) {
        const errorData = await response.json();
        if (errorData?.item?.[0]?.includes("score with this item already exists")) {
            throw new Error("Bu yo‘nalish uchun baho allaqachon qo‘yilgan.");
        }
        throw new Error(errorData.detail || "Xatolik yuz berdi");
    }


    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Tarmoq xatoligi");
    }

    // Если нужно вернуть успешный ответ
    return await response.json();
};

export const LeaderList = ({page = 1, itemsPerPage=100, full_name='', faculty='', course='', university='', toifa=''}) => {
    return async (dispatch) => {
        const request = () =>
            fetch(URL + `admin/leaderboard/?page=${page}&page_size=${itemsPerPage}&full_name=${full_name}&faculty=${faculty}&course=${course}&univeresity=${university}&toifa=${toifa}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                }
            });

        let res = await request();

        if (res.status === 401) {
            const refreshed = await refreshToken();
            if (!refreshed) {
                await loginAndSaveToken();
                res = await request();
            }

        }

        if (res.status === 403) {
            const error = await res.json();
            return error.detail || "Xatolik yuz berdi.";
        }

        if (res.ok) {
            const data = await res.json();
            dispatch({ type: 'SET_LEADERS', payload: data });
            return { payload: data }
        }
    };
};  


export const getGpaLeaders = ({
  university1 = "",
  level = "",
  faculty = "",
  page = 1,
  itemsPerPage = 20,
  full_name = ""
}) => {
  return async (dispatch) => {
    const request = () =>
      fetch(
        `${URL}admin/students-gpa/?page=${page}&page_size=${itemsPerPage}&faculty=${faculty}&university=${university1}&level=${level}&full_name=${full_name}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

    let res = await request();

    if (res.status === 401) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        await loginAndSaveToken();
        res = await request();
      }
    }

    if (res.status === 403) {
      const error = await res.json();
      return error.detail || "Xatolik yuz berdi.";
    }

    if (res.ok) {
      const data = await res.json();
      dispatch({ type: "SET_GPA_LEADERS", payload: data });
      return { payload: data };
    }
  };
};


export const GetExel = () => {
  return async () => {
    const request = () =>
      fetch(URL + `admin/students-gpa/export`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        }
      });

    let res = await request();

    if (res.status === 401) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        await loginAndSaveToken();
        res = await request();
      }
    }

    if (res.status === 403) {
      const error = await res.json();
      throw new Error(error.detail || "Xatolik yuz berdi.");
    }

    if (res.ok) {
      const blob = await res.blob();
      return { payload: blob };
    }

    throw new Error("Yuklab olishda xatolik yuz berdi.");
  };
};

export const GetExelLeaderBoard = () => {
  return async () => {
    const request = () =>
      fetch(URL + `api/leaderboard/?export=excel`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        }
      });

    let res = await request();

    if (res.status === 401) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        await loginAndSaveToken();
        res = await request();
      }
    }

    if (res.status === 403) {
      const error = await res.json();
      throw new Error(error.detail || "Xatolik yuz berdi.");
    }

    if (res.ok) {
      const blob = await res.blob();
      return { payload: blob };
    }

    throw new Error("Yuklab olishda xatolik yuz berdi.");
  };
};



export const getMandad = ({
  page = 1,
  itemsPerPage = 100,
}) => {
  return async (dispatch) => {
    const request = () =>
      fetch(
        `${URL}admin/mandat/?page=${page}&page_size=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

    let res = await request();

    if (res.status === 401) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        await loginAndSaveToken();
        res = await request();
      }
    }

    if (res.status === 403) {
      const error = await res.json();
      return error.detail || "Xatolik yuz berdi.";
    }

    if (res.ok) {
      const data = await res.json();
      dispatch({ type: "SET_MANDAD", payload: data });
      return { payload: data };
    }
  };
};