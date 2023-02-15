import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const boxesWrapperRef = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<string[]>([]);

  useEffect(() => {
    const length = 3;
    const initialBoxes = [...Array(length).keys()].map(
      (n, _) => `Box #${n.toString().padStart(2, '0')}`
    );

    setBoxes(initialBoxes);
  }, []);

  /**
   * In order to detect whether or not the user has clicked, I
   * need to take into consideration the following:
   *
   * - get the distance from the top of the document to the start
   * of one of the boxes rendered and add it to the box inner clientHeight.
   * Now I know the y axis range in which the user can add a box.
   *
   * For the x axis instead, I need to get the starting position of
   * the boxes from the left (offsetLeft) and loop until I find the
   * last biggest offset value in which the x value do not exceed.
   * That will correspond to the last element and the element before
   * will be the start.
   */
  useEffect(() => {
    const handleEventListenerClick = ({ y: yAxisValue }: MouseEvent): void => {
      const firstBoxElement = boxesWrapperRef.current?.children[0];
      if (typeof firstBoxElement === 'undefined') return;

      const { offsetTop, clientHeight } = firstBoxElement as HTMLDivElement;
      const boxYAxisRange = offsetTop + clientHeight;

      if (yAxisValue < offsetTop || yAxisValue > boxYAxisRange) return;
      alert('Y axis correct');
    };

    document.addEventListener('click', handleEventListenerClick);

    return () => {
      document.removeEventListener('click', handleEventListenerClick);
    };
  }, []);

  return (
    <div className='App'>
      <div className='boxesWrapper' ref={boxesWrapperRef}>
        {boxes.map((boxLabel, index: number) => {
          return (
            <div key={`bx-${boxLabel}-#${index}`} className='box'>
              {boxLabel}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
