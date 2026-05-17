"use client";

import { useActionState } from "react";
import styles from "@/components/admin/Admin.module.css";
import { adminLogin, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(adminLogin, initialState);

  return (
    <form action={action} className={styles.form}>
      {state.error ? <p className={styles.error}>{state.error}</p> : null}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input id="username" name="username" autoComplete="username" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="pin">
          PIN
        </label>
        <input
          id="pin"
          name="pin"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <button className={styles.textButton} disabled={pending} type="submit">
        {pending ? "Checking..." : "Access Dashboard"}
      </button>
    </form>
  );
}
