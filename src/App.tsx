import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const boxesWrapperRef = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<string[]>([]);
  const [boxIndexClicked, setBoxIndexClicked] = useState<number>();

  /**
   * @description
   * @param
   * @returns
   */
  const getIndexLastAvailableCell = ({
    xAxisValue,
    boxes,
  }: {
    xAxisValue: number;
    boxes: Element[];
  }): number => {
    let startIndex = 0;

    while (boxes[startIndex]) {
      const { offsetLeft: distanceFromLeft } = boxes[startIndex] as HTMLDivElement;

      if (distanceFromLeft > xAxisValue) break;
      startIndex += 1;
    }

    return 0;
  };

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
   *
   * TODO: transform this into custom hook that takes the
   * TODO: ...x and y axis values as well as the box ref..
   * TODO: ...and return the updated elements to render into the DOM
   *
   *
   * ? possibly allow user to insert boxes also at beginning
   *
   */
  useEffect(() => {
    const handleEventListenerClick = ({
      y: yAxisValue,
      x: xAxisValue,
      target,
    }: MouseEvent): void => {
      const parentElement: HTMLDivElement | null = boxesWrapperRef.current;
      if (!parentElement || parentElement.children.length <= 0) return;

      /**
       * In order to detect if user has clicked inside one
       * of the boxes I need to compare the current target
       * with one of the boxes and if the same, I allow
       * the user to edit the title.
       */
      if (target !== boxesWrapperRef.current) {
        const boxIndexClicked = [...parentElement.children].findIndex(
          (el) => el === target
        );

        setBoxIndexClicked((prevIndex) =>
          boxIndexClicked >= 0 ? boxIndexClicked : prevIndex
        );

        return;
      }

      const [firstBoxElement] = parentElement.children;
      const { offsetTop, clientHeight } = firstBoxElement as HTMLDivElement;
      const boxYAxisRange = offsetTop + clientHeight;

      if (yAxisValue < offsetTop || yAxisValue > boxYAxisRange) return;

      /**
       * In order to detect if the user has clicked in between 2 elements
       * I need to check the offsetLeft of each one of the boxes, to know
       * when to stop.
       *
       */

      const indexBox = getIndexLastAvailableCell({
        xAxisValue,
        boxes: [...parentElement.children],
      });

      /**
       * If the index is set to either 0 or to the boxes length,
       * that means that the user has either clicked at the beginning
       * or at the end, not in between 2 boxes, therefore stop here.
       */
      if (indexBox <= 0 || indexBox >= boxes.length) return;

      setBoxes((prevBoxes) => {
        const updatedBoxes = [
          ...prevBoxes.slice(0, indexBox),
          '-',
          ...prevBoxes.slice(indexBox),
        ];

        return updatedBoxes;
      });
    };

    document.addEventListener('click', handleEventListenerClick);

    return () => {
      document.removeEventListener('click', handleEventListenerClick);
    };
  }, []);

  const resetIndexBoxClicked = (): void => setBoxIndexClicked(undefined);

  const handleBoxInputChange = (e: React.KeyboardEvent): void => {
    if (e.code !== 'Enter') return;

    const { value: updatedBoxValue, dataset } = e.target as HTMLInputElement;
    const boxIndex: string | undefined = dataset['boxIndex'];

    if (typeof boxIndex === 'undefined' || isNaN(+boxIndex)) return;

    setBoxes((prevBoxes) => {
      const updatedBoxes = [...prevBoxes];
      updatedBoxes[+boxIndex] = updatedBoxValue;

      return updatedBoxes;
    });

    resetIndexBoxClicked();
  };

  return (
    <div className='App'>
      <div
        className='boxesWrapper'
        ref={boxesWrapperRef}
        style={{ border: '1px solid red' }}
      >
        {boxes.map((boxLabel, index: number) => {
          return (
            <div key={`bx-${boxLabel}-#${index}`} className='box'>
              {boxIndexClicked === index ? (
                <input
                  type='text'
                  autoFocus
                  defaultValue={boxLabel}
                  data-box-index={index}
                  onKeyUp={handleBoxInputChange}
                  onBlur={resetIndexBoxClicked}
                />
              ) : (
                boxLabel
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
