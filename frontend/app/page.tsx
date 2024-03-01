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
  const [ users, setUsers ] = useState<User[] | null>(null)
  const [ localUser, setLocalUser ] = useState<User | null>(null)
  const [ logined, setLogined ] = useState<boolean>(false)

  const updateLocalUser = async (_users: User[]) => {
    const _localUser: User = JSON.parse(localStorage.getItem("key") as string);
    _users?.map((_user) => {
      if(_user.email == _localUser.email) {
        setLogined(true);
      }
    })
    setLocalUser(_localUser);
  }

  useEffect(() => {
    const _users: User[] = []
    const getUsers = async () => {
      const res = await GET()
      res.map((data: any) => {
        const _user: User = {email: data.email, name: data.name}
        _users.push(_user);
      })
      setUsers(_users);
      await updateLocalUser(_users)
    }
    getUsers()
  }, [users, localUser, logined])

  return (
    <>
      <GoogleOAuthProvider clientId="128697940905-jtbpl7g86j7kbe9otv9lrj24tit2krqr.apps.googleusercontent.com">
        {logined
        ? <div>{localUser?.name}でログイン済み</div>
        : <GoogleLogin 
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
            window.localStorage.clear()
            window.localStorage.setItem('key', JSON.stringify(newUser));
            if(users !== null) {
              updateLocalUser(users)
            }
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />}
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

export const GET = async () => {
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

export const POST = async (user: User) => {
  const request = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)
  })
  request.write(JSON.stringify(user))
  request.end()
}