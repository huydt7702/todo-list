import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import * as taskService from '~/services/taskService';
import { CalendarIcon, InputRadioIcon, NotifyIcon, RepeatIcon } from '../Icons';
import TaskList from '../TaskList';

function CreateTask({ id, important = false, finished = false }) {
    const taskInputRef = useRef();
    const [taskInput, setTaskInput] = useState('');
    const [tasks, setTasks] = useState([]);
    const [reRenderPage, setReRenderPage] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        (async () => {
            const { data } = await taskService.getAllTasks();
            const listTaskOfUserId = data.filter((task) => {
                return task.userId === (userId ?? id);
            });
            const listNormalTask = listTaskOfUserId.filter((task) => !task.isFinished);

            setTasks(() => {
                if (important) {
                    const listImportantTask = listTaskOfUserId.filter((task) => task.isImportant && !task.isFinished);
                    return listImportantTask;
                } else if (finished) {
                    const listFinishedTask = listTaskOfUserId.filter((task) => task.isFinished);
                    return listFinishedTask;
                }

                return listNormalTask;
            });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reRenderPage]);

    const handleTaskInputChange = (e) => {
        const taskValue = e.target.value;

        if (!taskValue.startsWith(' ')) {
            setTaskInput(taskValue);
        }
    };

    const createTask = async () => {
        if (!taskInput) return;

        const formData = {
            name: taskInput,
            isImportant: important,
            userId: userId ?? id,
        };

        const { data } = await taskService.createTask(formData);
        setTasks([...tasks, data]);

        setTaskInput('');
        taskInputRef.current.focus();
    };

    const handleCreateTask = () => {
        createTask();
    };

    const handleEnterCreateTask = (e) => {
        if (e.which === 13) {
            createTask();
        }
    };

    return (
        <div className="mt-[26px]">
            {finished || (
                <div className="shadow-md rounded-[4px] overflow-hidden">
                    <div className="flex items-center px-[16px] bg-white">
                        <button className="ml-[6px] text-[#2564cf]">
                            <InputRadioIcon />
                        </button>
                        <input
                            type="text"
                            ref={taskInputRef}
                            value={taskInput}
                            placeholder="Thêm tác vụ"
                            className="px-[14px] py-[14px] w-full placeholder-[#2564cf]"
                            onChange={handleTaskInputChange}
                            onKeyDown={handleEnterCreateTask}
                        />
                    </div>
                    <div className="flex items-center justify-between border-t border-solid border-[#e1dfdd] px-[16px] h-[45px]">
                        <div className="flex items-center">
                            <button className="p-[4px] ml-[2px] hover:bg-white rounded-[4px] transition-colors">
                                <CalendarIcon />
                            </button>
                            <button className="p-[4px] ml-[8px] hover:bg-white rounded-[4px] transition-colors">
                                <NotifyIcon />
                            </button>
                            <button className="p-[4px] ml-[8px] hover:bg-white rounded-[4px] transition-colors">
                                <RepeatIcon />
                            </button>
                        </div>
                        <button
                            className={`px-[8px] h-[32px] border border-solid border-[#e1dfdd] text-[12px] bg-white ${
                                taskInput ? 'text-[#2564cf]' : 'text-[#a19f9d]'
                            }`}
                            onClick={handleCreateTask}
                        >
                            Thêm
                        </button>
                    </div>
                </div>
            )}

            <TaskList tasks={tasks} setTasks={setTasks} reRenderPage={reRenderPage} setReRenderPage={setReRenderPage} />
        </div>
    );
}

CreateTask.propTypes = {
    finished: PropTypes.bool,
    important: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        id: state.auth.login.currentUser?._id,
    };
};

export default connect(mapStateToProps)(CreateTask);
