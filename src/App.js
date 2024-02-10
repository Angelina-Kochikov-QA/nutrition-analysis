import { useState, useEffect } from 'react';
import { Nutrition } from "./Nutrition";
import { LoaderPage } from "./LoaderPage";
import './App.css';
import toast, { Toaster } from 'react-hot-toast';


function App() {
  const [mySearch, setMySearch] = useState("");
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [myNutrition, setMyNutrition] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [inputValid, setInputValid] = useState(true);



  const APP_ID = 'fd2e3440';
  const APP_KEY = '746addc7680faadc5ce75227646049c5';
  const APP_URL = 'https://api.edamam.com/api/nutrition-details';

  const fetchData = async (ingr) => {
    setShowLoader(true);

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingr: ingr }),
    });

    if (response.ok) {
      setShowLoader(false);
      const data = await response.json();
      setMyNutrition(data);
    } else {
      setShowLoader(false);
      toast.error('Ingredients entered incorrectly.');
    }
  }

  const myNutritionSearch = (e) => {
    setMySearch(e.target.value);
    setInputValid(e.target.value.length >= 10); 
  }

  const finalSearch = e => {
    e.preventDefault();
    if (mySearch.length >= 10) { 
      setWordSubmitted(mySearch);
    } else {
      toast.error('Please enter at least 10 characters for your ingredients.');
    }
  }

  const resetForm = () => {
    setMySearch('');
    setWordSubmitted('');
    setMyNutrition(null);
    setInputValid(true);
  };

  useEffect(() => {
    if (wordSubmitted !== '') {
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      fetchData(ingr);
    }
  }, [wordSubmitted]);


  return (


  
      <div className="container">
        {showLoader && <LoaderPage />}
        <h1>Nutrition Analysis App</h1>
        <form className="container" onSubmit={finalSearch}>
          <p className='par'>Dive deep into the nutritional composition of your meals!<br></br> Enter your ingredients below and our app provides you with detailed breakdowns of macronutrients (carbohydrates, proteins, fats) and micronutrients (vitamins and minerals).</p>
          <input className={`search-input ${!inputValid ? 'invalid-input' : ''}`} onChange={myNutritionSearch} value={mySearch} type='text' placeholder='Enter, ex: 1 cup rice, 10 oz chickpeas...'></input>
          {!inputValid && <p className="error-message">Minimum 10 characters</p>}
          <div className='buttons'>
          <button type='submit'>Analyze</button>
          <Toaster />
          <button className="btn-reset" type="button" onClick={resetForm}>Reset</button>
          </div>

        </form>
    
          {myNutrition && ( <div className="card">
          {myNutrition && <p className='par-nutritionfacts'>Nutrition Facts</p>}
          {myNutrition && <p className='par-totalcalories'> Total calories: {myNutrition.calories} kcal</p>}
          {myNutrition && Object.values(myNutrition.totalNutrients)
            .map(({ label, quantity, unit }) =>
              <Nutrition key={label}
                label={label}
                quantity={quantity.toFixed(1)}
                unit={unit}
              />
            )}
        </div>
  )}
      </div>
      
  );
}

export default App;