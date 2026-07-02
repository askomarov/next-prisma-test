"use client";

import { useActionState, useEffect, useState } from "react";
import { createUser } from "./users/actions";

export default function CreateUserForm() {
  const [state, formAction] = useActionState(createUser, {});
  const [hideError, setHideError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const showError = Boolean(state.error) && !hideError;

  useEffect(() => {
    setHideError(false);
  }, [state.error]);

  useEffect(() => {
    if (state.resetKey) {
      setName("");
      setEmail("");
    }
  }, [state.resetKey]);

  return (
    <form action={formAction}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={
          showError && state.input === "name"
            ? "border-red-500 border"
            : "border"
        }
        onFocus={() => setHideError(true)}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={
          showError && state.input === "email"
            ? "border-red-500 border"
            : "border"
        }
        onFocus={() => setHideError(true)}
      />
      <button type="submit">Create User</button>

      {showError && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
