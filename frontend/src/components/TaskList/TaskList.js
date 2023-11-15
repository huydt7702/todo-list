import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu';
import { toast } from 'react-hot-toast';

import * as taskService from '~/services/taskService';
import { CheckIcon, CheckSolidIcon, InputRadioIcon, StarIcon, StarSolidIcon, TrashIcon } from '../Icons';

function TaskList({ tasks, setTasks, reRenderPage, setReRenderPage }) {
    const handleDelete = async (id) => {
        const data = await taskService.deleteTask(id);
        if (data.success) {
            toast.success(data.message);
        }

        const tasksAfterDelete = tasks.filter((task) => task._id !== id);
        setTasks(tasksAfterDelete);
    };

    const handleTaskNameChange = async (e, task) => {
        const formData = {
            name: e.target.value,
        };

        await taskService.updateTask(formData, task._id);
    };

    const handleMoveToImportant = (task) => {
        if (task.isImportant) {
            const formData = {
                isImportant: false,
            };
            taskService.updateTask(formData, task._id);
            setReRenderPage(!reRenderPage);
        } else {
            const formData = {
                isImportant: true,
            };
            taskService.updateTask(formData, task._id);
            setReRenderPage(!reRenderPage);
        }
    };

    const handleMoveToFinished = (task) => {
        if (task.isFinished) {
            const formData = {
                isFinished: false,
            };
            taskService.updateTask(formData, task._id);
            setReRenderPage(!reRenderPage);
        } else {
            const formData = {
                isFinished: true,
            };
            taskService.updateTask(formData, task._id);
            setReRenderPage(!reRenderPage);
        }
    };

    return (
        <div className="mt-[4px]">
            {tasks.map((task) => (
                <div key={task._id}>
                    <ContextMenuTrigger id={task._id}>
                        <div className="flex items-center shadow-sm px-[16px] mt-[8px] bg-white rounded-[4px] hover:bg-[#f5f5f5] cursor-pointer">
                            <button className="p-[6px] text-[#2564cf]" onClick={() => handleMoveToFinished(task)}>
                                {task.isFinished ? <CheckSolidIcon /> : <InputRadioIcon />}
                            </button>
                            <div className="px-[14px] py-[8px] w-full">
                                <ContentEditable
                                    html={task.name}
                                    tagName="p"
                                    className={`text-[14px] outline-none outline-offset-0 focus:outline-[#2564cf] ${
                                        task.isFinished ? 'line-through' : 'no-underline'
                                    }`}
                                    onChange={(e) => handleTaskNameChange(e, task)}
                                />
                                <p className="text-[12px] text-[#605e5c]">Tác vụ</p>
                            </div>
                            <span
                                className="text-[#2564cf] px-[4px] py-[2px]"
                                onClick={() => handleMoveToImportant(task)}
                            >
                                {task.isImportant ? <StarSolidIcon /> : <StarIcon />}
                            </span>
                        </div>
                    </ContextMenuTrigger>

                    <ContextMenu id={task._id}>
                        <div className="py-[6px] rounded-[4px] bg-white shadow-[rgba(0,0,0,0.133)_0px_3.2px_7.2px_0px]">
                            <ul>
                                <li
                                    className="flex items-center px-[12px] h-[36px] hover:bg-[#f5f5f5] cursor-pointer"
                                    onClick={() => handleMoveToImportant(task)}
                                >
                                    <span className="mx-[4px]">
                                        <StarIcon />
                                    </span>
                                    <span className="mx-[4px] px-[4px] text-[14px]">
                                        {task.isImportant ? 'Loại bỏ mức độ quan trọng' : 'Đánhh dấu là quan trọng'}
                                    </span>
                                </li>
                                <li className="flex items-center px-[12px] h-[36px] hover:bg-[#f5f5f5] cursor-pointer">
                                    <span className="mx-[4px]">
                                        <CheckIcon />
                                    </span>
                                    <span
                                        className="mx-[4px] px-[4px] text-[14px]"
                                        onClick={() => handleMoveToFinished(task)}
                                    >
                                        {task.isFinished ? 'Đánh dấu là chưa hoàn thành' : 'Đánhh dấu là đã hoàn thành'}
                                    </span>
                                </li>
                                <li className="my-[6px] border-b border-solid border-[#e1dfdd] bg-[#e1dfdd]"></li>
                                <li
                                    className="flex items-center px-[12px] h-[36px] text-[#a80000] hover:bg-[#f5f5f5] cursor-pointer"
                                    onClick={() => handleDelete(task._id)}
                                >
                                    <span className="mx-[4px]">
                                        <TrashIcon />
                                    </span>
                                    <span className="mx-[4px] px-[4px] text-[14px]">Xóa tác vụ</span>
                                </li>
                            </ul>
                        </div>
                    </ContextMenu>
                </div>
            ))}
        </div>
    );
}

TaskList.propTypes = {
    reRenderPage: PropTypes.bool,
    setReRenderPage: PropTypes.func,
    setTasks: PropTypes.func,
    tasks: PropTypes.array.isRequired,
};

export default TaskList;