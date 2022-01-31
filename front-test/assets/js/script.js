let nextQuestionIndex = 0;
let finalQuestion =false;
let correctAnswer;
let questionsLength;
let score = 0;
let counter = 9;
let resetTimerFlag = false;

function start() {
    document.getElementById('button-section').classList.add("display-none");
    document.getElementById('button-section').classList.remove("display-block");
    document.getElementById('question-section').classList.add("display-block");
    getQuestion(0)
    timer()
}

function timer () {
    const myInterval =setInterval(() => {
        if (counter >= 0) {
            if(!resetTimerFlag) {
                document.getElementById('range-label').innerHTML = `${counter}`;
                document.getElementById('range').setAttribute('value', `${counter}`);
                counter --;
            } else {
                clearInterval(myInterval)
                resetTimer();
            }

        } else {
            clearInterval(myInterval)

            if(finalQuestion) {
                document.getElementById('question-section').classList.remove("display-block");
                document.getElementById('final-section').classList.add("display-block");
                document.getElementById('final-message').innerHTML = 'گند زدی عزیزم !';
            } else {
                score--;
                document.querySelector(`#answer-status :nth-child(${nextQuestionIndex})`).setAttribute("checked", "checked")
                document.querySelector(`#answer-status :nth-child(${nextQuestionIndex})`).classList.add('false-answer')
                getQuestion(nextQuestionIndex)
                resetTimer();
                timer()
            }

        }
    }, 1000)
}

function startAgain() {
    score = 0;
    nextQuestionIndex = 0;
    finalQuestion = false;
    document.getElementById('final-section').classList.remove("display-block");
    document.getElementById('button-section').classList.add("display-block");
    resetTimer()

    let answerStatusBulletCount = document.getElementById("answer-status").childElementCount;
    for (let i = 0; i< answerStatusBulletCount; i++) {
        document.getElementById('answer-status').children[i].removeAttribute("checked")
        document.getElementById('answer-status').children[i].removeAttribute("class")
    }
}

 function resetTimer() {
    resetTimerFlag = false;
     counter = 9;
     document.getElementById('range-label').innerHTML = `10`;
     document.getElementById('range').setAttribute('value', `10`);
 }

function createAnswerStatusBullet() {
    let answerStatusBulletCount = document.getElementById("answer-status").childElementCount;
    if(answerStatusBulletCount < questionsLength) {
        for(let i=0; i<questionsLength;i++) {
            let original = document.getElementById('status');
            let clone = original.cloneNode(true);
            clone.id = "status" + ++i;
            original.parentNode.appendChild(clone);
        }

    }

}

function getQuestion(questionIndex) {
    fetch('questions.json')
        .then(resp => resp.json())
        .then((packageJson) => {
            questionsLength = packageJson.length
            if(nextQuestionIndex < packageJson.length-1) {
                nextQuestionIndex ++
            } else {
                finalQuestion = true;
            }
            setQuestion(packageJson[questionIndex])
            createAnswerStatusBullet()
        });
}

function selectAnswer (answerId) {
    let selectedAnswer = document.getElementById(answerId);
    if(finalQuestion) {
        resetTimerFlag = true;
        if(selectedAnswer.innerHTML === correctAnswer) {
            score++;
        } else {
            score--;
        }
        document.getElementById('question-section').classList.remove("display-block");
        document.getElementById('final-section').classList.add("display-block");

        if (score === 3) {
            document.getElementById('final-message').innerHTML = 'آفرین !';
        } else {
            document.getElementById('final-message').innerHTML = 'گند زدی عزیزم !';
        }
    } else {
        resetTimerFlag = true;
        if (selectedAnswer.innerHTML === correctAnswer) {
            score++;
            document.querySelector(`#answer-status :nth-child(${nextQuestionIndex})`).setAttribute("checked", "checked")
            document.querySelector(`#answer-status :nth-child(${nextQuestionIndex})`).classList.add('true-answer')
        } else {
            score--;
            document.querySelector(`#answer-status :nth-child(${nextQuestionIndex})`).setAttribute("checked", "checked")
            document.querySelector(`#answer-status :nth-child(${nextQuestionIndex})`).classList.add('false-answer')
        }
        getQuestion(nextQuestionIndex)
        resetTimer();
    }
}

function setQuestion(currentQuestion) {
    correctAnswer = currentQuestion.correct;
    document.getElementById('question').innerHTML = currentQuestion.question;
    document.getElementById('answer1').innerHTML = currentQuestion.answers[0];
    document.getElementById('answer2').innerHTML = currentQuestion.answers[1];
    document.getElementById('answer3').innerHTML = currentQuestion.answers[2];
    document.getElementById('answer4').innerHTML = currentQuestion.answers[3];
}