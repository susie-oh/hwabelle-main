export interface OrderLike {
  id?: string;
  order_number?: string | null;
  customer_email?: string | null;
  stripe_session_id?: string | null;
  items?: any;
}

export const isAmazonOrder = (order: OrderLike | null | undefined): boolean =>
  order?.stripe_session_id?.startsWith("amz_") || false;

const KNOWN_TEST_EMAILS = [
  "ivllnv.000@gmail.com",
  "chrbxdev@gmail.com",
  "teamsienvi@gmail.com",
];

const KNOWN_TEST_ORDER_NUMBERS = [
  "HW-20260529-370977",
  "S01-0829002-9218055",
  "113-1719215-8266613",
];

export const isTestOrder = (order: OrderLike | null | undefined): boolean => {
  if (!order) return false;
  const orderNum = order.order_number || "";
  const email = (order.customer_email || "").toLowerCase();

  return (
    KNOWN_TEST_EMAILS.some((te) => email.includes(te.toLowerCase())) ||
    KNOWN_TEST_ORDER_NUMBERS.includes(orderNum) ||
    orderNum.startsWith("E2E-TEST-") ||
    orderNum.startsWith("TEST-") ||
    (order.stripe_session_id?.startsWith("test_") ?? false) ||
    (typeof order.items === "object" &&
      order.items !== null &&
      (order.items.is_test === true ||
        order.items.verify_method === "sp-api" ||
        order.items.note === "e2e test" ||
        order.items.note === "test order"))
  );
};

