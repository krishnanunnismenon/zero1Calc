'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter()
  return (
    <>
   <h1>This site is a zero1 By zerodha Excel sheet calculator combined</h1>
    <Button onClick={()=>router.push('/car-afford')}>Can You Afford A Car?</Button>
    <Button onClick={()=>router.push('/fire')}>Calculate Fire</Button>
    
    </>
  );
}
