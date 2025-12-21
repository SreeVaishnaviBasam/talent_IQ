
import './App.css'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function App() {


  return (
    <>
      <h1>Hello, Talent IQ!</h1>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="btn btn-primary">Sign Up Please</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <UserButton />

    </>

  )
}

export default App
