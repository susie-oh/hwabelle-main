import { useState, useEffect, useCallback } from "react";
import { QUIZ_QUESTIONS } from "@/data/flowerQuizQuestions";
import { getFlowerProfile } from "@/data/flowerQuizProfiles";
import { calculateFlowerResult } from "@/lib/flower-quiz/scoring";
import {
  captureAttribution,
  type QuizAttribution,
} from "@/lib/flower-quiz/attribution";
import {
  trackQuizViewed,
  trackQuizStarted,
  trackQuestionAnswered,
  trackLeadSubmitted,
  trackQuizCompleted,
} from "@/lib/flower-quiz/analytics";
import QuizIntro from "./QuizIntro";
import QuizQuestion from "./QuizQuestion";
import QuizLeadCapture from "./QuizLeadCapture";
import QuizResult from "./QuizResult";

type QuizStep = "intro" | "questions" | "lead-capture" | "result";

const FlowerQuiz = () => {
  const [step, setStep] = useState<QuizStep>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flowerResult, setFlowerResult] = useState<string | null>(null);
  const [attribution] = useState<QuizAttribution>(() => captureAttribution());

  useEffect(() => {
    trackQuizViewed({
      source: attribution.source,
      utm_source: attribution.utmSource,
      utm_medium: attribution.utmMedium,
      utm_campaign: attribution.utmCampaign,
    });
  }, [attribution]);

  const handleStart = useCallback(() => {
    setStep("questions");
    setCurrentQuestion(0);
    trackQuizStarted({
      source: attribution.source,
      utm_source: attribution.utmSource,
      utm_medium: attribution.utmMedium,
      utm_campaign: attribution.utmCampaign,
    });
  }, [attribution]);

  const handleAnswer = useCallback(
    (answerId: string) => {
      const question = QUIZ_QUESTIONS[currentQuestion];
      const newAnswers = { ...answers, [question.id]: answerId };
      setAnswers(newAnswers);

      trackQuestionAnswered({
        question_number: currentQuestion + 1,
        source: attribution.source,
      });

      // Auto-advance after a short delay for feedback
      setTimeout(() => {
        if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
        } else {
          // Final question — calculate result and go to lead capture
          const result = calculateFlowerResult(newAnswers);
          setFlowerResult(result);
          setStep("lead-capture");
        }
      }, 300);
    },
    [currentQuestion, answers, attribution]
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else {
      setStep("intro");
    }
  }, [currentQuestion]);

  const handleLeadComplete = useCallback(() => {
    trackLeadSubmitted({
      flower_result: flowerResult || undefined,
      source: attribution.source,
    });
    trackQuizCompleted({
      flower_result: flowerResult || undefined,
      source: attribution.source,
    });
    setStep("result");
  }, [flowerResult, attribution]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, currentQuestion]);

  if (step === "intro") {
    return <QuizIntro onStart={handleStart} />;
  }

  if (step === "questions") {
    const question = QUIZ_QUESTIONS[currentQuestion];
    return (
      <QuizQuestion
        question={question}
        questionIndex={currentQuestion}
        totalQuestions={QUIZ_QUESTIONS.length}
        selectedAnswer={answers[question.id] || null}
        onAnswer={handleAnswer}
        onBack={handleBack}
        showBack={true}
      />
    );
  }

  if (step === "lead-capture" && flowerResult) {
    return (
      <QuizLeadCapture
        flowerResult={flowerResult}
        answers={answers}
        attribution={attribution}
        onComplete={handleLeadComplete}
      />
    );
  }

  if (step === "result" && flowerResult) {
    const profile = getFlowerProfile(flowerResult);
    if (profile) {
      return <QuizResult profile={profile} attribution={attribution} />;
    }
  }

  // Fallback — shouldn't happen
  return <QuizIntro onStart={handleStart} />;
};

export default FlowerQuiz;
