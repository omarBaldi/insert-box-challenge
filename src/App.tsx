import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [boxes, setBoxes] = useState<string[]>([]);

  useEffect(() => {
    const length = 3;
    const initialBoxes = [...Array(length).keys()].map(
      (n, _) => `Box ${n.toString().padStart(2, '0')}`
    );

    setBoxes(initialBoxes);
  }, []);

  return (
    <div className='App'>
      <div className='boxesWrapper'>
        {boxes.map((box, index: number) => {
          return <div key={`bx-${box}-#${index}`} className='box' />;
        })}
      </div>
    </div>
  );
}

export default App;
