const adviceModal = document.getElementById("adviceModal");
const modalTopic = document.getElementById("modalTopic");
const nameInput = document.getElementById("nameInput");
const adviceInput = document.getElementById("adviceInput");
const submitAdviceBtn = document.getElementById("submitAdvice");
const closeAdviceBtn = document.getElementById("closeModal");

const questionModal = document.getElementById("questionModal");
const openQuestionBtn = document.getElementById("openQuestionModal");
const questionTextInput = document.getElementById("questionText");
const questionCategoryInput = document.getElementById("questionCategory");
const submitQuestionBtn = document.getElementById("submitQuestion");
const closeQuestionBtn = document.getElementById("closeQuestionModal");

const adviceListEl = document.getElementById("adviceList");
const emptyMessage = document.getElementById("emptyMessage");
const questionListEl = document.getElementById("questionList");
const toggleQuestionsBtn = document.getElementById("toggleQuestionsBtn");
const toggleAdviceBtn = document.getElementById("toggleAdviceBtn");

const MAX_VISIBLE_QUESTIONS = 6;
const MAX_VISIBLE_ADVICE = 6;

let showAllQuestions = false;
let showAllAdvice = false;

let currentTopic = "";
let currentCategory = "General";

let adviceData = JSON.parse(localStorage.getItem("studyConnectAdvice") || "[]");

const defaultQuestions = [
  { text: "How do you stay motivated during long study sessions?", category: "Motivation" },
  { text: "What’s a good strategy for group projects?", category: "Group Projects" },
  { text: "What resources are available for finding internships related to my major?", category: "Internships" },
  { text: "How do you balance school, work, and personal life?", category: "Balance" },
  { text: "Any advice for making friends in a new school or campus?", category: "Social Life" },
  { text: "How do you handle exam stress and anxiety?", category: "Stress & Exams" }
];

let questionData = JSON.parse(localStorage.getItem("studyConnectQuestions") || "null");
if (!Array.isArray(questionData)) questionData = defaultQuestions;

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".open-advice");
  if (!btn) return;
  
  currentTopic = btn.dataset.topic || "General advice";
  currentCategory = btn.dataset.category || "General";
  
  modalTopic.textContent = `Topic: ${currentTopic}`;
  adviceModal.style.display = "flex";
  adviceInput.value = "";
  nameInput.value = "";
});

if (openQuestionBtn) {
  openQuestionBtn.addEventListener("click", () => {
    questionModal.style.display = "flex";
    questionTextInput.value = "";
    questionCategoryInput.value = "";
  });
}

closeQuestionBtn.addEventListener("click", () => {
  questionModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === adviceModal) adviceModal.style.display = "none";
  if (e.target === questionModal) questionModal.style.display = "none";
});

closeAdviceBtn.addEventListener("click", () => {
  adviceModal.style.display = "none";
});

submitAdviceBtn.addEventListener("click", () => {
  const text = adviceInput.value.trim();
  const name = nameInput.value.trim() || "Anonymous";
  
  if (!text) return;
  
  adviceData.unshift({ name, text, topic: currentTopic, category: currentCategory });
  localStorage.setItem("studyConnectAdvice", JSON.stringify(adviceData));
  showAllAdvice = false;
  renderAdvice();
  adviceModal.style.display = "none";
});

submitQuestionBtn.addEventListener("click", () => {
  const qText = questionTextInput.value.trim();
  const qCat = questionCategoryInput.value.trim() || "Student Question";
  
  if (!qText) return;
  
  questionData.unshift({ text: qText, category: qCat });
  localStorage.setItem("studyConnectQuestions", JSON.stringify(questionData));
  showAllQuestions = false;
  renderQuestions();
  questionModal.style.display = "none";
});

toggleQuestionsBtn.addEventListener("click", () => {
  showAllQuestions = !showAllQuestions;
  renderQuestions();
});

toggleAdviceBtn.addEventListener("click", () => {
  showAllAdvice = !showAllAdvice;
  renderAdvice();
});

function renderQuestions() {
  questionListEl.innerHTML = "";
  
  const total = questionData.length;
  const itemsToShow = showAllQuestions ? total : Math.min(MAX_VISIBLE_QUESTIONS, total);
  
  for (let i = 0; i < itemsToShow; i++) {
    const q = questionData[i];
    
    const card = document.createElement("div");
    card.className = "card light-card";
    
    const title = document.createElement("h3");
    title.textContent = "Question";
    
    const text = document.createElement("p");
    text.textContent = q.text;
    
    const btn = document.createElement("button");
    btn.className = "open-advice";
    btn.dataset.topic = q.text;
    btn.dataset.category = q.category;
    btn.textContent = "Share your thoughts >";
    
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(btn);
    
    questionListEl.appendChild(card);
  }
  
  toggleQuestionsBtn.style.display = total > MAX_VISIBLE_QUESTIONS ? "inline-block" : "none";
  toggleQuestionsBtn.textContent = showAllQuestions ? "Show fewer questions" : "Show more questions";
}

function renderAdvice() {
  adviceListEl.innerHTML = "";
  
  if (adviceData.length === 0) {
    emptyMessage.style.display = "block";
    adviceListEl.appendChild(emptyMessage);
    toggleAdviceBtn.style.display = "none";
    return;
  }
  
  emptyMessage.style.display = "none";
  
  const total = adviceData.length;
  const itemsToShow = showAllAdvice ? total : Math.min(MAX_VISIBLE_ADVICE, total);
  
  for (let i = 0; i < itemsToShow; i++) {
    const item = adviceData[i];
    
    const card = document.createElement("div");
    card.className = "card advice-card";
    
    const nameEl = document.createElement("h4");
    nameEl.textContent = item.name;
    
    const topicEl = document.createElement("p");
    topicEl.className = "advice-topic";
    topicEl.textContent = `On: ${item.topic}`;
    
    const textEl = document.createElement("p");
    textEl.textContent = item.text;
    
    card.appendChild(nameEl);
    card.appendChild(topicEl);
    card.appendChild(textEl);
    
    adviceListEl.appendChild(card);
  }
  
  toggleAdviceBtn.style.display = total > MAX_VISIBLE_ADVICE ? "inline-block" : "none";
  toggleAdviceBtn.textContent = showAllAdvice ? "Show less advice" : "Show more advice";
}

renderAdvice();
renderQuestions();

