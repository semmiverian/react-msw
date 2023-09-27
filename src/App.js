import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((res) => {
        if (!res.ok) {
          throw res.json();
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <h1>Errorrr</h1>;
  }

  return (
    <div className="App">
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <ul data-testid="user-list">
          {data.map((user) => (
            <li key={user.id}>{user.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
