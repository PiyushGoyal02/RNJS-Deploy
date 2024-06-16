import './App.css';
import { Route, Routes, useNavigate, Link } from 'react-router-dom';
import Payment from './Components/Payment';
import MedicalRecords from './Components/MedicalRecords';
import Register from './Components/Register';
import BookAppointment from './Components/BookAppointment';
import Homepage from './Components/Homepage';
import axios from 'axios';
import { useState, useEffect } from 'react';
import sign from '../src/Assets/Sign.png'
import text from '../src/Assets/Text.png'
import black from '../src/Assets/BlackMan.jpg'
import { FaRegHeart } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import Thankyou from './Components/ThankYou';
import { IoMenu } from "react-icons/io5";
import { GiTireIronCross } from "react-icons/gi";

function App() {
  const [iconPresent, SetIconPresent] = useState(false)
  const [contentArray, setContentArray] = useState([])
  const navigator = useNavigate();
  const location = useLocation();
  const [zeroIndex, setZeroIndex] = useState(0);

  const extractValue = (htmlContent) => {
    const createElement = document.createElement('div');
    createElement.innerHTML = htmlContent;
    return createElement.textContent || createElement.innerText || '';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/fetch-data');
        const value = response.data.data;
        const content = value.map(i => i.data.content);
        setContentArray(content.map(extractValue));
      } catch (error) {
        console.error('Error For Data Fetch:', error);
      }
    };
    fetchData();
  }, []);

  const RouteComponents = {
    Payment: Payment,
    Register: Register,
    MedicalRecords: MedicalRecords,
    BookAppointment: BookAppointment
  };

  useEffect(() => {
    // Extracting path and normalizing it
    const path = location.pathname.slice(1);
    const normalizedPath = path.toLowerCase().replace(/\s+/g, ""); // Replacing all spaces
    const currentIndex = contentArray.findIndex(content =>
      content.toLowerCase().replace(/\s+/g, "") === normalizedPath
    );

    if (currentIndex !== -2) {         // Update state if a valid index is found
      setZeroIndex(currentIndex);
    }

  }, [location.pathname, contentArray]);
  
  // Handler to navigate to the next content
  const NextClickHandler = () => {
    const newIndex = zeroIndex + 1;
    if (newIndex < contentArray.length) {
      setZeroIndex(newIndex);
      const newPath = contentArray[newIndex];
      navigator(`/${newPath}`);
    }else{
      navigator('/thankyou')
    }
  };

  // function NextClickHandler() {
  //   if (zeroIndex <= contentArray.length - 1) {
  //     setZeroIndex(zeroIndex + 1);
  //     navigator(`/${contentArray[zeroIndex].toLowerCase().replace(" ", "")}`, { state: { contentArray, zeroIndex: zeroIndex + 1 } });
  //   }
  // }

  return (
    <div>

      <div className="Top-Hading">
        <div className="sign-text">
            <img src={sign}></img>
            <img src={text}></img>
        </div>

        <div className="HomePageLinks">
          <Link className='span' to='/'>Home</Link>
            {contentArray.map(route => (
              <Link className='span' key={route} to={`/${route.replace(" ", "")}`}>{route}</Link>
            ))}
        </div>

          <div className="heartlogo-blackman">
            <div className="redheartdiv">
                <p className="redheart"><FaRegHeart/></p>
            </div>

            <div className="blackmandiv">
                <img className="blackman" src={black}></img>
            </div>
          </div>

          {/* <div className='MenuBarIcon'>
            <p className='iconBar' onClick={() => SetIconPresent((pre) => !pre)}>{iconPresent ? (<IoMenu/> ): (<GiTireIronCross />)}</p>
          </div> */}

          <div class="demo">
            <div class="menu-icon">
              <input class="menu-icon__cheeckbox" type="checkbox" />
              <div>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

    </div>

    {/* <div className='NextButtonDiv'>
      <button onClick={NextClickHandler} className='NextButton'>Next</button>
    </div> */}

    <Routes>
      <Route path='/' element={<Homepage NextClickHandler={NextClickHandler} />} />
      {contentArray.map(route => {
        const Component = RouteComponents[route];
        return (
          <Route
            key={route}
            path={`/${route.toLowerCase().replace(" ", "")}`}
            element={<Component NextClickHandler={NextClickHandler} />}
          />
        );
      })}

      <Route path='/thankyou' element={<Thankyou/>}></Route>
    </Routes>

    </div>
  );
}

export default App;
