import { useContext, useEffect, useRef } from "react";
import { RouletteGameContext } from "../context/RouletteGameContext";

// w-20 = 80px

const slot =
  "w-[75px] h-[75px] m-[3px] rounded-lg aspect-square flex justify-center items-center";

const Spinner = () => {
  const myWheel = useRef<HTMLDivElement>(null);
  const rouletteGameContext = useContext(RouletteGameContext);

  const choiceArray = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];

  const spinWheel = (result: number) => {
    const position = choiceArray.indexOf(result);
    const rows = 12;
    const card = 75 + 8 * 2; // cardwidth * gap * both sides
    const landingPosition = rows * 15 * card + position * card + 340;

    const object = {
      x: Math.floor(Math.random() * 50) / 100,
      y: Math.floor(Math.random() * 20) / 100,
    };
    const resetPosition = -(position * card + 700);

    if (myWheel.current) {
      myWheel.current.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`;
      myWheel.current.style.transitionDuration = "6s";
      myWheel.current.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`;
    }

    setTimeout(() => {
      if (myWheel.current) {
        myWheel.current.style.transitionTimingFunction = "";
        myWheel.current.style.transitionDuration = "";
        myWheel.current.style.transform = `translate3d(${resetPosition}px, 0px, 0px)`;
      }
    }, 6 * 1000);
  };

  useEffect(() => {
    if (rouletteGameContext?.rouletteGameData.status === "ended") {
      spinWheel(rouletteGameContext?.rouletteGameData.value as number);
    }
  });

  return (
    <>
      <div className="relative mx-auto flex w-full justify-center overflow-hidden rounded-lg p-4">
        <div ref={myWheel} className="flex gap-2">
          {Array.from({ length: 29 }).map(() =>
            choiceArray.map((item, index) => {
              if (item === 0)
                return (
                  <div className={slot + " bg-green-800"} key={index}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      enableBackground="new 0 0 1024 1024"
                      viewBox="0 0 1024 1024"
                      className="h-7 w-7 fill-green-600"
                      id="videogame"
                    >
                      <path d="M446 719.666c0-11.413-9.252-20.666-20.666-20.666h-3.668C410.252 699 401 708.252 401 719.666v87.668c0 11.413 9.252 20.666 20.666 20.666h3.668c11.413 0 20.666-9.252 20.666-20.666V719.666zM623 719.666c0-11.413-9.252-20.666-20.666-20.666h-3.668C587.252 699 578 708.252 578 719.666v87.668c0 11.413 9.252 20.666 20.666 20.666h3.668c11.413 0 20.666-9.252 20.666-20.666V719.666z"></path>
                      <path d="M913.522,366.673c-22.051-48.06-54.255-94.309-93.129-133.748c-40.853-41.445-87.338-74.315-138.167-97.697   c-54.86-25.236-112.076-38.032-170.059-38.032c-57.982,0-115.199,12.796-170.059,38.032   c-50.829,23.382-97.315,56.252-138.167,97.697c-38.874,39.439-71.078,85.688-93.129,133.748   C88.285,415.77,76.378,466.786,76.378,514.207c0,58.681,17.744,110.203,52.739,153.138c29.741,36.489,71.441,66.135,124.074,88.263   c-0.34,29.043,6.09,66.311,32.854,100.121c41.011,51.807,116.125,78.075,223.253,78.075c109.184,0,185.532-26.51,226.919-78.794   c26.288-33.209,32.871-69.752,32.72-98.471c53.716-22.24,96.181-52.235,126.341-89.268c34.955-42.92,52.679-94.418,52.679-153.063   C947.957,466.786,936.05,415.77,913.522,366.673z M917.957,514.207c0,13.671-1.098,26.885-3.262,39.627   c-65.917-29.97-111.757-96.382-111.757-173.513c0-34.275,9.064-66.426,24.907-94.212   C884.818,355.951,917.957,438.763,917.957,514.207z M511.932,189.798c105.223,0,190.523,85.3,190.523,190.523   s-85.3,190.523-190.523,190.523s-190.523-85.3-190.523-190.523S406.709,189.798,511.932,189.798z M197.863,284.435   c16.441,28.165,25.873,60.921,25.873,95.886c0,77.976-46.85,144.997-113.931,174.484c-2.276-13.041-3.428-26.58-3.428-40.598   C106.378,438.159,140.05,354.626,197.863,284.435z M712.695,836.39c-15.888,20.071-38.958,35.923-68.569,47.115   c-35.635,13.47-80.997,20.299-134.828,20.299c-52.693,0-97.153-6.748-132.145-20.056c-29.113-11.072-51.853-26.765-67.586-46.64   c-34.365-43.412-27.054-94.834-22.316-114.928c5.813-24.65,31.835-42.729,77.344-53.73c36.357-8.79,82.902-12.884,146.479-12.884   c63.577,0,110.121,4.094,146.478,12.884c45.509,11.002,71.531,29.08,77.345,53.731C739.604,742.142,746.863,793.228,712.695,836.39   z"></path>
                    </svg>
                  </div>
                );
              if (item % 2 === 1)
                return (
                  <div className={slot + " bg-primary"} key={index}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      enableBackground="new 0 0 512 512"
                      viewBox="0 0 512 512"
                      className="h-8 w-8 rotate-45 fill-secondary"
                    >
                      <g display="none">
                        <path d="M207.9 89.9c.1-.1.2-.3.2-.4.1-.1.6-1.2.3-.6-.3.7.2-.4.2-.6.2-.6.4-1.1.6-1.7 1-2.7 2.1-5.4 3.7-7.7.3-.5.7-.8 1.1-1.2 0-.3 0-.7 0-1 0-1.4.7-2.5 1.6-3.3-.9-1.2-1.8-2.5-2.9-3.7-30.6-35.8-84-29.4-86.3-29.1-3.7.5-6.6 3.5-7 7.2-.2 2.6-5.5 63.3 24.4 98.3 1.3 1.5 2.6 2.9 4 4.2.7-2.1 2.9-3.1 5-2.8 0 0 0 0 0 0 .2 0 .5 0 .7 0 .4 0 .8 0 1.2-.1.2 0 .4-.1.6-.1.4-.1.8-.2 1.2-.3 1.7-.4 3.3-1 5-1.5 1.1-.3 2.2-.1 3.2.4.4-.2.8-.4 1.1-.5-.5-.9-1.2-1.7-2-2.3-2.8-2.2-5.4-4.6-7.8-7.4-20.2-23.6-21.4-63.7-21-79.6 13.9-.3 46.2 1.5 65.4 24 2.4 2.8 4.4 5.6 6.2 8.7C207.2 89.3 207.6 89.6 207.9 89.9zM381.4 47.9c-.3-3.7-3.2-6.7-7-7.2-2.3-.3-55.7-6.6-86.3 29.2-1 1.2-1.9 2.4-2.8 3.6 3.3 5.4 5.4 11.6 6.5 17.8.9-.6 1.7-1.4 2.3-2.4 1.8-3 3.9-5.9 6.2-8.6 19.3-22.5 51.7-24.4 65.5-24.1.4 15.9-.8 56-21 79.6-2.2 2.5-4.5 4.8-7 6.8.3.2.6.5.9.7 0 0 0 0 0 0 .1.1.2.1.2.2 1.3 1 2.7 2.1 4 3.2 1.8 1.4 3.6 2.6 5.6 3.5 1.1.5 1.7 1.5 1.9 2.5 2.3-2 4.5-4.2 6.5-6.5C386.9 111.2 381.6 50.5 381.4 47.9z"></path>
                        <path
                          d="M285.4,145.6c-0.9,0-1.7-0.1-2.6-0.4c-4.2-1.4-6.4-6-5-10.1c3.1-9.2,4.7-18.3,4.7-27c0-7-1-14.1-3-21.1
			c-6.2-23.3-21-42.2-29-51.3c-8.1,9.1-22.8,28.1-29,51.2c-2,7.1-3,14.2-3,21.2c0,8.7,1.6,17.8,4.7,27c1.4,4.2-0.8,8.7-5,10.1
			c-4.2,1.4-8.7-0.8-10.1-5c-3.7-10.9-5.5-21.7-5.5-32.2c0-8.5,1.2-17.1,3.6-25.5c9.9-36.8,37.8-63.3,38.9-64.4
			c3.1-2.9,7.9-2.9,10.9,0c1.2,1.1,29.1,27.6,39,64.5c2.3,8.3,3.6,16.9,3.6,25.4c0,10.5-1.9,21.3-5.5,32.2
			C291.8,143.5,288.7,145.6,285.4,145.6z"
                        ></path>
                        <path
                          d="M250.5,496c-74.3,0-184-118-184-224c0-92.9,65.3-144,184-144s184,51.1,184,144C434.5,378,324.8,496,250.5,496z M250.5,144
			c-76.6,0-168,22.2-168,128c0,96.4,101.7,208,168,208s168-111.6,168-208C418.5,166.2,327.2,144,250.5,144z"
                        ></path>
                        <ellipse cx="138.5" cy="232" rx="16" ry="24"></ellipse>
                        <ellipse cx="186.5" cy="312" rx="16" ry="24"></ellipse>
                        <ellipse
                          cx="250.5"
                          cy="393.9"
                          rx="16"
                          ry="24"
                        ></ellipse>
                        <ellipse cx="354.5" cy="232" rx="16" ry="24"></ellipse>
                        <ellipse cx="314.5" cy="312" rx="16" ry="24"></ellipse>
                        <ellipse cx="250.5" cy="232" rx="16" ry="24"></ellipse>
                      </g>
                      <path d="M339.8 144.3c1.7-1.6 3.4-3.2 5-5 20.2-23.6 21.4-63.7 21-79.6-13.8-.4-46.2 1.5-65.5 24.1-1.7 2-3.1 4.1-4.5 6.3 1.7 7.1 2.7 14.3 2.7 21.5 0 7.5-1 15.2-2.9 22.9C311.7 136.5 326.4 139.8 339.8 144.3zM161.3 144.3c13.4-4.5 28.1-7.8 44.1-9.9-1.9-7.7-2.9-15.4-2.9-22.9 0-7.2 1.1-14.5 2.8-21.6-1.4-2.1-2.9-4.1-4.6-6.2-19.3-22.5-51.6-24.3-65.4-24-.4 15.9.8 56 21 79.6C157.8 141.1 159.5 142.7 161.3 144.3zM250.5 131.5c10.1 0 19.7.5 29 1.2 1.9-7.2 3-14.3 3-21.2 0-7-1-14.1-3-21.1-6.2-23.3-21-42.2-29-51.3-8.1 9.1-22.8 28.1-29 51.2-2 7.1-3 14.2-3 21.2 0 6.9 1 14 3 21.2C230.8 132 240.4 131.5 250.5 131.5zM250.5 147.5c-76.6 0-168 22.2-168 128 0 96.4 101.7 208 168 208s168-111.6 168-208C418.5 169.7 327.2 147.5 250.5 147.5zM138.5 259.5c-9.3 0-16-10.1-16-24s6.7-24 16-24 16 10.1 16 24S147.8 259.5 138.5 259.5zM186.5 339.5c-9.3 0-16-10.1-16-24s6.7-24 16-24 16 10.1 16 24S195.8 339.5 186.5 339.5zM250.5 421.4c-9.3 0-16-10.1-16-24s6.7-24 16-24c9.3 0 16 10.1 16 24S259.8 421.4 250.5 421.4zM250.5 259.5c-9.3 0-16-10.1-16-24s6.7-24 16-24c9.3 0 16 10.1 16 24S259.8 259.5 250.5 259.5zM314.5 339.5c-9.3 0-16-10.1-16-24s6.7-24 16-24 16 10.1 16 24S323.8 339.5 314.5 339.5zM354.5 259.5c-9.3 0-16-10.1-16-24s6.7-24 16-24 16 10.1 16 24S363.8 259.5 354.5 259.5z"></path>
                    </svg>
                  </div>
                );
              if (item % 2 === 0)
                return (
                  <div className={slot + " bg-zinc-800"} key={index}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                      className="h-7 w-7 fill-zinc-600"
                    >
                      <path d="M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4L294.4 28.8c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0H416h32 16c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8c0 26.5-21.5 48-48 48H538.5c-17 0-33.3-6.7-45.3-18.7L480 160H448v21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1C640 462.9 590.9 512 530.2 512H496 432 32.3c-3.3 0-6.6-.4-9.6-1.4C13.5 507.8 6 501 2.4 492.1C1 488.7 .2 485.2 0 481.4c-.2-3.7 .3-7.3 1.3-10.7c2.8-9.2 9.6-16.7 18.6-20.4c3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1c0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1V181.5v-57zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3v.6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9c0 13.3 10.7 24 24 24c10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87V227c0 32.8 8.4 64.8 24 93H112c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9s-1.5-14.1 3.8-18.8L130.9 116.5z" />
                    </svg>
                  </div>
                );
            })
          )}
        </div>
        <span className="z-2 absolute left-1/2 top-0 h-full w-[3px] rounded-lg bg-base-content" />
      </div>
    </>
  );
};

export default Spinner;
