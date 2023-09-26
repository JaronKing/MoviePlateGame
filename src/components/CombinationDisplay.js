import * as React from "react"

const CombinationDisplay = ({ movies }) => {
    const [ displayCombination, setDisplayCombination ] = React.useState([]);
    const [ exampleCombination, setExampleCombination ] = React.useState();

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!movies.isInit) {
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
                                match = 1;
                                characterMap[offset][property] = 1;
                            }
                        }
                        if (!match) break;
                    }
                }
                setDisplayCombination(movies['data']['displayCharacterMap']);
            }
        }, 250);
        return () => clearInterval(interval);
    }, [movies]);

    return (
        <>
            <div className="grid grid-cols-7 text-center content-start bg-white pt-5 pb-5 mb-5 uppercase shadow-lg border border-gray-300 ">
                {
                    Object.entries(displayCombination || {}).map((characterPosition, index) => {
                        return (
                            <div key={index} className="bg-white">
                            {
                                Object.entries(characterPosition).map(([index2, characters], mix) => {
                                    if (characters === 0) return false;
                                    if (parseFloat(index2) === 0) return false;

                                    return (
                                        Object.entries(characters).map(([index3, character], mix2) => {
                                            // if (parseFloat(character)) return true;
                                            // if (index3 === 0) return true;
                                            let characterKey = `${index3}_${character}`
                                            return (
                                                <div key={characterKey} className={character ? ("bg-gray-300") : ("bg-white")}>{index3}</div>
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
