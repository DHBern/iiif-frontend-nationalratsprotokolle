import React from 'react';
import './search.css';

interface IProps {
    rows: number,
    setRows: React.Dispatch<React.SetStateAction<string|null>>,
}

const SearchSimpleFilters = (props: IProps) => {
    const { rows, setRows } = props;

    return (
        <div className='simple-filters'>
            <div className="simple-filters__rows">
                <label>
                    <span>Anzahl Treffer pro Seite</span>
                    <select className="form-control" value={rows} onChange={(ev) => setRows(ev.currentTarget.value)}>
                        {[10, 25, 50, 100].map((row) => (
                            <option key={row} value={row}>{row}</option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}

export default SearchSimpleFilters;