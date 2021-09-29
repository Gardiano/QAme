import { useContext } from 'react';
import { MenuMobileContext } from '../components/menuMobile';

export function useMenuMobile() {
    const value = useContext( MenuMobileContext );
        return value;
}
