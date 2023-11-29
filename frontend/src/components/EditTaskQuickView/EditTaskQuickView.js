import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import ContentEditable from 'react-contenteditable';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import * as taskService from '~/services/taskService';
import { CalendarIcon, ClearIcon, DescIcon } from '../Icons';

const styles = {
    boxWrapperModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'background.paper',
        flex: '1 1 auto',
        overflowY: 'auto',
        padding: '20px 24px',
        maxWidth: '900px',
        width: '100%',
        p: 4,
        borderRadius: '8px',
    },
    btnClose: {
        position: 'absolute',
        fontSize: '1.5rem',
        padding: '8px',
        borderRadius: '50%',
        overflow: 'visible',
        color: 'rgba(0, 0, 0, 0.54)',
        transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        top: '3px',
        right: '3px',
        minWidth: 'inherit',
    },
    boxControlBtn: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
        marginTop: '10px',
    },
    boxReviewBtn: {
        fontSize: '14px',
        fontWeight: 600,
        color: 'rgb(255, 255, 255)',
        maxWidth: '120px',
        backgroundColor: '#2564cf',
        width: '100%',
        minWidth: '0px',
        minHeight: '0px',
        textTransform: 'capitalize',
        height: '40px',
        margin: '0px 0px 0.75rem',
        boxShadow: 'rgb(43 52 69 / 10%) 0px 4px 16px',
        '&:hover': {
            backgroundColor: '#4b83e3',
            boxShadow: 'rgb(3 0 71 / 1%) 0px 0px 28px',
        },
    },
    boxCancelReview: {
        fontSize: '14px',
        fontWeight: 600,
        maxWidth: '120px',
        border: '1px solid rgba(210, 63, 87, 0.5)',
        color: '#2564cf',
        width: '100%',
        minWidth: '0px',
        minHeight: '0px',
        textTransform: 'capitalize',
        height: '40px',
        borderColor: '#2564cf',
        '&:hover': {
            borderColor: '#0048c3',
            backgroundColor: 'rgba(37, 100, 207, 0.08)',
        },
    },
};

function EditTaskQuickView({ data, openModal, handleCloseModal, reRenderPage, setReRenderPage }) {
    const [descValue, setDescValue] = useState(data.description);
    const [taskName, setTaskName] = useState(data.name);
    const handleClose = () => handleCloseModal();

    const updateTaskDesc = useMutation({
        mutationFn: (taskId) => taskService.updateTask({ name: taskName, description: descValue }, taskId),
        onSuccess: ({ success }) => {
            if (success) {
                toast.success('Cập nhật công việc thành công');
                setReRenderPage(!reRenderPage);
                handleClose();
            } else {
                toast.error('Cập nhật công việc thất bại!');
            }
        },
    });

    const handleSubmitEdit = (taskId) => {
        updateTaskDesc.mutate(taskId);
    };

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styles.boxWrapperModal}>
                <Grid container>
                    <Box
                        style={{
                            marginBottom: '40px',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <CalendarIcon width="2.6rem" height="2.6rem" />
                        <ContentEditable
                            html={taskName}
                            tagName="h3"
                            className={`text-[18px] w-full font-medium outline-none outline-offset-0 focus:outline-[#2564cf] ${
                                data.isFinished ? 'line-through' : 'no-underline'
                            }`}
                            spellCheck={false}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                    </Box>
                    <Box component={'form'} noValidate sx={{ width: '100%' }}>
                        <Box className="flex gap-[10px] mb-[10px]">
                            <DescIcon className="mt-[2px]" />
                            <Box component={'h3'} className="text-[18px] font-medium">
                                Mô tả
                            </Box>
                        </Box>
                        <ReactQuill
                            placeholder="😀 Mô tả cho công việc này..."
                            theme="snow"
                            value={descValue}
                            onChange={setDescValue}
                        />
                        <Box sx={styles.boxControlBtn}>
                            <Button variant="outlined" sx={styles.boxCancelReview} onClick={handleClose}>
                                Hủy
                            </Button>
                            <Button
                                variant="contained"
                                sx={styles.boxReviewBtn}
                                onClick={() => handleSubmitEdit(data._id)}
                            >
                                Lưu
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Button sx={styles.btnClose} onClick={handleClose}>
                    <ClearIcon />
                </Button>
            </Box>
        </Modal>
    );
}

EditTaskQuickView.propTypes = {
    data: PropTypes.object.isRequired,
    openModal: PropTypes.bool,
    handleCloseModal: PropTypes.func,
    reRenderPage: PropTypes.bool,
    setReRenderPage: PropTypes.func,
};

export default EditTaskQuickView;
