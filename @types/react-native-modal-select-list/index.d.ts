type CommonTypes = {
  // Options is an array with static objects to be displayed
  // in the list. Each option object must have a label (to display
  // in the list), and a value which will be returned to the parent component
  // on selection.
  options: {
    label: string;
    value: string | {};
  }[];
  // Provider is a custom function that can be used to fetch any async
  // data. The function can return a promise. The returned value from that
  // function must be in the same format as the options array above.
  provider: func;
  // Number of rows returned by every page request of the provider.
  pageSize: number;
  // The key where the value of the header input text will be stored in the
  // filter object that is passed down to the provider function.
  inputName: string;
  // Filter is a object(or function that returns a object) that represents all
  // the conditional values to be used by the provider function when it make
  // the data requests.
  filter: {} | (() => void);
  // Maximum number of lines to display for row text.
  numberOfLines: number;
};
type ModalSelectListType = {
  onSelectedOption: () => void;
  onClosedModal: () => void;
} & CommonTypes;
type SelectListType = {
  placeholder: PropTypes.string;
  closeButtonText: PropTypes.string;
  onCloseModalRequest: PropTypes.func.isRequired;
  onRowSelected: PropTypes.func.isRequired;
  disableTextSearch: PropTypes.bool;
  headerTintColor: PropTypes.string;
  buttonTextColor: PropTypes.string;
} & CommonTypes;
declare module "react-native-modal-select-list" {
  const ModalSelectList: {
    (props: ModalSelectListType & SelectListType): JSX.Element;
  };
  export default { ModalSelectList };
}
