'use client'

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import * as http from 'http'

type User = {
  email: string,
  name: string,
}

const StageComponent = dynamic(() => import('./_components/stageComponent'), {ssr: false})
export default function Home() {
  const [ users, setUsers ] = useState<[User] | null>(null)

  useEffect(() => {
    const getUsers = async () => {
      const res = await GET()
      setUsers(res);
    }
    getUsers()
  }, [])

  return (
    <>
      <GoogleOAuthProvider clientId="128697940905-jtbpl7g86j7kbe9otv9lrj24tit2krqr.apps.googleusercontent.com">
        <GoogleLogin 
          onSuccess={credentialResponse => {
            const decoded = jwtDecode(credentialResponse.credential as string)
            const newUser: User = {
              email: decoded.email,
              name: decoded.given_name,
            }
            var skip = false;
            users?.forEach(user => {
              if (user.email == newUser.email) {
                skip = true;
              }
            })
            if(skip == false) {
              POST(newUser);
            }
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>
      <StageComponent />
      <div>
        {
          users?.map((item) => {
            return <li>{item.name} {item.email}</li>;
          })
        }
      </div>
    </>
  );
}

export async function GET() {
  const res = await fetch('http://localhost:8000/users/');
  const users = await res.json();
  return users
}

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  host: 'localhost',
  port: 8000,
  path: '/users/',
};

export async function POST(user: User) {
  const request = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)
  })
  request.write(JSON.stringify(user))
  request.end()
}