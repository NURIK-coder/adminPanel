import { useState } from "react";


export default function Test(){
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    console.log(answers);
    

    const handleOptionSelect = (qId, optionIndex) => {
        setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const getScore = () => {
        let score = 0;
        mockTest.questions.forEach((q) => {
        if (answers[q.id] === q.answer) score++;
        });
        return score;
    };
    const mockTest = {
        title: 'Test',
        questions: [
            {
            id: 1,
            question: 'adfdasfsadf',
            options: ['asdfads','asdfd','adsfdfs'],
            answer: 2,
            },
            {
            id: 2,
            question: 'asdfsdaf',
            options: ['asdfdsf', 'adsfdsfasd', 'adfadsfds'],
            answer: 0,
            },
        ],
    };
    return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{mockTest.title}</h1>

      {mockTest.questions.map((q) => (
        <div key={q.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2 bg-blue-200 text-left p-4 rounded-xl shadow-xl border-black border-[1px]">{q.question}</h2>
          <div className="flex flex-col gap-3 bg-[white] shadow-xl rounded-xl">
            {q.options.map((opt, index) => (
              <div key={index} className="text-left m-3">
                <label className="">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    disabled={submitted}
                    checked={answers[q.id] === index}
                    onChange={() => handleOptionSelect(q.id, index)}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Завершить тест
        </button>
      ) : (
        <div className="mt-6 text-lg font-semibold bg-green-300 p-4" style={getScore() > 0 ? {backgroundColor: '#81C784'} : {backgroundColor: '#ff7575'}}>
          <p>{getScore() > 0 ? (<spam>✅</spam>) : (<spam>❌</spam>)} Вы набрали {getScore()} из {mockTest.questions.length} баллов.</p>
          <button onClick={()=>setSubmitted(false)} className="p-2 bg-blue-500 border-[1px] hover:bg-white transition mt-3">Qayta t'opshirish</button>
        </div>
      )}
    </div>
  );
}