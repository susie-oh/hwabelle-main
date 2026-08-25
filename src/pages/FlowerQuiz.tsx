import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import FlowerQuiz from "@/components/flower-quiz/FlowerQuiz";
import { defaultKeywords } from "@/lib/site";

const FlowerQuizPage = () => {
  return (
    <Layout showPetals={false}>
      <Seo
        title="Flower Personality Quiz: What's Your Flower? | Hwabelle"
        description="Take a quick personality quiz to discover your signature flower, what it represents, pressing tips, and a personalized pressed-flower project idea."
        path="/flower-quiz"
        keywords={[
          ...defaultKeywords,
          "flower personality quiz",
          "flower quiz",
          "what flower am I",
          "pressed flower project ideas",
        ]}
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Find Your Flower", path: "/flower-quiz" },
          ]),
        ]}
      />
      <div className="min-h-[70vh]">
        <FlowerQuiz />
      </div>
    </Layout>
  );
};

export default FlowerQuizPage;
