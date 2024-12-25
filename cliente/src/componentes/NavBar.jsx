 import { ClockIcon, Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar5 = () => {
    const [abierto, setAbierto] = useState(false)
    const xLink = 'md:ml-8 md:my-0 my-7 font-semibold'

    return (
      <div className='shadow-md w-full fixed top-0 left-0 z-50'>
            <div className='md:flex items-center justify-between bg-white py-4 md:px-10 px-7'>
                {/* logo section */}
                <div className='font-bold text-2xl cursor-pointer flex items-center gap-1'>
                    {/* <ClockIcon className='w-7 h-7 text-blue-600' /> */}
                  
                    <img src=
"../../kinesio.png"
 alt=
"icono quinesio"
 className=
"w-9 h-9 bg-blue-300"
 />
   <span className='italic font-extrabold text-blue-800 tracking-wide  pl-5 pr-11 '>DIGALO CON MÍMICA</span>
                </div>
                {/* Menu icon */}
                <div onClick={() => setAbierto(!abierto)} className='absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7'>
                    {
                        abierto ? <XMarkIcon /> : <Bars3BottomRightIcon />
                    }
                </div>
                {/* linke items */}
                <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${abierto ? 'top-28' : 'top-[-490px]'}`}>

                    <li className={xLink}><Link className='text-gray-800 hover:text-blue-400  hover:font-extrabold hover:translate-y-1' onClick={() => setAbierto(!abierto)} to='/'>Principal</Link></li>
                    <li className={xLink}><Link className='text-gray-800 hover:text-blue-400  hover:font-extrabold hover:translate-y-1' onClick={() => setAbierto(!abierto)} to='/tablameridianos'>Meridianos</Link></li>
              
                </ul>
                {/* button */}
            </div>
        </div>
    );


}

export default Navbar5
