import Image from "next/image";
import Navbar from './../components/Navbar'
import Footer from './../components/Footer'
import {ButtonRotatingBackgroundGradient} from './../components/Button'
import DemoTable from "@/components/DemoTable";

export default function Home() {
  return (
    <div>
      <div className=" inset-0 -z-10 [background:radial-gradient(120%_120%_at_50%_-20%,#000_40%,#63e_100%)]" >
        <Navbar />
        <div className="h-[90vh] flex flex-col justify-center items-center text-white">
          <div className="text-6xl">Where Ideas Meet Builders</div>
          <div className="flex flex-wrap text-gray-400 p-4 pb-8 gap-2 text-lg">
          <div>Build what people actually need&nbsp;</div>
          <div>&nbsp;•&nbsp;&nbsp;&nbsp;Turn Ideas Into Reality — Without Writing Code&nbsp;</div>
          <div>&nbsp;•&nbsp;&nbsp;&nbsp;Where Ideas Meet Developers</div>
          </div>
          <div><ButtonRotatingBackgroundGradient/></div>
        </div>
        <div className="border-gray-300 border-t my-4" />
        <DemoTable/>
        <div className="border-gray-300 border-t" />
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}





