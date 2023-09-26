import * as React from "react"

import { Accordion } from 'flowbite-react';

const GenresOptions = ({ genres, setGenres }) => {

    const handleGenreChange = (event) => {
        let genreValue = [];
        genreValue[event.target.defaultValue] = !(event.target.checked !== false);
        let booleanValue = {
            ...genres,
            ...genreValue,
        }
        setGenres(booleanValue);
    }

    return (
        <Accordion collapseAll className="px-5 mb-5 mx-5 border border-gray-300 bg-white shadow-lg rounded-none">
            <Accordion.Panel>
                <Accordion.Title className="bg-white hover:bg-white rounded-none border-none">
                    Genres
                </Accordion.Title>
                <Accordion.Content>
                    <div className="md:columns-3 columns-2">
                        {
                            Object.keys(genres).map((genre, index) => {
                                return (
                                    <label key={genre} htmlFor={genre} className="relative m-3 inline-flex items-center cursor-pointer">
                                        <input id={genre} name={genre} onChange={(e) => handleGenreChange(e)} value={genre} checked={!genres[genre]} type="checkbox" className="sr-only peer"/>
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{genre}</span>
                                    </label>
                                )
                            })
                        }
                    </div>
                </Accordion.Content>
            </Accordion.Panel>
        </Accordion>
    );
}

export default GenresOptions;