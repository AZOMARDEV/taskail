import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { InitOptions } from "i18next";
import i18n from "i18next";

const FALLBACK_LANGUAGE = "en";

const resources = {
  en: {
    translation: {
      onboarding: {
        track_tickets:
          "Easily track your journey with our digital tickets, reliability and peace of mind and create unforgettable memories with us.",
        seal_deals:
          "Seal your deals instantly and effortlessly from the comfort of your home using our secure and convenient digital contracts.",
        earn_rewards:
          "Earn points, receive exciting rewards, and level up to unlock even more exclusive features and opportunities.",
        track_tickets_header: "Project Planning App for Everyone",
        seal_deals_header: "Organize Your Task & Projects Easily",
        earn_rewards_header: "Get Rewarded for Your Hard Work",
        everything: "Don't miss out the opportunity, login now or sign up to get started, it's not going to take long, we promise.",
        everything_header: "Everything You Can Do in this App",
      },
      login: {
        get_started: "Get Started",
        login: "Login",
        dont_have_account: "Don't have an account?",
        sign_up: "Sign up",
      },
      almost_there: "Almost there",
      bottom_sheet_debugger: "Debug Settings",
      loading: "Loading...",
      sign_in: {
        Welcome_back: "Welcome Back!",
        Hello_there: "Hello there, welcome back to your account.",
        If_you_have_an_account:
          "If you have an account, sign in with your email.",
        Email: "Email",
        Enter_Your_Email: "Enter Your Email",
        Password: "Password",
        Enter_Your_Password: "Enter Your Password",
        Sign_in: "Sign in",
        Create_Account: "Create Account",
        Please_fill_all_fields: "Please fill all fields",
        return_to_login: "Return to login",
      },
      sign_up: {
        Create_Account: "Create Account",
        Create_an_account_to_get_started:
          "Create an account to get started with us now.",
        It_s_quick_and_easy: "What are you waiting for? It's quick and easy.",
        Full_Name: "Full Name",
        Enter_Your_Full_Name: "Enter Your Full Name",
        Email: "Email",
        Enter_Your_Email: "Enter Your Email",
        Password: "Password",
        Enter_Your_Password: "Enter Your Password",
        Create_New_Account: "Create New Account",
        sign_in: "Sign in",
        Please_fill_all_fields: "Please fill all fields",
        return_to_login: "Return to login",
      },
    },
  },
  // fr: {
  //   translation: {
  //     onboarding: {
  //       track_tickets:
  //         "Suivez facilement votre voyage avec nos billets numériques, fiabilité et tranquillité d'esprit et créez des souvenirs inoubliables avec nous.",
  //       seal_deals:
  //         "Scellez vos accords instantanément et sans effort depuis le confort de votre maison en utilisant nos contrats numériques sécurisés et pratiques.",
  //       earn_rewards:
  //         "Gagnez des points, recevez des récompenses passionnantes et montez de niveau pour débloquer encore plus de fonctionnalités exclusives.",
  //       track_tickets_header:
  //         "Application de planification de projet pour tous",
  //       seal_deals_header: "Organisez vos tâches et projets facilement",
  //       earn_rewards_header: "Soyez récompensé pour votre travail acharné",
  //       everything: "Ne manquez pas l'opportunité, connectez-vous maintenant ou inscrivez-vous pour commencer, cela ne prendra pas longtemps, nous vous le promettons.",
  //       everything_header: "Tout ce que vous pouvez faire dans cette application",
  //     },
  //     login: {
  //       get_started: "Commencez",
  //       login: "Connexion",
  //       dont_have_account: "Vous n’avez pas de compte?",
  //       sign_up: "S'inscrire",
  //     },
  //     almost_there: "Presque là",
  //     bottom_sheet_debugger: "Paramètres de débogage",
  //     loading: "Chargement...",
  //     sign_in: {
  //       Welcome_back: "Re-bienvenue!",
  //       Hello_there: "Bonjour, bienvenue de retour sur votre compte.",
  //       If_you_have_an_account:
  //         "Si vous avez un compte, connectez-vous avec votre e-mail.",
  //       Email: "Email",
  //       Enter_Your_Email: "Entrez votre e-mail",
  //       Password: "Mot de passe",
  //       Enter_Your_Password: "Entrez votre mot de passe",
  //       Sign_in: "Se connecter",
  //       Create_Account: "Créer un compte",
  //       Please_fill_all_fields: "Veuillez remplir tous les champs",
  //       return_to_login: "Retour à la connexion",
  //     },
  //     sign_up: {
  //       Create_Account: "Créer un compte",
  //       Create_an_account_to_get_started:
  //         "Créez un compte pour commencer avec nous maintenant.",
  //       It_s_quick_and_easy: "Qu'attendez-vous? C'est rapide et facile.",
  //       Full_Name: "Nom complet",
  //       Enter_Your_Full_Name: "Entrez votre nom complet",
  //       Email: "Email",
  //       Enter_Your_Email: "Entrez votre e-mail",
  //       Password: "Mot de passe",
  //       Enter_Your_Password: "Entrez votre mot de passe",
  //       Create_New_Account: "Créer un compte",
  //       sign_in: "Se connecter",
  //       Please_fill_all_fields: "Veuillez remplir tous les champs",
  //       return_to_login: "Retour à la connexion",
  //     },
  //   },
  // },
  // ar: {
  //   translation: {
  //     onboarding: {
  //       track_tickets: "تتبع بتذاكر رقمية وكن مرتاحًا مع رحلتك معنا.",
  //       seal_deals: "أبرم صفقاتك على الفور دون مغادرة منزلك بعقود رقمية.",
  //       earn_rewards:
  //         "اكسب نقاطًا، واحصل على مكافآت وارتقِ لتفتح المزيد من الميزات المثيرة.",
  //       track_tickets_header: "تطبيق تخطيط المشروع للجميع",
  //       seal_deals_header: "نظم مهامك ومشاريعك بسهولة",
  //       earn_rewards_header: "احصل على مكافأة لجهودك الجادة",
  //     },
  //     login: {
  //       get_started: "إبدأ الآن",
  //       login: "تسجيل الدخول",
  //       dont_have_account: "ليس لديك حساب؟",
  //       sign_up: "سجل الآن",
  //     },
  //     almost_there: "فقط القليل",
  //     bottom_sheet_debugger: "إعدادات التصحيح",
  //     loading: "جار التحميل...",
  //     sign_in: {
  //       Welcome_back: "مرحبًا مجددًا!",
  //       Hello_there: "مرحبًا بك مرة أخرى في حسابك.",
  //       If_you_have_an_account:
  //         "إذا كان لديك حساب، قم بتسجيل الدخول باستخدام بريدك الإلكتروني.",
  //       Email: "البريد الإلكتروني",
  //       Enter_Your_Email: "أدخل بريدك الإلكتروني",
  //       Password: "كلمة المرور",
  //       Enter_Your_Password: "أدخل كلمة المرور",
  //       Sign_in: "تسجيل الدخول",
  //       Create_Account: "إنشاء حساب",
  //       Please_fill_all_fields: "يرجى ملء جميع الحقول",
  //       return_to_login: "العودة إلى تسجيل الدخول",
  //     },
  //     sign_up: {
  //       Create_Account: "إنشاء حساب",
  //       Create_an_account_to_get_started:
  //         "ماذا تنتظر؟ لن يستغرق الأمر وقتًا طويلاً.",
  //       It_s_quick_and_easy: "أنشئ حسابًا جديدًا للبدء معنا الآن.",
  //       Full_Name: "الإسم الكامل",
  //       Enter_Your_Full_Name: "أدخل اسمك الكامل",
  //       Email: "البريد الإلكتروني",
  //       Enter_Your_Email: "أدخل بريدك الإلكتروني",
  //       Password: "كلمة المرور",
  //       Enter_Your_Password: "أدخل كلمة المرور",
  //       Create_New_Account: "إنشاء حساب",
  //       sign_in: "تسجيل الدخول",
  //       Please_fill_all_fields: "يرجى ملء جميع الحقول",
  //       return_to_login: "العودة إلى تسجيل الدخول",
  //     },
  //   },
  // },
};

