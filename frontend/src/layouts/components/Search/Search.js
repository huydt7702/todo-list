import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { ClearIcon, SearchIcon } from '~/components/Icons';
import TaskList from '~/components/TaskList';
import { useDebounce } from '~/hooks';
import * as taskService from '~/services/taskService';

const Search = ({ id }) => {
    const inputRef = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [reRenderPage, setReRenderPage] = useState(false);
    const userId = localStorage.getItem('userId');

    const debouncedValue = useDebounce(searchValue, 500);

    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }

        (async () => {
            try {
                const result = await taskService.searchTasks(userId ?? id, debouncedValue);
                setSearchResult(result);
            } catch (error) {
                console.error('Error searching tasks:', error);
            }
        })();
    }, [debouncedValue, userId, id]);

    const handleChange = (e) => {
        const searchValue = e.target.value;

        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleSearchResultClick = (task) => {
        console.log('Selected task:', task);
        // Thực hiện các hành động mong muốn khi chọn một mục
    };

    const renderResult = () => {
        if (!debouncedValue.trim()) {
            return <div className="no-result-message">Vui lòng nhập từ khóa tìm kiếm.</div>;
        }

        if (searchResult.length === 0) {
            return <div className="no-result-message">Không có kết quả tìm kiếm.</div>;
        }

        return (
            <ul className="search-results-list">
                {searchResult.map((task) => (
                    <li key={task.id} className="search-result-item" onClick={() => handleSearchResultClick(task)}>
                        {task.name}
                    </li>
                ))}
            </ul>
        );
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    return (
        <div className="relative w-[800px] mx-auto mt-8">
            <div className="relative flex items-center rounded-lg border-2 border-indigo-300">
                <span className="absolute top-0 left-0 bottom-0 flex items-center justify-center px-2 cursor-pointer text-[#2564cf] hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    value={searchValue}
                    ref={inputRef}
                    spellCheck={false}
                    placeholder="Bạn Tìm Gì?..."
                    className="flex-1 py-2 px-12 rounded-lg text-xl border-cyan-400"
                    onChange={handleChange}
                    onFocus={() => setShowResult(true)}
                />
                {searchValue && (
                    <span
                        className="absolute top-0 bottom-0 right-0 flex items-center justify-center px-2 cursor-pointer text-[#2564cf] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                        onClick={handleClear}
                    >
                        <ClearIcon />
                    </span>
                )}
            </div>
            {showResult && searchResult.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden">
                    {renderResult()}
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        id: state.auth.login.currentUser?._id,
    };
};

export default connect(mapStateToProps)(Search);
