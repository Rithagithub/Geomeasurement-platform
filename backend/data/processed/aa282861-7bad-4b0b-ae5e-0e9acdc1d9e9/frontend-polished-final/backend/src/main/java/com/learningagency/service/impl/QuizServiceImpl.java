package com.learningagency.service.impl;

import com.learningagency.dto.QuestionResponse;
import com.learningagency.dto.QuizResponse;
import com.learningagency.entity.Course;
import com.learningagency.entity.Question;
import com.learningagency.entity.Quiz;
import com.learningagency.repository.CourseRepository;
import com.learningagency.repository.QuestionRepository;
import com.learningagency.repository.QuizRepository;
import com.learningagency.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final QuestionRepository questionRepository;

    @Override
    public QuizResponse getQuizByCourse(Long courseId) {

        Quiz quiz = quizRepository.findByCourseId(courseId)
                .orElseGet(() -> createDefaultQuiz(courseId));

        ensureQuizHasTenQuestions(quiz);

        List<QuestionResponse> questions = quiz.getQuestions()
                .stream()
                .map(this::mapQuestion)
                .toList();

        return QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .courseTitle(quiz.getCourse().getTitle())
                .questions(questions)
                .build();

    }

    private void ensureQuizHasTenQuestions(Quiz quiz) {
        List<Question> existingQuestions = questionRepository.findByQuizId(quiz.getId());
        if (existingQuestions.size() >= 10) {
            return;
        }

        List<String> prompts = List.of(
                "Which skill is most directly improved by completing this course?",
                "What is the best way to apply the concepts from this course in practice?",
                "Why is repetition important when learning a technical skill?",
                "Which study method best supports mastery?",
                "What should you do after making a mistake in a coding or learning task?",
                "Which activity shows stronger learning progress?",
                "Why is feedback valuable in a learning journey?",
                "Which statement is most accurate about real-world learning?",
                "What helps build confidence in a technical subject?",
                "Which behavior best supports long-term growth?"
        );

        List<Question> newQuestions = new ArrayList<>();
        for (int i = 0; i < prompts.size(); i++) {
            String prompt = prompts.get(i);
            boolean alreadyExists = existingQuestions.stream()
                    .anyMatch(q -> q.getQuestion().equalsIgnoreCase(prompt));
            if (alreadyExists) {
                continue;
            }

            newQuestions.add(Question.builder()
                    .quiz(quiz)
                    .question(prompt)
                    .optionA(i % 2 == 0 ? "Applied problem solving" : "Build a small real-world project")
                    .optionB(i % 3 == 0 ? "Passive reading" : "Memorize definitions without coding")
                    .optionC(i % 2 == 0 ? "Skipping exercises" : "Only watch tutorials")
                    .optionD(i % 3 == 0 ? "Ignoring feedback" : "Avoid feedback from peers")
                    .correctAnswer("A")
                    .build());
        }

        if (!newQuestions.isEmpty()) {
            questionRepository.saveAll(newQuestions);
        }
    }

    private Quiz createDefaultQuiz(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        Quiz quiz = quizRepository.save(
                Quiz.builder()
                        .title(course.getTitle() + " Quiz")
                        .description("Check your understanding of " + course.getTitle() + ".")
                        .course(course)
                        .build()
        );

        ensureQuizHasTenQuestions(quiz);
        return quiz;
    }

    private QuestionResponse mapQuestion(Question question) {

        return QuestionResponse.builder()
                .id(question.getId())
                .question(question.getQuestion())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .build();

    }

}