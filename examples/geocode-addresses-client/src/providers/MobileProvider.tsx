import {Context, createContext, FC, PropsWithChildren, useEffect, useState} from 'react';
import {MOBILE_MAX_WIDTH} from '../constants/constants';

type TProps = {
    isMobiles: boolean;
};
export const MobileContext = createContext<TProps | null>(null) as Context<TProps>;

export const MobileProvider: FC<PropsWithChildren> = ({children}) => {
    const [width, setWidth] = useState<number>(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    return <MobileContext.Provider value={{isMobiles: width <= MOBILE_MAX_WIDTH}}>{children}</MobileContext.Provider>;
};
