import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { TagsIcon } from '~/components/Icons';
import { get, post, update } from '~/utils/httpRequest';
import { PropTypes } from "prop-types";
import { Button, Typography } from '@mui/material';
import { faArrowsRotate, faSpinner,  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCalendar, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import Modal from '~/components/Modal';

function Labels() {
    const schema = Yup.object({
        label: Yup.string().required("Label is required!").min(3, "Label at least 3 characters.").max(20, "Label maximum 20 characters")
    });
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
      });
    const [labelData, setLabelData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const createLabel= async(data)=> {
        const {label} = data
        try {
            setIsLoading(true)
            const res = await post("/label", {
                name: label
            })
            if(res){
                setLabelData(res)
                reset()
                toast.success("Create label complate")
            }
        } catch (error) {
            toast.error("Something wrong, try late")
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <div className="wrapper wrapper-container">
            <h2 className="text-gray-400 font-semibold text-[3rem] mb-4">Labels</h2>
            <div>
                <form onSubmit={handleSubmit(createLabel)}>
                    <div className="flex items-center bg-gray-400 h-24 text-white rounded-lg px-3">
                        <TagsIcon className="text-[2rem]"/>
                        <input {...register("label")} className='w-full bg-transparent  pl-5 placeholder:text-white text-[2rem]' name='label' type="text" placeholder="Add label"/>
                    </div>
                    {errors.label && <p className='text-red-500'>{errors.label.message}</p>}
                    <div className="flex justify-between mt-6">
                        <div className="flex gap-10 items-center">
                            <FontAwesomeIcon className='text-[2rem]' icon={faCalendar} />
                            <FontAwesomeIcon className='text-[2rem]' icon={faBell} />
                            <FontAwesomeIcon className='text-[2rem]' icon={faArrowsRotate} />
                        </div>
                        <Button type="submit" variant="contained" size='large' className="px-6 py-4 rounded-lg bg-blue-400 hover:bg-transparent transition-all text-white">{isLoading?<FontAwesomeIcon className='animate-spin' icon={faSpinner} />:"Create label"}</Button>
                    </div>
                </form>
            </div>
            <div className='mt-10'>
                <ListLabel dependense={labelData} isLoading={isLoading} setIsLoading={setIsLoading}/>
            </div>
        </div>
    )
}

const ListLabel = ({dependense, isLoading, setIsLoading}) => {
    const [openModal, setOpenModal] = useState(false)
    const [ListLabel, setListLabel] = useState([])
    const [editLabel, setEditLabel] = useState({})
    const schema = Yup.object({
        label: Yup.string().required("Label is required!").min(3, "Label at least 3 characters.").max(20, "Label maximum 20 characters")
    });
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
      });
    const getLabel = async() => {
        try {
            setIsLoading(true)
            const res = await get("label")
            if(res){
                setListLabel(res?.data)
                toast.success("Get update list label")
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false)
        }
    }
    const getEditLabel = async(id) => {
        try {
            const res = await get(`label/${id}`)
            if(res){
                setEditLabel(res?.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const pushUpdateLabel = async({label}) => {
        try {
            setIsLoading(true)
            await update(`label?id=${editLabel?._id}`, {
                name: label,
            })
            reset()
            setOpenModal(false)
            getLabel()
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false)
        }
    } 
    useEffect(()=> {
        getLabel()
    },[dependense])
    return (
        <>
        {isLoading? <FontAwesomeIcon className='animate-spin' icon={faSpinner} />:(
            <div className='grid grid-cols-4 gap-4'>
                <Modal isOpen={openModal} onRequestClose={()=>setOpenModal(false)} contentLabel={"Edit label"}>
                    <form className='flex items-center flex-col gap-10 p-10' onSubmit={handleSubmit(pushUpdateLabel)}>
                            <div className='border-2 rounded-xl overflow-hidden'>
                                <input {...register("label")} name='label' className='py-5 w-full px-4' placeholder={openModal ? editLabel?.name : ""} type='text' />
                            </div>
                            {errors.label && <p className='text-red-500'>{errors.label.message}</p>}
                            <Button variant='contained' type='submit' size='large' className='bg-blue-400'>{isLoading?<FontAwesomeIcon className='animate-spin' icon={faSpinner} />:"Submit"}</Button>
                    </form>
                </Modal>
                {ListLabel.map((items, key)=> (
                    <div className='h-[200px] w-[200px]' key={key}>
                        <div className='flex items-center justify-center h-2/3 border-b-0 border-4 border-gray-400 rounded-t-lg'>
                            <Typography variant='h4'>{items.name}</Typography>
                        </div>
                        <div className='h-1/3 rounded-t-lg rounded-b-lg border-4 border-gray-400 flex items-center justify-center gap-6'>
                            <button onClick={()=> {
                                getEditLabel(items._id)
                                setOpenModal(true)}}
                                className='hover:text-blue-400 transition-colors'>
                                <FontAwesomeIcon className='text-[2rem]' icon={faEdit} />
                            </button>
                            <button className='hover:text-rose-400 transition-colors'>
                                <FontAwesomeIcon className='text-[2rem]' icon={faTrashAlt} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
        </>
    )
}
ListLabel.propTypes = {
    dependense: PropTypes.object,
    isLoading: PropTypes.bool
}
export default Labels;
