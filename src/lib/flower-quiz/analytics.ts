/**
 * Quiz-specific analytics events using the existing GA4 gtag integration.
 * Never sends email addresses or PII to analytics.
 */

type QuizEventProperties = {
  source?: string | null;
  flower_result?: string;
  question_number?: number;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
};

function trackEvent(eventName: string, properties?: QuizEventProperties) {
  if (typeof window !== "undefined" && window.gtag) {
    // Clean null values to undefined for gtag
    const cleanProps: Record<string, string | number | undefined> = {};
    if (properties) {
      for (const [key, value] of Object.entries(properties)) {
        cleanProps[key] = value ?? undefined;
      }
    }
    window.gtag("event", eventName, cleanProps);
  }
}

export function trackQuizViewed(props?: QuizEventProperties) {
  trackEvent("flower_quiz_viewed", props);
}

export function trackQuizStarted(props?: QuizEventProperties) {
  trackEvent("flower_quiz_started", props);
}

export function trackQuestionAnswered(props?: QuizEventProperties) {
  trackEvent("flower_quiz_question_answered", props);
}

export function trackLeadSubmitted(props?: QuizEventProperties) {
  trackEvent("flower_quiz_lead_submitted", props);
}

export function trackQuizCompleted(props?: QuizEventProperties) {
  trackEvent("flower_quiz_completed", props);
}

export function trackAIDesignerClicked(props?: QuizEventProperties) {
  trackEvent("flower_quiz_ai_designer_clicked", props);
}

export function trackShopClicked(props?: QuizEventProperties) {
  trackEvent("flower_quiz_shop_clicked", props);
}
