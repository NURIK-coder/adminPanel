import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../store/store";
import { FinishTest, NextQuestion, SendAnswer, TestStart } from "../store/test/testAction";
import { Link, useNavigate } from "react-router-dom";

export default function TestDetail() {
    const testDetail = useSelector((t) => t.testInfo.testDetail);
    
    const navigate = useNavigate()
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    // При первом запуске — запускаем тест
    useEffect(() => {
        store.dispatch(TestStart(localStorage.getItem("testId")));
    }, []);

    // Обновляем текущий вопрос при обновлении testDetail
    useEffect(() => {
        if (testDetail) {
            const question = testDetail.resume ? testDetail.first_question : testDetail;
            setCurrentQuestion(question);
        }
    }, [testDetail]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!currentQuestion || selectedOption === null) {
            alert("Iltimos, biror javobni tanlang.");
            return;
        }

        const answerData = {
            question_id: currentQuestion.id,
            selected_option_id: selectedOption,
        };

        store.dispatch(SendAnswer(answerData, testDetail.session_id));
        store.dispatch(NextQuestion(testDetail.session_id));
        setSelectedOption(null);
    };

    if (!testDetail || !currentQuestion) {
        return <div className="p-5 text-center text-gray-500">Yuklanmoqda...</div>;
    }
    const SendTest = () =>{
        store.dispatch(FinishTest(testDetail.session_id))
        navigate('/testsList')
    }

    return (
        <div>
            <div className="shadow-xl p-3 bg-white m-5 border-black border-[1px] flex justify-between items-center">
                <Link to={'/testsList'} className=" px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">← Orqaga</Link>
                <h1 className="font-bold text-2xl">TEST {testDetail.session_id}</h1>
                <p className="font-bold">Berilgan vaqt: {testDetail.duration} daq</p>
            </div>
 
            <div className="mx-5">
                <form onSubmit={handleSubmit} className="mx-5">
                    <div>
                        <h1 className="bg-blue-800 text-xl text-white border-[1px] p-3 text-left rounded">
                            {currentQuestion.text}
                        </h1>
                    </div>

                    <div className="mt-4 space-y-2">
                        {currentQuestion.options?.map((variant) => (
                            <label
                                key={variant.id}
                                className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-100"
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    value={variant.id}
                                    checked={selectedOption === variant.id}
                                    onChange={() => setSelectedOption(variant.id)}
                                    className="form-radio"
                                />
                                {variant.text}
                            </label>
                        ))}
                    </div>
                    {testDetail.options ? (
                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Keyingisi
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={SendTest}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Javoblarni jo'natish
                        </button>
                    )}

                        
                </form>
            </div>
        </div>
    );
}
