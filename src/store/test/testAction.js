    const URL = 'http://192.168.2.73:8000/api/';

    async function loginAndSaveToken() {
        const res = await fetch(URL + 'students/login/', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                login: "364211100841",
                password: "AB5086340"
            })
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('accessToken', data.token.access);
            localStorage.setItem('refreshToken', data.token.refresh);
            return true;
        }
        return false;
    }

    async function refreshToken() {
        const res = await fetch(URL + 'api/token/refresh/', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ refresh: localStorage.getItem('refreshToken') })
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('accessToken', data.access);
            return true;
        }
        return false;
    }

    export const TestsList = () => {
        return async (dispatch) => {
            let res = await fetch(URL + 'tests/', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (res.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    res = await fetch(URL + 'tests/', {
                        method: 'GET',
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                } else {
                    await loginAndSaveToken();
                    res = await fetch(URL + 'tests/', {
                        method: 'GET',
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                }
            }

            if (res.ok) {
                const data = await res.json();
                dispatch({ type: 'SET_TESTS', payload: data });
            }
        };
    };


    export const getTestById = (id) => {
        return async (dispatch) => {
            let res = await fetch(URL + `tests/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (res.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    res = await fetch(URL + `tests/${id}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                } else {
                    await loginAndSaveToken();
                    res = await fetch(URL + `tests/${id}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                }
            }

            if (res.ok) {
                const data = await res.json();
                dispatch({ type: 'SET_TESTDETAIL', payload: data });
            }
        };
    };

    export const TestStart = (id) => {
        return async (dispatch) => {
            let res = await fetch(URL + `test/start/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ test_id: id })
            });

            if (res.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    res = await fetch(URL + `test/start/`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({ test_id: id })
                    });
                } else {
                    await loginAndSaveToken();
                    res = await fetch(URL + `test/start/`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({ test_id: id })
                    });
                }
            }

            if (res.status === 403) {
                const error = await res.json();
                return error.detail || "Xatolik yuz berdi.";
            }

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('sessionId', data.session_id);
                dispatch({ type: 'SET_TESTDETAIL', payload: data });
            }
        };
    };


export const SendAnswer = (data, session_id) => {
    return async (dispatch) => {
        const request = () =>
            fetch(URL + `test/${session_id}/answer/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

        let res = await request();

        if (res.status === 401) {
            const refreshed = await refreshToken();
            if (!refreshed) {
                await loginAndSaveToken();
            }
            res = await request(); // Повторный запрос
        }

        if (res.status === 403) {
            const error = await res.json();
            return error.detail || "Xatolik yuz berdi.";
        }

        if (res.ok) {
            const responseData = await res.json();
            console.log(responseData);
        }
        else{

        }
    };
};

export const NextQuestion = (session_id, test_id) => {
    return async (dispatch) => {
        const request = () =>
            fetch(URL + `test/${session_id}/next/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });

        let res = await request();

        if (res.status === 401) {
            const refreshed = await refreshToken();
            if (!refreshed) {
                await loginAndSaveToken();
            }

            // Повторный запуск теста (если сессия истекла)
            res = await fetch(URL + `test/start/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ test_id })
            });
        }

        if (res.status === 403) {
            const error = await res.json();
            return error.detail || "Xatolik yuz berdi.";
        }

        if (res.ok) {
            const data = await res.json();
            dispatch({ type: 'SET_TESTDETAIL', payload: data });
        }
    };
};  

export const FinishTest = (session_id) => {
    return async (dispatch) => {
        const res = await fetch(URL + `test/${session_id}/finish/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-type": "application/json"
            }
        });

        if (res.status === 401) {
            const refreshed = await refreshToken();
            if (!refreshed) {
                await loginAndSaveToken();
            }

            // Повторяем запрос после обновления токена
            const retryRes = await fetch(URL + `test/${session_id}/next/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                    "Content-type": "application/json"
                }
            });

            if (retryRes.ok) {
                const data = await retryRes.json();
                dispatch({ type: 'SET_TESTDETAIL', payload: data });
            } else if (retryRes.status === 403) {
                const error = await retryRes.json();
                return error.detail || "Xatolik yuz berdi.";
            }

            return;
        }

        if (res.status === 403) {
            const error = await res.json();
            return error.detail || "Xatolik yuz berdi.";
        }

        if (res.ok) {
            const data = await res.json();
            dispatch({ type: 'SET_TESTDETAIL', payload: data });
        }
    };
};

