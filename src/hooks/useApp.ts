import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useLicence } from '../context/LicenceContext';
import { useSettings } from '../context/SettingsContext';

export function useApp() {
  const user = useUser();
  const cart = useCart();
  const licence = useLicence();
  const settings = useSettings();

  return {
    user,
    cart,
    licence,
    settings,
  };
}
