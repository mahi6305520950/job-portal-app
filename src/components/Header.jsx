import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'
import { useUser } from '@clerk/clerk-react'

const Header = () => {
  const [showSignin, setshowSignin] = useState(false);
  const [search,setsearch]=useSearchParams()
  const {user}=useUser();
  useEffect(()=>{
    if(search.get("sign-in")==="true"){
      setshowSignin(true);
    }
  },[search])
  const handleoverlayClick=(e)=>{
    if(e.target===e.currentTarget){
      setshowSignin(false);
      setsearch({});
    }
  }
  
  //if(user?.unsafeMetadata?.role==="recruiter"){
  //    return <Navigate to="/jobs" />;
  //  } ///idn_39FMNh0Ej2rq93PgKf591BAMqwk
          // idn_39FMNh0Ej2rq93PgKf591BAMqwk
  console.log("user",user)
  return (
    <>
      <nav className='py-4 flex justify-between items-center'>
        <Link>  
            <img src="/logo.png" alt="Logo" className="h-40" />
        </Link>
        
        <div>
          <SignedOut className="flex gap-8">
            <Button variant="outline" onClick={()=>setshowSignin(true)}>Login</Button>
        </SignedOut>
        <SignedIn>
          <div className='flex items-center'>
          { user?.unsafeMetadata?.role==="recruiter" &&(
            <Link to="/post-job">
            <Button variant="destructive" className="rounded-full mr-2 h-8">
              <PenBox size={20} className='mr-2'/>Post a Job</Button>
          </Link>
          )
          }
          <UserButton appearance={{
             elements:{
                avatarBox:"w-20 h-20 rounded-full",
            }
          }
          }>
            <UserButton.MenuItems >
              <UserButton.Link
              label='My jobs'
              labelIcon={<BriefcaseBusiness size={16}/>}
              href='/my-jobs'
              />
              <UserButton.Link
              label='Saved jobs'
              labelIcon={<Heart size={16}/>}
              href='/saved-jobs'
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
        </SignedIn>


        </div>
        


      </nav>
      {showSignin && <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm'
      onClick={handleoverlayClick}>
        <SignIn 
        fallbackRedirectUrl="/"
        signUpForceRedirectUrl="/onboarding"
        />
      </div>
      }
    </>
  )

}

export default Header