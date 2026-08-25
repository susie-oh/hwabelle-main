import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { getFlowerProfile } from "@/data/flowerQuizProfiles";
import { defaultKeywords } from "@/lib/site";
import FlowerTraits from "@/components/flower-quiz/FlowerTraits";
import PressingGuide from "@/components/flower-quiz/PressingGuide";
import QuizCTA from "@/components/flower-quiz/QuizCTA";
import { Button } from "@/components/ui/button";
import { Flower2 } from "lucide-react";

const FlowerQuizResult = () => {
  const { slug } = useParams<{ slug: string }>();
  const profile = slug ? getFlowerProfile(slug) : undefined;

  if (!profile) {
    return <Navigate to="/flower-quiz" replace />;
  }

  return (
    <Layout>
      <Seo
        title={`You're a ${profile.name} — Flower Personality Quiz | Hwabelle`}
        description={`${profile.shortDescription} Discover what ${profile.name} represents, pressing tips, and a personalized project idea.`}
        path={`/flower-quiz/result/${profile.slug}`}
        keywords={[
          ...defaultKeywords,
          `${profile.name.toLowerCase()} flower meaning`,
          `pressed ${profile.name.toLowerCase()}`,
          "flower personality quiz",
        ]}
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Find Your Flower", path: "/flower-quiz" },
            { name: profile.name, path: `/flower-quiz/result/${profile.slug}` },
          ]),
        ]}
      />

      <div className="min-h-[70vh] max-w-2xl mx-auto py-12 md:py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-petal-lavender/30 mb-6">
            <Flower2 size={24} strokeWidth={1.5} className="text-foreground" />
          </div>
          <p className="caption mb-4">Flower Profile</p>
          <h1 className="font-serif text-display-lg md:text-display-xl mb-4">
            {profile.name}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground italic">
            {profile.tagline}
          </p>
        </div>

        {/* Short Description */}
        <section className="mb-12">
          <p className="text-muted-foreground leading-relaxed text-lg">
            {profile.shortDescription}
          </p>
        </section>

        {/* Personality Summary */}
        <section className="mb-12">
          <h2 className="font-serif text-heading mb-4">Personality</h2>
          <p className="text-muted-foreground leading-relaxed">
            {profile.personalitySummary}
          </p>
        </section>

        {/* Traits */}
        <section className="mb-12">
          <h2 className="font-serif text-heading mb-4">Core Traits</h2>
          <FlowerTraits traits={profile.traits} />
        </section>

        {/* Symbolism */}
        <section className="mb-12">
          <h2 className="font-serif text-heading mb-4">
            What {profile.name} Represents
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {profile.symbolism}
          </p>
        </section>

        {/* Pressing Guide */}
        <section className="mb-12">
          <h2 className="font-serif text-heading mb-4">
            How {profile.name} Presses
          </h2>
          <PressingGuide profile={profile} />
        </section>

        {/* Project Idea */}
        <section className="mb-12 rounded-xl border border-border p-6 md:p-8 bg-secondary/30">
          <h2 className="font-serif text-heading mb-2">Project Idea</h2>
          <h3 className="font-serif text-xl mb-3">
            {profile.projectIdea.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {profile.projectIdea.description}
          </p>
        </section>

        {/* CTAs */}
        <section className="mb-12">
          <QuizCTA
            flowerSlug={profile.slug}
            flowerName={profile.name}
          />
        </section>

        {/* Take Quiz CTA */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-muted-foreground mb-4 mt-6">
            Want to discover your own flower personality?
          </p>
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/flower-quiz">Take the Quiz</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default FlowerQuizResult;
