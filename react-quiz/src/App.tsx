import React, { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { fetchQuizQuestions } from "./API";

//Types
import { QuestionState, Difficulty } from "./API";


export type AnswerObject = {
  question: string;
  answer: string;
  corrent: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestion] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswer] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  // console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY))

  const startQuiz = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestion = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestion(newQuestion);
    setScore(0);
    setUserAnswer([]);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      //user answer
      const answer = e.currentTarget.value
      //check answer against correct answer
      const correct = questions[number].correct_answer === answer;

      if(correct){
        setScore(prev => prev+1)
        //save answer in the array
      }

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };

      setUserAnswer((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    //Move on the next question if not the last question
     const nextQuestion =number+1
     
     if(nextQuestion === TOTAL_QUESTIONS){
       setGameOver(true)
      } else {
        setNumber(nextQuestion);
      }
  };

  return (
    <div className="App">
      <h1>REACT QUIZ</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startQuiz}>
          Start
        </button>
      ) : null}
      {!gameOver ? <p className="score">Score:</p> : null}
     {loading ? <p>Loading Question ...</p> : null}
     
     {!loading && !gameOver && (
        <QuestionCard
        questionNr={number+1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
        />

     )}
     
      {!gameOver && !loading && userAnswers.length ===number +1 && number!==TOTAL_QUESTIONS-1 ? (
      <button className="next" onClick={nextQuestion}>
      Next Question
    </button>

      ):null}

    </div>
  );
};

export default App;
