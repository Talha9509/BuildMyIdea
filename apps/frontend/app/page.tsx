import Image from "next/image";
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <div>
        <div className=" inset-0 -z-10 [background:radial-gradient(120%_120%_at_50%_-20%,#000_40%,#63e_100%)]" >
        <Navbar />
          <div className="h-[90vh] flex flex-col justify-center items-center text-white">
            <div className="text-4xl">Where Ideas meet Builders</div>
            <div>Build togetiher</div>
            <div>Build on Demand</div>
            <div>Showcase your skills on Demand</div>
            <div>Showcase your ideas</div>
          </div>
      </div>
    </div>
  );
}
