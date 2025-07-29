const quizData = [
            {
                question: "What does 'IaaS' stand for in cloud computing?",
                answers: [
                    "Internet as a Service",
                    "Infrastructure as a Service",
                    "Integration as a Service",
                    "Information as a Service"
                ],
                correct: 1,
                explanation: "IaaS (Infrastructure as a Service) provides virtualized computing resources over the internet, including servers, storage, and networking."
            },
            {
                question: "Which of the following is NOT a major cloud service provider?",
                answers: [
                    "Amazon Web Services (AWS)",
                    "Microsoft Azure",
                    "Google Cloud Platform",
                    "Adobe Creative Suite"
                ],
                correct: 3,
                explanation: "Adobe Creative Suite is a software package, not a cloud service provider. AWS, Azure, and Google Cloud are the major cloud providers."
            },
            {
                question: "What is the main advantage of cloud computing scalability?",
                answers: [
                    "Fixed resource allocation",
                    "Manual hardware upgrades",
                    "Automatic resource adjustment based on demand",
                    "Limited storage capacity"
                ],
                correct: 2,
                explanation: "Cloud scalability allows automatic adjustment of resources up or down based on demand, ensuring optimal performance and cost efficiency."
            },
            {
                question: "Which cloud deployment model is exclusively used by a single organization?",
                answers: [
                    "Public Cloud",
                    "Private Cloud",
                    "Hybrid Cloud",
                    "Community Cloud"
                ],
                correct: 1,
                explanation: "A Private Cloud is dedicated to a single organization and offers more control over data, security, and quality of service."
            },
            {
                question: "What does 'SaaS' provide to users?",
                answers: [
                    "Hardware infrastructure",
                    "Operating systems",
                    "Ready-to-use software applications",
                    "Network components"
                ],
                correct: 2,
                explanation: "SaaS (Software as a Service) delivers fully functional software applications over the internet, ready for immediate use."
            },
            {
                question: "Which of the following is a key characteristic of cloud computing?",
                answers: [
                    "Limited internet access",
                    "On-demand self-service",
                    "Fixed pricing models",
                    "Local data storage only"
                ],
                correct: 1,
                explanation: "On-demand self-service allows users to provision computing resources automatically without requiring human interaction with service providers."
            },
            {
                question: "What is 'PaaS' primarily used for?",
                answers: [
                    "Email services",
                    "Application development and deployment",
                    "Data backup only",
                    "Network monitoring"
                ],
                correct: 1,
                explanation: "PaaS (Platform as a Service) provides a development and deployment environment for building, testing, and managing applications."
            },
            {
                question: "Which security model is shared between cloud provider and customer?",
                answers: [
                    "Customer-only responsibility",
                    "Provider-only responsibility",
                    "Shared responsibility model",
                    "No responsibility model"
                ],
                correct: 2,
                explanation: "The shared responsibility model divides security responsibilities between the cloud provider (infrastructure) and customer (data, applications)."
            },
            {
                question: "What is cloud elasticity?",
                answers: [
                    "Fixed resource allocation",
                    "Ability to quickly scale resources up or down",
                    "Limited bandwidth",
                    "Manual resource management"
                ],
                correct: 1,
                explanation: "Cloud elasticity is the ability to quickly and efficiently scale computing resources up or down based on demand changes."
            },
            {
                question: "Which of the following best describes a hybrid cloud?",
                answers: [
                    "Only public cloud services",
                    "Only private cloud services",
                    "Combination of public and private clouds",
                    "Local servers only"
                ],
                correct: 2,
                explanation: "A hybrid cloud combines public and private cloud services, allowing data and applications to be shared between them for greater flexibility."
            }
        ];

        // Game state
        let currentQuestionIndex = 0;
        let score = 0;
        let playerName = '';
        let selectedAnswer = null;
        let timeLeft = 15;
        let timerInterval = null;
        let questionAnswered = false;
        let leaderboard = [];

        // DOM elements
        const loginScreen = document.getElementById('loginScreen');
        const dashboard = document.getElementById('dashboard');
        const quizScreen = document.getElementById('quizScreen');
        const feedbackScreen = document.getElementById('feedbackScreen');
        const resultsScreen = document.getElementById('resultsScreen');

        function startQuiz() {
            playerName = document.getElementById('playerName').value.trim();
            if (!playerName) {
                alert('Please enter your name!');
                return;
            }
           
            document.getElementById('welcomeName').textContent = playerName;
            showScreen('dashboard');
        }

        function beginQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            showScreen('quizScreen');
            loadQuestion();
        }

        function showScreen(screenId) {
            document.querySelectorAll('.container > div').forEach(screen => {
                screen.classList.add('hidden');
            });
            document.getElementById(screenId).classList.remove('hidden');
        }

        function loadQuestion() {
            const question = quizData[currentQuestionIndex];
            selectedAnswer = null;
            questionAnswered = false;
            timeLeft = 15;
           
            document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
            document.getElementById('questionText').textContent = question.question;
           
            const progressPercent = ((currentQuestionIndex + 1) / quizData.length) * 100;
            document.getElementById('progressFill').style.width = progressPercent + '%';
           
            // Reset submit button
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.classList.remove('active');
           
            // Reset timer
            const timerElement = document.getElementById('timer');
            timerElement.textContent = timeLeft;
            timerElement.classList.remove('warning');
           
            const answersGrid = document.getElementById('answersGrid');
            answersGrid.innerHTML = '';
           
            question.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.textContent = answer;
                button.onclick = () => selectAnswer(index, button);
                answersGrid.appendChild(button);
            });
            
            // Hide show answers container
            document.getElementById("showAnswersContainer").classList.add("hidden");
           
            // Start timer
            startTimer();
        }

        function startTimer() {
            clearInterval(timerInterval);
           
            timerInterval = setInterval(() => {
                timeLeft--;
                const timerElement = document.getElementById('timer');
                timerElement.textContent = timeLeft;
               
                // Add warning style when time is running low
                if (timeLeft <= 5) {
                    timerElement.classList.add('warning');
                }
               
                // Time's up!
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    if (!questionAnswered) {
                        timeUp();
                    }
                }
            }, 1000);
        }

        function timeUp() {
            questionAnswered = true;
           
            // Disable all answer buttons
            document.querySelectorAll('.answer-btn').forEach((btn, index) => {
                btn.style.pointerEvents = 'none';
                if (index === quizData[currentQuestionIndex].correct) {
                    btn.classList.add('correct');
                }
            });
           
            // Disable submit button
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.classList.remove('active');
           
            // Show feedback after highlighting correct answer
            setTimeout(() => {
                showFeedback(true); // true indicates time ran out
            }, 1500);
        }

        function selectAnswer(answerIndex, buttonElement) {
            if (questionAnswered) return;
           
            selectedAnswer = answerIndex;
           
            // Remove selected class from all buttons
            document.querySelectorAll('.answer-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
           
            // Add selected class to clicked button
            buttonElement.classList.add('selected');
           
            // Enable submit button
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.classList.add('active');
        }

        function submitAnswer() {
            if (selectedAnswer === null || questionAnswered) return;
           
            questionAnswered = true;
            clearInterval(timerInterval);
           
            // Disable submit button
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.classList.remove('active');
           
            // Show feedback after a short delay
            setTimeout(() => {
                showFeedback(false); // false indicates answer was submitted
                document.getElementById("showAnswersContainer").classList.remove("hidden");
            }, 300);
        }

        function showFeedback(timeRanOut = false) {
            const question = quizData[currentQuestionIndex];
            let isCorrect = false;
           
            if (timeRanOut) {
                // Time ran out - no points awarded
                isCorrect = false;
            } else {
                // Answer was submitted
                isCorrect = selectedAnswer === question.correct;
                if (isCorrect) {
                    score++;
                }
            }
           
            // Update button colors
            document.querySelectorAll('.answer-btn').forEach((btn, index) => {
                if (index === question.correct) {
                    btn.classList.add('correct');
                } else if (index === selectedAnswer && !timeRanOut && !isCorrect) {
                    btn.classList.add('incorrect');
                }
                btn.style.pointerEvents = 'none';
            });
           
            setTimeout(() => {
                const feedbackScreen = document.getElementById('feedbackScreen');
               
                if (timeRanOut) {
                    feedbackScreen.className = 'feedback-screen feedback-incorrect';
                    document.getElementById('feedbackIcon').textContent = '⏰';
                    document.getElementById('feedbackTitle').textContent = 'Time\'s Up!';
                    document.getElementById('feedbackExplanation').textContent = 'The correct answer was: ' + question.answers[question.correct] + '. ' + question.explanation;
                } else {
                    feedbackScreen.className = `feedback-screen ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
                    document.getElementById('feedbackIcon').textContent = isCorrect ? '✅' : '❌';
                    document.getElementById('feedbackTitle').textContent = isCorrect ? 'Correct!' : 'Incorrect!';
                    document.getElementById('feedbackExplanation').textContent = question.explanation;
                }
               
                showScreen('feedbackScreen');
            }, 1500);
        }

        function nextQuestion() {
            currentQuestionIndex++;
           
            if (currentQuestionIndex < quizData.length) {
                showScreen('quizScreen');
                loadQuestion();
            } else {
                showResults();
            }
        }

        function showResults() {
            const accuracy = Math.round((score / quizData.length) * 100);
           
            document.getElementById('finalScore').textContent = `${score}/${quizData.length}`;
            document.getElementById('correctCount').textContent = score;
            document.getElementById('accuracy').textContent = accuracy;
           
            let message = '';
            if (accuracy >= 90) {
                message = '🌟 Outstanding! You\'re a cloud computing expert!';
            } else if (accuracy >= 70) {
                message = '👍 Great job! You have solid cloud knowledge!';
            } else if (accuracy >= 50) {
                message = '📖 Good effort! Keep studying to improve!';
            } else {
                message = '💪 Don\'t give up! Practice makes perfect!';
            }
           
            document.getElementById('performanceMessage').textContent = message;
            
            // Update leaderboard with current player's score
            updateLeaderboard(playerName, score);
            
            showScreen('resultsScreen');
        }

        function showLeaderboard() {
            showScreen('leaderboardScreen');
        }

        function restartQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            selectedAnswer = null;
            questionAnswered = false;
            clearInterval(timerInterval);
            showScreen('dashboard');
        }

        function updateLeaderboard(name, score) {
            leaderboard.push({ name, score });
            leaderboard.sort((a, b) => b.score - a.score);
            leaderboard = leaderboard.slice(0, 5); // Top 5

            const list = document.getElementById("leaderboardList");
            list.innerHTML = "";
            leaderboard.forEach((entry, i) => {
                const li = document.createElement("li");
                li.textContent = `${i + 1}. ${entry.name} - ${entry.score}/10`;
                list.appendChild(li);
            });
        }

        function showAllAnswers() {
            const question = quizData[currentQuestionIndex];
            const grid = document.getElementById("answersGrid");
            
            // Clear existing buttons and show all answers with correct one highlighted
            grid.innerHTML = "";
            question.answers.forEach((answer, index) => {
                const btn = document.createElement("button");
                btn.classList.add("answer-btn");
                btn.textContent = answer;
                btn.style.pointerEvents = 'none'; // Disable clicking
                
                if (index === question.correct) {
                    btn.classList.add('correct');
                }
                grid.appendChild(btn);
            });
            
            // Hide the show answers button after use
            document.getElementById("showAnswersContainer").classList.add("hidden");
        }

        // Initialize
        document.getElementById('playerName').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startQuiz();
            }
        });