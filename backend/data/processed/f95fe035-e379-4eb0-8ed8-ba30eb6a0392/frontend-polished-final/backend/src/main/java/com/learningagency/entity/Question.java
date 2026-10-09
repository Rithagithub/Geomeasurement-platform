package com.learningagency.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @Column(length = 1000)
    private String question;

    private String optionA;

    private String optionB;

    private String optionC;

    private String optionD;

    /*
     * Stores only:
     * A
     * B
     * C
     * D
     */

    private String correctAnswer;

}