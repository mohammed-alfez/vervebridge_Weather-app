import React from 'react'; // Import React library
import Weather from './components/Weather'; // Import the Weather component

const App = () => {
  return (
    // Main container for the app with the 'app' class for styling
    <div className='app'> 
      {/* Render the Weather component */}
      <Weather/> 
    </div>
  );
};

export default App; // Export the App component as the default export
