import admin from 'firebase-admin';

let app: admin.app.App;

export function initFirebaseAdmin() {
  if (!admin.apps.length) {
    app = admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
      ),
    });
  } else {
    app = admin.app();
  }
  return app;
}
