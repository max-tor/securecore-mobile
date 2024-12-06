import {TextInputProps} from '@/components/common/TextInput';

export interface PlaceSelectedParams {
  formattedAddress?: string;
  postalCode?: string;
  state?: string;
  city?: string;
  district?: string;
  street?: string;
  streetNumber?: string;
}
export interface AddressAutoCompleteProps extends TextInputProps {
  onPlaceSelected?: (params: PlaceSelectedParams) => void;
  value?: string;
}

export interface AutoCompleteOption {
  value: string;
  label?: string;
  data: {
    // eslint-disable-next-line camelcase
    place_id: string;
  };
}

export interface GeocoderAddressComponent {
  /**
   * The full text of the address component
   */
  // eslint-disable-next-line camelcase
  long_name: string;
  /**
   * The abbreviated, short text of the given address component
   */
  // eslint-disable-next-line camelcase
  short_name: string;
  /**
   * An array of strings denoting the type of this address component. A list
   * of valid types can be found <a
   * href="https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingAddressTypes">here</a>
   */
  types: string[];
}