// Get system language
const getSystemLanguage = (): string => {
  const locales = Localization.getLocales();
  return locales?.[0]?.languageCode || "en"; // Default fallback to English
};

export const initializeI18n = async () => {
  try {
    const options: InitOptions = {
      fallbackLng: FALLBACK_LANGUAGE,
      lng: FALLBACK_LANGUAGE,
      resources,
      interpolation: {
        escapeValue: false,
      },
      compatibilityJSON: "v4",
      initImmediate: false,
      react: {
        useSuspense: false,
      },
    };

    console.log("Initializing i18n...");
    await i18next.use(initReactI18next).init(options);

    // Load stored language or default to system language
    const storedLanguage = await AsyncStorage.getItem("appLanguage");
    const deviceLanguage = getSystemLanguage();
    const finalLanguage = storedLanguage || deviceLanguage || FALLBACK_LANGUAGE;

    console.log(`Setting language to: ${finalLanguage}`);
    await i18next.changeLanguage(finalLanguage);
    console.log("i18n initialization complete.");
  } catch (error) {
    console.error("i18n initialization error:", error);
    throw error; // Throw the error to halt app loading if necessary
  }
};

export const setLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem("appLanguage", language);
    await i18next.changeLanguage(language);
  } catch (error) {
    console.error("Language change error:", error);
  }
};

// Initialize immediately
initializeI18n();

export default i18next;
