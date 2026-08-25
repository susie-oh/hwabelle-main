import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import QuizIntro from "../QuizIntro";
import QuizQuestion from "../QuizQuestion";
import QuizAnswerCard from "../QuizAnswerCard";
import FlowerTraits from "../FlowerTraits";
import PressingGuide from "../PressingGuide";
import QuizCTA from "../QuizCTA";
import QuizProgress from "../QuizProgress";
import { QUIZ_QUESTIONS } from "@/data/flowerQuizQuestions";
import { FLOWER_PROFILES } from "@/data/flowerQuizProfiles";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("QuizIntro", () => {
  it("renders the start button", () => {
    render(<QuizIntro onStart={() => {}} />, { wrapper });
    expect(screen.getByText("Discover My Flower")).toBeDefined();
  });

  it("calls onStart when button is clicked", () => {
    let started = false;
    render(<QuizIntro onStart={() => { started = true; }} />, { wrapper });
    fireEvent.click(screen.getByText("Discover My Flower"));
    expect(started).toBe(true);
  });
});

describe("QuizProgress", () => {
  it("shows correct question count", () => {
    render(<QuizProgress current={3} total={7} />);
    expect(screen.getByText("Question 3 of 7")).toBeDefined();
  });
});

describe("QuizQuestion", () => {
  const question = QUIZ_QUESTIONS[0];

  it("renders the question text", () => {
    render(
      <QuizQuestion
        question={question}
        questionIndex={0}
        totalQuestions={7}
        selectedAnswer={null}
        onAnswer={() => {}}
        onBack={() => {}}
        showBack={false}
      />
    );
    expect(screen.getByText(question.question)).toBeDefined();
  });

  it("renders all four answers", () => {
    render(
      <QuizQuestion
        question={question}
        questionIndex={0}
        totalQuestions={7}
        selectedAnswer={null}
        onAnswer={() => {}}
        onBack={() => {}}
        showBack={false}
      />
    );
    for (const answer of question.answers) {
      expect(screen.getByText(answer.text)).toBeDefined();
    }
  });

  it("shows back button when showBack is true", () => {
    render(
      <QuizQuestion
        question={question}
        questionIndex={1}
        totalQuestions={7}
        selectedAnswer={null}
        onAnswer={() => {}}
        onBack={() => {}}
        showBack={true}
      />
    );
    expect(screen.getByText("Back")).toBeDefined();
  });
});

describe("QuizAnswerCard", () => {
  it("calls onSelect when clicked", () => {
    let selected = false;
    render(
      <QuizAnswerCard
        id="test-a"
        text="Test answer"
        isSelected={false}
        onSelect={() => { selected = true; }}
      />
    );
    fireEvent.click(screen.getByText("Test answer"));
    expect(selected).toBe(true);
  });

  it("reflects selected state via aria-checked", () => {
    render(
      <QuizAnswerCard
        id="test-a"
        text="Test answer"
        isSelected={true}
        onSelect={() => {}}
      />
    );
    const button = screen.getByRole("radio");
    expect(button.getAttribute("aria-checked")).toBe("true");
  });
});

describe("FlowerTraits", () => {
  it("renders all provided traits", () => {
    const traits = ["Calm", "Thoughtful", "Creative"];
    render(<FlowerTraits traits={traits} />);
    for (const trait of traits) {
      expect(screen.getByText(trait)).toBeDefined();
    }
  });
});

describe("PressingGuide", () => {
  const profile = FLOWER_PROFILES.lavender;

  it("shows pressing difficulty", () => {
    render(<PressingGuide profile={profile} />);
    expect(screen.getByText(profile.pressingSuitability)).toBeDefined();
  });

  it("shows pressing tips", () => {
    render(<PressingGuide profile={profile} />);
    for (const tip of profile.pressingTips) {
      expect(screen.getByText(tip)).toBeDefined();
    }
  });
});

describe("QuizCTA", () => {
  it("renders AI Designer and Shop links", () => {
    render(
      <QuizCTA
        flowerSlug="lavender"
        flowerName="Lavender"
      />,
      { wrapper }
    );
    const links = screen.getAllByRole("link");
    const aiLink = links.find((l) => l.getAttribute("href")?.includes("/designer"));
    const shopLink = links.find((l) => l.getAttribute("href")?.includes("/product/"));
    expect(aiLink).toBeDefined();
    expect(shopLink).toBeDefined();
  });

  it("AI Designer link contains correct flower param", () => {
    render(
      <QuizCTA
        flowerSlug="rose"
        flowerName="Rose"
      />,
      { wrapper }
    );
    const links = screen.getAllByRole("link");
    const aiLink = links.find((l) => l.getAttribute("href")?.includes("/designer"));
    expect(aiLink?.getAttribute("href")).toContain("flower=rose");
    expect(aiLink?.getAttribute("href")).toContain("source=flower-quiz");
  });
});
