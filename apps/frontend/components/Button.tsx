import Link from 'next/link'

interface ButtonProps {
  text?: string
}

export const ButtonRotatingBackgroundGradient = ({ text = 'Get Started Free' }: ButtonProps) => {
  return (
    <Link href={"/signin"}>
      <button className='relative inline-flex h-12 overflow-hidden rounded-full p-px focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0F] cursor-pointer'>
        <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c4b5fd_0%,#7c3aed_50%,#c4b5fd_100%)]' />
        <span className='inline-flex h-full w-full items-center justify-center rounded-full bg-[#0A0A0F] lg:px-8 px-5 text-sm font-semibold text-gray-50 backdrop-blur-3xl'>
          {text}
        </span>
      </button>
    </Link>
  );
};
