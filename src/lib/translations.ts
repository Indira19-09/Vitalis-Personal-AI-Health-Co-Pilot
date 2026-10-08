export type Language = "en" | "hi" | "te";
export const LANGUAGE_STORAGE_KEY = "vitalis-language";
export const LOCALES: Record<Language, string> = { en: "en-IN", hi: "hi-IN", te: "te-IN" };
export function isLanguage(value: unknown): value is Language { return value === "en" || value === "hi" || value === "te"; }
export const translations: Record<string, Record<"hi" | "te", string>> = {
  "Language": {
    "hi": "भाषा",
    "te": "భాష"
  },
  "Dashboard": {
    "hi": "डैशबोर्ड",
    "te": "డ్యాష్‌బోర్డ్"
  },
  "AI Copilot": {
    "hi": "AI सहायक",
    "te": "AI సహాయకుడు"
  },
  "Timeline": {
    "hi": "समयरेखा",
    "te": "కాలక్రమం"
  },
  "Medications": {
    "hi": "दवाइयाँ",
    "te": "మందులు"
  },
  "Appointments": {
    "hi": "अपॉइंटमेंट",
    "te": "అపాయింట్‌మెంట్లు"
  },
  "Health Records": {
    "hi": "स्वास्थ्य रिकॉर्ड",
    "te": "ఆరోగ్య రికార్డులు"
  },
  "Sign out": {
    "hi": "साइन आउट",
    "te": "సైన్ అవుట్"
  },
  "Sign in": {
    "hi": "साइन इन",
    "te": "సైన్ ఇన్"
  },
  "Get started": {
    "hi": "शुरू करें",
    "te": "ప్రారంభించండి"
  },
  "AI-powered personal health copilot": {
    "hi": "AI आधारित व्यक्तिगत स्वास्थ्य सहायक",
    "te": "AI ఆధారిత వ్యక్తిగత ఆరోగ్య సహాయకుడు"
  },
  "Your health journey,": {
    "hi": "आपकी स्वास्थ्य यात्रा,",
    "te": "మీ ఆరోగ్య ప్రయాణం,"
  },
  "finally in one place": {
    "hi": "अब एक ही जगह",
    "te": "ఇప్పుడు ఒకే చోట"
  },
  "Vitalis helps you understand, organize, and manage your healthcare — an AI copilot that knows your medications, appointments, records, and vitals, and answers in plain language.": {
    "hi": "Vitalis आपकी स्वास्थ्य देखभाल को समझने और व्यवस्थित करने में मदद करता है — आपका AI सहायक आपकी दवाइयों, अपॉइंटमेंट, रिकॉर्ड और स्वास्थ्य मापों के आधार पर सरल भाषा में जवाब देता है।",
    "te": "Vitalis మీ ఆరోగ్య సంరక్షణను అర్థం చేసుకోవడానికి, నిర్వహించడానికి సహాయపడుతుంది — మీ మందులు, అపాయింట్‌మెంట్లు, రికార్డులు, ఆరోగ్య కొలతల ఆధారంగా AI సహాయకుడు సరళమైన భాషలో సమాధానాలు ఇస్తాడు."
  },
  "Start free →": {
    "hi": "मुफ़्त शुरू करें →",
    "te": "ఉచితంగా ప్రారంభించండి →"
  },
  "See features": {
    "hi": "सुविधाएँ देखें",
    "te": "సదుపాయాలు చూడండి"
  },
  "Everything your health needs": {
    "hi": "आपके स्वास्थ्य के लिए सब कुछ",
    "te": "మీ ఆరోగ్యానికి కావాల్సినవన్నీ"
  },
  "Built for patients, caregivers, and anyone managing a complex healthcare journey.": {
    "hi": "मरीज़ों, देखभाल करने वालों और स्वास्थ्य देखभाल का प्रबंधन करने वाले सभी लोगों के लिए।",
    "te": "రోగులు, సంరక్షకులు, ఆరోగ్య సంరక్షణను నిర్వహించే అందరి కోసం."
  },
  "Take control of your health today": {
    "hi": "आज ही अपने स्वास्थ्य की ज़िम्मेदारी लें",
    "te": "ఈ రోజే మీ ఆరోగ్యాన్ని మీ చేతుల్లోకి తీసుకోండి"
  },
  "Sign up in seconds and let your AI copilot organize the rest.": {
    "hi": "कुछ ही सेकंड में खाता बनाएँ और बाकी व्यवस्था अपने AI सहायक को सौंपें।",
    "te": "క్షణాల్లో ఖాతా తెరవండి, మిగతావి మీ AI సహాయకుడు నిర్వహిస్తాడు."
  },
  "Create your account": {
    "hi": "अपना खाता बनाएँ",
    "te": "మీ ఖాతాను సృష్టించండి"
  },
  "Your AI-powered personal health copilot — medications, appointments, records and vitals in one place.": {
    "hi": "आपका AI स्वास्थ्य सहायक — दवाइयाँ, अपॉइंटमेंट, रिकॉर्ड और स्वास्थ्य माप एक ही जगह।",
    "te": "మీ AI ఆరోగ్య సహాయకుడు — మందులు, అపాయింట్‌మెంట్లు, రికార్డులు, ఆరోగ్య కొలతల అనీ ఒకే చోట."
  },
  "Contact support": {
    "hi": "सहायता के लिए संपर्क करें",
    "te": "సహాయం కోసం సంప్రదించండి"
  },
  "Need help? Click any email below to write to our team.": {
    "hi": "मदद चاهिए? हमारी टीम को लिखनके लिए नीचे कभी भे ईमेल पर क्लिक करेँ।",
    "te": "సహాయం కావాలా? మా బృందానికి రాయడానికి క్రింద ఉన్న ఏదైనా ఇమెయిల్‌పై క్లిక్ చేయండి."
  },
  "All rights reserved.": {
    "hi": "सभे अधिकार सनरक्षित।",
    "te": "అన్ని హక్కులు రక్షించబడ్డాయి."
  },
  "Built for HacXLerate 2026 · Challenge 01": {
    "hi": "HacXLerate 2026 के लिए · चैलेंज 01",
    "te": "HacXLerate 2026 కోసం · ఛాలెంజ్ 01"
  },
  "AI Health Copilot": {
    "hi": "AI स्वास्थ्य सहायक",
    "te": "AI ఆరోగ్య సహాయకుడు"
  },
  "Medication Tracking": {
    "hi": "दवाइयों की निगरानी",
    "te": "మందుల పర్యవేక్షణ"
  },
  "Chat with an AI that knows your medications, vitals, and records — get plain-language answers about your health.": {
    "hi": "आपकी दवाइयों, स्वास्थ्य मापों और रिकॉर्ड को जानने वाले AI से सरल भाषा में जवाब पाएँ।",
    "te": "మీ మందులు, ఆరోగ్య కొలతలు, రికార్డులు తెలిసిన AIతో మాట్లాడి సరళమైన సమాధానాలు పొందండి."
  },
  "Keep every prescription organized with dosage, frequency, and schedules in one place.": {
    "hi": "दवाइयों की मात्रा, आवृत्ति और समय एक ही जगह व्यवस्थित रखें।",
    "te": "మందుల మోతాదు, ఎంత తరచుగా, ఎప్పుడు తీసుకోవాలో ఒకే చోట నిర్వహించండి."
  },
  "Never miss a doctor visit. Track upcoming appointments with specialties, locations, and reasons.": {
    "hi": "डॉक्टर की मुलाक़ात न भूलें। आगामी अपॉइंटमेंट की विशेषज्ञता, स्थान और कारण देखें।",
    "te": "డాక్టర్‌ను కలవడం మర్చిపోవద్దు. రాబోయే అపాయింట్‌మెంట్ల వివరాలు ఒకే చోట చూడండి."
  },
  "Store lab reports, prescriptions, and scan summaries — organized and searchable.": {
    "hi": "लैब रिपोर्ट, पर्चे और स्कैन सारांश व्यवस्थित रखें और खोजें।",
    "te": "ల్యాబ్ నివేదికలు, ప్రిస్క్రిప్షన్లు, స్కాన్ సారాంశాలు భద్రపరచి వెతకండి."
  },
  "Vitals Dashboard": {
    "hi": "स्वास्थ्य माप डैशबोर्ड",
    "te": "ఆరోగ్య కొలతల డ్యాష్‌బోర్డ్"
  },
  "Log blood pressure, heart rate, weight, glucose and more — visualize trends over time.": {
    "hi": "रक्तचाप, हृदय गति, वज़न, ग्लूकोज़ और अन्य माप दर्ज करें और बदलाव देखें।",
    "te": "రక్తపోటు, గుండె వేగం, బరువు, గ్లూకోజ్ తదితర కొలతలను నమోదు చేసి మార్పులను చూడండి."
  },
  "Private by Design": {
    "hi": "गोपनीयता हमारी प्राथमिकता",
    "te": "గోప్యతకు ప్రాధాన్యం"
  },
  "Your health data is encrypted and visible only to you, secured with row-level access control.": {
    "hi": "आपका स्वास्थ्य डेटा एन्क्रिप्टेड है और केवल आपको दिखाई देता है।",
    "te": "మీ ఆరోగ్య సమాచారం ఎన్‌క్రిప్ట్ చేయబడుతుంది, మీకు మాత్రమే కనిపిస్తుంది."
  },
  "Welcome back": {
    "hi": "वापस स्वागत है",
    "te": "తిరిగి స్వాగతం"
  },
  "Sign in to your health copilot": {
    "hi": "अपने स्वास्थ्य सहायक में साइन इन करें",
    "te": "మీ ఆరోగ్య సహాయకుడిలో సైన్ ఇన్ చేయండి"
  },
  "Start managing your health journey": {
    "hi": "अपनी स्वास्थ्य यात्रा का प्रबंधन शुरू करें",
    "te": "మీ ఆరోగ్య ప్రయాణాన్ని నిర్వహించడం ప్రారంభించండి"
  },
  "Continue with Google": {
    "hi": "Google के साथ जारी रखें",
    "te": "Googleతో కొనసాగించండి"
  },
  "or": {
    "hi": "या",
    "te": "లేదా"
  },
  "Full name": {
    "hi": "पूरा नाम",
    "te": "పూర్తి పేరు"
  },
  "Priya Sharma": {
    "hi": "प्रिया शर्मा",
    "te": "ప్రియా శర్మ"
  },
  "Email": {
    "hi": "ईमेल",
    "te": "ఇమెయిల్"
  },
  "Enter password": {
    "hi": "पासवर्ड दर्ज करें",
    "te": "పాస్‌వర్డ్ నమోదు చేయండి"
  },
  "Password": {
    "hi": "पासवर्ड",
    "te": "పాస్‌వర్డ్"
  },
  "Confirm password": {
    "hi": "पासवर्ड की पुष्टि करें",
    "te": "పాస్‌వర్డ్ నిర్ధారించండి"
  },
  "Passwords match": {
    "hi": "पासवर्ड मेल खाते हैं",
    "te": "పాస్‌వర్డ్‌లు సరిపోలాయి"
  },
  "Passwords do not match": {
    "hi": "पासवर्ड मेल नहीं खाते",
    "te": "పాస్‌వర్డ్‌లు సరిపోలలేదు"
  },
  "Create account": {
    "hi": "खाता बनाएँ",
    "te": "ఖాతా సృష్టించండి"
  },
  "New to Vitalis?": {
    "hi": "Vitalis पर नए हैं?",
    "te": "Vitalisకు కొత్తవారా?"
  },
  "Already have an account?": {
    "hi": "पहले से खाता है?",
    "te": "ఇప్పటికే ఖాతా ఉందా?"
  },
  "Create an account": {
    "hi": "नया खाता बनाएँ",
    "te": "కొత్త ఖాతా సృష్టించండి"
  },
  "Show password": {
    "hi": "पासवर्ड दिखाएँ",
    "te": "పాస్‌వర్డ్ చూపించండి"
  },
  "Hide password": {
    "hi": "पासवर्ड छिपाएँ",
    "te": "పాస్‌వర్డ్ దాచండి"
  },
  "Account created! You can sign in now.": {
    "hi": "खाता बन गया! अब साइन इन करें।",
    "te": "ఖాతా సృష్టించబడింది! ఇప్పుడు సైన్ ఇన్ చేయండి."
  },
  "Something went wrong": {
    "hi": "कुछ गलत हुआ",
    "te": "ఏదో తప్పు జరిగింది"
  },
  "Google sign-in failed": {
    "hi": "Google साइन इन विफल",
    "te": "Google సైన్ ఇన్ విఫలమైంది"
  },
  "Invalid login credentials": {
    "hi": "ईमेल या पासवर्ड गलत है",
    "te": "ఇమెయిల్ లేదా పాస్‌వర్డ్ తప్పు"
  },
  "Never miss a doctor visit": {
    "hi": "डॉक्टर की मुलाक़ात न भूलें",
    "te": "డాక్టర్‌ను కలవడం మర్చిపోవద్దు"
  },
  "Cancel": {
    "hi": "रद्द करें",
    "te": "రద్దు చేయండి"
  },
  "Book appointment": {
    "hi": "अपॉइंटमेंट बुक करें",
    "te": "అపాయింట్‌మెంట్ బుక్ చేయండి"
  },
  "Doctor name": {
    "hi": "डॉक्टर का नाम",
    "te": "డాక్టర్ పేరు"
  },
  "Dr. Ananya Rao": {
    "hi": "डॉ. अनन्या राव",
    "te": "డా. అనన్య రావు"
  },
  "Specialty": {
    "hi": "विशेषज्ञता",
    "te": "వైద్య నైపుణ్యం"
  },
  "Cardiologist": {
    "hi": "हृदय रोग विशेषज्ञ",
    "te": "గుండె వైద్య నిపుణుడు"
  },
  "Date": {
    "hi": "तारीख़",
    "te": "తేదీ"
  },
  "Time": {
    "hi": "समय",
    "te": "సమయం"
  },
  "Location": {
    "hi": "स्थान",
    "te": "స్థలం"
  },
  "Apollo Clinic, Hyderabad": {
    "hi": "अपोलो क्लिनिक, हैदराबाद",
    "te": "అపోలో క్లినిక్, హైదరాబాద్"
  },
  "Reason": {
    "hi": "कारण",
    "te": "కారణం"
  },
  "Annual checkup": {
    "hi": "वार्षिक जाँच",
    "te": "వార్షిక పరీక్ష"
  },
  "Saving…": {
    "hi": "सहेज रहे हैं…",
    "te": "భద్రపరుస్తోంది…"
  },
  "Save appointment": {
    "hi": "अपॉइंटमेंट सहेजें",
    "te": "అపాయింట్‌మెంట్ భద్రపరచండి"
  },
  "No appointments yet": {
    "hi": "अभी कोई अपॉइंटमेंट नहीं",
    "te": "ఇంకా అపాయింట్‌మెంట్లు లేవు"
  },
  "Book your first appointment to see it here.": {
    "hi": "अपना पहला अपॉइंटमेंट बुक करें।",
    "te": "మీ మొదటి అపాయింట్‌మెంట్ బుక్ చేయండి."
  },
  "Reason:": {
    "hi": "कारण:",
    "te": "కారణం:"
  },
  "Mark upcoming": {
    "hi": "आगामी चिह्नित करें",
    "te": "రాబోయేదిగా గుర్తించండి"
  },
  "Mark done": {
    "hi": "पूरा चिह्नित करें",
    "te": "పూర్తయినట్లు గుర్తించండి"
  },
  "Upcoming": {
    "hi": "आगामी",
    "te": "రాబోయేవి"
  },
  "Past & completed": {
    "hi": "पुराने और पूरे हुए",
    "te": "గత మరియు పూర్తయినవి"
  },
  "Personalized answers using your medications, vitals, and records. Not a substitute for professional medical advice.": {
    "hi": "आपकी दवाइयों, स्वास्थ्य मापों और रिकॉर्ड के आधार पर जवाब। यह डॉक्टर की सलाह का विकल्प नहीं है।",
    "te": "మీ మందులు, ఆరోగ్య కొలతలు, రికార్డుల ఆధారంగా సమాధానాలు. ఇవి వైద్య నిపుణుల సలహాకు ప్రత్యామ్నాయం కావు."
  },
  "How can I help with your health today?": {
    "hi": "आज आपके स्वास्थ्य में कैसे मदद करूँ?",
    "te": "ఈ రోజు మీ ఆరోగ్యం గురించి ఎలా సహాయపడగలను?"
  },
  "I can see your medications, upcoming appointments, vitals, and records — ask me anything.": {
    "hi": "मैं आपकी दवाइयाँ, आगामी अपॉइंटमेंट, स्वास्थ्य माप और रिकॉर्ड देख सकता हूँ — अपना सवाल पूछें।",
    "te": "మీ మందులు, రాబోయే అపాయింట్‌మెంట్లు, ఆరోగ్య కొలతలు, రికార్డులు నాకు కనిపిస్తాయి — మీ ప్రశ్న అడగండి."
  },
  "Thinking…": {
    "hi": "सोच रहे हैं…",
    "te": "ఆలోచిస్తోంది…"
  },
  "Ask about symptoms, medications, appointments…": {
    "hi": "लक्षणों, दवाइयों, अपॉइंटमेंट के बारे में पूछें…",
    "te": "లక్షణాలు, మందులు, అపాయింట్‌మెంట్ల గురించి అడగండి…"
  },
  "Send": {
    "hi": "भेजें",
    "te": "పంపండి"
  },
  "View medications": {
    "hi": "दवाइयाँ देखें",
    "te": "మందులు చూడండి"
  },
  "View appointments": {
    "hi": "अपॉइंटमेंट देखें",
    "te": "అపాయింట్‌మెంట్లు చూడండి"
  },
  "View records": {
    "hi": "रिकॉर्ड देखें",
    "te": "రికార్డులు చూడండి"
  },
  "View dashboard": {
    "hi": "डैशबोर्ड देखें",
    "te": "డ్యాష్‌బోర్డ్ చూడండి"
  },
  "Couldn't complete: {label}": {
    "hi": "पूरा नहीं हुआ: {label}",
    "te": "పూర్తి చేయలేకపోయింది: {label}"
  },
  "Add Dolo 650 to my medications, twice daily": {
    "hi": "मेरी दवाइयों में Dolo 650 जोड़ें, दिन में दो बार",
    "te": "నా మందుల జాబితాలో Dolo 650 చేర్చండి, రోజుకు రెండుసార్లు"
  },
  "Book an appointment with Dr. Rao (cardiologist) next Monday at 10am": {
    "hi": "अगले सोमवार सुबह 10 बजे डॉ. राव (हृदय रोग विशेषज्ञ) का अपॉइंटमेंट बुक करें",
    "te": "వచ్చే సోమవారం ఉదయం 10 గంటలకు డా. రావు (గుండె వైద్య నిపుణుడు)తో అపాయింట్‌మెంట్ బుక్ చేయండి"
  },
  "Log my heart rate as 78 bpm": {
    "hi": "मेरी हृदय गति 78 bpm दर्ज करें",
    "te": "నా గుండె వేగాన్ని 78 bpmగా నమోదు చేయండి"
  },
  "Summarize my current health status": {
    "hi": "मेरी मौजूदा स्वास्थ्य स्थिति का सारांश दें",
    "te": "నా ప్రస్తుత ఆరోగ్య స్థితిని సంగ్రహించండి"
  },
  "Health Dashboard": {
    "hi": "स्वास्थ्य डैशबोर्ड",
    "te": "ఆరోగ్య డ్యాష్‌బోర్డ్"
  },
  "Your health at a glance": {
    "hi": "आपके स्वास्थ्य की झलक",
    "te": "మీ ఆరోగ్యం ఒక చూపులో"
  },
  "Ask the AI Copilot": {
    "hi": "AI सहायक से पूछें",
    "te": "AI సహాయకుడిని అడగండి"
  },
  "Vitals Tracker": {
    "hi": "स्वास्थ्य मापों की निगरानी",
    "te": "ఆరోగ్య కొలతల పర్యవేక్షణ"
  },
  "Log": {
    "hi": "दर्ज करें",
    "te": "నమోదు చేయండి"
  },
  "Heart Rate": {
    "hi": "हृदय गति",
    "te": "గుండె వేగం"
  },
  "Systolic BP": {
    "hi": "सिस्टोलिक रक्तचाप",
    "te": "సిస్టోలిక్ రక్తపోటు"
  },
  "Weight": {
    "hi": "वज़न",
    "te": "బరువు"
  },
  "Blood Glucose": {
    "hi": "रक्त ग्लूकोज़",
    "te": "రక్తంలో గ్లూకోజ్"
  },
  "Sleep": {
    "hi": "नींद",
    "te": "నిద్ర"
  },
  "Active medications": {
    "hi": "सक्रिय दवाइयाँ",
    "te": "వాడుతున్న మందులు"
  },
  "Next appointment": {
    "hi": "अगला अपॉइंटमेंट",
    "te": "తదుపరి అపాయింట్‌మెంట్"
  },
  "None scheduled": {
    "hi": "कुछ तय नहीं",
    "te": "ఏదీ నిర్ణయించలేదు"
  },
  "Health records": {
    "hi": "स्वास्थ्य रिकॉर्ड",
    "te": "ఆరోగ్య రికార్డులు"
  },
  "Latest {metric}": {
    "hi": "नवीनतम {metric}",
    "te": "తాజా {metric}"
  },
  "Value in {unit}": {
    "hi": "मान ({unit})",
    "te": "విలువ ({unit})"
  },
  "No {metric} readings yet — log your first one above.": {
    "hi": "अभी {metric} के माप नहीं हैं — अपना पहला माप दर्ज करें।",
    "te": "ఇంకా {metric} కొలతలు లేవు — మీ మొదటి కొలత నమోదు చేయండి."
  },
  "Track prescriptions, dosages, and schedules": {
    "hi": "पर्चे, मात्रा और समय का ध्यान रखें",
    "te": "ప్రిస్క్రిప్షన్లు, మోతాదులు, సమయాలను పర్యవేక్షించండి"
  },
  "Add medication": {
    "hi": "दवाई जोड़ें",
    "te": "మందు చేర్చండి"
  },
  "Medication name": {
    "hi": "दवाई का नाम",
    "te": "మందు పేరు"
  },
  "Dosage": {
    "hi": "मात्रा",
    "te": "మోతాదు"
  },
  "Frequency": {
    "hi": "कितनी बार",
    "te": "ఎంత తరచుగా"
  },
  "Time of day": {
    "hi": "दिन का समय",
    "te": "రోజులో సమయం"
  },
  "Notes (optional)": {
    "hi": "नोट्स (वैकल्पिक)",
    "te": "గమనికలు (ఐచ్ఛికం)"
  },
  "Take after food": {
    "hi": "खाने के बाद लें",
    "te": "భోజనం తర్వాత తీసుకోండి"
  },
  "Save medication": {
    "hi": "दवाई सहेजें",
    "te": "మందు భద్రపరచండి"
  },
  "No medications yet": {
    "hi": "अभी कोई दवाई नहीं",
    "te": "ఇంకా మందులు లేవు"
  },
  "Add your first medication to start tracking.": {
    "hi": "निगरानी शुरू करने के लिए पहली दवाई जोड़ें।",
    "te": "పర్యవేక్షణ ప్రారంభించడానికి మీ మొదటి మందు చేర్చండి."
  },
  "Active": {
    "hi": "सक्रिय",
    "te": "వాడుతున్నారు"
  },
  "Stopped": {
    "hi": "बंद",
    "te": "ఆపివేశారు"
  },
  "Mark as stopped": {
    "hi": "बंद चिह्नित करें",
    "te": "ఆపివేసినట్లు గుర్తించండి"
  },
  "Mark as active": {
    "hi": "सक्रिय चिह्नित करें",
    "te": "వాడుతున్నట్లు గుర్తించండి"
  },
  "Once daily": {
    "hi": "दिन में एक बार",
    "te": "రోజుకు ఒకసారి"
  },
  "Twice daily": {
    "hi": "दिन में दो बार",
    "te": "రోజుకు రెండుసార్లు"
  },
  "Three times daily": {
    "hi": "दिन में तीन बार",
    "te": "రోజుకు మూడుసార్లు"
  },
  "Weekly": {
    "hi": "साप्ताहिक",
    "te": "వారానికి ఒకసారి"
  },
  "As needed": {
    "hi": "ज़रूरत पड़ने पर",
    "te": "అవసరమైనప్పుడు"
  },
  "Morning": {
    "hi": "सुबह",
    "te": "ఉదయం"
  },
  "Afternoon": {
    "hi": "दोपहर",
    "te": "మధ్యాహ్నం"
  },
  "Evening": {
    "hi": "शाम",
    "te": "సాయంత్రం"
  },
  "Night": {
    "hi": "रात",
    "te": "రాత్రి"
  },
  "With meals": {
    "hi": "भोजन के साथ",
    "te": "భోజనంతో పాటు"
  },
  "Upload a prescription or lab report — the AI reads it and explains it in simple words": {
    "hi": "पर्चा या लैब रिपोर्ट अपलोड करें — AI इसे पढ़कर सरल शब्दों में समझाता है",
    "te": "ప్రిస్క్రిప్షన్ లేదా ల్యాబ్ నివేదిక అప్‌లోడ్ చేయండి — AI చదివి సరళమైన పదాల్లో వివరిస్తుంది"
  },
  "Add manually": {
    "hi": "खुद जोड़ें",
    "te": "మీరే చేర్చండి"
  },
  "AI is reading…": {
    "hi": "AI पढ़ रहा है…",
    "te": "AI చదువుతోంది…"
  },
  "Upload & scan": {
    "hi": "अपलोड और स्कैन",
    "te": "అప్‌లోడ్ చేసి స్కాన్ చేయండి"
  },
  "Title": {
    "hi": "शीर्षक",
    "te": "శీర్షిక"
  },
  "Complete Blood Count": {
    "hi": "पूर्ण रक्त गणना",
    "te": "పూర్తి రక్త గణన"
  },
  "Type": {
    "hi": "प्रकार",
    "te": "రకం"
  },
  "Provider / Lab": {
    "hi": "प्रदाता / लैब",
    "te": "వైద్య సంస్థ / ల్యాబ్"
  },
  "Summary (optional)": {
    "hi": "सारांश (वैकल्पिक)",
    "te": "సారాంశం (ఐచ్ఛికం)"
  },
  "Key findings, values out of range…": {
    "hi": "मुख्य निष्कर्ष, सीमा से बाहर मान…",
    "te": "ముఖ్య వివరాలు, సాధారణ పరిధికి బయట విలువలు…"
  },
  "Save record": {
    "hi": "रिकॉर्ड सहेजें",
    "te": "రికార్డు భద్రపరచండి"
  },
  "Search records…": {
    "hi": "रिकॉर्ड खोजें…",
    "te": "రికార్డులు వెతకండి…"
  },
  "No records yet": {
    "hi": "अभी कोई रिकॉर्ड नहीं",
    "te": "ఇంకా రికార్డులు లేవు"
  },
  "No matches": {
    "hi": "कोई परिणाम नहीं",
    "te": "ఫలితాలు లేవు"
  },
  "Upload a photo of a prescription or lab report and let the AI read it.": {
    "hi": "पर्चे या लैब रिपोर्ट की तस्वीर अपलोड करें।",
    "te": "ప్రిస్క్రిప్షన్ లేదా ల్యాబ్ నివేదిక ఫోటో అప్‌లోడ్ చేయండి."
  },
  "Try a different search.": {
    "hi": "कुछ और खोजें।",
    "te": "వేరే పదంతో వెతకండి."
  },
  "abnormal": {
    "hi": "असामान्य",
    "te": "అసాధారణం"
  },
  "Hide details": {
    "hi": "विवरण छिपाएँ",
    "te": "వివరాలు దాచండి"
  },
  "AI analysis": {
    "hi": "AI विश्लेषण",
    "te": "AI విశ్లేషణ"
  },
  "Simple summary": {
    "hi": "सरल सारांश",
    "te": "సరళమైన సారాంశం"
  },
  "Medicines": {
    "hi": "दवाइयाँ",
    "te": "మందులు"
  },
  "Test values": {
    "hi": "जाँच के मान",
    "te": "పరీక్ష విలువలు"
  },
  "normal": {
    "hi": "सामान्य",
    "te": "సాధారణం"
  },
  "Diagnoses / impressions": {
    "hi": "निदान / निष्कर्ष",
    "te": "నిర్ధారణలు / అభిప్రాయాలు"
  },
  "Lab report": {
    "hi": "लैब रिपोर्ट",
    "te": "ల్యాబ్ నివేదిక"
  },
  "Prescription": {
    "hi": "पर्चा",
    "te": "ప్రిస్క్రిప్షన్"
  },
  "Scan / Imaging": {
    "hi": "स्कैन / इमेजिंग",
    "te": "స్కాన్ / ఇమేజింగ్"
  },
  "Scan / imaging": {
    "hi": "स्कैन / इमेजिंग",
    "te": "స్కాన్ / ఇమేజింగ్"
  },
  "Scan or Imaging": {
    "hi": "स्कैन / इमेजिंग",
    "te": "స్కాన్ / ఇమేజింగ్"
  },
  "Discharge summary": {
    "hi": "डिस्चार्ज सारांश",
    "te": "డిశ్చార్జ్ సారాంశం"
  },
  "Vaccination": {
    "hi": "टीकाकरण",
    "te": "టీకాలు"
  },
  "Insurance": {
    "hi": "बीमा",
    "te": "బీమా"
  },
  "Other": {
    "hi": "अन्य",
    "te": "ఇతరాలు"
  },
  "Upload failed": {
    "hi": "अपलोड विफल",
    "te": "అప్‌లోడ్ విఫలమైంది"
  },
  "Failed to create record": {
    "hi": "रिकॉर्ड नहीं बना",
    "te": "రికార్డు సృష్టించలేకపోయింది"
  },
  "Health Timeline": {
    "hi": "स्वास्थ्य समयरेखा",
    "te": "ఆరోగ్య కాలక్రమం"
  },
  "Your complete health journey in one place": {
    "hi": "आपकी पूरी स्वास्थ्य यात्रा एक जगह",
    "te": "మీ పూర్తి ఆరోగ్య ప్రయాణం ఒకే చోట"
  },
  "Your profile": {
    "hi": "आपकी प्रोफ़ाइल",
    "te": "మీ వివరాలు"
  },
  "Blood group {group}": {
    "hi": "रक्त समूह {group}",
    "te": "రక్త వర్గం {group}"
  },
  "Born {date}": {
    "hi": "जन्म {date}",
    "te": "పుట్టిన తేదీ {date}"
  },
  "Ask the AI copilot to update your profile": {
    "hi": "AI सहायक से अपनी प्रोफ़ाइल अपडेट करने को कहें",
    "te": "మీ వివరాలను మార్చమని AI సహాయకుడిని అడగండి"
  },
  "ABHA ID (mock)": {
    "hi": "ABHA ID (डेमो)",
    "te": "ABHA ID (నమూనా)"
  },
  "Link ABHA ID": {
    "hi": "ABHA ID लिंक करें",
    "te": "ABHA ID అనుసంధానించండి"
  },
  "Allergies:": {
    "hi": "एलर्जी:",
    "te": "అలెర్జీలు:"
  },
  "Conditions:": {
    "hi": "स्वास्थ्य स्थितियाँ:",
    "te": "ఆరోగ్య పరిస్థితులు:"
  },
  "Nothing here yet — add records, vitals, medications, or appointments and they'll appear in your timeline.": {
    "hi": "अभी कुछ नहीं है — रिकॉर्ड, स्वास्थ्य माप, दवाइयाँ या अपॉइंटमेंट जोड़ें।",
    "te": "ఇంకా ఏమీ లేదు — రికార్డులు, ఆరోగ్య కొలతలు, మందులు లేదా అపాయింట్‌మెంట్లు చేర్చండి."
  },
  "Record": {
    "hi": "रिकॉर्ड",
    "te": "రికార్డు"
  },
  "Vital": {
    "hi": "स्वास्थ्य माप",
    "te": "ఆరోగ్య కొలత"
  },
  "Appointment": {
    "hi": "अपॉइंटमेंट",
    "te": "అపాయింట్‌మెంట్"
  },
  "Medication": {
    "hi": "दवाई",
    "te": "మందు"
  },
  "Vital reading": {
    "hi": "स्वास्थ्य माप",
    "te": "ఆరోగ్య కొలత"
  },
  "active": {
    "hi": "सक्रिय",
    "te": "వాడుతున్నారు"
  },
  "stopped": {
    "hi": "बंद",
    "te": "ఆపివేశారు"
  },
  "upcoming": {
    "hi": "आगामी",
    "te": "రాబోయేది"
  },
  "completed": {
    "hi": "पूर्ण",
    "te": "పూర్తయింది"
  },
  "cancelled": {
    "hi": "रद्द",
    "te": "రద్దయింది"
  },
  "heart rate": {
    "hi": "हृदय गति",
    "te": "గుండె వేగం"
  },
  "systolic bp": {
    "hi": "सिस्टोलिक रक्तचाप",
    "te": "సిస్టోలిక్ రక్తపోటు"
  },
  "weight": {
    "hi": "वज़न",
    "te": "బరువు"
  },
  "glucose": {
    "hi": "ग्लूकोज़",
    "te": "గ్లూకోజ్"
  },
  "sleep": {
    "hi": "नींद",
    "te": "నిద్ర"
  },
  "Page not found": {
    "hi": "पेज नहीं मिला",
    "te": "పేజీ కనబడలేదు"
  },
  "The page you're looking for doesn't exist or has been moved.": {
    "hi": "यह पेज मौजूद नहीं है या कहीं और चला गया है।",
    "te": "ఈ పేజీ లేదు లేదా వేరే చోటికి మార్చబడింది."
  },
  "Go home": {
    "hi": "होम पर जाएँ",
    "te": "హోమ్‌కు వెళ్లండి"
  },
  "This page didn't load": {
    "hi": "यह पेज नहीं खुला",
    "te": "ఈ పేజీ లోడ్ కాలేదు"
  },
  "Something went wrong on our end. You can try refreshing or head back home.": {
    "hi": "कुछ गलत हुआ। फिर कोशिश करें या होम पर जाएँ।",
    "te": "ఏదో తప్పు జరిగింది. మళ్లీ ప్రయత్నించండి లేదా హోమ్‌కు వెళ్లండి."
  },
  "Try again": {
    "hi": "फिर कोशिश करें",
    "te": "మళ్లీ ప్రయత్నించండి"
  }
};
export function translate(language: Language, text: string, params: Record<string, string | number> = {}): string {
 const localized = language === "en" ? text : translations[text]?.[language] ?? text;
 return localized.replace(/\{(\w+)\}/g, (match, key: string) => String(params[key] ?? match));
}
