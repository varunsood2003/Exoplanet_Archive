import React, { useEffect, useState } from 'react';
import QueryPanel from './Components/QueryPanel';
import ResultsPanel from './Components/ResultsPanel';
import Papa from 'papaparse';

function App() {
  const [exoplanetData, setExoplanetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  const [resultsVisible, setResultsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.csv'); 
        const text = await response.text();
        Papa.parse(text, {
          delimiter: ",",
          header: true, 
          complete: (result) => {
            setExoplanetData(result.data);
            setFilteredData(result.data);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error.message);
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    const filtered = exoplanetData.filter((entry) => {
      const nameMatch = entry.pl_name && entry.pl_name.toLowerCase().includes(query.pl_name.toLowerCase());
      const hostMatch = entry.hostname && entry.hostname.toLowerCase().includes(query.hostname.toLowerCase());
      const methodMatch = entry.discoverymethod && entry.discoverymethod.toLowerCase().includes(query.discoverymethod.toLowerCase());
      const yearMatch = entry.disc_year && entry.disc_year.toString().includes(query.disc_year.toString());
      const facilityMatch = entry.disc_facility && entry.disc_facility.toLowerCase().includes(query.disc_facility.toLowerCase());

      return nameMatch && hostMatch && methodMatch && yearMatch && facilityMatch;
    });

    setFilteredData(filtered);
    setResultsVisible(true);
  };

  const handleClear = () => {
    setFilteredData([]); 
    setResultsVisible(false); 
  };

  return (
    <div>
      <QueryPanel onSearch={handleSearch} exoplanetData={exoplanetData} onClear={handleClear} />
      {resultsVisible && <ResultsPanel data={filteredData} />}
    </div>
  );
}

export default App;
