import CreateTask from '~/components/CreateTask';
import { TheSunIcon } from '~/components/Icons';
import Search from '~/layouts/components/Search';

function MyDay() {
    const getCurrentDate = () => {
        const date = new Date();

        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            timeZone: 'UTC',
            timeZoneName: 'short',
        };

        const formatter = new Intl.DateTimeFormat('vi-VN', options);
        const formattedDate = formatter.format(date).slice(8);

        return formattedDate;
    };

    return (
        <div>
            <div className="flex flex-grow ">
                <div className=" w-1/4">
                    <h2 className="flex items-center gap-[8px] font-medium text-[18px]">
                        <span>
                            <TheSunIcon width="2.4rem" height="2.4rem" />
                        </span>
                        Ngày của Tôi
                    </h2>
                    <p className="text-[#605e5c] text-[12px] mt-[4px]">{getCurrentDate()}</p>
                </div>
                <div className="w-3/4 max-lg:hidden">
                    <Search />
                </div>
            </div>

            <CreateTask />
        </div>
    );
}

export default MyDay;
