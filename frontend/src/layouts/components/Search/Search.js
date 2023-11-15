import HeadlessTippy from '@tippyjs/react/headless';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import { ClearIcon, SearchIcon } from '~/components/Icons';
import TaskList from '~/components/TaskList';
import { useDebounce } from '~/hooks';
import * as taskService from '~/services/taskService';

function Search({ id }) {
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
            const { data } = await taskService.getAllTasks();
            const listTaskOfUserId = data.filter((task) => task.userId === (userId ?? id));

            setSearchResult((prev) => {
                return listTaskOfUserId.filter((task) => task.name.includes(debouncedValue));
            });
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);

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

    const renderResult = () => {
        return (
            <TaskList
                tasks={searchResult}
                setTasks={setSearchResult}
                reRenderPage={reRenderPage}
                setReRenderPage={setReRenderPage}
            />
        );
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    return (
        <HeadlessTippy
            visible={showResult && searchResult.length > 0}
            offset={[0, -2]}
            placement="bottom-start"
            render={renderResult}
            onClickOutside={handleHideResult}
        >
            <div className="relative flex items-center  w-[800px]  rounded-lg max-sm:w-[300px] max-2xl:w-[700px]  max-[1380px]:w-[600px] max-[1230px]:w-[500px] max-[1120px]:w-[400px]  border-2 border-indigo-300">
                <span className="absolute top-0 lef-0 bottom-0 flex items-center justify-center px-[8px] cursor-pointer text-[#2564cf] hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    value={searchValue}
                    ref={inputRef}
                    spellCheck={false}
                    placeholder="Search Task..."
                    className="flex-1 py-[8px] px-[60px] h-[50px] rounded-lg text-2xl max-lg:h-[30px] max-lg:text-xl border-cyan-400"
                    onChange={handleChange}
                    onFocus={() => setShowResult(true)}
                />
                {searchValue && (
                    <span
                        className="absolute  top-0 bottom-0 right-0 flex items-center justify-center px-[8px] cursor-pointer text-[#2564cf] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                        onClick={handleClear}
                    >
                        <ClearIcon />
                    </span>
                )}
            </div>
        </HeadlessTippy>
    );
}

const mapStateToProps = (state) => {
    return {
        id: state.auth.login.currentUser?._id,
    };
};

export default connect(mapStateToProps)(Search);
