//
// lib/lib.js
//
var Question = function (questionObj) {
  this.value = {
    text: "Question",
    answers: [],
  };

  this.selectedAnswer = null;
  this.html = null;
  this.questionText = null;
  this.questionAnswers = null;
  this.questionFeedback = null;

  this.value = Object.assign(this.value, questionObj);

  this.onQuestionAnswered = ({ detail }) => {
    this.selectedAnswer = {
      value: detail.answer,
      html: detail.answerHtml,
    };
    this.update();

    document.dispatchEvent(
      new CustomEvent("question-answered", {
        detail: {
          question: this,
          answer: detail.answer,
        },
      })
    );
  };

  this.create = function () {
    this.html = document.createElement("div");
    this.html.classList.add("question");

    this.questionText = document.createElement("h2");
    this.questionText.textContent = this.value.text;

    this.questionAnswers = document.createElement("div");
    this.questionAnswers.classList.add("answers");

    for (let i = 0; i < this.value.answers.length; i++) {
      const ansObj = this.value.answers[i];
      let answer = createAnswer(ansObj);

      answer.onclick = (ev) => {
        if (this.selectedAnswer !== null) {
          this.selectedAnswer.html.classList.remove("selected");
        }

        answer.classList.add("selected");

        this.html.dispatchEvent(
          new CustomEvent("question-answered", {
            detail: {
              answer: ansObj,
              answerHtml: answer,
            },
          })
        );
      };

      this.questionAnswers.appendChild(answer);
    }

    this.questionFeedback = document.createElement("div");
    this.questionFeedback.classList.add("question-feedback");

    this.html.appendChild(this.questionText);
    this.html.appendChild(this.questionAnswers);
    this.html.appendChild(this.questionFeedback);

    this.html.addEventListener("question-answered", this.onQuestionAnswered);

    return this.html;
  };

  this.disable = function () {
    this.html.classList.add("disabled");
    this.html.onclick = (ev) => {
      ev.stopPropagation();
    };

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    let answers = this.html.querySelectorAll(".answer");
    for (let i = 0; i < answers.length; i++) {
      let answer = answers[i];
      answer.onclick = null;
    }
  };

  this.remove = function () {
    let children = this.html.querySelectorAll("*");
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      this.html.removeChild(child);
    }

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    this.html.parentNode.removeChild(this.html);
    this.html = null;
  };

  this.update = function () {
    let correctFeedback, incorrectFeedback;
    this.html = this.html || document.createElement("div");

    correctFeedback = "Super! c'est la bonne reponse.";
    incorrectFeedback = "Oupss! Non ce n'est pas la bonne reponse.";

    if (this.selectedAnswer !== null) {
      if (this.selectedAnswer.value.isCorrect) {
        this.html.classList.add("correct");
        this.html.classList.remove("incorrect");
        this.questionFeedback.innerHTML = correctFeedback;
      } else {
        this.html.classList.add("incorrect");
        this.html.classList.remove("correct");
        this.questionFeedback.innerHTML = incorrectFeedback;
      }
    }
  };

  function createAnswer(obj) {
    this.value = {
      text: "Answer",
      isCorrect: false,
    };

    this.value = Object.assign(this.value, obj);

    this.html = document.createElement("button");
    this.html.classList.add("answer");

    this.html.textContent = this.value.text;

    return this.html;
  }
};

//
// main.js
//

