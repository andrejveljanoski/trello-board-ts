import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { isValidTextInput } from "../types"; 

const auth = getAuth();

// Login Modal
const loginModal = document.getElementById("login-modal");
const closeLoginModal = document.getElementById("close-login-modal");
const loginForm = document.getElementById("login-form");

if (!loginModal || !closeLoginModal || !loginForm) //cant be null
  throw new Error("Login Modal not found");

closeLoginModal.onclick = () => {
  loginModal.style.display = "none";
};

loginForm.onsubmit = (e) => checkInputsAndSubmit(e, "login");

// Register Modal
const registerModal = document.getElementById("register-modal");
const closeRegisterModal = document.getElementById("close-register-modal");
const registerForm = document.getElementById("register-form");

if (!registerModal || !closeRegisterModal || !registerForm)
  throw new Error("Register Modal not found");

closeRegisterModal.onclick = () => {
  registerModal.style.display = "none";
};

registerForm.onsubmit = (e) => checkInputsAndSubmit(e, "register");

// Login and Register input validation and submission
const checkInputsAndSubmit = async (e: Event, type: "login" | "register") => {
  e.preventDefault();
  const emailInput = document.getElementById(`${type}-email`);
  const passwordInput = document.getElementById(`${type}-password`);
  if (
    !emailInput ||
    !passwordInput ||
    !isValidTextInput(emailInput) ||
    !isValidTextInput(passwordInput)
  )
    throw new Error("Email or Password input not found");
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    if (type === "login") {
      await signInWithEmailAndPassword(auth, email, password);
      loginModal.style.display = "none";
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
      registerModal.style.display = "none";
    }
  } catch (error) {
    console.error(error);
  }
};

const dontHaveAnAcountLink = document.getElementById("register-link");
dontHaveAnAcountLink?.addEventListener("click", () => {
  loginModal.style.display = "none";
  registerModal.style.display = "block";
});

const alreadyHaveAnAcountLink = document.getElementById("login-link");
alreadyHaveAnAcountLink?.addEventListener("click", () => {
  registerModal.style.display = "none";
  loginModal.style.display = "block";
});

export const checkAuth = async () => {
  onAuthStateChanged(auth, (user) => {
    const emailAndLogoutButtonContainer = document.querySelector(
      ".email-and-logout-button-container",
    );

    if (user) {
      if (!emailAndLogoutButtonContainer) {
        const container = document.createElement("div");
        container.className = "email-and-logout-button-container";

        const userEmail = document.createElement("h4");
        userEmail.textContent = user.email;
        userEmail.className = "user-email";

        const logoutButton = document.createElement("button");
        logoutButton.textContent = "Logout";
        logoutButton.className = "logout-button";
        logoutButton.addEventListener("click", async () => {
          await signOut(auth);
        });

        container.appendChild(userEmail);
        container.appendChild(logoutButton);
        document.body.appendChild(container);
      }
    } else {
      loginModal.style.display = "block";

      if (emailAndLogoutButtonContainer) {
        emailAndLogoutButtonContainer.remove();
      }
    }
  });
};
