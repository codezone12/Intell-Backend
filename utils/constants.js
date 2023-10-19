export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]+$/;

export const USER_TYPES = { 0: "Admin", 1: "User" };
export const PLAN_TYPES = { 0: "free", 1: "premium", 2: "vip" };
export const PLAN_CATEGORY = { 0: "discount", 1: "regular" };

export const ALL_PACKAGES = [
  {
    id: 0,
    type: "Basic",
    price: "Free",
    name: "",
    description:
      "Join our free Telegram channel for daily crypto signals and market insights. ",
    numOfDays: 30,
    numOfSignals: 1,
    features: [
      "1 Free Signal per day",
      "Perfect for beginners and those looking to dip their toes into crypto trading."
    ]
  },
  {
    id: 1,
    type: "Premium",
    price: 49,
    name: "Month",
    description:
    "Unlock exclusive crypto signals and expert analysis in our premium channel.",
    numOfDays: 30,
    numOfSignals: 5,
    features: [
      "5 Signals per day",
      "Access to Premium signals.",
      "Opportunity to diversify your portfolio Ideal for traders seeking more signals and a competitive edge."
    ]
  },
  {
    id: 2,
    type: "VIP",
    price: 99,
    name: "Month",
    description:
      "Experience unlimited elite crypto signals and personalized coaching in our VIP Telegram channel.",
    numOfDays: 30,
    numOfSignals: null,
    features: [
      "Unlimited Signals",
      "One-to-One Coaching (up to 1 hour)",
      "Custom Crypto Research Reports on Demand",
      "For serious traders wanting maximum insights, personalized guidance, and research expertise."
    ]
  },
  {
    id: 3,
    type: "Premium",
    price: 129,
    name: "3 Months",
    description:
      "Get premium crypto signals and in-depth analysis for 3 months at a special discounted rate.",
    numOfDays: 30,
    numOfSignals: 90,
    features: [
      "All benefits of Monthly Premium package",
      "Discounted rate for 3 months",
      "A cost-effective choice for extended premium access and savings."
    ]
  },
  {
    id: 4,
    type: "VIP",
    price: 249,
    name: "3 Months",
    description:
      "Enjoy unlimited high-quality crypto signals and personalized coaching at an exclusive discounted price.",
    numOfDays: 30,
    numOfSignals: null,
    features: [
      "All benefits of Monthly VIP package",
      "Discounted rate for 3 months",
      "Premium features at a reduced rate for traders committed to growth."
    ]
  }
];
