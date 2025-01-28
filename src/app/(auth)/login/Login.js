"use client";
import React from "react";
import { signIn, signOut } from "next-auth/react"
export default function Login(){
    return (
      <>
        Signed in as  <br />
        <button onClick={() => signIn("google",{
                callbackUrl: '/'
            })}>Sign in</button>
      </>
    )
}