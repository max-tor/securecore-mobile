export const Input = {
  variants: {
    withMargin: {
      mb: 5, // 20px
    },
  },
  baseStyle: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 42,
    _input: {
      fontFamily: 'SF Pro Text',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 15,
      color: '#323234',
    },
  },
  defaultProps: {
    placeholderTextColor: 'darkGrey',
  },
};
