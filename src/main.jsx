import "./index.css";
import { createRoot } from "react-dom/client";
import CuteFit from "./CuteFit.jsx";
import AuthGate from "./auth/AuthGate.jsx";

createRoot(document.getElementById("root")).render(
  <AuthGate logoSrc="/icon.jpg" termsUrl="/terms/" privacyUrl="/privacy/">
    {({ user, signOut, deleteAccount }) => (
      <CuteFit key={user ? user.id : "local"} user={user} onSignOut={signOut} onDeleteAccount={deleteAccount} />
    )}
  </AuthGate>
);
