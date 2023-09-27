import * as React from "react"

import { Transition } from 'react-transition-group';
import { useRef } from 'react';

const duration = 500;

const defaultStyle = {
    border: `1px solid green`,
    backgroundColor: `lightGreen`,
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: .2,
}

const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity:.2, backgroundColor: `light-green`, },
    exited:   { opacity:.2, backgroundColor: `light-green`, },
};

const CombinationDisplay = ({ movies }) => {
    const [ displayCombination, setDisplayCombination ] = React.useState([]);
    const [ exampleCombination, setExampleCombination ] = React.useState();
    const nodeRef = useRef(null);

    const loadDisplay = React.useCallback(() => {
        let filteredLength = movies['data']['stats']['filteredStringCombination'].length;
        let randomIndex = Math.floor(Math.random() * filteredLength);
        let selectedCombination = movies['data']['stats']['filteredStringCombination'][randomIndex];
        setExampleCombination(selectedCombination);

        let characterMap = movies['data']['displayCharacterMap'];
        let stringDifference = characterMap.length - selectedCombination.length;
        let combinationArray = selectedCombination.split('');

        // clear previous selects
        for (const stringArrayIndex in characterMap) {
            for (const character in characterMap[stringArrayIndex]) {
                characterMap[stringArrayIndex][character] = 0;
            }
        }
        setDisplayCombination(characterMap);
        for (let b = 0; b <= stringDifference; b++) {
            for (let a = 0; a < combinationArray.length; a++) {
                let match = 0
                let offset = a + b;
                for (const property in characterMap[offset]) {
                    if (combinationArray[a].toUpperCase() === property.toUpperCase()) {
                        match++;
                        characterMap[offset][property] = 1;
                    }
                }
                if (!match) break;
            }
        }
        setDisplayCombination(movies['data']['displayCharacterMap']);
    },[movies]);

    React.useEffect(() => {
        loadDisplay();
        const interval = setInterval(() => {
            if (!movies.isInit) {
                loadDisplay();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [movies, loadDisplay]);

    return (
        <>
            <div className="grid grid-cols-7 text-center content-start bg-white pt-5 pb-5 mb-5 px-5 uppercase shadow-lg border border-gray-300 ">
                {
                    Object.entries(displayCombination || {}).map((characterPosition, index) => {
                        return (
                            <div key={index} className="bg-white">
                            {
                                Object.entries(characterPosition).map(([index2, characters], mix) => {
                                    if (parseFloat(index2) === 0) return false;
                                    return (
                                        Object.entries(characters).map(([index3, character], mix2) => {
                                            return (
                                                <Transition nodeRef={nodeRef} in={character} timeout={duration}>
                                                  {state => (
                                                    <div ref={nodeRef} style={{
                                                      ...defaultStyle,
                                                      ...transitionStyles[state]
                                                    }}>
                                                      {index3}
                                                    </div>
                                                  )}
                                                </Transition>
                                            );
                                        })
                                    );
                                })
                            }
                            </div>
                        );
                    })
                }
            </div>

            <div className="text-center content-start bg-white pt-5 pb-5 mb-5 uppercase shadow-lg border border-gray-300 ">
                { exampleCombination }
            </div>
        </>
    )
}

export default CombinationDisplay;
