package com.learningagency.analytics;

import com.learningagency.analytics.dto.AgencyMetrics;
import com.learningagency.analytics.service.LearningAgencyScoreService;
import com.learningagency.entity.Progress;
import com.learningagency.entity.QuizResult;
import com.learningagency.entity.User;
import com.learningagency.repository.ProgressRepository;
import com.learningagency.repository.QuizResultRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LearningAgencyScoreServiceTest {

    @Test
    void calculateUsesRealProgressAndQuizResults() {
        ProgressRepository progressRepository = mock(ProgressRepository.class);
        QuizResultRepository quizResultRepository = mock(QuizResultRepository.class);

        User user = User.builder()
                .id(1L)
                .fullName("Alex")
                .email("alex@example.com")
                .password("secret")
                .role("student")
                .build();

        when(progressRepository.findByUser(user)).thenReturn(List.of(
                progress(user, 85, 2.5),
                progress(user, 100, 4.0),
                progress(user, 60, 1.5)
        ));

        when(quizResultRepository.findByUser(user)).thenReturn(List.of(
                quizResult(90.0),
                quizResult(75.0),
                quizResult(60.0)
        ));

        LearningAgencyScoreService service = new LearningAgencyScoreService(progressRepository, quizResultRepository);

        AgencyMetrics metrics = service.calculate(user);

        assertThat(metrics.getQuizScore()).isEqualTo(75.0);
        assertThat(metrics.getCompletionScore()).isCloseTo(81.6666666667, org.assertj.core.data.Offset.offset(0.01));
        assertThat(metrics.getAgencyScore()).isGreaterThan(70.0);
        assertThat(metrics.getImprovement()).isNotEqualTo(4.0);
    }

    private Progress progress(User user, int completion, double hoursSpent) {
        Progress p = new Progress();
        p.setUser(user);
        p.setCompletion(completion);
        p.setHoursSpent(hoursSpent);
        p.setCompletedLessons(completion >= 100 ? 10 : 4);
        p.setTotalLessons(10);
        p.setCompleted(completion >= 100);
        return p;
    }

    private QuizResult quizResult(double percentage) {
        QuizResult q = new QuizResult();
        q.setPercentage(percentage);
        q.setScore((int) Math.round(percentage));
        q.setTotalQuestions(10);
        q.setPassed(percentage >= 60);
        return q;
    }
}
