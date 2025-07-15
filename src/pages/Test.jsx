import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../store/store";
import { TestsList } from "../store/test/testAction";
import { Link } from "react-router-dom";


export default function TestPage(){
    const tests = useSelector(t=>t.testInfo.tests)
    console.log(tests);
    
    useEffect(()=>{
        store.dispatch(TestsList())
    }, [])

    const test  = [
        {
            id:1, 
            name:"test1",
            question: 25,
            score: 50,
            session:1
        },
        {
            id:2, 
            name:"test2",
            question: 30,
            score: 60,
            session: 2
        },
        {
            id:3, 
            name:"test3",
            question: 35,
            score: 70,
            session: 3
        },

    ]
    return (
        <div className="">
            <div>
                <div className="bg-blue-600 font-semibold text-white flex justify-between p-3 mx-5 mt-5 rounded-t-xl">
                    <p>Test nomi</p>
                    <p>Test savollar soni</p>
                    <p>Belgilangan vaqt</p>
                    <p>Status</p> 
                    <p className="px-2">Imkoniyatlar</p>
                </div>
                
                <div className="flex flex-col text-left  mx-5">
                    {tests?.map((t, i)=>(
                        <div className="p-3 border-black border-[1px] font-bold flex justify-between items-center">
                            <h1 className=" text-xl">{t.title}</h1>
                            <p>{t.total_questions} dona</p>
                            <p>{t.time_limit} daq</p>
                            <p>{t.status}</p>
                            <Link to={`/test/${t.id}`} onClick={()=>localStorage.setItem('testId', t.id)} className="bg-blue-700 text-white px-3 py-2">Ko'rish</Link>
                        </div>

                    ))}
                </div>
            </div>
            
            
        </div>
    )
}