import React, { useEffect, useState } from 'react'

function App() {

  const [backendData, setBackendData] = useState()

  useEffect(() => {
    fetch("\/api") // need to add Proxy to package.json
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setBackendData(data)
    });
  }, []);

  return (
    <div>App</div>
  )
}

export default App