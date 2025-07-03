import {AnimationObject} from 'lottie-react-native';

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  textKey: string; // Use a key for translations
  textHeader?: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require("../assets/images/animations/First.json"),
    textKey: "onboarding.track_tickets",
    textHeader: "onboarding.track_tickets_header",
    textColor: "black",
    backgroundColor: "white",
  },
  {
    id: 2,
    animation: require("../assets/images/animations/Second.json"),
    textKey: "onboarding.seal_deals",
    textHeader: "onboarding.seal_deals_header",
    textColor: "black",
    backgroundColor: "white",
  },
  {
    id: 3,
    animation: require("../assets/images/animations/Third.json"),
    textKey: "onboarding.earn_rewards",
    textHeader: "onboarding.earn_rewards_header",
    textColor: "black",
    backgroundColor: "white",
  },
  {
    id: 4,
    animation: require("../assets/images/animations/Fourth.json"),
    textKey: "onboarding.everything",
    textHeader: "onboarding.everything_header",
    textColor: "black",
    backgroundColor: "white",
  },
];

export default data;
