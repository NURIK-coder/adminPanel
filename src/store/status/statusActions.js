const URL = 'http://192.168.2.73:8000/api/'


const token = localStorage.getItem("token");
const headers = {
    Authorization: `Bearer ${token}`
};

export const fetchAllStats = () => async (dispatch) => {
    try {
        const [stats, types, faculties, gpa, gender, university] = await Promise.all([
            fetch(URL + "stats/", { headers }).then(res => res.json()),
            fetch(URL + "stats/applications-by-type/", { headers }).then(res => res.json()),
            fetch(URL + "stats/faculty-students/", { headers }).then(res => res.json()),
            fetch(URL + "stats/gpa/", { headers }).then(res => res.json()),
            fetch(URL + "stats/students-by-gender/", { headers }).then(res => res.json()),
            fetch(URL + "stats/students-by-university/", { headers }).then(res => res.json()),
        ]);

        dispatch({ type: "SET_STATS", payload: stats });
        dispatch({ type: "SET_STATS_APPLICATIONS_BY_TYPE", payload: types });
        dispatch({ type: "SET_STATS_FACULTY_STUDENTS", payload: faculties });
        dispatch({ type: "SET_STATS_GPA", payload: gpa });
        dispatch({ type: "SET_STUDENS_BY_GENDER", payload: gender });
        dispatch({ type: "SET_STUDENS_BY_UNIVERSITY", payload: university });

    } catch (error) {
        console.error("❌ Statistikani olishda xatolik:", error);
    }
};
