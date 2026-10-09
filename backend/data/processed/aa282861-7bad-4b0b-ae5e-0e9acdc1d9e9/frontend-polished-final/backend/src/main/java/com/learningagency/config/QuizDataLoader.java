package com.learningagency.config;

import com.learningagency.entity.Course;
import com.learningagency.entity.Question;
import com.learningagency.entity.Quiz;
import com.learningagency.repository.CourseRepository;
import com.learningagency.repository.QuestionRepository;
import com.learningagency.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class QuizDataLoader implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    @Override
    public void run(String... args) {

        List<Course> courses = courseRepository.findAll();

        if (courses.isEmpty()) {
            System.out.println("No courses found. Quiz data not loaded.");
            return;
        }

        for (Course course : courses) {
            Quiz quiz = quizRepository.findByCourseId(course.getId())
                    .orElseGet(() -> quizRepository.save(
                            Quiz.builder()
                                    .title(course.getTitle() + " Quiz")
                                    .description("Test your understanding of " + course.getTitle() + ".")
                                    .course(course)
                                    .build()
                    ));

            List<Question> existingQuestions = questionRepository.findByQuizId(quiz.getId());
            if (existingQuestions.size() >= 10) {
                continue;
            }

            List<Question> questionsToAdd = new ArrayList<>();
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

            for (int i = 0; i < prompts.size(); i++) {
                String prompt = prompts.get(i);
                boolean alreadyExists = existingQuestions.stream()
                        .anyMatch(q -> q.getQuestion().equalsIgnoreCase(prompt));

                if (alreadyExists) {
                    continue;
                }

                questionsToAdd.add(Question.builder()
                        .quiz(quiz)
                        .question(prompt)
                        .optionA(i % 2 == 0 ? "Applied problem solving" : "Build a small real-world project")
                        .optionB(i % 3 == 0 ? "Passive reading" : "Memorize definitions without coding")
                        .optionC(i % 2 == 0 ? "Skipping exercises" : "Only watch tutorials")
                        .optionD(i % 3 == 0 ? "Ignoring feedback" : "Avoid feedback from peers")
                        .correctAnswer("A")
                        .build());
            }

            if (!questionsToAdd.isEmpty()) {
                questionRepository.saveAll(questionsToAdd);
            }
        }

        System.out.println("==================================");
        System.out.println("Course quizzes loaded successfully for all courses");
        System.out.println("Total courses: " + courses.size());
        System.out.println("==================================");
    }
}