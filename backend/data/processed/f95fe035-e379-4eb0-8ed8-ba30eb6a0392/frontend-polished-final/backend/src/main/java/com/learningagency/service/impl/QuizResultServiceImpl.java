package com.learningagency.service.impl;

import com.learningagency.dto.AnswerRequest;
import com.learningagency.dto.QuizSubmissionRequest;
import com.learningagency.dto.QuizSubmissionResponse;
import com.learningagency.entity.Progress;
import com.learningagency.entity.Question;
import com.learningagency.entity.Quiz;
import com.learningagency.entity.QuizResult;
import com.learningagency.entity.User;
import com.learningagency.repository.ProgressRepository;
import com.learningagency.repository.QuestionRepository;
import com.learningagency.repository.QuizRepository;
import com.learningagency.repository.QuizResultRepository;
import com.learningagency.repository.UserRepository;
import com.learningagency.service.CertificateService;
import com.learningagency.service.QuizResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class QuizResultServiceImpl implements QuizResultService {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuizResultRepository quizResultRepository;
    private final QuestionRepository questionRepository;
    private final ProgressRepository progressRepository;
    private final CertificateService certificateService;

    @Override
    public QuizSubmissionResponse submitQuiz(
            String email,
            QuizSubmissionRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        int correct = 0;

        for (AnswerRequest answer : request.getAnswers()) {

            Question question = questionRepository
                    .findById(answer.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            if (question.getCorrectAnswer()
                    .equalsIgnoreCase(answer.getSelectedOption())) {
                correct++;
            }
        }

        int total = request.getAnswers().size();
        int wrong = total - correct;

        double percentage = (correct * 100.0) / total;
        boolean passed = percentage >= 50;

        QuizResult quizResult = QuizResult.builder()
                .user(user)
                .quiz(quiz)
                .score(correct)
                .totalQuestions(total)
                .percentage(percentage)
                .passed(passed)
                .submittedAt(LocalDateTime.now())
                .build();

        quizResultRepository.save(quizResult);

        progressRepository.findByUserAndCourse(user, quiz.getCourse())
                .ifPresent(progress -> updateProgress(progress, user, quiz, passed));

        return QuizSubmissionResponse.builder()
                .correctAnswers(correct)
                .wrongAnswers(wrong)
                .totalQuestions(total)
                .percentage(percentage)
                .passed(passed)
                .build();
    }

    private void updateProgress(
            Progress progress,
            User user,
            Quiz quiz,
            boolean passed) {

        progress.setCompletion(100);
        progress.setCompletedLessons(progress.getTotalLessons());
        progress.setHoursSpent(progress.getHoursSpent() + 1);

        if (passed) {

            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());

            certificateService.generateCertificate(
                    user,
                    quiz.getCourse()
            );
        }

        progressRepository.save(progress);
    }
}