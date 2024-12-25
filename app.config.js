import 'dotenv/config'; // If you're using dotenv to manage environment variables

export default {
  expo: {
    name: "CampusXperience",
    slug: "CampusXperience",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rohanudhwani.CampusXperience"
    },
    android: {
      versionCode: 5,
      config: {
        usesCleartextTraffic: true,
        googleServicesFile: "./google-services.json",
        networkSecurityConfig: "./assets/network_security_config.xml"
      },
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.rohanudhwani.CampusXperience",
      cleartext: {
        config: {
          cleartext: true
        }
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "36355677-866b-49a8-81fb-b2a36fb1ac79"
      },
      firebaseConfig: {
        apiKey: process.env.CAMPUSXPERIENCE_FIREBASE_APIKEY,
        authDomain: process.env.CAMPUSXPERIENCE_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.CAMPUSXPERIENCE_FIREBASE_PROJECT_ID,
        storageBucket: process.env.CAMPUSXPERIENCE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.CAMPUSXPERIENCE_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.CAMPUSXPERIENCE_FIREBASE_APP_ID,
        databaseURL: process.env.CAMPUSXPERIENCE_FIREBASE_DATABASE_URL
      }
    }
  }
};
