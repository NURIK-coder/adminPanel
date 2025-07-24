const URL = 'https://tanlov.medsfera.uz/api/'


const token = localStorage.getItem("token");
const headers = {
    Authorization: `Bearer ${token}`
};
export const fetchAllFiltres = () => async (dispatch) => {
    try {
        const [faculties, levels, universities] = await Promise.all([
            fetch(URL + "admin/student-facultys/", { headers }).then(res => res.json()),
            fetch(URL + "admin/student-levels/", { headers }).then(res => res.json()),
            fetch(URL + "admin/student-universitys/", { headers }).then(res => res.json()),
            
        ]);

        dispatch({ type: "SET_LEVELS", payload: levels });
        dispatch({ type: "SET_FACULTIES", payload: faculties });
        dispatch({ type: "SET_UNIVERSITIES", payload: universities });
        console.log("Faculties:", faculties);
        
        

    } catch (error) {
        console.error("❌ Statistikani olishda xatolik:", error);
    }
};
