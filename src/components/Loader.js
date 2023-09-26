import * as React from "react"

import { Spinner } from 'flowbite-react';

const Loader = ({ movies }) => {

    return (
        <div className="flex flex-col items-center">
            Loading... <Spinner aria-label="Default status example" />
            { movies.loadMessage }
        </div>
    )
}

export default Loader;