let questionsData = [
  {
    text: "Quelle est la première mention du nom Jéhovah dans la Bible ?",
    answers: [
      {
        text: "Gen. 1:20",
        isCorrect: false,
      },
      {
        text: "Gen. 2:4",
        isCorrect: true,
      },
      {
        text: "Gen. 2:6",
        isCorrect: false,
      },
      {
        text: "Gen. 3:2",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Qui était le premier homme à bâtir une ville dans la Bible ?",
    answers: [
      {
        text: "Caïn",
        isCorrect: true,
      },
      {
        text: "koushs",
        isCorrect: false,
      },
      {
        text: "nemrod",
        isCorrect: false,
      },
      {
        text: "Noe",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Qui est le premier personnage biblique à propos de qui il est écrit qu’il marchait avec le vrai Dieu ?",
    answers: [
      {
        text: "Abraham",
        isCorrect: false,
      },
      {
        text: "Noe",
        isCorrect: false,
      },
      {
        text: "Hénoch",
        isCorrect: true,
      },
      {
        text: "Job",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Qui était la première femme citee dans la Bible, après Eve ?",
    answers: [
      {
        text: "zila",
        isCorrect: false,
      },
      {
        text: "marie",
        isCorrect: false,
      },
      {
        text: "Ada",
        isCorrect: true,
      },
      {
        text: "sarai",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Sur quoi reposait La distinction entre animaux purs et impur à l’époque du Déluge : sur des critères.",
    answers: [
      {
        text: "sacrificiels",
        isCorrect: true,
      },
      {
        text: "alimentaires",
        isCorrect: false,
      },
      {
        text: "sanitaires",
        isCorrect: false,
      },
      {
        text: "les troix",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Combien de temps Noé et sa famille ont-ils passé dans l’arche ?",
    answers: [
      {
        text: "1 an et 30 jours ",
        isCorrect: false,
      },
      {
        text: "1 an et 15 jours",
        isCorrect: false,
      },
      {
        text: "1 an et 10 jours",
        isCorrect: true,
      },
      {
        text: "1 an et 20 jours",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Si Abraham n’avait pas eu d’enfant, qui serait son successeur ? ",
    answers: [
      {
        text: "Ismael",
        isCorrect: false,
      },
      {
        text: "Eliezer",
        isCorrect: true,
      },
      {
        text: "Loth",
        isCorrect: false,
      },
      {
        text: "personne",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Quel âge Isaac avait-il quand Sarah sa mère est décédée ?",
    answers: [
      {
        text: "35 ans",
        isCorrect: false,
      },
      {
        text: "30 ans",
        isCorrect: false,
      },
      {
        text: "40 ans",
        isCorrect: false,
      },
      {
        text: "37 ans",
        isCorrect: true,
      },
    ],
  },
  {
    text: "Abraham a-t-il connu ses petits-fils Esaü et Jacob ?",
    answers: [
      {
        text: "OUi",
        isCorrect: true,
      },
      {
        text: "Non",
        isCorrect: false,
      },
      {
        text: "peut-etre",
        isCorrect: false,
      },
      {
        text: "Pas de reponse de la bible",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Quel autre nom donnait-on à Jethro le beau-père de Moïse ?",
    answers: [
      {
        text: "Abdiel",
        isCorrect: false,
      },
      {
        text: "Réouel",
        isCorrect: true,
      },
      {
        text: "Habaia",
        isCorrect: false,
      },
      {
        text: "ethane",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Quel était le premier mois du calendrier juif ?",
    answers: [
      {
        text: "Abib",
        isCorrect: true,
      },
      {
        text: "Nissan",
        isCorrect: false,
      },
      {
        text: "Tammouz",
        isCorrect: false,
      },
      {
        text: "Tishri",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Qui est l’instigateur du système de nomination des Juges dans l’antique Israël ?",
    answers: [
      {
        text: "Moise",
        isCorrect: false,
      },
      {
        text: "Aaron",
        isCorrect: false,
      },
      {
        text: "Jethro",
        isCorrect: true,
      },
      {
        text: "Josue",
        isCorrect: false,
      },
    ],
  },
  {
    text: "What is France Dans l’Israël antique, pouvait-on consommer de l’encens ?",
    answers: [
      {
        text: "Oui",
        isCorrect: true,
      },
      {
        text: "Non",
        isCorrect: false,
      },
      {
        text: "La bible ne dit rien",
        isCorrect: false,
      },
      {
        text: "peut-etre",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Quel autre nom donnait-on à Josué, le successeur de Moïse ?",
    answers: [
      {
        text: "Noun",
        isCorrect: false,
      },
      {
        text: "Phineas",
        isCorrect: false,
      },
      {
        text: "Osée",
        isCorrect: true,
      },
      {
        text: "Jabin",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Qui était le « Prince de l’armée de Jéhovah » qui est apparu à Josué lors de la traversée du Jourdain ? ",
    answers: [
      {
        text: "Gedeon",
        isCorrect: false,
      },
      {
        text: "Moise",
        isCorrect: false,
      },
      {
        text: "Jesus",
        isCorrect: true,
      },
      {
        text: "Gedeon",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Quel autre nom donnait-on à la nation d’Israël ?",
    answers: [
      {
        text: "Juif",
        isCorrect: false,
      },
      {
        text: "Jacob",
        isCorrect: false,
      },
      {
        text: "Jah",
        isCorrect: false,
      },
      {
        text: "Jeshouroun",
        isCorrect: true,
      },
    ],
  },
  {
    text: "Vrai ou Faux ? La nation d’Israël a connu plus d’une fois la traversée à sec d’un fleuve… ?",
    answers: [
      {
        text: "Vrai",
        isCorrect: true,
      },
      {
        text: "Faut",
        isCorrect: false,
      },
      {
        text: "",
        isCorrect: true,
      },
      {
        text: "",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Lors de l’installation d’Israël en terre promise, au sein de quelle tribus Caleb a-t-il reçu une ville héritage ?",
    answers: [
      {
        text: "La tribus de Dan",
        isCorrect: false,
      },
      {
        text: "La tribus d'Ahser",
        isCorrect: false,
      },
      {
        text: "La tribus de Juda",
        isCorrect: true,
      },
      {
        text: "La tribus de Benjamin",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Lors de l’installation d’Israël en terre promise, au sein de quelle tribus Josué a-t-il reçu une ville héritage ?",
    answers: [
      {
        text: "La tribus de Zabulon",
        isCorrect: false,
      },
      {
        text: "La tribus d’Ephraïm",
        isCorrect: true,
      },
      {
        text: "La tribu de Gad",
        isCorrect: true,
      },
      {
        text: "La tribus d'Issacar",
        isCorrect: false,
      },
    ],
  },
  {
    text: "Quel autre nom donnait-on à Gédéon, le Juge en Israël ?",
    answers: [
      {
        text: "Yoash",
        isCorrect: false,
      },
      {
        text: "zebath",
        isCorrect: false,
      },
      {
        text: "Yotham",
        isCorrect: false,
      },
      {
        text: "Jéroubaal",
        isCorrect: true,
      },
    ],
  },
];

// variables initialization
let questions = [];
let score = 0,
  answeredQuestions = 0;
let appContainer = document.getElementById("questions-container");
let scoreContainer = document.getElementById("score-container");
scoreContainer.innerHTML = `Score: ${score}/${questionsData.length}`;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} arr items An array containing the items.
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

//shuffle(questionsData);

// creating questions
for (var i = 0; i < questionsData.length; i++) {
  let question = new Question({
    text: questionsData[i].text,
    answers: questionsData[i].answers,
  });

  appContainer.appendChild(question.create());
  questions.push(question);
}

document.addEventListener("question-answered", ({ detail }) => {
  if (detail.answer.isCorrect) {
    score++;
  }

  answeredQuestions++;
  scoreContainer.innerHTML = `Score: ${score}/${questions.length}`;
  detail.question.disable();

  if (answeredQuestions == questions.length) {
    setTimeout(function () {
      alert(`Quiz termine! \nScore final: ${score}/${questions.length}`);
    }, 100);
  }
});

console.log(questions, questionsData);
