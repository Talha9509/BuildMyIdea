import Image from "next/image";
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white p-2">
      <Navbar />
      <div>
        <div className="h-[90vh] flex justify-center items-center">
        <div className="text-4xl">Where Ideas meet Builders</div>
        </div>
        <div>
          Profile page has what option do you want whether as Owner or Dev
          by edit changes
        </div>
      </div>
    </div>
  );
}
